---
title: 9 Lessons from 9 Years of Serverless
description: Sharing some thoughts about my experience using serverless technologies.
---

# 9 Lessons from 9 Years of Serverless

Hey, I’m Nick, CTO at a startup called [Wakelet](https://wakelet.com). I’ve been using serverless since 2015, and since then have written systems that do billions of Lambda requests per month and supports tens of millions of users worldwide.

Serverless is great, and we use it to greatly simply our ops and infrastructure, but like with every tool, knowing how to use it can make you much more effective.

## Lesson 1: You might still need or want a container

Even though our cloud estate is pretty much fully serverless (including our upload pipeline, which I may write about in future), we have one exception which is our core API. This is our main service, supported by a bunch of microservices running in Lambdas. This service is running in ECS in Fargate.

### We have some very good reasons for this.

First off, cost. This service gets hit on every page load, and is on the critical path. It handles many hundreds of requests per second, and is pretty much under constant load as we have customers all around the globe. A general rule of thumb is that if you are able to run a server at >25% load 24/7, this is the inflection point for it being cheaper than Lambda in terms of infrastructure. Now, bear in mind that this doesn’t mean always use containers at this point (more on this later), but it is still something to bear in mind.

The second, and more important reason as to why we’re using a container is Redis. We maintain a Redis cache layer in front of DynamoDB that handles 95+% of all reads going through the system, and saves us thousands of dollars a month. However, Redis is stateful, and requires a persistent connection to be set up. When we originally set up the Redis cache layer, we were running our API in a Lambda. This worked fine until we hit bursts of traffic. When traffic bursts occurred, Lambda (since it can only handle a single request at a time) would spin up multiple instances. Each instance would set up its own Redis connection on initialise, which would increase CPU usage on the cache layer when setting them up, causing the cache to slow down. When the cache slowed down, our Lambdas would take longer to respond, causing even more parallel Lambdas to spin up, which slowed the cache down even more, causing even more Lambdas to spin up… until eventually the cache fell over under load. With a container, we can control the number of new connections much more easily, as each server can handle hundreds of concurrent requests.

These are just a few reasons you might need a container, but you’re very likely to need one at some point. Other reasons include being able to have caches on the local machine (we currently do this via [Rueidis](https://github.com/redis/rueidis)), supporting stateful protocols like WebSockets, or having more control over your infrastructure in general.

## Lesson 2: Using a web server and an adapter is great

For every other service we have, they all run in Lambda and most of them have standardised on a pattern. We either use [serverless express](https://www.npmjs.com/package/@codegenie/serverless-express) or [Go Lambda proxy](https://github.com/awslabs/aws-lambda-go-api-proxy). You could also use the [Lambda HTTP adapter](https://github.com/awslabs/aws-lambda-web-adapter) but we’ve never used it ourselves. We then deploy the whole thing as one “fat” lambda - with everything bundled up as one deployment package.

The main advantage of this is twofold. Firstly, developers can use tools they understand from traditional web servers. Secondly, it makes local development a breeze, because you simply test your web-server like you would any normal project. You can run it locally and make requests normally without having to wrangle obtuse Lambda CLI tooling.

Another minor advantage of “fat” lambdas is you’re less likely to hit a cold start, since the same lambda runs every endpoint.

One disadvantage is that you lose the coarse grained “per-endpoint” permissions that you can apply for one Lambda per endpoint. You still have an escape hatch of deploying the same lambda on different URLs with a different IAM role, but I find the complaint a little overblown. After all, very few people would complain a container or ec2 instance is violating the principle of least privilege just because one endpoint can access something that another endpoint on the same box needs, but it itself doesn’t need.

## Lesson 3: Infrastructure as code is great

A few years ago, Lambda deployment was a bit of a pain, as most tools either deployed zip archives or generated them, but didn’t do both at once. Infrastructure as code is great and you should use it. Reproducible builds and easy rollbacks are worth the investment, and its not particularly hard to write any more with modern tooling. We prefer to write our IaC in TypeScript with the AWS Cloud Development Kit, as TypeScript is something we all know in the company and is just one fewer thing to learn. Getting autocomplete and documentation in your IDE is also a great productivity boost. Other alternatives which use high level languages include [Pulumi](https://www.pulumi.com/) and [SST](https://sst.dev/), though we haven’t felt the need for either so far. Terraform also works, but I am not a fan of having to learn another configuration language and syntax.

## Lesson 4: 1 Function != 1 Service

One other advantage of infrastructure as code is that you can deploy multiple related lambdas at once. One mistake we made very early on was treating each lambda as its own thing - its own repo, its own deployment… this just creates a bunch of issues.

The important realisation is that things that change together should live together as much as possible. And it’s totally valid to have multiple lambdas forming a coherent whole. Our main API service has multiple supporting lambdas doing async work on a queue, but that doesn’t mean that async work is a separate service. Conceptually it’s part of the same whole.

You can also do the same thing that we do with API lambdas and have “fat” lambdas handling multiple data sources. For a few years, we had a single Lambda listening to multiple different DynamoDB and Kinesis streams and doing slightly different logic based on the input stream. The benefits are clearer if you’re doing similar things with the data - in this case, it was preprocessing and copying data to our analytics database.

Tools like [localstack](https://www.localstack.cloud/) also help us test the “glue” between parts of the service locally, like queues.

## Lesson 5: Go (/Rust) is great

Even though Node is probably *the* poster child for serverless, I would argue it’s not always the right choice, for a few reasons.

Firstly, cold starts. A cold start is the extra time taken to initialise a function which hasn’t been called in a while. Cold starts are something people love to talk about a lot, and they can be devastating if you have large ones. However, at scale they’re just a minute fraction of all your requests since more requests hit “warm” lambdas. Despite this, languages like Go and Rust have minute cold starts ([source](https://mikhail.io/serverless/coldstarts/aws/)) which basically stay flat with bundle size. This also makes “fat” lambdas more palatable in Go, as adding more code doesn’t materially impact cold start, unlike in Node where your startup time can end up being multiple seconds for large bundles.

Even ignoring cold starts for a moment, time is literally money when it comes to Lambda, seeing as it’s billed per millisecond. We saw improvements of up to 50% in our execution times when porting code from Node to Go, and that had direct impacts on our infrastructure costs. Even for simple tasks such as making a single read to DynamoDB, we saw improvements of around 20%.

Rust has similar performance benefits - and theoretically can be optimised more than Go - but has a much steeper learning curve, so it would probably not be my first choice. However, with the right people it could definitely work well.

This is unfortunately not (yet) a panacea. While there are interesting Rust based web frameworks like Yew, they’re not really mainstream nor suited for most sites. And Go doesn’t have a good WASM story, so you’re probably writing your UI in TypeScript (or JavaScript if you love runtime errors). This almost necessitates you to use Node on the server for SSR etc. I’m still on the fence about serverless for frontend. JS simultaneously has excellent I/O handling, but is also single threaded, meaning that you get benefits from isolating requests, but also you pay for time where your compute is idle in Lambda. If only there was a cloud provider that billed you for the CPU you actually ended up using… (there is, keep reading)

## Lesson 6: Total cost of ownership is more than just compute cost

As alluded above, simply hitting the magic 25% utilisation mark shouldn’t be enough to automatically make you move to ECS or EC2 immediately. There’s lots of little things you just don’t have to think of with Lambda.

Firstly, patching. Unless you’re using a static binary, you’re probably shipping an OS with your containers. These need to be kept up to date.

Secondly, scaling. Autoscaling is just a few lines of code, but you need to understand what metrics you should use to trigger a scale up, right size your instances etc. This is much less of a concern with Lambda - though you can still perform right sizing with [power tuning](https://docs.aws.amazon.com/lambda/latest/operatorguide/profile-functions.html) for cost purposes.

Thirdly, isolation. Occasionally you’ll get API calls that consume so many server resources that it slows things down for everyone. Tracking these down and fixing them can take a lot of time. This just doesn’t happen on lambda, and a slow or expensive request will not impact other users.

We’ve got lambdas that have sat there for years without needing any updates or intervention. They *just work*. The cost savings of this in terms of maintenance are rather understated, and  the infrastructure cost doesn’t tell the whole story.

## Lesson 7: Stateless database APIs are king

As mentioned previously, we had a lot of issues using Redis and Lambda. Where possible, using a database that provides a stateless API, eg over HTTP is generally far better. The main benefit is that these stop you using up server resources when parallel connections spike. You can still get 90% of the benefits of a persistent connection using HTTP keepAlive.

Examples of good choices here are dynamodb, RDS via the data api and upstash. Other options exist, but I don’t have sufficient experience with them to recommend any in particular.

## Lesson 8: AWS consistently makes Lambda better

When I first started using Lambda, it didn’t work in VPC, it billed per 100MS, it didn’t support Docker images, it had awful cold starts and had limited memory. And those are only the limitations I can remember!

AWS has proven that it wants to invest heavily into Lambda, and it has only gotten cheaper, faster, more powerful and more reliable. Just by virtue of using Lambda, you generally end up getting a bunch of infrastructure benefits for free as and when Amazon releases them.

## Lesson 9: Don’t sleep on Cloudflare

While being quite limited in terms of NodeJS APIs (though they are [working on that](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)), as well as only supporting WASM or JavaScript, Cloudflare and their offerings are getting better and better. They’re significantly cheaper than Lambda, and lots of their products such as Durable objects and KV enable really interesting use cases. Their billing is also a bit friendlier than AWS - they only charge you for the compute time you actually use, and don’t bill you when the function is idle, for example when waiting on a network call.

AWS used to be the only serious competitor and innovator in this space, but Cloudflare has really ramped up their offerings and are well worth considering especially if you’re using a lot of JS in your estate. Unfortunately for us, Go doesn’t have a great WASM story, but other languages do, most notably Rust.

## TL; DR

Serverless is great and keeps getting better. It’s not a cure-all, but for many use cases it’s a cost-effective and easy to maintain option. I’m excited to see where things go in future, and what cool use cases they’ll unlock.
