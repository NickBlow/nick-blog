---
title: Let's talk AI detection
description: And the self-defeating anti-Pangram vitriol
---

# Let's talk AI detection

Before I begin, I am not affiliated with Pangram in any way. I am not sponsored or paid by them, nor do I use them as part of my business. I pay a $20/mo subscription to them. I am not going to name any names, or accuse or not accuse any particular author of using AI.

I've become increasingly annoyed at the deluge of AI slop writing, and the well-meaning but ultimately self-defeating assault on Pangram. If there was another, equivalently good AI detector out there, then I'd support them too. Right now (November 2026), Pangram is the only one that I trust.

## Why are most AI detectors bad?

A lot of the 'free' online AI detectors are completely fake. Some of them exist purely to scare students into thinking their essay is AI generated, and upsell them onto a 'humanise my writing' tool. The rest are inaccurate, and nowhere near as sophisticated as Pangram. People have *finally* started to realise that AI detectors are bad, and not to trust their output. 

The problem is that AI detection, at least in the case of Pangram, is now actually starting to be good enough that you *can* trust it with a high degree of certainty.

## Why do I trust Pangram?

I have fed nearly 250,000 words of my own writing into Pangram, and the most it has come up as AI generated is 7%, and those are cases where I've accepted Google Doc's suggestions, which *are* using AI. 

I use AI every day for my job, which means I probably talk to Claude and GPT more than my wife. They have very particular mannerisms and habits that you can detect, such as overuse of constructions (it's not X, it's Y or the rule of three), particular word choice (delve, as a particularly famous one) and just oddness. They also have a weird sense of space (they struggle to follow where people are physically in a scene), they use weird metaphors (she walked across the floor like an angry octopus after a bad haircut) and *love love love* short pithy paragraphs. In fact, long paragraphs are generally a sign that it was human written.

I've managed to make Pangram flag [AI text as human](https://nickblow.tech/posts/on-ai-writing), with a *huge* amount of effort. Otherwise it's incredibly difficult to sneak AI text past Pangram.

I have yet to manage to write something that Pangram flags as AI. No one writes like that!


## So, how does Pangram work?

Essentially they take human written text, ask an AI to rewrite it, and then train a model to distinguish between the pairs. This is essentially statistical analysis, but using a neural network to 'learn' the statistical patterns. 

To massively oversimplify, imagine you have two texts which are 10,000 words long. For this example, an AI is more likely to use the phrases 'delve', and 'it's not X, it's Y'. The first text contains one instance of delve, and one instance of 'it's not X, it's Y'. Does this mean it's AI? Likely not – we can look at human text, and see how often the average human reaches for 'delve'. If it's around 1/10,000, then you're probably fine. If the second piece of text has 30 instances of 'it's not X, it's Y' and 'delve' appears 40 times, it's very likely to be AI, because humans simply do not use those words that often.

## So Pangram is an AI?

Sure, but AI in and of itself isn't bad – neural networks have been around for over half a century now. You have exceptionally accurate AIs nowadays that are used in fields such as medicine (detecting breast cancer) and image detection. Just by virtue of being AI doesn't make it any less accurate. In fact, AIs are *incredibly* good at spotting hidden patterns that humans might not be able to encode in regular code. Search 'dog' on your phone, and your phone is using AI to find pictures of dogs.

## But I've heard that Pangram flags real text as AI generated

The only case I've seen confirmed was where a journalist asked ChatGPT for a passage from On The Origin of Species, it hallucinated a passage that didn't exist in the book, and they passed that into Pangram. The famous study showing detectors are biased against non-native English speakers didn’t test Pangram. When Pangram re-ran the same essays, it flagged none of them.

