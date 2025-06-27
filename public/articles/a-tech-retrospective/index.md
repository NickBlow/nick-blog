---
title: A Tech Retrospective
description: A retrospective on my tech journey at Wakelet.
---

# A tech retrospective

Today marks my last day as CTO of Wakelet, where I've been working since 2015. It's been a crazy journey. I've learned a lot and had a lot of fun along the way.

In terms of what's next, I'm joining Iterate - [https://www.iterate.com/](https://www.iterate.com/), another startup about automating tedious startup processes.

## Looking Back

Over the nearly decade at Wakelet, I've made many tech decisions - some good, some bad. More importantly, I have the somewhat unique experience of coming face-to-face with some of my technology decisions years later. I have the privilege of seeing the day 1 AND the day 3000 experience for some of these things!

So, without further ado, here's a tech retrospective of my time at Wakelet.

## The Good

### Serverless

[I love serverless](https://nickblow.tech/posts/9-lessons-from-9-years-of-serverless). Yeah, it's a bit more expensive. But we literally didn't have an on-call rotation because outages happen so rarely. The extra sleep and my sanity is worth the $. Cloudflare is innovating a lot here (another reason I joined Iterate, who use them extensively), and is actually significantly cheaper than AWS – despite a few rough edges.

### TailwindCSS

Tailwind is one that I had a particularly visceral day 1 reaction to (I did not like it). To the point where I was tempted to rip it out and rewrite in vanilla CSS. But I'm glad I didn't.

Tailwind's main advantage is the fact that LLMs know it well, and you don't need to muck around with separate CSS files. It's all there in the markup. Yes, you do pay a [slight performance penalty](https://nickblow.tech/posts/tailwind-is-not-always-optimal-and-thats-okay) compared to completely optimal CSS, but in general it's hard to write perfectly optimal CSS as a team, and you're likely going to be better with Tailwind.

There are some problems with composition [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) being a hacky runtime solution, but overall it's a great tool for building UIs.

### TypeScript (particularly with Bun)

TypeScript is getting really good. Things like Bun (which I've been using for a while) and Deno (which I've heard great things about) have solved many of the problems that TypeScript used to have, particularly around tooling. Gone are the days of having to download 500GB of NPM packages to get your app to compile. There's functional programming with [Effect](https://effect.website), and all of the major AI providers support it very well. My hot take is that TypeScript will eventually overtake Python as the dominant language for machine learning scripting but that's very speculative...

### Automated Testing

When I started, I was vehemently anti-testing. "Just write simple code!", I naiively cried.

What a fool I was. I love tests now (especially with AI writing more and more code). The big thing that clicked is that tests are a quick feedback loop, and they enable you to *refactor* with confidence. Tests are not actually really there to catch bugs – though writing a failing test to reproduce a bug is a great way to start fixing one.

I also tend to use tests as my 'TODO' list as I am programming something. I've gotten addicted to the dopamite hit of seeing all the little red crosses turn into green checkboxes.

### Pair Programming

Pairing always seemed like a bit of a waste of time to me, but if you treat it as continual, real time, code review then it's a great way to learn from each other and improve your code. We instigated a rule that code that was paired does not need to go through PR, and that massively increased adoption. I especially like the dynamic of a senior + junior developer, where you have the youthful energy and unconventional ideas plus the wisdom of experience.

I really like using something like VSCode Live Share, or JetBrains Code With Me where you can then split up to do repetitive tasks in the codebase, then get back together to do the more complex stuff.

### Claude!

Claude 3.7 Sonnet was the first model since GPT4 that blew me away. And Claude 4.0 is even better. It's excellent at UIs, I really like the personality, and it's the best agentic model I've used. Claude Code helps me automate the tasks I don't want to do, and it usually is pretty good at them! The only problem is it's quite expensive, which brings me to...

### Gemini Flash

Gemini Flash is my secret weapon for things that don't need a lot of power. It's got the best price/performance in the industry, and it's a fantastic little model.

## The Mid

### DynamoDB

DynamoDB has been *rock solid* for us. I can't remember it ever going down, and we hit it with several billion requests a month. Why is it mid?

It's mid because it really forces you to use it a certain way, and if your access patterns don't match that, you're in trouble. You can spend a lot of time thinking about this, but I've lost a lot of brain cycles to the optimal way of storing large lists in Dynamo (e.g. we have users with tens of thousands of items on a page). The limits are pretty strict – I understand why, it's so that they can scale and guarantee the performance characteristics, but it's also a bit of a pain to work with. We've bumped into the 400KB item max size a lot.

If I were to start today, I'd probably use [Planetscale](https://planetscale.com/) instead of DynamoDB. MySQL supports JSON now, it has full text search (though you'd probably need a dedicated search engine later on), and it's a lot more familiar to work with. Planetscale Metal is also incredibly fast.

### React

I have a lot to say about React. Let's start with the negatives:

React has *good enough* performance, until it doesn't. We have lots of performance issues that are due to React's re-rendering model, and though concurrent rendering + the compiler helped, we have a lot of fundamental re-architecture to do to fix it. Something like Solid, Svelte or Vue would be better, but we're stuck with React for now.

React Hooks are too big-brained for most people. The amount of abuse of `useEffect` I see is crazy, and the old lifecycle methods were I think easier to reason about.

React doesn't play well with lots of DOM APIs, especially when it comes to things like drag and drop or complex animations. This is just the impedence mismatch between a declarative API over imperative DOM APIs.

The good:

The ecosystem is unmatched, and LLMs are *awesome* at React. This is incredibly useful, as for 99% of UIs, a React SPA is completely adequate, and Claude can crap them out at a rate of knots. It's also the only framework at the moment that can viably do Web and Mobile on one codebase. Plus there's people doing cool stuff like [ReasonReact](https://github.com/reasonml/reason-react) with OCaml bindings for React - there's an alternative universe where that won which is very interesting.

I really like JSX as a templating languge, it's super intuitive and easy enough to reason about. As an aside, this is why I think Solid adopting JSX is a good thing.

The team is continuing to push the tech forward. The compiler was a huge win, and even though Server Components are a bit of a mixed bag at the moment, it's still directionally correct in my opinion.

### Go

[I feel like Go isn't a great choice any more](https://nickblow.tech/posts/ive-soured-on-go), but I don't necessarily regret choosing it. For a team of mostly juniors, who needed to get productive fast, Go is and was a good choice. It's fast and easy to learn, and the standard library is comprehensive and pretty decent, all things considered (though I know there are some who would disagree).

Despite it being known for concurrency, I actually don't like its concurrency model. It's far too easy to leak Goroutines, and it's just not worth it in many cases. Cancellation of Goroutines is also a pain. We have a soft ban on Goroutines which is probably the right choice.

### GraphQL

GraphQL was the future of APIs! It was going to kill REST! Well... that was the promise.

I actually liked quite a lot of things about GraphQL. As we were discovering what our APIs should look like, the flexibility really helped. Having a backend in Go, and a frontend in JS, it was really great for generating TypeScript types from the definitions. Especially at the time, OpenAPI tooling was not great, so couldn't compete there. I really wish we'd been able to try out Relay (though I've heard it's complicated), but I was outvoted and we went for TanStack Query – which is pretty good.

The biggest problem is just that it's a bit too different. We really struggled hiring people who knew it. You couldn't cache responses easily as everything was a POST, and it was too easy to accidentally create resolvers that were slow. Plus security was a bit of a minefield.

Today, I'd probably just pick REST, which is another technology I've grown to appreciate. But APIs are in a weird spot with LLMs, maybe it'll all be MCP soon.

### Redis

Redis saved us a crap ton of money on Dynamo by caching all read-only data on write. I had to actually rewrite our duration logging middleware to use microseconds instead of milliseconds as it was so fast. You can do so many things with Redis and the weird and wonderful data models.

The biggest problem was really the connection model. In the last 3 years, all of our outages have been Redis related.

The first main issue was the fact that it doesn't play well with Lambda – each lambda has its own connection, and if a new one spins up it opens a new connection, consuming CPU. This means on a request spike you'll get a CPU spike as it processes connections, which slows down the responses, which spins up more concurrent lambdas, which open more connections... not good. [Upstash](https://upstash.com/) has a stateless HTTP proxy, but is rather expensive.

The second main issue is that many libraries used a thread pool, and didn't work well if it was exhausted. We used [Rueidis](https://github.com/redis/rueidis) in the end to fix this, which automatically pipelines requests. It also supports Client Assisted Caching which is super neat.

### Stateless Auth

Use a JWT they said. Sessions don't scale well they said. Except companies like Facebook and Google still use them. Most people will never get to that scale.

Interestingly enough, the biggest thing pushing stateless auth is 3rd party auth providers, as it's a lot easier to sign a token than it is to manage a session store as a service. We use Firebase Auth (because they support SAML), which forces us to use a JWT.

Anyway, overall - they've actually been fine. The biggest problem has actually been third parties. Loads of 'security researchers' and unsophisticated penetration testers (which we got a lot of, in the Edu space) report that cookies are still valid after you log out. One does not simply revoke a JWT!

Probably not worth the hassle on balance, just use a session store. If you get to Google scale, you'll be able to afford spending some engineering time to fix it.

## And the Ugly...

### Web-Components

Web Components are the biggest disappointment. We took a very early bet on them, and they were horrible to work with. The API being JavaScript first, unable to be server rendered, and the frameworks being super unergonomic was a pain. It took literal years before Safari and Firefox were not a buggy mess, especially when it came to things like selection.

There's still barely a good SSR solution that works for search engines - though [Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom) is *finally* baseline, I don't think it will work well with SEO, but that's speculation.

The main problem was actually Shadow DOM. Loads of tools just outright blow up when they can't access the internals of a page, and JSDOM did not support it for a long time, making testing unnecessarily tedious. This is still an issue, nearly a decade later.

Performance wise, Solid, Svelte or Vue offer comparative (if not better) performance with a tiny bundle size, while having 10000x better DevEx.

### JavaScript without types

JavaScript without types is hell. We had several hundred thousand SLOC. You could not refactor it. We had to throw it all away and rewrite. Just don't do it. Please.

### Next.JS

NextJS was the 'popular' choice, and I regret it bitterly. React was the right choice at the time, but nowadays React Router is just far better. It's probably not malicious, but new features just work better on Vercel. We hosted on Netlify for a bit, and at the time we essentially could not use middleware as it was so buggy.

And Vercel is *pricy*. Even with their fancy fluid compute, you will pay a premium.

I appreciate their bold bet on RSC, but the Pages/App Router dichotomy sucks. Page transitions between paradigms are a mess, and you essentially have to do a big bang re-write from one to the other.

React Router + Cloudflare Workers is cheap, and does basically the same thing, use that instead. Or use Astro, SolidStart or Sveltekit. You can even host those on Vercel if you like the DevEx, but with the advantage you're much less 'soft locked-in'.

## Overall

I think I hit more than I missed, and there's certainly a lot of things I probably wouldn't have changed, especially considering the alternatives at the time. It's been an incredibly valuable experience overall, and I'm excited to see what the future holds.
