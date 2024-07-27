---
title: I have mixed feelings about LLMs
description: In which I explore my complicated relationship with generative AI
---

# I have mixed feelings about LLMs

I remember the first time I used an LLM. It wasn't actually even to do with programming. It was [GPT6B by Eleuther AI](https://6b.eleuther.ai/), shortly after it was released.

I'd read about GPT2, and how it was [too dangerous to release](https://techcrunch.com/2019/02/17/openai-text-generator-dangerous/?guccounter=1), and I was intrigued, but didn't think too much of it.

Most of my usage was breaking writers block when coming up with ideas for tabletop roleplaying sessions. The models were cool, but I found them very prone to repetition and getting stuck in loops. When prompting with very niche content, it often collapsed down to its training set. One particular failure mode was simply spitting out lists of what looked like books, presumably parroting references from Wikipedia.

A blog that I followed [started to do the same thing](https://vaultsofvaarn.com/2022/05/09/monsters-in-the-machine/). Using AI for coding was something that I didn't even think of at the time.

## Cue ChatGPT

You have to have been living under a rock if you didn't hear about ChatGPT. It wasn't even new tech, but for whatever reason, packaging it up as chat suddenly made it click for a lot of people.

Again, I played with it as a toy - using it to prompt my own writings, exploring its limits using silly tasks like song lyrics - but didn't take it seriously. I tried it for coding, but it was often wrong.

### GPT 4

Once GPT4 came out, I started hearing more and more people use LLMs for coding. I strongly believe that people who think LLMs cannot assist you with coding were mostly using GPT 3.5.

There is a world of difference between 3.5 and 4. It's not even comparable in quality. Since it was locked behind a paywall though, most people tried out the free version and bounced off.

It didn't revolutionize my workflow immediately, but I began using it sporadically for answering questions. Over time, it became more and more integral to my workflow.

## The LLM sweet spot

The following represents my personal experience with LLMs. Perhaps there are prompting maestros that can exceed this, but I haven't found an exception to this rule myself.

LLMs shine in the following circumstance: there is a non-zero chance that someone has written a blog post about it. I suspect this is because the [quality of the output depends on the training data](https://stackoverflow.blog/2024/02/26/even-llms-need-education-quality-data-makes-llms-overperform/), and if the LLM has seen examples, it will give better results.

Truly novel, or very niche examples I find make the LLM very confused. Anything boilerplatey, or fairly rote is ripe for automation. My biggest productivity increase was using GPT to generate thousands of lines of boilerplate for OpenSearch queries.

Writing that by hand would be tedious and error prone and take several days. With GPT4 I did this in a few hours.

Don't expect the LLM to be right the first time. Give it examples, correct its code, clarify. My technique is similar to 'chain of thought' prompting, where you build up the solution in logical steps.

## Will this ossify programming languages?

There's one thing that I've been wondering about. Due to the aforementioned effects, the more content about a subject, the better the LLM is. A brand new programming language or library is suddenly at a disadvantage that it didn't have before - or at least not of the same order.

LLM knowledge cutoff won't include it by default. Sure, there's ways of adding custom data, RAG etc. but something like React has a massive advantage vs a framework that comes out today, even if it's technically superior.

You will simply be more productive in a language created prior to 2023, because the LLM will be able to write better code. The more people who use LLMs to generate code, the fewer people will write new language examples by hand. This creates yet more content in existing languages, making the LLM even better.

Code samples seem to be far better than technical explanations of how the language works.

Perhaps this will be solved by smarter AI models, or perhaps new languages now need to come with a much more comprehensive suite of code samples. Time will tell.

## LLMs for junior engineers

I'm hesistant to recommend AI for people who are learning. You get the best results when you know exactly what to do, and all you need to do is 'write the code'.

If you don't know exactly what to do, or are unfamiliar with the problem domain, you can actually lose productivity when working with AI. The main reason being is if you don't know what you're looking for, you can't tell if the AI is wrong. Sometimes you need to tell it to update the code, or that it has missed something.

It's often not right first time, and helping it reason through a problem helps both your own thinking but also the quality of the LLMs output.

The more familiar you are with programming, the more powerful AI is.

## Google's demise?

One major factor in my increasing initial LLM usage was the massively degraded quality of Google search results. A few years ago, Google seemed almost magical in its ability to discover exactly what I was looking for.

Any programming problem, any syntax issue, Google would be able to point me in the right direction. Nowadays, it feels like you're just directed to AI generated slop, SEO black-hat sites or just completely irrelevant results.

I know that the content MUST exist, because it must exist in the training data for the LLM to give me a good answer. But my ability to find it with Google seems greatly diminished.

This is a bit of a double-edged sword. The open internet exists in its current form because of the symbiotic relationship between advertisers and content creators. If the content of sites is now subsumed into LLMs and when GPT spits out an answer we are not paying the creator of that content, what incentive do they have to create more?

That said, I'm writing this blog for free, and perhaps there are enough people willing to give the fruits of their labour out for reasons other than financial (see the whole OSS movement for example).

## Copilot?

I never got on with Co-Pilot. It is just *slightly* too slow to be useful, and the small delay tends to interrupt my thinking more than anything else. My current workflow looks like this:

Write code until I get to a point at which I suspect it will be faster to do via LLM, in which case I give context and some samples to GPT. Once I'm happy with the solution, I copy it into my editor, and continue.

## Claude

I did try Claude, and while I liked the 'personality' of the model, I still find GPT superior for coding. I do see people raving, so perhaps I'll give it a go again - perhaps I am missing something.

## AI and testing

I don't really like using AI for writing my tests. Tests should be small, and focused. They should not test implementation details. The example I always give is that if I write a test, I should be able to give the test to an LLM and say 'make this pass'.

This is actually not too dissimilar to how I write my code nowadays. It's actually really helpful to have automated tests that I write manually covering behaviour, as I can validate programatically that the AI code does what I expect it to do.

Sometimes giving the test to the LLM gives better results. YMMV.

## P(Doom)?

I don't personally subscribe to the extinction risk of AI. I think it's over-hyped, and used by the incumbents to bully regulators into passing legislation to hobble competitors and open source models.

Perhaps I will change my mind once we have humanoid robots, and if they ask [if this unit has a soul](https://masseffect.fandom.com/wiki/Geth).

## Conclusion

If you're not using AI to write code, I think you're going to be left behind. I rather like [Linus Torvald's](https://www.youtube.com/watch?v=VHHT6W-N0ak) answer when asked about LLM generated code.

It's not magic. You still need to be able to write code. We cannot let AI build our entire software systems at this point, and you still need solid engineering practices like automated tests and maintainable code.

That might change in the future. Our jobs as engineers has never really been about the code, it's about solving business problems with software. If the programming language of the future is English, then it's merely another syntax to learn.


