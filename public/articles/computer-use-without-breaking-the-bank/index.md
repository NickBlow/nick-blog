---
title: Computer use without breaking the bank
description: Or… what the labs don't want you to know.
---

# Computer use without breaking the bank

[Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) has gotten really good, probably since GPT-5.4-ish. Give the model a screenshot and a task, and it can tell you where to click. Magic, right!

The big problem is cost. Screenshots are hundreds to thousands of tokens. If you have a complex, multi-step flow this can get rather expensive. Now, this is nothing to the Claude-jockey who's burning 15 trillion tokens a day at his employer's expense – but if you're running a business then you either have to pass the cost onto the user or eat a loss. 

At my startup, we're working hard to make computer use usable and useful, without breaking the bank. Eventually we want to get to a point where we can offer it cost-effectively enough to be essentially B2C. Right now, you can't really get  computer use with any meaningful limits for less than a few hundred dollars.

Or can you?

## So what's the solution?

I don't claim to be the originator of this idea, but I've added a few improvements I haven't necessarily seen elsewhere.

The general idea is that once a particular flow is completed, our agent can 'freeze' it, generating a runnable script, with variables that can be interpolated. We're currently using 5.6 Terra as our driver.

In our system right now this is a custom JSON DSL, but this will eventually be just JavaScript – mostly because it's more token efficient and better represented in the training data. I'll use JavaScript for the pseudocode as it's more readable.

Essentially, the agent gives some kind of script along the lines of:

```javascript
const page = await navigate(url);
const button = await page.getByText("button");
await button.click();
```
Our harness then executes this on a computer.

It being 'just' javascript means you can do all the goodness like branching, loops, etc. Though, our current DSL  cannot do this, only having a wait and loop primitive. The harness iteration to move to javascript will allow more complex control flow (in theory...).

Great! Except there's a big problem. How does it know what button to click? What if the structure of the page changes?

This is where our magic 'explore' function comes in.

### Explore step!

The agent can call a function called 'explore', like so:

```javascript
const page = await navigate(url);
const results = await page.explore("find a button to click, and click it");
```

Under the hood, our harness spins up a subagent, passes it the page context and a completion criterion, and then passes the result back to the calling script once it has been completed. This subagent has a variety of commands it can issue, essentially extracting accessibility trees from the page, screenshots, clicks etc.

What's really cool about this, is you can compose explore steps with deterministic steps. It's just another function it can call.

```javascript
const page = await navigate(url);
const selector = await page.explore("find a button to click, and give me the selector ONLY. No other text");
const button = await page.getByText(selector);
await button.click();
```

Obviously this is a completely contrived example, but you get the picture. This is incredibly powerful for anything that is truly unknown. It also saves on tokens because you don't need the agent to do all the repeatable steps.

### Self-healing

If any of the steps hits an error, the harness currently triggers an explore step, with the script in context, and asks the agent to fix the script. This allows us to self-heal the repeatable tasks and not bother the user about them. Idempotency is still a work in progress, but usually the agent is smart enough to handle partial tasks. 

### Repeatability

Obviously this is *less* token efficient if you are just doing one-off runs. You don't need to emit or save the frozen script. In that case, the agent is smart enough to just... not do it.

Now, if every single flow is unique, then yeah, this gets expensive. In practice, most people do a small set of regular tasks (scan LinkedIn, scan X, etc.), and this does provide a meaningful saving. It would cost ~$20/mo for one particular one of our system flows to run every hour, and we can do it for ~free.

### Security

Cost is not the only problem. The other big problem is approvals. All clicks are not made equal. A click on a hyperlink to navigate around the site is not the same as a click on 'delete account' and then 'confirm'. Running a LLM judge on each action is a decent solution to this, but can get expensive. We add a flag to particular actions in the frozen javascript to indicate it as risky, but this is not foolproof.

We do run a separate LLM judge over the script to make sure it's not doing anything nefarious, but again, it is not foolproof.

## Running in the cloud vs running locally

Our agent currently uses a browser extension with a RPC protocol to perform computer use. I'm very much in two minds about this. Running on the user's browser is definitely the safest possible way to do this – and means I don't need to store very sensitive user credentials.

Some cloud flows I've seen rely on 'stealing' the user's cookies. [Device bound cookies](https://blog.google/security/protecting-cookies-with-device-bound-session-credentials/) are going to break this, and many sites already bind sessions to user agents and IPs. Flows where you log in on a VM (a la Grok Bot) are nice, but this relies on some kind of either agreement with the platforms, stealth browsers + residential proxies, or simply accepting a ban risk. It also means that you're likely to get logged out and have to keep logging in again.

However there's definitely advantages to running in the cloud. For one, you're not at the mercy of flaky home / office internet. You can run when the machine is off. There's nothing to install for the end user, and you control what software it is running.

For now, I'm happy with the choice of local, but I can definitely see a shift to cloud VMs in the future.

## Aside: What does this mean for the platforms?

Agents are *really* bad for places like LinkedIn and X. They rely on serving ads for revenue. Agents do not look at ads, and certainly are not going to be swayed by a Coca-Cola advertisement to go and buy a refreshing beverage. Agents consume bandwidth, and also are capable of creating more load on a website than humans are.

I think the future is going to be a zero-tolerance policy towards agents, combined with a cheap pay-per-use MCP or similar. This isn't a million miles off what X is currently doing. If there was an easy LinkedIn, TikTok or WhatsApp MCP, I think there would be a lot less agentic traffic. The demand is absolutely there.

However since consumer sites are very sensitive to false bans (they'd rather keep a client who might be a bot if there's a change they are real), I think bots will always get through.

## Closing thoughts

Agents writing repeatable, deterministic, scripts seems to be one way to rein in ballooning token costs. I know the prevailing AI-pilled idea is that token costs are going to tend towards ~0 and we should prepare for that future, but that doesn't help us today!

I also think the data center backlash will slow that down, at least in the short-medium term, but that's a rant for another time.

This is still an active area of research, and this is probably not the final form – it's likely I will look back at this article in a year and laugh at how naïve I was.