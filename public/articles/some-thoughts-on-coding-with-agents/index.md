---
title: Some Thoughts on Coding with Agents
description: Agents are already changing software work, and I am excited, uneasy, and still not sure where any of this ends up.
---

# Some thoughts on coding with agents

I haven't blogged in a while because everything is changing so quickly that I find it hard to put together thoughts that stay relevant for long enough.

This time last year I thought models were beginning to plateau. I was wrong. Around November, with Opus 4.6, they got incredibly good. But they aren't quite good enough to blindly trust - they still under-abstract, and have weird quirks such as overusing mocks in tests. They still struggle with data outside their training sets. The number of times I've had to tell a model that they cannot reuse a Postgres connection across requests in Cloudflare Workers is ridiculously high.

Agents are magical. I get better software out of agents than I've gotten out of some people. This both excites and scares me. I also feel like my skills are atrophying if I use them too much. I need to sit down and write some code by hand (with tab autocomplete, I'm not a savage) every now and then.

They are *just* slow enough that context switching is tempting. Productive context switching is exhausting - you cannot trust anything they give you blindly and need your full attention to make sure it isn't subtly wrong. Unproductive context switching rots your brain. I've taken to taking lots of little walks. However, I feel like I understand my software a little less than I used to.

If I hadn't had 10 years of experience writing code by hand, agents would just be devastating for my skills. It's way too tempting to offload all decision-making and code to them. I don't know how we create new seniors. AI can be useful for learning, but it requires immense self-discipline not to cheat with.

## Tests, proofs, and reviewbots

Tests and formal verification are going to become increasingly important. I really need to learn Effect properly - I have a reasonable amount of functional programming in my background so it should hopefully be fine.

I didn't trust agents to write my tests last year. I do now, but I feel like I should go back to writing them by hand sometimes - to keep that muscle exercised, and to make sure they're actually testing the right thing. Getting agents to do the TDD cycle by themselves seems to be a good thing - that is, getting models to write a failing test first, then make it green, then refactor - and gets better results than just naive test-last coding. But at least tests help focus things.

Cursor Bugbot is really good, though overly pedantic sometimes. Reviewbots in general seem invaluable. At Iterate we directly feed the results of the reviewbot back into the agent session that spawned the PR, which saves the whole tedious loop of copying and pasting the errors into your agent yourself, which happens 90% of the time.

You cannot formally verify everything though. And tests only prove that your test assumptions hold, not that your software works. AI-native observability is quite cool - giving agents access to your logs and telemetry is useful, though there's a lot of noise and false positives.

But even then, what is "working software"? UX is getting materially worse across almost every product I use, and I, like I'm sure many others, tend to shovel the boring frontend work to agents. They are bad at interactions, and these are hard to test. Maybe this works for B2B, but consumers will revolt eventually.

## Software jobs are changing

A selfish part of me hopes we will never see AGI, but I know that AGI, if deployed correctly, will massively increase the living standards of many people. However, AGI or ASI would probably kill most knowledge jobs. A society like that will be interesting, in a "may you live in interesting times" kind of way. There will be a permanent underclass.

Even if models stay exactly the way they are right now and never increase again (imo `p < 0.01`), this is transformative for the industry.

Software seems to be the one place where AI content has little-to-no exposure to the negative public opinion. People complain about AI slop articles, AI image and video generation, and hallucination. Software is going to be safe even if the AI bubble bursts and consumers rebel. Consumers only care if their software gets better.

Code paradoxically is both a means to an end, and increasingly important. Agents, and humans, care if their code is good, well-structured, and readable. Right now, agents are not great at creating code like this, especially not at a higher level. They produce reams and reams of code, filling up their context window. Succinctness should be their goal.

I have yet to see an agentic PR, without much human intervention, that manages to keep the same functionality while meaningfully reducing lines of code - yet this is what a good senior *should* do.

## The clone-in-two-hours discourse

I'm not sure I buy the whole FOMO and hype about "I can clone XYZ in 2 hours with agents". Nearly ten years ago, you saw the exact same thing with Rails: "I cloned Twitter in 2 hours with Rails!"

The two outcomes of this are:

1. Agents are unable to scale software, and eventually a codebase becomes large enough that it starts to collapse under the weight of its own tech debt. We are here right now.
2. Software is entirely fungible, and the only advantages are brand, distribution, and network effects. We are also kind of here too.

To a lesser extent, physical *things* will be more important. We're kind of seeing this with the renaissance in vinyl and similar hobbies. And with the increased price of RAM and computer parts looking unlikely to abate any time soon, we'll see more of a return to in-person things and tactile possessions.

I personally picked up tabletop gaming again. Doing things with my hands frees up my brain. I can see augmented and mixed reality getting interesting.

All this to say: I have no idea what we're doing, where we are going, or what is going to happen.
