export type BlogPost = {
	slug: string;
	title: string;
	date: string;
	published: string;
	description: string;
};

export const posts = [
	{
		slug: "reason-once-run-many",
		title: "Reason once, run many.",
		date: "26 August, 2026",
		published: "2026-08-26",
		description: "Everything is computer.",
	},
	{
		slug: "computer-use-without-breaking-the-bank",
		title: "Computer use without breaking the bank",
		date: "20 August, 2026",
		published: "2026-08-20",
		description: "Or… what the labs don't want you to know.",
	},
	{
		slug: "on-ai-writing",
		title: "On AI Writing",
		date: "9 June, 2026",
		published: "2026-06-09",
		description: "And why I don't like it.",
	},
	{
		slug: "i-built-an-agent-harness",
		title: "I built an agent harness",
		date: "15 May, 2026",
		published: "2026-05-15",
		description:
			"I've spent the last ~2 weeks working on my own agent and harness.",
	},
	{
		slug: "a-quick-example-of-alchemy-email-routing-dev",
		title: "A quick example of Alchemy email routing in dev",
		date: "28 April, 2026",
		published: "2026-04-28",
		description:
			"Routing Cloudflare inbound email to a local development server with Alchemy, a Worker, and a tunnel.",
	},
	{
		slug: "some-thoughts-on-coding-with-agents",
		title: "Some Thoughts on Coding with Agents",
		date: "14 March, 2026",
		published: "2026-03-14",
		description:
			"Agents are already changing software work, and I am excited, uneasy, and still not sure where any of this ends up.",
	},
	{
		slug: "why-i-hate-mocking-imports",
		title: "Why I hate mocking imports in javascript",
		date: "6 September, 2025",
		published: "2025-09-06",
		description: "And why I do it anyway",
	},
	{
		slug: "im-sad-we-lost-the-creatives",
		title: "I'm Sad We Lost the Creatives",
		date: "12 July 2025",
		published: "2025-07-12",
		description:
			"The art community overwhelmingly hates AI, and I think that's a great loss",
	},
	{
		slug: "a-tech-retrospective",
		title: "A Tech Retrospective",
		date: "27 June, 2025",
		published: "2025-06-27",
		description: "A retrospective on my tech journey at Wakelet.",
	},
	{
		slug: "ive-soured-on-go",
		title: "I've Soured on Go",
		date: "5 June, 2025",
		published: "2025-06-05",
		description: "Why I don't think Go is the future.",
	},
	{
		slug: "hypermedia-in-the-age-of-ai",
		title: "Hypermedia in the Age of AI",
		date: "18 May, 2025",
		published: "2025-05-18",
		description: "In which I make the case for hypermedia for LLMs.",
	},
	{
		slug: "serverless-straight-to-s3-uploads",
		title: "Serverless Straight to S3 Uploads",
		date: "9 May, 2025",
		published: "2025-05-09",
		description:
			"A 'fun' technique for emulating some of the functionality of Cloudflare Workers",
	},
	{
		slug: "planetscale-local",
		title: "Running Planetscale's Serverless Driver Locally",
		date: "21 March, 2025",
		published: "2025-03-21",
		description:
			"Some example code for using a local MySQL instance with planetscale's serverless driver",
	},
	{
		slug: "the-books-i-read-in-2024",
		title: "The books I read in 2024",
		date: "12 Jan, 2025",
		published: "2025-01-12",
		description:
			"A retrospective and mini-review of the fiction and non-fiction I read last year.",
	},
	{
		slug: "i-made-the-mistake-of-trying-to-write-a-test",
		title: "I made the mistake of trying to write a test",
		date: "25 Nov, 2024",
		published: "2024-11-25",
		description:
			"My odyssey to get a single unit test passing with Durable Objects.",
	},
	{
		slug: "another-hack-for-durable-objects-with-astro",
		title: "Another hack for durable objects and Astro",
		date: "4 Oct, 2024",
		published: "2024-10-04",
		description:
			"Working around various wrangler limitations. Is the DX better? I can't tell.",
	},
	{
		slug: "a-hack-for-durable-objects-with-astro",
		title: "A hack for durable objects and Astro",
		date: "2 Oct, 2024",
		published: "2024-10-02",
		description:
			"I wanted to use Durable Objects with the new Workers Assets Astro integration...",
	},
	{
		slug: "i-have-mixed-feelings-about-llms",
		title: "I have mixed feelings about LLMs",
		date: "27 July, 2024",
		published: "2024-07-27",
		description:
			"In which I explore my complicated relationship with generative AI",
	},
	{
		slug: "solid-start-inside-a-durable-object",
		title: "Solid Start inside a Durable Object.",
		date: "31 May, 2024",
		published: "2024-05-31",
		description:
			"Running Solid Start inside a durable object was fairly simple thanks to the pluggable architecture.",
	},
	{
		slug: "tailwind-is-not-always-optimal-and-thats-okay",
		title: "Tailwind is not always optimal. And that's okay!",
		date: "6 April, 2024",
		published: "2024-04-06",
		description: "Weighing in on the Tailwind 'discourse'.",
	},
	{
		slug: "this-blog-is-open-source",
		title: "This blog is open source!",
		date: "19 March, 2024",
		published: "2024-03-19",
		description:
			"Plus some fiddly things about deploying Remix to Cloudflare Pages.",
	},
	{
		slug: "9-lessons-from-9-years-of-serverless",
		title: "9 Lessons from 9 Years of Serverless",
		date: "18 March, 2024",
		published: "2024-03-18",
		description:
			"Serverless is great, and it keeps getting better. Here, I share some tips and tricks that I've learned over the years.",
	},
] satisfies BlogPost[];
