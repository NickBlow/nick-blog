---
title: Another hack for durable objects and Astro
description: Working around various wrangler limitations. Is the DX better? I can't tell.
---

# Another hack for durable objects and Astro

I'm still playing around trying to get durable objects and Astro to work well together. My [last attempt](https://nickblow.tech/posts/a-hack-for-durable-objects-with-astro) was cute, but only worked at build time. This is slow, and you lose HMR etc.

My biggest problem is that since you can't access any kind of index file, there's no way to export the required classes needed. And Astro doesn't have some kind of worker file or index.js I can point the workers CLI at. In Astro's defense, most frameworks do this.

I'm hoping that eventually this is a problem that Astro and/or Cloudflare solve. It's really quite annoying, and the DX honestly sucks. The infra tech is great though, so I shall persist.

After some fiddling around with Vite internals and Astro adapters, I kind of gave up on that approach.

## Resigning myself to using a second worker

During my fiddling I found out that [getPlatformProxy](https://developers.cloudflare.com/workers/wrangler/api/#supported-bindings) - which Astro uses in dev mode - only supports durable objects in another worker, running in another terminal.

I resigned myself to doing that. Now, the sensible approach would be to define a worker, define my durable objects, create a wrangler.toml and go from there.

Which I did. I wanted to use Durable Object RPC. Only to find out [it's not supported in local dev](https://github.com/cloudflare/workers-sdk/issues/5918) in a separate worker.

Great. However, [service bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/) *ARE*. Which gave me an idea.

## Why spend 5 minutes doing something when you can spend several hours automating it?

The only option would just be to create a worker that purely proxies the RPC calls onto a durable object. Luckily, service bindings are an essentially free abstraction, so the cost and latency implications are basically zero.

I'm not going to have hundreds of durable objects or RPCs. But this does feel like somewhere where you can easily make a mistake.

So, let's automate it. We can load all the durable objects in one directory (in my case, src/objects), and create a worker which proxies every RPC they define.

This involved a LOT of fiddling and trial and error. The code is very messy. But, as far as I can tell, this works and lets you use durable objects (indirectly) within Astro!

And it works in dev mode! Hopefully this improves at some point, and I can remove all of this code. I made the names of the functions find-and-replaceable so hopefully it won't be a horrible job to rip out.

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const objectsDir = './src/objects';
const rpcWorkerPath = `${objectsDir}/rpc_worker.js`;
const wranglerTomlPath = `${objectsDir}/wrangler.toml`;


async function generateRPCWorker() {
    const files = await fs.readdir(objectsDir);
    const durableObjectClasses: { className: string; methods: any[]; }[] = [];

    for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
            const filePath = path.join(objectsDir, file);
            const content = await fs.readFile(filePath, 'utf-8');

            const ast = parse(content, { sourceType: 'module', plugins: ['typescript'] });

            traverse(ast, {
                ClassDeclaration(path) {
                    if (path.node.id && path.node.id.name) {
                        const className = path.node.id.name;
                        const methods: any[] = [];

                        path.traverse({
                            ClassMethod(methodPath) {
                                // @ts-ignore
                                const methodName = methodPath.node.key.name;

                                // Ignore constructor and fetch methods
                                if (methodName !== 'constructor' && methodName !== 'fetch') {
                                    methods.push(methodName);
                                }
                            }
                        });

                        if (methods.length > 0 && className !== "RPCWorker") {
                            durableObjectClasses.push({ className, methods });
                        }
                    }
                }
            });
        }
    }

    // Generate the RPC Worker content
    let rpcWorkerContent = `import { WorkerEntrypoint } from "cloudflare:workers";\n\n`;

    // Re-export the durable object classes
    durableObjectClasses.forEach(({ className }) => {
        rpcWorkerContent += `export { ${className} } from "./${className}";\n`;
    });

    rpcWorkerContent += `\nexport default class RPCWorker extends WorkerEntrypoint {\n`;
    if (durableObjectClasses.length > 0) {
        rpcWorkerContent += `\n   async newUniqueId() { return this.env.${durableObjectClasses[0].className.toUpperCase()}.newUniqueId().toString() }\n\n`
    }
    // Generate methods for each Durable Object class and its methods
    durableObjectClasses.forEach((durableObject, classIndex) => {
        durableObject.methods.forEach((methodName, methodIndex) => {
            rpcWorkerContent += `  // ${durableObject.className} - ${methodName}\n`;
            rpcWorkerContent += `  async ${durableObject.className.toUpperCase()}_${methodName}(id, ...args) {\n`;
            rpcWorkerContent += `    const durableId = this.env.${durableObject.className.toUpperCase()}.idFromString(id);\n`;
            rpcWorkerContent += `    return this.env.${durableObject.className.toUpperCase()}.get(durableId).${methodName}(...args);\n`;
            rpcWorkerContent += `  }`;
            rpcWorkerContent += '\n\n';
        });
    });

    rpcWorkerContent += `}\n`;

    // Write the rpc_worker.js file
    await fs.writeFile(rpcWorkerPath, rpcWorkerContent, 'utf-8');
    console.log(`Generated ${rpcWorkerPath}`);
}

