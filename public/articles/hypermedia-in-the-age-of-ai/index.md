---
title: Hypermedia in the Age of AI
description: In which I make the case for hypermedia for LLMs.
---
# Hypermedia in the Age of AI

I was nerdsniped into making this post by a discussion I participated in on Xitter. The crux of it was someone asking how JSON
could be considered Hypermedia, in reply to which was linked [this article](https://htmx.org/essays/hypermedia-clients/).

To summarize, Carson Gross argues that sprinkling link objects into JSON doesn’t make an API truly RESTful because REST also demands a generic client able to interpret those controls. Building such a client means bloating payloads with presentation and control metadata, expanding their size and shifting complexity onto consumers. The web works because browsers already perform this job for HTML, while most JSON APIs rely on thick, domain-specific clients that sidestep hypermedia ideals.

I think this is a valid, but overly narrow view of the landscape. As LLM-style agents join humans on the client side, we need hypermedia patterns that work for both audiences. Pure HTML works for humans; pure RPC works for machines; but neither are great for LLMs.

## Presentation is not everything

Yes, in many cases you generally want to present the result of an API call on screen, and skipping the JSON -> UI step and returning HTML directly saves a lot of complexity. The web is after all *the* most successful hypermedia system ever built.

However HTML is not the be all and end all of hypermedia. It is not a universal language. It is messy, and very difficult for [LLMs](https://www.anthropic.com/news/3-5-models-and-computer-use) to work with. This capability is still a work in progress with heavy research behind it. Client-side JavaScript also complicates things, but let's leave that out of the discussion for now.

As an aside - one thing that I find fascinating is that when you look at REST architectural discussions from the mid-late 2000s, you see a lot of mention of 'agents' - as in *USER-agent*. Time is a flat circle.

## Arguing semantics

I think this is where things fall apart - hypermedia implies *interactive* controls. One can argue semantics all day long, but I would argue that sending an API request via curl or the like is also a form of interaction. The UX might suck (for a human), but that is still interaction.

Another constraint for a purely REST system is that one cannot rely on out-of-band information to determine the semantics of a resource. This *does not* imply that you cannot have a standard specification for how to deal with resources built on top of JSON (or XML). Many specifications for JSON attempting to define hypermedia give you HTTP methods and JSON schemas for the payloads - as well as defining a custom content-type, like `vnd.siren+json` to inform the client which spec to use.

## An intelligence in the loop

REST is designed for human use. Even in HTML, if you get a HTML Form back, you require some intelligence to fill it out. If you get a form saying 'First Name', 'Last Name', then you know what to do from there. But there are by definition an infinite number of possible forms, and it is not possible to exhaustively define all of them. An additional hiccup is *validation*. HTML Form validation is not complete enough to handle every kind of possible validation one would want to provide. JSON schemas are actually more comprehensive, but still not complete.

Now, most people when faced with a HTML website will to a first approximation be able to more or less do the task they want to do (though UX research exists for a reason!). But it is impossible to get a classical algorithm that can look at any arbitrary website and navigate it comprehensively. Read-only links is the exception here - PageRank has been following HTML links for decades.

This gets a lot more interesting in the age of LLMs. They are also (more or less) intelligent agents. They can 'understand' in a way that is more than just following links. And HTML is a really awful format for them to use. There's so much mess in there - which is a good thing for humans, not so much for Claude.

## Intelligence can be *asynchronous*

Both [REST in practice](https://www.oreilly.com/library/view/rest-in-practice/9781449383312/) and Martin Fowler's [glory of REST](https://martinfowler.com/articles/richardsonMaturityModel.html#level3) article mention the following scenario. Quoting Martin Fowler's article:

"... it allows the server team to advertise new capabilities by putting new links in the responses. If the client developers are keeping an eye out for unknown links these links can be a trigger for further exploration."

The point of this is that if you create a client for a REST API, and a new link appears, it doesn't need to be handled immediately. You can handle it in the next release (or never). If your software interacts with a REST API, these links allow you to discover new features without reading release notes, or reading external documentation, as the endpoint itself will tell you how to interact with it. You can even add human readable documentation to the links! An idealized REST client will not be able to handle anything that the server throws at it automagically, but it *should* give the intelligence the tools it needs to do so - even if that's days or weeks later.

## REST is a state machine

REST was one of the things that I didn't really understand the point of when I was younger. It was over a series of interesting discussions with [Mark Masterson](https://www.mastermark.me/) that I changed my mind. The thing that made REST click was his explanation of resources and methods in terms of a state machine.

Each resource is a page in a choose-your-own-adventure book. The hyperlinks are the allowed transitions between pages. The pages you flip to are the new states.

Hypermedia controls allow you to *change* the state of either the server or the client (or both). Then you can once again follow the *new* resource to yet another state. Over time, you have dynamically discovered and transitioned through an arbitrarily complex state machine at *runtime*. The client cannot make up transitions. The server sends it only the list of state transitions that are possible. Partial failure or failure can itself be a state, triggering the client to handle it gracefully.

![State machine example](/articles/hypermedia-in-the-age-of-ai/state-machine.svg)

## MCP missed a trick

[Model Context Protocol](https://modelcontextprotocol.io/) is a new standard for describing endpoints that LLMs can interact with, that seems to have 'won'. Unfortunately, it's very much RPC style. You do get a sort of 'discovery' mechanism where you get tools that you can use, but it is not hypermedia. The main problem with an RPC style API is that you have to give *every* RPC upfront. The surface area of APIs tends to grow and grow, and you have to give that all to your model. Models already struggle with instruction following in [long contexts](https://arxiv.org/abs/2411.07037) - though this is an active area of research.

Imagine if the model could explore your API via hypermedia responses. An agent for managing files doesn't need to know about file editing and deletion until it uploaded its first file. The response of the upload could have those links baked in.

## So where does this leave us?

I think there's a lot of potential for hypermedia in AI. We are often too quick to ignore the lessons of the past, and RPC isn't the only way to go. HTML solved that problem for eyeballs; JSON-flavoured hypermedia can solve it for silicon neurons.
