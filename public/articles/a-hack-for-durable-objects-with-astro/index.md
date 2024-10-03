---
title: A hack for durable objects and Astro
description: I wanted to use Durable Objects with the new Workers Assets Astro integration...
---

# A hack for durable objects and Astro

I was very excited to play around with some of the cool stuff released during [Cloudflare Birthday Week](https://blog.cloudflare.com/birthday-week-2024-wrap-up/).

I've been exploring Astro, and I really like it. I wanted to give a go to the new Workers Assets functionality. And of course, play around with Durable Objects.

You can't bind Durable Objects to the legacy Cloudflare Pages integration. But Workers Assets is *just* a worker, meaning it can access everything a normal worker can. Like Durable Object bindings...

**NOTE: This only works when built. I'm still trying to find a good solution for dev mode. In the mean time you can run a separate worker in another terminal.**

## Durable Objects, an aside

Durable Objects are really cool. They're essentially persistent compute + storage, with neat pseudo-actor semantics.

I have yet to use them in production, or in anger. I can definitely see the utility. If I were to rebuild [Wakelet](https://wakelet.com) from scratch, I'd definitely put Durable Objects as a key part of the infra.

Alas, nothing is quite so simple.

## Back to the good stuff!

One gripe I have with Astro (and quite a few other frameworks - it's not alone), is they obfuscate the main entry point from you.

This is actually one of the things I appreciate with Remix - they don't hide anything from you! You can actually edit the [entry function](https://github.com/NickBlow/nick-blog/blob/main/functions/%5B%5Bpath%5D%5D.ts) if you want. Neat!

Unfortunately, you can't do this with Astro. You can run a separate worker script, and bind to that with wrangler (Cloudflare's cli). But it kind of sucks.

Luckily, Astro uses Vite. Vite supports plug-ins.

## The horrible hack

We'll write a vite plug in that loads our Durable Object code and shoves it into index.js. My first attempt was very simple.

```typescript
import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import ts from 'typescript'; // Import TypeScript transpiler
import { fileURLToPath } from 'url'; // To handle ESM paths

export default function injectDurableObject(): Plugin {
    return {
        name: 'inject-durable-object',
        generateBundle(_, bundle) {
            const workerFile = Object.keys(bundle).find((file) => file === 'index.js');

            if (workerFile && bundle[workerFile]?.type === 'chunk') {
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);

                const chunk = bundle[workerFile];

                const counterFilePath = path.resolve(__dirname, './src/objects/Counter.ts');
                const counterTsContent = fs.readFileSync(counterFilePath, 'utf8');

                // Transpile the TypeScript content to JavaScript
                const counterJsContent = ts.transpileModule(counterTsContent, {
                    compilerOptions: { module: ts.ModuleKind.ESNext }
                }).outputText;

                // Inject the transpiled JavaScript content into the index.js file
                chunk.code += `\n${counterJsContent}\n`;

                console.log('Transpiled Durable Object class injected into index.js');
            } else {
                console.error('index.js not found in the bundle');
            }
        }
    };
}
```

This works! But it has a couple of issues. Firstly it only works if the Durable Object code is self contained and has no imports.

Secondly, if I add a new object, I have to shove it into here... Sounds ripe for human error. We can do better (with our trusty friend, GPT).

## The final code

```typescript
import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { rollup } from 'rollup';
import typescript from '@rollup/plugin-typescript';

export default function injectDurableObjects(): Plugin {
    return {
        name: 'inject-durable-objects',
        async buildStart() {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const objectsDirPath = path.resolve(__dirname, './src/objects');
            const objectFiles = fs
                .readdirSync(objectsDirPath)
                .filter((file) => file.endsWith('.ts'))
                .map((file) => `export * from './${path.basename(file, '.ts')}';`)
                .join('\n');

            const barrelFilePath = path.resolve(objectsDirPath, '_barrel.ts');
            fs.writeFileSync(barrelFilePath, objectFiles);

            const inputOptions = {
                input: barrelFilePath,
                plugins: [typescript()],
            };
            const outputOptions = {
                format: 'esm' as const,
                file: path.resolve(__dirname, './dist/_barrel.js'),
            };

            const bundle = await rollup(inputOptions);
            await bundle.write(outputOptions);

            fs.unlinkSync(barrelFilePath);
        },
        generateBundle(_, bundle) {
                const workerFile = bundle['index.js'];
                const __dirname = path.dirname(fileURLToPath(import.meta.url));
                const barrelFilePath = path.resolve(__dirname, './dist/_barrel.js');

            if (workerFile && fs.existsSync(barrelFilePath)) {
                const barrelContent = fs.readFileSync(barrelFilePath, 'utf8');

                    if ('code' in workerFile) {
                        workerFile.code += `\n${barrelContent}\n`;
                    }
                fs.unlinkSync(barrelFilePath);
            }
        },
    };
}
```

![Inception](/articles/a-hack-for-durable-objects-with-astro/og-image.png)

We're running rollup INSIDE a Vite plugin, which is a bit inception-y. But what better way to bundle dependencies than a bundler? And (for the moment) rollup comes with Vite.

We generate a fake barrel file including all our objects, bundle that into one file (deduping and resolving imports for free!) and shove that into the index.js.

Probably will have to be replaced with Rolldown in future. This is rather brittle, but at least it does the right thing!

## More to come (hopefully)!

The Astro team are apparently working on making this nicer to use, so maybe I won't need this soon. This at least unblocks me.

This is just the start. I want to do some experimentation with local first, and play around with [SQLite](https://blog.cloudflare.com/sqlite-in-durable-objects/).

Hopefully I'll be able to build something cool to share in the next few weeks.
