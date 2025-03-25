---
title: I made the mistake of trying to write a test...
description: My odyssey to get a single unit test passing with Durable Objects.
---
# I made the mistake of trying to write a test...

Yesterday I tried to write some unit tests for my [durable objects](https://nickblow.tech/posts/another-hack-for-durable-objects-with-astro). Simple, right?

WRONG.

## On testing in general

To preface: I think tests are immensely valuable. Especially in the world of LLM generated code, I think tests are *more* valuable than ever.
If you're wholesale replacing your code with the output of GPT (or for me, increasingly Claude), how can you verify that the behaviour has stayed the same?

Yeah, you can manually test. But that does not scale with codebase size. It wastes a lot of time.

A good test runs fast and does not test implementation detail. It checks the behaviour works programmatically. This is perfect for making sure that the massive chunk of code you just pasted in continues to work the
same way that you used to (at least within the parameters of your assertions).

I think that people who use LLMs to generate their tests in any meaningful way (aside from as a sort of fancy autocomplete) are kind of missing the point.
You should know *exactly* the behaviour you're trying to test. Though, for people labouring under code coverage targets, I feel your pain, as I think [that's missing the point too](https://en.wikipedia.org/wiki/Goodhart%27s_law).

## What went wrong?

It started simple enough. I wanted to test my astro actions. This in and of itself ended up being a bit of pain as I had to separate my logic from my actions code, as there didn't seem to be a documented way to test actions.

For end to end tests, I'll probably use [Playwright](https://playwright.dev/) with [Chromatic](https://www.chromatic.com/playwright), to make sure things are hooked up right.

Anyway, as mentioned in my previous article, due to some [Cloudflare limitations](https://github.com/cloudflare/workers-sdk/issues/5918) I have a separate worker with all my Durable Objects RPC.

Turns out, there's also [another issue](https://github.com/cloudflare/workers-sdk/blob/main/fixtures/vitest-pool-workers-examples/multiple-workers/vitest.config.ts#L74) that makes this a pain for local dev.
Essentially, I can't use my wrangler.toml file to define the bindings for the second worker, I need to duplicate that into my Vitest config. Sounds ripe for human error, thus time to automate it...

My `workergen` script is getting incredibly large, but luckily I live for this shit... and also my trusty intern Claude has boundless energy.

## The approach

We're already generating the `wrangler.toml` for the auxiliary worker in `workergen` (from the [previous article](https://nickblow.tech/posts/another-hack-for-durable-objects-with-astro)). So we know what the bindings are already (by statically analyzing my Typescript code).

I'm not going to share intermediate code, because it's getting very large - but I'll talk through the issues I had.

First off, I was annoyed at the lack of typesafety, so I got it to add types to the generated worker. They're a bit rough-and-ready, but they work.

Then, I generated a vitest config. Easy enough right? I'll just add a `workers` array, point it to my `rpc_worker.ts` file.

Nope. It [doesn't support TypeScript](https://github.com/cloudflare/workers-sdk/blob/main/fixtures/vitest-pool-workers-examples/multiple-workers/vitest.config.ts#L82)...

Okay, I'll build it with esbuild when I start my test. This more-or-less works (it does mean I don't have hot module replacement on my Durable Objects and have to rerun workergen).

But it's not the end of the world, esbuild is fast.

## More problems

At this point I've spent like an hour on this. Cloudflare has a lot of work to do on DX, frankly. But it's worth it for the superior buttery smooth UX I'll have (it better be).

More fun occurs because I have a WASM module, so Claude writes me a WASM loader. Then some weird externals as the `cloudflare:workers` import is not a 'real' import.

I don't give up. Eventually (after like 3 hours), I have a single unit test passing. Maybe I'll find more issues tonight.

## The code

Here's the final code, complete with all my fixes.

```typescript
import { promises as fs } from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

const objectsDir = "./src/objects";
const rpcWorkerPath = `${objectsDir}/rpc_worker.ts`;
const wranglerTomlPath = `${objectsDir}/wrangler.toml`;
const vitestConfigPath = "./vitest.config.ts";

interface DurableObjectMethod {
  name: string;
  paramCount: number;
}

interface DurableObjectClass {
  className: string;
  methods: DurableObjectMethod[];
}

async function generateRPCWorker() {
  const files = await fs.readdir(objectsDir);
  const durableObjectClasses: DurableObjectClass[] = [];

  for (const file of files) {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const filePath = path.join(objectsDir, file);
      const content = await fs.readFile(filePath, "utf-8");

      const ast = parse(content, {
        sourceType: "module",
        plugins: ["typescript"],
      });

      traverse(ast, {
        ClassDeclaration(path) {
          if (path.node.id && path.node.id.name) {
            const className = path.node.id.name;
            const methods: DurableObjectMethod[] = [];

            path.traverse({
              ClassMethod(methodPath) {
                // @ts-ignore
                const methodName = methodPath.node.key.name;
                const isPrivate = methodPath.node.accessibility === "private";

                // Ignore constructor, fetch, alarm methods, and private methods
                if (
                  methodName !== "constructor" &&
                  methodName !== "fetch" &&
                  methodName !== "alarm" &&
                  !isPrivate
                ) {
                  const paramCount = methodPath.node.params.length;
                  methods.push({
                    name: methodName,
                    paramCount,
                  });
                }
              },
            });

            if (methods.length > 0 && className !== "RPCWorker") {
              durableObjectClasses.push({ className, methods });
            }
          }
        },
      });
    }
  }

  // Generate the RPC Worker content
  let rpcWorkerContent = `import { WorkerEntrypoint } from "cloudflare:workers";\n\n`;

  // Re-export and import the durable object classes
  durableObjectClasses.forEach(({ className }) => {
    rpcWorkerContent += `import type { ${className} } from "./${className}";\n`;
    rpcWorkerContent += `export { ${className} } from "./${className}";\n`;
  });
  rpcWorkerContent += "\n";

  // Generate Env interface with index signature
  rpcWorkerContent += `type DurableObjects = {\n`;
  durableObjectClasses.forEach(({ className }) => {
    rpcWorkerContent += `  ${className.toUpperCase()}: DurableObjectNamespace<${className}>;\n`;
  });
  rpcWorkerContent += `};\n\n`;

  rpcWorkerContent += `interface Env extends DurableObjects {\n`;
  rpcWorkerContent += `  [key: string]: DurableObjectNamespace<any> | undefined;\n`;
  rpcWorkerContent += `}\n\n`;

  // Add type helpers for method inference
  rpcWorkerContent += `type GetMethodParameters<T, M extends keyof T> = T[M] extends (...args: infer P) => any ? P : never;\n`;
  rpcWorkerContent += `type GetMethodReturnType<T, M extends keyof T> = T[M] extends (...args: any[]) => infer R ? R : never;\n\n`;

  // Start class definition
  rpcWorkerContent += `export default class RPCWorker extends WorkerEntrypoint<Env> {\n`;

  if (durableObjectClasses.length > 0) {
    rpcWorkerContent += `\n  async newUniqueId(obj: string): Promise<string> {\n`;
    rpcWorkerContent += `    const namespace = this.env[obj.toUpperCase()];\n`;
    rpcWorkerContent += `    if (!namespace) throw new Error(\`Invalid object type: \${obj}\`);\n`;
    rpcWorkerContent += `    return namespace.newUniqueId().toString();\n`;
    rpcWorkerContent += `  }\n\n`;
  }

  rpcWorkerContent += `  async idFromName(obj: string, name: string): Promise<string> {\n`;
  rpcWorkerContent += `    const namespace = this.env[obj.toUpperCase()];\n`;
  rpcWorkerContent += `    if (!namespace) throw new Error(\`Invalid object type: \${obj}\`);\n`;
  rpcWorkerContent += `    return namespace.idFromName(name).toString();\n`;
  rpcWorkerContent += `  }\n\n`;

  // Generate methods for each Durable Object class and its methods
  durableObjectClasses.forEach((durableObject) => {
    durableObject.methods.forEach((method) => {
      const params =
        method.paramCount > 0
          ? `id: string, ...args: GetMethodParameters<${durableObject.className}, "${method.name}">`
          : `id: string`;

      rpcWorkerContent += `  async ${durableObject.className.toUpperCase()}_${
        method.name
      }(${params}): Promise<GetMethodReturnType<${durableObject.className}, "${
        method.name
      }">> {\n`;
      rpcWorkerContent += `    const durableId = this.env.${durableObject.className.toUpperCase()}.idFromString(id);\n`;
      rpcWorkerContent += `    const obj = this.env.${durableObject.className.toUpperCase()}.get(durableId);\n`;
      rpcWorkerContent += `    return obj.${method.name}(${
        method.paramCount > 0 ? "...args" : ""
      });\n`;
      rpcWorkerContent += `  }\n\n`;
    });
  });

  rpcWorkerContent += `}\n`;

  // Write the rpc_worker.ts file
  await fs.writeFile(rpcWorkerPath, rpcWorkerContent, "utf-8");
  console.log(`Generated ${rpcWorkerPath}`);

  return durableObjectClasses;
}

async function generateWranglerToml(
  durableObjectClasses: DurableObjectClass[]
) {
  const durableObjectBindings = durableObjectClasses.map(
    (doc) => doc.className
  );

  // Generate wrangler.toml content
  let wranglerTomlContent = `# Auto-generated wrangler.toml\n\n`;
  wranglerTomlContent += `name = "rpc_worker"\n`;
  wranglerTomlContent += `compatibility_date = "2024-09-25"\n`;
  wranglerTomlContent += `main = "./rpc_worker.ts"\n\n`;
  wranglerTomlContent += `[[migrations]]\n`;
  wranglerTomlContent += `tag = "v1"\n`;
  wranglerTomlContent += `new_sqlite_classes = [${durableObjectBindings
    .map((name) => `"${name}"`)
    .join(", ")}]\n\n`;
  wranglerTomlContent += `[durable_objects]\n`;
  wranglerTomlContent += `bindings = [\n`;
  durableObjectBindings.forEach((binding, index) => {
    wranglerTomlContent += `  { name = "${binding.toUpperCase()}", class_name = "${binding}" }`;
    if (index !== durableObjectBindings.length - 1) {
      wranglerTomlContent += ",\n";
    } else {
      wranglerTomlContent += "\n";
    }
  });
  wranglerTomlContent += `]\n`;

  await fs.writeFile(wranglerTomlPath, wranglerTomlContent, "utf-8");
  console.log(`Generated ${wranglerTomlPath}`);
}

async function generateVitestConfig(durableObjectClasses: DurableObjectClass[]) {
  // Create the DO bindings object
  const doBindingsObject = durableObjectClasses
      .map(({ className }) => `              ${className.toUpperCase()}: { className: "${className}", scriptName: "rpc_worker" }`)
      .join(",\n");

  let vitestConfigContent = `import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";\n`;
  vitestConfigContent += `import * as esbuild from 'esbuild';\n`;
  vitestConfigContent += `import { readFileSync } from 'fs';\n`;
  vitestConfigContent += `import { join } from 'path';\n\n`;

  // Add WASM loader helper
  vitestConfigContent += `const wasmLoader: esbuild.Plugin = {\n`;
  vitestConfigContent += `  name: 'wasm-loader',\n`;
  vitestConfigContent += `  setup(build: esbuild.PluginBuild) {\n`;
  vitestConfigContent += `    build.onLoad({ filter: /\.wasm$/ }, async (args: esbuild.OnLoadArgs) => {\n`;
  vitestConfigContent += `      const wasmModule = readFileSync(args.path);\n`;
  vitestConfigContent += `      const wasmBase64 = wasmModule.toString('base64');\n`;
  vitestConfigContent += `      return {\n`;
  vitestConfigContent += `        contents: \`\n`;
  vitestConfigContent += `          const wasmBase64 = "\${wasmBase64}";\n`;
  vitestConfigContent += `          const wasmBytes = Uint8Array.from(atob(wasmBase64), c => c.charCodeAt(0));\n`;
  vitestConfigContent += `          export default wasmBytes;\n`;
  vitestConfigContent += `        \`,\n`;
  vitestConfigContent += `        loader: 'js'\n`;
  vitestConfigContent += `      };\n`;
  vitestConfigContent += `    });\n`;
  vitestConfigContent += `  }\n`;
  vitestConfigContent += `};\n\n`;

  // Add function to build the script
  vitestConfigContent += `async function buildWorkerScript() {\n`;
  vitestConfigContent += `  const outfile = join(process.cwd(), 'dist', '_rpc_worker.js');\n`;
  vitestConfigContent += `  await esbuild.build({\n`;
  vitestConfigContent += `    entryPoints: ['./src/objects/rpc_worker.ts'],\n`;
  vitestConfigContent += `    outfile,\n`;
  vitestConfigContent += `    bundle: true,\n`;
  vitestConfigContent += `    format: 'esm',\n`;
  vitestConfigContent += `    target: 'es2022',\n`;
  vitestConfigContent += `    minify: false,\n`;
  vitestConfigContent += `    platform: 'browser',\n`;
  vitestConfigContent += `    plugins: [\n`;
  vitestConfigContent += `      wasmLoader,\n`;
  vitestConfigContent += `    ],\n`;
  vitestConfigContent += `     external:["cloudflare:workers"]\n`;
  vitestConfigContent += `  });\n`;
  vitestConfigContent += `  return outfile;\n`;
  vitestConfigContent += `}\n\n`;

  vitestConfigContent += `export default defineWorkersProject({\n`;
  vitestConfigContent += `  test: {\n`;
  vitestConfigContent += `    poolOptions: {\n`;
  vitestConfigContent += `      workers: {\n`;
  vitestConfigContent += `        singleWorker: true,\n`;
  vitestConfigContent += `        wrangler: { configPath: "./wrangler.toml" },\n`;
  vitestConfigContent += `        miniflare: {\n`;
  vitestConfigContent += `          compatibilityDate: "2024-09-25",\n`;
  vitestConfigContent += `          compatibilityFlags: ["nodejs_compat_v2", "nodejs_compat"],\n`;
  vitestConfigContent += `          workers: [\n`;
  vitestConfigContent += `            {\n`;
  vitestConfigContent += `              name: "rpc_worker",\n`;
  vitestConfigContent += `              modules: true,\n`;
  vitestConfigContent += `              scriptPath: await buildWorkerScript(),\n`;
  vitestConfigContent += `              durableObjects: {\n${doBindingsObject}\n              }\n`;
  vitestConfigContent += `            }\n`;
  vitestConfigContent += `          ]\n`;
  vitestConfigContent += `        }\n`;
  vitestConfigContent += `      }\n`;
  vitestConfigContent += `    }\n`;
  vitestConfigContent += `  }\n`;
  vitestConfigContent += `});\n`;

  await fs.writeFile(vitestConfigPath, vitestConfigContent, "utf-8");
  console.log(`Generated ${vitestConfigPath}`);
}

// Execute all generators
(async () => {
  try {
    const durableObjectClasses = await generateRPCWorker();
    await generateWranglerToml(durableObjectClasses);
    await generateVitestConfig(durableObjectClasses);
    console.log("All files generated successfully!");
  } catch (error) {
    console.error("Error generating files:", error);
    process.exit(1);
  }
})();

```