// Generate wrangler.toml with bindings
async function generateWranglerToml() {
    const files = await fs.readdir(objectsDir);
    const durableObjectBindings: string[] = [];

    for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
            const filePath = path.join(objectsDir, file);
            const content = await fs.readFile(filePath, 'utf-8');

            const ast = parse(content, { sourceType: 'module', plugins: ['typescript'] });

            traverse(ast, {
                ClassDeclaration(path) {
                    // Check if class declaration has a valid name
                    if (path.node.id && path.node.id.name) {
                        const className = path.node.id.name;
                        if (className === "RPCWorker") {
                            return
                        }
                        durableObjectBindings.push(className);
                    }
                }
            });
        }
    }

    // Generate wrangler.toml content
    let wranglerTomlContent = `# Auto-generated wrangler.toml\n\n`;
    wranglerTomlContent += `name = "rpc_worker"\n`;
    wranglerTomlContent += `compatibility_date = "2024-09-25"\n`;
    wranglerTomlContent += `main = "./rpc_worker.js"\n\n`;
    wranglerTomlContent += `[[migrations]]\n`;
    wranglerTomlContent += `tag = "v1"\n`;
    wranglerTomlContent += `new_classes = [${durableObjectBindings.map(name => `"${name}"`).join(', ')}]\n\n`;
    wranglerTomlContent += `[durable_objects]\n`;
    wranglerTomlContent += `bindings = [\n`;
    durableObjectBindings.forEach((binding, index) => {
        wranglerTomlContent += `  { name = "${binding.toUpperCase()}", class_name = "${binding}" }`;

        // Add a comma between bindings, except for the last one
        if (index !== durableObjectBindings.length - 1) {
            wranglerTomlContent += ',\n';
        } else {
            wranglerTomlContent += '\n';
        }
    });
    wranglerTomlContent += `]\n`;

    // Write the wrangler.toml file
    await fs.writeFile(wranglerTomlPath, wranglerTomlContent, 'utf-8');
    console.log(`Generated ${wranglerTomlPath}`);
}

(async () => {
    await generateRPCWorker();
    await generateWranglerToml();
})();
````

And I can just run this in another terminal with `bun run workergen.ts && bunx wrangler dev --config ./src/objects/wrangler.toml`.

## Sample output

Here's an example from my test repo:

```typescript
import { WorkerEntrypoint } from "cloudflare:workers";

export { Counter } from "./Counter";

export default class RPCWorker extends WorkerEntrypoint {

   async newUniqueId() { return this.env.COUNTER.newUniqueId().toString() }

  // Counter - doStuff
  async COUNTER_doStuff(id, ...args) {
    const durableId = this.env.COUNTER.idFromString(id);
    return this.env.COUNTER.get(durableId).doStuff(...args);
  }

}
```

And the generated wrangler.toml

```toml
# Auto-generated wrangler.toml

name = "rpc_worker"
compatibility_date = "2024-09-25"
main = "./rpc_worker.js"

[[migrations]]
tag = "v1"
new_classes = ["Counter"]

[durable_objects]
bindings = [
  { name = "COUNTER", class_name = "Counter" }
]
```

## Now onto the good stuff (I hope)

Now all this spadework is done, I'm hoping I can actually finally try to build the thing I wanted to build in the first place!
