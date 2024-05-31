---
title: Solid Start inside a Durable Object.
description: Running Solid Start inside a durable object was fairly simple thanks to the pluggable architecture.
---

# Solid Start inside a Durable Object.

I've been looking at SolidStart a lot recently, and I've been looking for a good excuse to play around with it a bit.

I was inspired by [this tweet](https://x.com/threepointone/status/1796223745243119890) to see how easy it would be to set up SolidStart inside a Cloudflare Durable Object.

![Sunil Pai Remix inside Durable Object tweet](/articles/solid-start-inside-a-durable-object/sunil-pai-tweet.png)

As Sunil lays out, there's a lot of really cool advantages to having your web server inside a durable object, and thanks to SolidStart's pluggable architecture, I figured I could give it a go.

The full code for this blog is on my [GitHub](https://github.com/NickBlow/solid-durable-object).

## Solid Start

Solid Start is the new server framework from SolidJS. It's analogous to your Remix, SvelteKit and Next packages. Solid is a smaller bundle size, both on server and client, which has nice performance characteristics. It's also very fast.

The main benefit from Solid here was the pluggable architecture. The server is built on top of [Nitro](https://nitro.unjs.io/). And more crucially, it's exposed. Doing this in something like Next would pretty much involve forking Next, as they obfuscate the server entry point from you.

## Nitro Presets

Nitro comes with a bunch of built in presets for deployment, and recently released an experimental ['Custom Preset'](https://nitro.unjs.io/deploy/custom-presets) feature, which is exactly what we need.

It took a bit of digging, but eventually I found the [Cloudflare Module](https://github.com/unjs/nitro/blob/main/src/presets/cloudflare/runtime/cloudflare-module.ts) preset, and used this as my starting point.

I first wasted time on the Cloudflare preset and was greeted by `[ERROR] You seem to be trying to use Durable Objects in a Worker written as a service-worker.`

Once I figured that out, it was a simple matter of creating a few preset files.

## The Preset Configuration

In `app.config.ts`, I added the following:

```ts
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    server: {
        preset: "./preset",
        rollupConfig: {
            external: ["__STATIC_CONTENT_MANIFEST", "node:async_hooks"]
        },
    }
});
```

The rollupConfig fixes an issue with Cloudflare and async_hooks, which is needed for this to work properly. And the './preset' folder is my local Nitro Preset.

It has two files. `nitro.config.ts` contains the following.

```ts
import type { NitroPreset } from "nitropack";
import { fileURLToPath } from "node:url"
export default <NitroPreset>{
    extends: "cloudflare-module",
    entry: fileURLToPath(new URL("./entry.ts", import.meta.url)),
    hooks: {
        compiled() {
            console.log('compiled');
        },
    },
};
```

The next file was a bit more interesting. `entry.ts`. My first attempt was the following:

```ts
    // @ts-ignore
    import "#internal/nitro/virtual/polyfill";
    // @ts-ignore
    import { requestHasBody } from "#internal/nitro/utils";
    import { Buffer } from 'node:buffer';
    import { useNitroApp } from "nitropack/dist/runtime/app";

    const nitroApp = useNitroApp();

    interface Env {
        DURABLE_SOLID: DurableObjectNamespace;
    }

    export class DurableSolid {
        state: DurableObjectState;
        env: Env;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
    }

    async fetch(request: Request) {
        const url = new URL(request.url);
        let body;
        if (requestHasBody(request)) {
            body = Buffer.from(await request.arrayBuffer());
        }
        return nitroApp.localFetch(url.pathname + url.search, {
            context: {
                durableObjRef: this
            },
            host: url.hostname,
            protocol: url.protocol,
            method: request.method,
            headers: request.headers,
            body: body,
        });
    }
}

export default {
    async fetch(request: Request, env: Env) {
        const id = env.DURABLE_SOLID.idFromName('todo');
        const stub = env.DURABLE_SOLID.get(id);
        return await stub.fetch(request);
    },
};
```

Now I can get access to the durable object wherever I want in my SolidStart server. I can access state, all the cloudflare bindings, etc.

```ts
    const event = getRequestEvent();
    const durableObj = event?.nativeEvent.context.durableObjRef;
    console.log(durableObj);
```

This worked... on the server. On the client, I saw this:

![UI with no CSS](/articles/solid-start-inside-a-durable-object/broken-ui.png)

The missing piece was static asset handling. I was missing all the CSS and JS.

Luckily, Nitro has our back once again, and it was a simple matter of doing some small tweaks and adding all the asset fetching from the [Cloudflare Module preset](https://github.com/unjs/nitro/blob/main/src/presets/cloudflare/runtime/cloudflare-module.ts) back in.

The full code can be found [on my GitHub](https://github.com/NickBlow/solid-durable-object/blob/main/preset/entry.ts).

## Developer Experience

The developer experience is a bit bad. [Wrangler](https://developers.cloudflare.com/workers/wrangler/) luckily supports mocking durable objects and their APIs locally. However, it doesn't support any of the neat features like hot reloading when doing it this way.

Future enhancements should probably include creating a mock Durable Object we can pass in during local development, potentially using the lower level primitives of [Miniflare](https://www.npmjs.com/package/@miniflare/durable-objects) directly.

## Summary

This was a really cool proof of concept, and I'm looking forward to hacking around a bit more and seeing what's possible!

