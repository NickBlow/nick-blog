---
title: A quick example of Alchemy email routing in dev
description: Routing Cloudflare inbound email to a local development server with Alchemy, a Worker, and a tunnel.
---

# A quick example of Alchemy email routing in dev

I found myself wanting to handle inbound emails in local dev with [Alchemy](https://alchemy.run). I couldn't find a good example of how to do this without having a fully remote worker, so I sketched out the following architecture:

![Alchemy email routing architecture](/articles/a-quick-example-of-alchemy-email-routing-dev/diagram.png)

I ended up with the following simplified Alchemy file, extracted from my larger Alchemy app.

Of course you can run whatever server you want. This isn't limited to a Node server or anything in particular. Super simple, easy to set up!

```typescript
import { spawn } from "node:child_process";
import { createServer } from "node:http";

import alchemy, { type Scope } from "alchemy";
import { EmailRouting, EmailRule, Tunnel, Worker } from "alchemy/cloudflare";
import { SQLiteStateStore } from "alchemy/state";

const stateStore = (scope: Scope) =>
  new SQLiteStateStore(scope, { engine: "libsql" });

const app = await alchemy("inbound-email-demo", {
  password: process.env.ALCHEMY_PASSWORD,
  stateStore,
  phase: "up",
});

if (!app.local) {
  throw new Error(
    "This demo is intentionally local-only. Run it with `alchemy dev`.",
  );
}

const accountId = requireEnv("CLOUDFLARE_ACCOUNT_ID");
const apiToken =
  process.env.CLOUDFLARE_ADMIN_API_TOKEN ?? process.env.CLOUDFLARE_API_TOKEN;
const zone = requireEnv("EMAIL_ZONE");
const emailAddress = process.env.EMAIL_ADDRESS ?? `inbound-demo@${zone}`;
const localPort = Number(process.env.LOCAL_EMAIL_HANDLER_PORT ?? "8789");
const tunnelHostname = process.env.TUNNEL_HOSTNAME ?? `email-dev.${zone}`;
const webhookSecret =
  process.env.EMAIL_WEBHOOK_SECRET ?? "local-email-demo-secret";
const resourceName = safeName(app.stage);

if (!apiToken) {
  throw new Error(
    "CLOUDFLARE_ADMIN_API_TOKEN or CLOUDFLARE_API_TOKEN is required.",
  );
}

const cloudflare = {
  accountId,
  apiToken: alchemy.secret(apiToken),
};

const localHandlerUrl = `http://localhost:${localPort}`;
const publicHandlerUrl = `https://${tunnelHostname}/email`;

await EmailRouting("email-routing", {
  ...cloudflare,
  zone,
  enabled: true,
});

const tunnel = await Tunnel("email-handler-tunnel", {
  ...cloudflare,
  name: `${resourceName}-email-handler`,
  adopt: true,
  ingress: [
    {
      hostname: tunnelHostname,
      service: localHandlerUrl,
    },
    {
      service: "http_status:404",
    },
  ],
});

const bridge = await Worker("email-bridge", {
  ...cloudflare,
  name: `${resourceName}-email-bridge`,
  adopt: true,
  delete: true,
  dev: { remote: true },
  bindings: {
    FORWARD_URL: publicHandlerUrl,
    WEBHOOK_SECRET: alchemy.secret(webhookSecret),
  },
  script: `export default {
  async email(message, env) {
    const headers = {};
    for (const [key, value] of message.headers.entries()) {
      headers[key] = value;
    }

    const raw = message.raw ? await new Response(message.raw).text() : "";
    const response = await fetch(env.FORWARD_URL, {
      method: "POST",
      headers: {
        "authorization": \`Bearer \${env.WEBHOOK_SECRET}\`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        from: message.from,
        to: message.to,
        headers,
        raw
      })
    });

    if (!response.ok) {
      throw new Error(
        \`Local email handler failed: \${response.status} \${await response.text()}\`,
      );
    }
  }
}`,
});

await EmailRule("email-to-local-handler", {
  ...cloudflare,
  zone,
  name: `Route ${emailAddress} to local dev`,
  enabled: true,
  priority: 1,
  matchers: [
    {
      type: "literal",
      field: "to",
      value: emailAddress,
    },
  ],
  actions: [
    {
      type: "worker",
      value: [bridge.name],
    },
  ],
});

console.log({
  sendEmailTo: emailAddress,
  cloudflareRoutesTo: bridge.name,
  bridgeForwardsTo: publicHandlerUrl,
  tunnelForwardsTo: localHandlerUrl,
});

await app.finalize();

const server = startLocalEmailHandler(localPort, webhookSecret);
const cloudflared = startCloudflaredTunnel(
  tunnel.token.unencrypted,
  tunnelHostname,
);

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function safeName(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "dev";
}

function startLocalEmailHandler(port: number, secret: string) {
  const server = createServer((request, response) => {
    if (request.method !== "POST" || request.url !== "/email") {
      response.writeHead(404).end("not found");
      return;
    }

    if (request.headers.authorization !== `Bearer ${secret}`) {
      response.writeHead(401).end("unauthorized");
      return;
    }

    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      const email = JSON.parse(body) as {
        from: string;
        to: string;
        headers: Record<string, string>;
        raw: string;
      };

      console.log("Received inbound email", {
        from: email.from,
        to: email.to,
        subject: email.headers.subject,
        rawBytes: Buffer.byteLength(email.raw),
      });

      response.writeHead(204).end();
    });
  });

  server.listen(port, () => {
    console.log(
      `Local email handler listening on http://localhost:${port}/email`,
    );
  });

  return server;
}

function startCloudflaredTunnel(tunnelToken: string, hostname: string) {
  const child = spawn(
    "cloudflared",
    [
      "tunnel",
      "--loglevel",
      "warn",
      "--protocol",
      "http2",
      "--no-autoupdate",
      "run",
      "--token",
      tunnelToken,
    ],
    { stdio: ["ignore", "inherit", "inherit"] },
  );

  child.on("error", (error) => {
    console.error("Failed to start cloudflared:", error.message);
    console.error("Install it with: brew install cloudflared");
  });

  child.on("spawn", () => {
    console.log(
      `cloudflared is routing https://${hostname} to the local handler`,
    );
  });

  return child;
}

function shutdown() {
  server.close();
  if (!cloudflared.killed) {
    cloudflared.kill();
  }
}

process.on("exit", shutdown);
process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});
```
