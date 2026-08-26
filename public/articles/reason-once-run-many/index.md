---
title:  Reason once, run many.
description: Everything is computer.
---

# Reason once, run many.

I recently wrote about [my approach to computer use](https://nickblow.tech/posts/computer-use-without-breaking-the-bank).

Writing is thinking, and in the process of writing that blog post I stumbled across something interesting...

![Absolute cinema](/articles/reason-once-run-many/cinema.png){width=500}

Judging by current productivity standards I'm negatively productive. But I actually added *more* functionality to my custom harness! I mentioned in my computer use post that I was currently using a custom JSON DSL. I moved it to JavaScript, and during that process, I discovered a few really cool things.

What is it that has me so excited?

To generalize – functions like this:

```js
async function work() {
    deterministic();

    const x = await explore(
        "resolve whatever I don't know here"
    );

    deterministic(x);
}
```

Turns out everything is computer. The code that runs my workflows and the code that runs my dashboards now uses this exact pattern! This is kind of like a recursive language model – the model can call itself with data. An explore could in theory call another language model.

## We can mine the agent turn for information

The coolest thing about the RLM-esque design is it's trivially easy to see what the agent did.

Want to create a workflow for automating a browser task? As before, easy:

```js
const page = await navigate(url);
const selector = await page.explore("find a button to click, and give me the selector ONLY. No other text");
const button = await page.getByText(selector);
await button.click();
```

And how do we know how to create a permanent workflow from this?

Just inspect the code that the explore session wrote!

```js
const screenshot = await page.screenshot();
const target = await page.getByText("button");
return target.selector;
```

In our system, we do have a second LLM layer, which basically reads what the agent does, and trims screenshot steps and any nonsense (for example, if the explore agent gets lost, we don't want to codify confused clicking around).

The next run no longer needs to reason about that part at all. Over time, the program absorbs the agent's work, leaving explore() only at the fuzzy edges.

## Workflows are code

This seems obvious, but our agent has the concept of a 'task'. Aka – when this thing happens, do that.

But these can often just be deterministic.

And what better way to do determinism than... code? Code is ~free to run. Why do you need to inject a fallible LLM?

So a workflow can look something like:


```js
const data = sql.query(`SELECT * from posts`);
const max = data.reduce((a, b) => a.upvotes > b.upvotes ? a : b);
await createReport(max)
```

And if you need a fallible LLM in there – well, we can generalize `page.explore` to `agent.run`.

```js
const data = sql.query(`SELECT * from posts`);
const max = data.reduce((a, b) => a.upvotes > b.upvotes ? a : b);
const sentimentScore = await agent.run(`Give me a number between 1 and 10 for the sentiment of ${max.text}`);
await createReport(max, sentimentScore)
```

Opt-in nondeterminism! 

## We don't need to trigger this from an agent turn!

The traditional way we might do this is we trigger the LLM and say "hey, run this script/skill".

What's the point? In the first script this is literally hardcoded. There is no 'intelligence' needed. We're just bumping OpenAI's share price. 

The twist here is that the agent is no longer running the code. It *writes* the code. Once it has figured out a stable sequence of operations, we turn those operations into code. The LLM comes back only when there is uncertainty of some kind.

This is an order of magnitude+ cheaper... and it's still entirely as extensible as any AI native product. Want to change the flow? The agent can do that. Want a new flow? The agent can do that.

Crucially, though, we only pay for the tokens *when we actually need intelligence*.

## Repairs

And, as in the computer use example, if we ever error or get a weird result – well, we can just pass the script to an agent who's able to fix the script, repair it, and continue as if nothing happened. A true self-healing system.

## Prior Art

The big one is [https://github.com/browser-use/workflow-use](https://github.com/browser-use/workflow-use) – but this is limited to workflows only. 

It turns successful browser-agent runs into deterministic workflows and falls back to an agent when they break. That's pretty close to the browser-specific version of this. What I'm interested in is the more general abstraction: arbitrary code can contain nondeterminism, and that can itself be inspected and turned into deterministic code over time.

## Why should we care?

A) Determinism is *good*. You want to run the same report and get the same result. Even with a skill, LLMs can occasionally go off the rails. 

B) Cost. One day we might have intelligence too cheap to meter. But whoever sends me my inference bill every month is definitely metering that... If your skill amounts to 'run this script', you are literally paying for nothing. The agent loads the skill, runs the script, returns the result. We just cut the middleman.

This is a really fun paradigm, and I'm excited to play with it more. I feel like I'm only scratching the surface of what agents can do, and they're already powerful. The really interesting part is the agent getting out of the way once it has codified something — but, in the words of Shakira, being able to step in whenever, wherever it's needed.