If you can find a piece of content that was written pre 2019 and can prove it, go get your [free $500](https://x.com/Nition/status/2115166531462259163).  

## What if people learn to write more like AI over time, or AI gets better at being human?

Modern models are trained into being incredibly inoffensive, are unable to discern what is funny (because there is no such thing as 'objective' humour), and share Victorian-era sensibilities on sexual content. They relies a lot on cliches and familiar constructions. 

If you aspire to write bland, unfunny, unsexy prose, then fine, I guess. Go ask Claude to write you a story, read it, and come back. (or [read the one I added at the bottom](#claudes-story))

Shit, isn't it? This is what people are going to emulate? I don't want to read that.

The latter is more interesting. Right now AI is getting insanely good at math and coding because those are so called 'verifiable' problems. 1+1 always equals two. Whether a poem is good or not is entirely subjective. This means you can tell when an AI is getting better at math, but you cannot tell when they're writing better poetry. This doesn't mean this will forever be an unsolved problem. If AI can write better than Shelley, Keats or Byron, then yeah, we're probably all screwed. 

But the more interesting part is if it can *adapt* its style. Right now, all AI prose is virtually the same. You can maybe give it a bit of George RR Martin flair if you try really hard, but it's still gonna be unmistakably AI. An AI that could switch styles such that you would believe a different person wrote each would be a genuine problem, with no solution that I can think of. Luckily, such a thing doesn't exist, and is several research breakthroughs away, which aren't even guaranteed to be possible. But this is an industry obsessed with the impossible, so who knows.

[Right now, all AI text is being watermarked by EU law](https://www.anthropic.com/news/claude-text-watermark), which will hopefully help put a lot of these debates to bed.

## My hot take

Tools like Pangram are our best defense against a deluge of slop in publishing and normal life. Anything that is predominantly AI shows a lack of effort and care. If they can't be bothered to write it themselves, you should not read it. 

Publishers especially should be aggressively screening books with Pangram or the like. Anything above, say, 30% should go straight in the trash without being read. The words are the work! I don’t want to know how many person-hours have been spent reading slop. Pangram’s mistakes are rare and scattered, so a book doesn’t come out at 30% AI (about 15,000 words of an average novel) by accident.

I’m also completely fine with AI-assisted work, so long as it’s overwhelmingly human. I don’t mind if you took a sentence here and there from an AI suggestion. But I do want to know that there’s a real person with real, original thoughts behind the piece.

Instead of demonizing Pangram, we should be encouraging it and expecting more

## My scorching hot take

Some of the loudest voices against Pangram have the most to lose from it. People using AI have every reason to be overrepresented in the backlash. Of course, false accusations do happen, but someone whose livelihood or award depends on being seen as ‘human’ is going to be very defensive. 

We should be encouraging proof of human work.

## Bonus, Claude's 500 word story {#claudes-story}

**The Lighthouse Keeper's Last Visitor**

For forty-one years, Edda Marsh had kept the light at Corran Point, and in all that time no one had ever knocked on her door after midnight.

So when the knock came, three sharp raps beneath the howl of a November gale, she sat *very still*[1](#note-1){.fn-ref} in her chair by the stove and waited for it to come again.

*It did.*[2](#note-2){.fn-ref}

She took the lantern from its hook and opened the door. A boy stood on the step, soaked through, maybe eleven or twelve, in a coat far too thin for the weather. *He didn't shiver.*[2](#note-2){.fn-ref} That was the first strange thing.

"Your light's out," he said.

Edda turned to look up the tower. The beam swept steadily over the black water, as it had every night since the Coast Guard automated it and told her, kindly, that she was free to retire. *She never had.*[2](#note-2){.fn-ref} Someone had to wipe the salt from the glass.

"It isn't," she said.

"Not that one." The boy pointed past her, toward the mantel, where a brass oil lamp sat cold and dusty. It had been her father's. She hadn't lit it since the night he died.

"Come in out of the rain," she said, because it was the only sensible thing to say.

He sat at her table and watched her put the kettle on. *He didn't drip on the floor.*[2](#note-2){.fn-ref} That was the second strange thing.

"What's your name?" she asked.

"Doesn't matter much." He tilted his head. "You used to tell stories to the fishermen's children. About the drowned bell under the bay, and the gull who wanted to be a ship."

Edda's hands *went still*[1](#note-1){.fn-ref} on the teapot. She hadn't thought of those stories in thirty years. The children had grown up and moved inland, to cities *with jobs and without storms*[3](#note-3){.fn-ref}. Nobody came out to the Point anymore.

"How do you know that?"

*"Someone remembered them," the boy said. "Someone always does.*[4](#note-4){.fn-ref} Will you light the lamp?"

She almost refused. The lamp had been her father's last chore each evening: *wick trimmed, glass polished, flame coaxed up gold and steady*[5](#note-5){.fn-ref}. *When he died she'd let it go dark, as though the grief needed somewhere to live.*[6](#note-6){.fn-ref}

But the boy was looking at her with such patience that *she took down the lamp, filled it from the old tin, and struck a match.*[5](#note-5){.fn-ref}

The flame caught. *Warm light spilled across the table, the walls, the boy's face.*[5](#note-5){.fn-ref} For a moment she thought she saw something familiar in his features: a crooked smile, a cowlick she had once teased.

"There," he said softly. *"That's the one that matters."*[2](#note-2){.fn-ref}

She went to pour the tea. When she turned back, the chair was empty. *No wet footprints.*[2](#note-2){.fn-ref} The door was still latched.

Edda sat down slowly, across from the empty chair, and watched the lamp burn.

In the morning a letter came, the first in months. It was from a woman in Glasgow who'd grown up on the Point. She was writing a book of children's stories, she said, and wanted to know whether Edda remembered the one about the gull who wanted to be a ship.

Edda found a pen and began to write.

1. LLMs love people going still {#note-1}
2. Short pithy sentence. {#note-2}
3. “with X and without Y”, a close cousin of “it’s not X, it’s Y.” {#note-3}
4. A fortune-cookie line built on repetition. {#note-4}
5. Rule of three! AI loves it. Three rule of threes in five hundred words! {#note-5}
6. Weird physical metaphor. Sounds profound, but makes no sense. Why does grief need to live anywhere? {#note-6}
{.footnotes}

And look at how short the paragraphs are! 1-3 sentences each. Everything is designed for maximum punch.
 
Could someone have written this? I don't think so. People don't write like this. Maybe someone might have used some of these, but together this forms a smorgasbord of LLM-isms.