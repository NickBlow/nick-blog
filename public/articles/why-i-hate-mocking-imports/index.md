---
title: Why I hate mocking imports in JavaScript
description: And why I do it anyway
---

# Why I hate mocking imports in JavaScript

Imagine you have this code:


```ts
import {database} from "./db.ts";

const getStuff = () => {
    const stuff = database.sql("SELECT * FROM stuff");
    return stuff.rows;
}
```

This kind of thing is common everywhere in JS. It's fine? Until you come to test it.

## The 'solution'

The testing pattern that I see most often (and something that is deeply ingrained in LLMs too from my experience) is to do the following:

```ts
import {vi} from "vitest";
import {getStuff} from "./my-module.ts";
import {database} from "./db.ts";

// Mock the entire database module
vi.mock("./db.ts", () => ({
  database: {
    sql: vi.fn()
  }
}));

test("getStuff returns database rows", () => {
  const mockRows = [{id: 1, name: "test"}];
  vi.mocked(database.sql).mockReturnValue({rows: mockRows});
  
  const result = getStuff();
  
  expect(result).toEqual(mockRows);
  expect(database.sql).toHaveBeenCalledWith("SELECT * FROM stuff");
});
```

Ugh. There are a couple of main things that are wrong with this.

## Module mocking kind of sucks

Global mocking means you override the whole thing for everyone in the same test. It's quite difficult to have different tests with different mocked versions (e.g. one test that tests what happens when the database errors out). Forget running the tests in parallel, you've polluted the global scope – I actually ran into this at work where tests were interfering with each other.

It's also somewhat 'magic', in that the mocking happens at import time before your test even runs. You have to understand the module loading order, and hoisting behavior. Try debugging a failing test where the mock isn't working - good luck figuring out if it's a hoisting issue, import order problem, or if you're mocking the wrong module path.

## Please use a real database if you can!

I also really dislike the `expect().toHaveBeenCalledWith` kind of tests. Just because you're mocking something, doesn't mean you can't use a local real database instead. It's much more robust, you're actually checking for things like correct SQL query syntax, and that your table has the right number of columns etc. Otherwise you'll essentially end up re-implementing a shitty version of a database.

Some people would call these integration tests instead of unit tests. To which I say, who cares? This is clearly a better test.

## Passing around a context is not really a 'done' thing

In Go (where I spent much of my recent career), you would often pass around a context as the first argument. We would put all the service dependencies on that, and it was great. You could just pass the database into the test, and this meant you could isolate every test. An example of how that looks in Typescript is the following:

```ts
type Context = {
  database: {
    sql: (query: string) => {rows: any[]};
  };
};

const getStuff = (ctx: Context) => {
  const stuff = ctx.database.sql("SELECT * FROM stuff");
  return stuff.rows;
};

test("getStuff returns database rows", () => {
  const mockDatabase = new LocalSQLDB();
  
  const result = getStuff({database: mockDatabase});
  
  expect(result).toEqual([{id: 1, name: "test"}]);
});
```

I really like this pattern. It's essentially constructor based DI. It's not magic. It's very clear what everything does. There is a layer of indirection because of the interface being passed around instead of a concrete function, which some people don't like.

However – it's swimming against the flow. Most TypeScript does *not* look like this. Your LLM does not write this code (without Claude.md saying so), and neither does your team mate or OSS contributor.

 There are a few reasons why. First off is verbosity - you need to plumb it in everywhere, and TypeScript tends to not like 'drilling' arguments. And you can also end up with a sort of 'god' context object – though depending only on smaller interfaces that are subsets of the main context object is the solution to make individual functions suck less.

## Hidden entry points!

The main reason I end up mocking is actually this reason. Many frameworks like Next, Solid, Astro have a hidden 'index.js' that is very difficult to modify without major hacks. Shout out to React Router for [not doing this](https://reactrouter.com/api/framework-conventions/entry.server.tsx).

Constructor based dependency injection doesn't work if you don't have access to the constructor! Ever tried to test a Next.js API route? Good luck injecting dependencies into that `export default function handler(req, res)` function - the framework calls it, not you.

There are hacky ways of doing this with middleware, but I've always had some issue or other with doing it this way. Worse even, some frameworks do magical bundler things making everything even harder.

## So I keep mocking

Despite it all, I still reach for `vi.mock`, even though it makes me cringe a bit every time I do it.

However – if you take *one* thing away from this rant – please stop mocking your database. At least make *that* part of your tests less bad.
