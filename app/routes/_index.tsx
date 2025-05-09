import { Link, useLoaderData } from "@remix-run/react";
import { json, MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Nick Blow's Tech Blog" },
    {
      property: "og:title",
      content: "Nick Blow's Tech Blog",
    },
    {
      name: "og:description",
      content:
        "I'm the CTO of a startup called Wakelet. I write about Serverless, Web Tech and my experience engineering at a startup.",
    },
  ];
};

export const loader = async () => {
  return json({
    // TODO: - autogenerate this somehow.
    posts: [
      {
        slug: "serverless-straight-to-s3-uploads",
        title: "Serverless Straight to S3 Uploads",
        date: "9 May, 2025",
        description:
          "A 'fun' technique for emulating some of the functionality of Cloudflare Workers",
      },

      {
        slug: "planetscale-local",
        title: "Running Planetscale's Serverless Driver Locally",
        date: "21 March, 2025",
        description:
          "Some example code for using a local MySQL instance with planetscale's serverless driver",
      },
      {
        slug: "the-books-i-read-in-2024",
        title: "The books I read in 2024",
        date: "12 Jan, 2025",
        description:
          "A retrospective and mini-review of the fiction and non-fiction I read last year.",
      },
      {
        slug: "i-made-the-mistake-of-trying-to-write-a-test",
        title: "I made the mistake of trying to write a test",
        date: "25 Nov, 2024",
        description:
          "My odyssey to get a single unit test passing with Durable Objects.",
      },
      {
        slug: "another-hack-for-durable-objects-with-astro",
        title: "Another hack for durable objects and Astro",
        date: "4 Oct, 2024",
        description:
          "Working around various wrangler limitations. Is the DX better? I can't tell.",
      },
      {
        slug: "a-hack-for-durable-objects-with-astro",
        title: "A hack for durable objects and Astro",
        date: "2 Oct, 2024",
        description:
          "I wanted to use Durable Objects with the new Workers Assets Astro integration...",
      },
      {
        slug: "i-have-mixed-feelings-about-llms",
        title: " I have mixed feelings about LLMs",
        date: "27 July, 2024",
        description:
          "In which I explore my complicated relationship with generative AI",
      },
      {
        slug: "solid-start-inside-a-durable-object",
        title: "Solid Start inside a Durable Object.",
        date: "31 May, 2024",
        description:
          "Running Solid Start inside a durable object was fairly simple thanks to the pluggable architecture.",
      },
      {
        slug: "tailwind-is-not-always-optimal-and-thats-okay",
        title: "Tailwind is not always optimal. And that's okay!",
        date: "6 April, 2024",
        description: "Weighing in on the Tailwind 'discourse'.",
      },
      {
        slug: "this-blog-is-open-source",
        title: "This blog is open source!",
        date: "19 March, 2024",
        description:
          "Plus some fiddly things about deploying Remix to Cloudflare Pages.",
      },
      {
        slug: "9-lessons-from-9-years-of-serverless",
        title: "9 Lessons from 9 Years of Serverless",
        date: "18 March, 2024",
        description:
          "Serverless is great, and it keeps getting better. Here, I share some tips and tricks that I've learned over the years.",
      },
    ],
  });
};

const bio =
  "Hey, I’m Nick, CTO at a startup called Wakelet. I love Golang and infrastructure, but I enjoy learning about everything Web. Outside of work, I enjoy spending time with my wife and two young daughters, producing electronic music, and playing video games.";

export default function PostSlug() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-center mb-4">About Me</h1>
        <p className="text-lg text-gray-700 text-center">{bio}</p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>
        <div className="space-y-4 pb-4">
          {posts.map((post) => (
            <Link to={`/posts/${post.slug}`} key={post.slug} className="block">
              <article className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl rounded-lg overflow-hidden">
                <div className="p-6 bg-white dark:bg-gray-800">
                  <p className="text-gray-600 dark:text-gray-400 pb-2">
                    {post.date}
                  </p>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {post.description}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
        <article className="transition duration-300 ease-in-out rounded-lg overflow-hidden block">
          <div className="p-6 bg-white dark:bg-gray-800">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              More posts coming soon!
            </h3>
          </div>
        </article>
      </section>
    </div>
  );
}
