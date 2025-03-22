---
title: Running Planetscale's Serverless Driver Locally
description: Some example code for using a local MySQL instance with planetscale's serverless driver
---

# Running Planetscale's Serverless Driver Locally

TL;DR, look at [this gist](https://gist.github.com/NickBlow/50416afdd782617db05ceebdc82d2a52) for the code.

Update: Matt Robenolt from Planetscale [pointed out on X](https://x.com/mattrobenolt/status/1903261372068282517) that he's working on a [local simulator](https://github.com/mattrobenolt/ps-http-sim) for their HTTP endpoint, so this may be a better solution!

I finally took the plunge and moved something I've been working on from Durable Objects SQL to PlanetScale. I just had a second baby, so time (and energy) have been few and far between, but it wasn't too hard with some LLM assistance. I had a fairly comprehensive test suite which helped validate I haven't broken anything in the process.

While developing against the production branch, I was kind of annoyed at the latency to the cloud, and wanted to develop against a locally running MySQL container.

However, all the code I saw was using the MySQL driver, and I'd been using the [serverless driver](https://planetscale.com/docs/tutorials/planetscale-serverless-driver).

So I created a fully compatible drop in replacement that has the same types. I ran my test suite against both local and remote planetscale, and it seems to work identically, though be warned this has not been productionized or battle tested.

When running local tests, my suite went from 30s > 4s. And I can now use it on an aeroplane.

I have something fun cooking for dealing with latency in prod from my worker (it involves Durable Objects!), that I'll write about soon.

## Why did I move?

Firstly - the 1GB / 10GB limit per Durable Object worries me a bit. I was planning on having a Durable Object per account, but it is possible for users to exceed this. I was thinking of sharding or pagination techniques, but I decided I didn't want to start reinventing the wheel with my database layer, fun as it may be.

Secondly, it simplified my code a lot - I was able to do transactions and JOINs that were not really possible with Durable Objects. I had done a pseudo two-phase commit pattern that worked quite well, but I was just able to push this all to the database itself.

Thirdly - Planetscale supports full text search and vector search natively which I will be hoping to use.

I still think Durable Objects and SQLite are a great bit of tech, but sadly not suited for what I am building right now.

## Bonus: It works in wrangler dev / workerd!

With a compatibility date of `2025-03-10` or later, `nodejs_compat_v2` enabled and mysql2 `3.13.0` or later (be sure to set `disableEval: true`), this code works just fine in workerd. You could conceivably run it as is, but I think the planetscale serverless driver is just better performing (until Hyperdrive supports MySQL)?

## The code

The code is in [this gist](https://gist.github.com/NickBlow/50416afdd782617db05ceebdc82d2a52), but reproduced below.

```typescript
import mysql, { FieldPacket, OkPacket } from "mysql2/promise";
import { Connection } from "@planetscale/database";

export type PscaleConnection = Omit<Connection, "fetch">;
export type PscaleLocalConnection = PscaleConnection & { close: () => void };

export interface PlanetScaleConfig {
  host?: string;
  username?: string;
  password?: string;
  database?: string;
}

export class PlanetScaleLocal {
  private pool: mysql.Pool;
  private cachedConnection: PscaleLocalConnection;

  constructor(config: PlanetScaleConfig = {}) {
    this.pool = mysql.createPool({
      host: config.host || "localhost",
      user: config.username || "root",
      password: config.password || "rootpassword",
      database: config.database || "testdb",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      disableEval: true,
    });

    // Initialize the cached connection interface
    const self = this;
    this.cachedConnection = {
      execute: async function (query: string, args?: any, options?: any) {
        const connection = await self.pool.getConnection();
        try {
          // Convert null args to empty array
          const params =
            args === null ? [] : Array.isArray(args) ? args : undefined;
          const [rows, fields] = await connection.execute(query, params);

          // Format the result to match PlanetScale's ExecutedQuery
          let formattedRows: any;
          if (Array.isArray(rows)) {
            formattedRows = rows;
          } else if ("affectedRows" in rows) {
            const okPacket = rows as OkPacket;
            formattedRows = [
              {
                affectedRows: okPacket.affectedRows,
                insertId: okPacket.insertId,
              },
            ];
          } else {
            formattedRows = [];
          }

          // Convert field packets
          const formattedFields = (fields || ([] as FieldPacket[])).map(
            (field) => ({
              name: field.name,
              type: field.type?.toString() || "string",
              typeName: field.typeName || "",
              orgName: field.orgName || "",
              table: field.table || "",
              orgTable: field.orgTable || "",
              schema: field.schema || "",
            }),
          );

          return {
            rows: formattedRows,
            fields: formattedFields,
            headers: [],
            types: {},
            size: formattedRows.length,
            statement: query,
            insertId: (rows as OkPacket).insertId?.toString() || "0",
            rowsAffected: (rows as OkPacket).affectedRows || 0,
            time: Date.now(),
          };
        } finally {
          connection.release();
        }
      },

      transaction: async function <T>(fn: any): Promise<T> {
        const connection = await self.pool.getConnection();
        await connection.beginTransaction();

        try {
          // Create transaction object based on PlanetScale's api
          const tx = {
            // This is a placeholder that matches the expected interface
            conn: connection,
            execute: async function <U>(
              query: string,
              args?: any,
              options?: any,
            ): Promise<any> {
              // Convert null args to empty array
              const params =
                args === null ? [] : Array.isArray(args) ? args : undefined;
              const [rows, fields] = await connection.execute(query, params);

              // Format the result to match PlanetScale's ExecutedQuery
              let formattedRows: any;
              if (Array.isArray(rows)) {
                formattedRows = rows;
              } else if ("affectedRows" in rows) {
                const okPacket = rows as OkPacket;
                formattedRows = [
                  {
                    affectedRows: okPacket.affectedRows,
                    insertId: okPacket.insertId,
                  },
                ];
              } else {
                formattedRows = [];
              }

              // Convert field packets
              const formattedFields = ((fields as FieldPacket[]) || []).map(
                (field) => ({
                  name: field.name,
                  type: field.type?.toString() || "string",
                  typeName: field.typeName || "",
                  orgName: field.orgName || "",
                  table: field.table || "",
                  orgTable: field.orgTable || "",
                  schema: field.schema || "",
                }),
              );

              return {
                rows: formattedRows,
                fields: formattedFields,
                headers: [],
                types: {},
                size: formattedRows.length,
                statement: query,
                insertId: (rows as OkPacket).insertId?.toString() || "0",
                rowsAffected: (rows as OkPacket).affectedRows || 0,
                time: Date.now(),
              };
            },
          };

          const result = await fn(tx);
          await connection.commit();
          return result;
        } catch (err) {
          await connection.rollback();
          throw err;
        } finally {
          connection.release();
        }
      },

      // Required by the interface but not actually used
      config: {},
      refresh: async (): Promise<void> => {},

      // Close method to clean up resources
      close: async function (): Promise<void> {
        await self.pool.end();
      },
    };
  }

  // Now this method is not async, it just returns the cached connection
  connection(): Omit<Connection, "fetch"> {
    return this.cachedConnection;
  }

  // Close the pool when shutting down your application
  async close(): Promise<void> {
    await this.pool.end();
  }
}
```
