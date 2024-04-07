---
title: Tailwind is not always optimal. And that's okay!
---

# Tailwind is not always optimal. And that's okay!

Tailwind seems to be a divisive topic online, and I've spotted a bunch of opinions disguised as facts, outright misinformation and strong feelings.

I thought I'd weigh in on the conversation - as it seems to be evergreen and crops up every now and again - and provide some thoughts from ~2 years of using Tailwind.

## It's ugly!

Let's just get this one out of the way first.

![Lots of tailwind classes](/articles/tailwind-is-not-always-optimal-and-thats-okay/img.png)

Yes, it's verbose. I initially hated it. There's some advantages (which I'll get into), but a lot of it is getting the knowledge & tooling set up properly. Lots of these examples tend to be egregious and cherry picked too - the equivalent CSS to achieve the above is also fairly long, and it's using the *optional* `tw-` prefix to pad the length.

If all you know is CSS, then it can be hard to parse. I'm not entirely sure when it happened, but somewhere around 6-12 months in, this stopped bothering me entirely, and I started to appreciate it.

Unfortunately this is just a matter of getting familiar with it. Beauty is in the eye of the beholder after all.

## What's separation of concerns anyway?

Let's go back to what HTML and CSS actually are meant to do. HTML is a semantic markup language. HTML provides *structure* and *meaning* to your page. CSS is focused on *presentation*.

One very common mistake is to assume that the only user agent that actually matters (or exists) is *screen*. Did you know that you can add a [media query](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#conditionally_loading_resources_with_media_queries) to your css stylesheets?

```html
<link
        href="mobile.css"
        rel="stylesheet"
        media="screen and (max-width: 600px)" />
```

For example, you can provide different stylesheets for mobile, print or screen-readers. This means that (if you set it all up correctly) you can just ship HTML to a screen-reader user, and their user agent can skip the stylesheet.

Lots of people have strong feelings about separation of concerns, and I will give my take later on.

## Smaller bundle size?

Tailwind uses utility classes, which are classes that map approximately 1-1 to CSS attributes. To illustrate, the following CSS:

```css
.title {
margin-left: 1rem;
margin-right: 1rem;
word-wrap: break-word;
font-size: 1.125rem;
line-height: 1.75rem;
}
```

maps to `mx-4 break-words text-lg`.

Now, Tailwind has to actually *include* the CSS for the classes, but crucially it does two things. Firstly, it only includes the CSS for the utility classes you actually use in your project.

If you never use `break-words`, it'll never create that class for you. The CSS Tailwind generates grows linearly with the number of 'unique' classes used. Most sites end up with fairly small CSS files as a result.

Therefore, Tailwind generates a pretty optimal CSS file for you that scales even on large codebases. However, Tailwind *does* have a cost, and that cost is related to the separation of concerns mentioned above.

Tailwind bloats your markup. Tailwind classes are far more verbose than well written CSS classes, using selectors and the 'cascading' part of Cascading Style Sheets optimally.

A single CSS class such as `title`, could be replaced by `mx-4 break-words text-lg`. This is *more* bytes in the markup. Now, a first time visitor has to download both the markup and the CSS (with an exception clever readers may have figured out), so it's kind of a wash there.

However, let's take a hypothetical web app which has two identical pages, one written in Tailwind, and one in optimised CSS. For convenience, let's say the Tailwind site has 40KB of markup, and 10KB of CSS, and the vanilla page has 10KB of markup and 40KB of CSS.

In the fairly common case that the HTML cannot be cached (for example, it's dynamic), a return visitor on the Tailwind site actually gets a bad deal. The CSS file is heavily cacheable, so every time a return visitor comes to the Tailwind site, they load 30KB more markup than they'd otherwise need to!

The retort you often hear is that GZIP and Brotli make this difference negligible (which is mostly true, Tailwind classes compress quite well), but it's *non-zero*.

This difference is also pronounced for the screen reader case. Remember our friend, the media query on the link? A screen-reader has to download 30KB of useless markup for no reason in the Tailwind case, even on the first visit, because the screen-reader user agent can *skip downloading the CSS*.

Does this mean Tailwind is bad and we shouldn't use it? No - keep reading (or maybe have a look at some of the classes used in this blog for a hint)!

## The sweet spot for tailwind

In my experience, Tailwind shines in the following scenarios:

### You're using a component or template based system.

This is pretty much a requirement for using Tailwind. If you write one big index.html file, and shove all your code in there, then you're going to end up duplicating logic and classes everywhere, which is hard to manage.

Tailwind also adds a build step, if you care about those things. Most JavaScript frameworks add a build step so this isn't a big deal, but [maybe you don't need one](https://world.hey.com/dhh/you-can-t-get-faster-than-no-build-7a44131c).

### Your site changes a lot

If you're constantly adding features, changing UI, moving components around, and using vanilla CSS with selectors heavily, then you'll have a bad time.

Moving things around can change how things work in complicated ways. How many developers know [CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) by heart?

When deadlines approach, some developers will cut corners, shoving in `!important` instead of trying to understand why the CSS isn't applying the way it should. Others will be terrified to change CSS rules because they cause side-effects elsewhere, so they just add another CSS rule, bloating your stylesheet unneccesarily. Is this wrong? Maybe. But it takes a lot of discipline to ensure it doesn't happen.

The biggest problem with the 'cascading' part of CSS is the 'spooky action at a distance'. You can change a class and cause an impact somewhere else in your site. This gets exacerbated with a large team. This is a common enough problem that CSS scoping is [built into WebComponents](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scoping).

Yes, in a platonic ideal world every developer knows web standards by heart, can write perfect semantic HTML and can make sure your CSS and HTML is optimal for all user agents. In practice, well - to err is human.

Tailwind classes apply only to the element they are attached to - with a few exceptions like text and color. Code that changes together, stays together. You can take a component from one place and move it somewhere else, and it will continue looking exactly like it should. This is also fantastic for reusability. A component is styled in isolation, and can be put anywhere.

You can achieve similar things with CSS modules, but there's a small overhead for context switching between HTML and CSS files, which can be annoying for some people.

### You don't use JavaScript for your backend, and your framework doesn't understand CSS splitting

While Tailwind seems to have taken the JavaScript world by storm, it can add value in other stacks too. Imagine a hypothetical site which has hundreds of different pages. Each of those pages has a different set of CSS rules and classes it needs to apply. It spits out server rendered HTML for all the pages.

You need to have a fairly deep understanding of the routes, and what they could possibly render in order to generate optimal CSS. Otherwise you might include some unused CSS from Page A on Page B. You could hand-write this, but it's error prone and doesn't scale out to multiple pages. Some tooling and frameworks don't understand how to do this automatically - predominantly non-JS ones. I'd have no way for it to automatically prune CSS per page.

Tailwind here has the advantage that you'd only pay the cost for unused CSS *declarations*, which may transmit fewer bytes than full CSS classes (because those classes themselves may contain some duplication).

A concrete example, let's say every page A...N has a class with the same name, but most of the rules in that class are actually duplicated, in vanilla CSS you'd pay for that duplication every time. In Tailwind, you'd only pay for the part of the class that changed.

Vanilla Stylesheet:

```css
.classA {
height: 100%;
background-color: blue;
width: 100%;
}

.classB {
height: 100%;
background-color: blue;
width: 99%;
}

.classC {
height: 100%;
background-color: blue;
width: 98%;
}
...

.classN {
height: 100%;
background-color: blue;
width: 1%;
}
```

Tailwind stylesheet:
```css
.h-full {
height: 100%;
}
.bg-blue {
background-color: blue;
}
.w-full{
width: 100%
}
.w-[99%] {
width: 99%
}
.w-[98%]{
width: 98%
}
...
.w-[1%] {
width: 1%
}
```

The tailwind stylesheet transmits fewer bytes, and the more duplication there is, the bigger savings there are.

### You need or want standardisation

One aspect of Tailwind that's quite neat is the ability to define themes - like colours, spacing etc. You can definitely do this in CSS, but having an opinionated way to do it means less thinking is required, and the knowledge of how its set up is transferable across multiple Tailwind codebases.

### Aside: Why Tailwind for my blog?

I find it easy to set up, and rather productive. I work faster in Tailwind than Vanilla CSS. The cost of sending a few extra bytes is minimal. YMMV.

## StyleX?

One recent project to keep an eye on is [StyleX](https://stylexjs.com/), recently open sourced by Meta. It shares many ideas with Tailwind, such as atomic css classes, and colocation of styles with code.

It actually has a few advantages over Tailwind which are worth mentioning.

Firstly, composition. Composition in Tailwind works best with the somewhat clunky [Tailwind-Merge](https://www.npmjs.com/package/tailwind-merge), which has a runtime JS cost. StyleX does this at compile time, and does it as a first class citizen.

Secondly, there's no Tailwind Class <-> CSS name mapping. You just use the CSS name. This is probably easier to onboard to, as it does take a while to 'think in Tailwind'. It's fully type-checked too, whereas Tailwind needs a [plugin](https://www.npmjs.com/package/eslint-plugin-tailwindcss) to make sure that you don't make up invalid Tailwind classes (which happens more often than you'd think!).

The opportunity cost of switching from an existing Tailwind project to StyleX is too high compared to the benefits IMO, but it's definitely worth keeping an eye on, and considering for new projects.

## React Native

It's worth noting that both [Tailwind](https://www.nativewind.dev/) and hopefully soon [StyleX](https://twitter.com/naman34/status/1730019818529751101) will pretty much 'just work'™ in a React Native App. Vanilla CSS won't work quite the same and will need all your styles rewritten.

## JavaScript is the real enemy

Fighting for bytes is admirable, but the biggest bang for your buck is eliminating *JavaScript*. It's [at least three times as expensive, byte-for-byte, than CSS and HTML](https://infrequently.org/2024/01/performance-inequality-gap-2024/#javascript-heavy).

The linked article, by Alex Russell - who works on Edge at Microsoft - goes into great detail about performance, and is a great, if harrowing, read of the state of our industry.

If you really care about performance and bundle size, everything in this article is within margin-of-error of nitpicking. Focus your energies on eliminating JS from your bundle - your users will thank you.

