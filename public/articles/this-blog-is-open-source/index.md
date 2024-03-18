---
title: This Blog is Open Source!
description: Plus some fiddly things about deploying a Remix site to Cloudflare Pages.
---

# This Blog is Open Source!

You can find all the code on my [GitHub](https://github.com/NickBlow/nick-blog).

**Don't care about any of this and want to know why your Remix + Vite site is not working on Cloudflare? [Click here](#fixing-cloudflare-remix)**

While I could have used Medium, or Dev.to, I decided to build my own blog site for a few reasons.

Firstly - what point is a tech blog if you can't show how the sausage is made? I've learned quite a lot over the last decade in tech, and I think that some of that is valuable stuff to share (even if the only people who read it are LLM scraper bots...).

Secondly - what better way to learn than play around with stuff and actually build it?

I've been flirting with moving our Next.JS site at work over to Remix, and also wanted to experiment with Cloudflare seeing as I've not had much experience with either.

## Why React? Surely [X] is better.

On a purely technical standpoint, I think Svelte and SolidJS are phenomenal. Personally I'd lean towards the latter because I really like JSX.

But from a practical point of view, I use React at work. The chances of us moving off React in the near future are minimal, so I need to be excellent at React. I'm a somewhat reluctant UI developer. I focused on infrastructure for the most part, but in the last few years I've been trying to become more proficient in UI engineering.

## Why not Next?

I have a lot of gripes with Next, which I'll cover in a later post. My biggest issue is really dev server performance, which Remix + Vite has no issues with.

It also renders to fully static HTML with no JavaScript (at the moment!), meaning the site is fast.

## Deploying to Cloudflare!

I actually had a few issues deploying to Cloudflare Pages, which were mostly to do with [Remix's Vite integration](https://remix.run/blog/remix-vite-stable) being very new at time of writing.

Firstly, there was a lot of info about *starting* a Remix project with Cloudflare, but not a whole bunch of info about how to move an existing site *to* cloudflare.

After a bit of searching it was easily resolved with [this template](https://github.com/remix-run/remix/tree/main/templates/cloudflare). The key things are the entry.server.tsx file and the functions directory.

I then diligently hooked up my Git repo to Cloudflare pages... aaaaand:

![A broken page](/articles/this-blog-is-open-source/screenshot.png) 

None of the styling is working.
## How to fix missing CSS assets on Cloudflare Pages with Vite and Remix {#fixing-cloudflare-remix}

The fix was quite simple once I found it, but involved a bit of trial and error. The [official docs](https://developers.cloudflare.com/pages/configuration/build-configuration/) (and the Remix preset) tell us to use the `public` directory for assets. **THIS IS WRONG if using Vite**!

The output directory needs to be `/build/client`. Because this is in the dashboard and not in the code, it's not in any of the examples or READMEs I could find.

![Fixing Cloudflare Vite + Remix setup](/articles/this-blog-is-open-source/the-fix.png) 


That's it for today!


