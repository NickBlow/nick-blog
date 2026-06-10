---
title: On AI Writing
description: And why I don't like it.
---
# On AI Writing

I've previously written about [AI and creativity](/posts/im-sad-we-lost-the-creatives/), and I do stand by that article. I think AI is a great tool to get rid of the tedium. I've spoken to several creatives who have similar thoughts – it's an excellent tool for doing rote, boring tasks, and freeing up your brain for the higher level tasks.

AI writing is a particularly interesting case. I never use AI for writing – these are all grass-fed, organic words! And I agree essentially with Marc Brooker here. There's some kind of unspoken social contract you're breaking by dumping AI generated text in front of someone.

[![Marc Brooker tweet about not using LLMs for writing](/articles/on-ai-writing/mark.png){width=650}](https://x.com/MarcJBrooker/status/2054997979279540255)

I am reminded of the apocryphal quote commonly misattributed to Mark Twain "I didn't have time to write a short letter, so I wrote a long one instead". I feel like AI makes this problem worse. Often it goes bullet points -> dense prose via author's AI -> summary via the reader's AI -> bullet points. You're adding useless indirection, and wasting everyone's time.

The more interesting thing is *why* it is annoying to read AI prose. AI has definitely got better at writing code (November of 2025 especially was a step change), but I don't think it's necessarily gotten better at writing words.

Part of that is just the over-corporatized sycophantic personality so many models have adopted. I actually preferred the really old GPT1 & 2 models for this, they were weird and surreal in their outputs! Some of it is the fact that *everyone* seems to be using them (especially on LinkedIn). Try to find a post a real human wrote there... 

I don't actually even think AI is a bad writer. It's probably 60th percentile – better than the average person. But a lot of it is because it's virtually impossible to steer it away from that strange style it has adopted. It's as if every essay you read online is written by the same author. They might not even necessarily be bad, but it's just bland. There's no hint of the human behind the words.

## Why am I thinking about this?

I'm actually co-authoring a book with my wife, and it's really interesting to see the shortcomings of AI tools in this regard.

As an experiment, I dumped 40,000 of the words of the book (all human written) into ChatGPT, and asked it to generate a new scene. When I put that scene into [pangram](https://www.pangram.com/), which is the only AI checker I think is worth a damn, the resulting text came out as 100% human written.

Some changes have made this a bit more annoying. The chatgpt web ui makes long pastes into text files, it doesn't read enough of my words to steer the output sufficiently – and codex's system prompt messes the output too much!

Pangram has also updated their model since, and I've been unable to reproduce this consistently any more with their 3.3.2 model – though it can still very consistently fool other AI detectors (which are, imo, snake oil anyway). I was previously able to get it pretty much every time with Pangram 3.2.

I've attached my generated scene below. This was 100% gpt, just based on 'here's my book, write a scene', and still scores 100% on human written by pangram's latest model.

However, as someone who deals with AI *all the time* professionally, the prose still had that 'AI smell', that I have only cultivated by spending far too much of my life being told 'you're absolutely right'. 

## The scene

The barricades proved only moderately effective.

Sten knew he would have to join Cael’s eastward migration soon, but first he wanted to help the Heartwood guards make the roads to Pinehallow as difficult as possible.

They were met with suspicion at best, outright hostility at worst. The Cult of the Tree had sunk its claws deep into the common folk. The Festival, it seemed, was worth risking bandits, infected wyverns and whatever other certain death the council tried to invent.

A farmer spat at Sten’s boots when told the northern bridge was unsafe.

“My sister came back healed from Pinehallow,” the man said. “You think I’ll turn back because some council dog tells me to?”

Sten looked at the three children sitting in the back of the cart.

“No,” he said. “I think you’ll turn back because the bridge is closed.”

“It looks open to me.”

Sten drew his sword and cut the bridge rope. One side of the rotten plankway sagged into the stream below.

“There,” he said. “Now it’s closed.”

It worked for half a day.

By evening, pilgrims were fording the stream in waist-deep water, holding children and prayer bundles over their heads.
Sten watched them go, soaked and shivering, toward Pinehallow.

One of the children waved at him. He did not wave back.

![Fooling pangram](/articles/on-ai-writing/beepboop.png){width=650}

## What's wrong about it?

The interesting part is it's hard to point to any particular part of AI writing that is necessarily *bad*. It's hard even to explain what it is. The paragraphs that are too short. The triplets. The weird tortured metaphors. And there's the classic 'gotta end on something punchy' that especially gpt5.5 is awful for.

More importantly, it's just not *our writing*. As an aside, this is why I think the 'our AI learns how to speak like you' stuff that lots of people are touting is utter bullshit. Maybe you can do it for corporate-adjacent emails, but my wife would know in a heartbeat I didn't write this. 

Particular lines I think have the 'ai smell' are 

`“No,” he said. “I think you’ll turn back because the bridge is closed.”`. 

`“There,” he said. “Now it’s closed.” It worked for half a day.`

Could I articulate exactly why? No. But those make my gpt spidey-sense tingle. Just a particular punchiness that feels almost like someone trying too hard.

You could conceivably do something better if you had a sufficient amount of text written by a person, either training a base model or finetuning on their text (which is part of why I am trying to write a lot – maybe one day I can be an immortal part of the machine spirit), but just dumping historical prose into context and saying 'write like me' seems to not be the way to go.

## What is AI actually useful for in writing?

A lot less than I expected.

It's excellent for putting commas in the right places (though the AI built into word / grammarly etc is good enough for this and using a frontier model is overkill). 

I use deep research a lot for everything, though part of it I think is because Google has just become borderline unusable for some bizarre reason. I remember when Google seemed almost magical in its ability to find things... now that's deep research, at least for me. But I digress.

In particular, I've found it really quite bad for ideation, something that I thought would work very well. 

I don't think I used a single idea it came up with, aside from names for characters. I would have expected that with an encyclopaedic knowledge of tropes, and the ability to read my entire books + worldbuilding notes comfortably into context, it would be able to connect dots I had missed. However, the suggestions were painfully pedestrian.

## I'm not worried about it taking the job of authors

It definitely means you can flood the market with crap, and I don't envy literary agents one bit having to read through all this nonsense (and hopefully when we get that far, our book won't be in this category of nonsense). But I don't necessarily agree about the copyright infringement / theft angle here. I know many may disagree, so take this with a big fat 'IMO'.

"Good artists copy, great artists steal". Another apocryphal quote with unknown origins (though I first came across it in conjunction with the late, great Sir Terry Pratchett). The way I think of AI is that it is learning from texts in the same way that I have absorbed the prose of Steven Erikson, Mark Lawrence, Joe Abercrombie, Terry Pratchett, J.R.R Tolkien, and so many more. It is not simply a database of stolen text that it can pull from, like many believe. The work of these writers just nudge the weights *ever so little* in this direction or that – in the same way that I might subconsciously choose one word over another, or one idea or another because of what I have read. 

Yet even the best model is still lesser than all of these people. I could ask it to generate me a book in the style of any of the above, and perhaps it might even sound *a little* like them. But for the reasons I mentioned earlier, I just don't think (barring some specialized finetuning or training) that it can output any prose to match the original. It is not a substitute for a real author. I would not read something that ChatGPT output over the latest Joe Abercrombie book – at least for the current generation of models. If we get recursive self improvement or artificial super-intelligence, all bets are off.

What's even more interesting, is that my feelings are the opposite when it comes to code. I *definitely* think Claude and GPT can produce higher quality code than many software engineers. I've seen code that is worse than these models put out running real production systems. 

Perhaps this is selection bias. Tolkien is the equivalent of the 100x gigacracked chad principal engineer, not the 0.1x enterprise Java CRUD slopmonger. Maybe Claude is a better author than half the unpublished authors who just aren't in the same league as the big guys, and now they won't ever get a chance.

But art has always been a winner-takes-all market. The best (or most popular, which aren't always the same thing) people claim a disproportionate share of the rewards and the attention. This isn't necessarily anything new.

### On copyrighting styles

I also don't like all the 'it can reproduce the style of this artist/author' discourse. To go back to music, I think the [Blurred Lines lawsuit](https://en.wikipedia.org/wiki/Pharrell_Williams_v._Bridgeport_Music) is one of the worst things to happen to modern music.

Pharrell Williams did not sample, he did not take any lyrics or melodies yet he *still lost* because it 'sounded like Marvin Gaye', and had to pay significant damages.

This is horrible. It only serves to consolidate the rewards for incumbents at the expense of newcomers finding their style. All it takes is for one person to say 'this sounds too much like this other record' and you lose a huge chunk of your royalties. Even if you did not actually take anything from the original record!

It is actively damaging (IMO) to try to seek protection or damages for a 'style' of art. Limiting it only to AI output is impossible to enforce, since it is so hard to definitively prove the use or not of AI (see my 'human' GPT example, above). Real people, and real art, will get caught in the crossfire (and already have been, in the case of music).

### Honesty and humanity

I think we can also be honest too. I prefer to consume art done by humans *because it is done by humans*. We don't need to pick on the technical or artistic shortcomings of AI in an attempt to discredit it. Maybe the models will get better than Tolkien at writing one day, by some objective measure. We don't need to bend over backwards to nitpick at it. We can just say 'I like Tolkien because he was a meatbag'. That is a completely valid point to make.

I also don't think it is necessary to force humans to do everything for their art to still be valuable. Especially if that work we automate is tedious and low-value. 

Are background textures in a video game *that* important to the creative vision?

What the equivalent of that is for writing, I'm not sure. Formatting the text? Checking for plotholes and inconsistencies? It seems important to put every word in its right place, but Word already suggests alternative words. Perhaps we have already achieved the global maxima of grammar + minor suggestions inside Word, and this is the best AI-assisted writing will ever be without debasing the product (and yes, the grammar and suggestions *are* generative AI – hence the futility of trying to erase genAI from every part of the creative process).

Maybe I'll figure something else out once I've written a bit more.

## In conclusion

Please don't just blindly use the output of ChatGPT for your writing.

