import {Link, useLoaderData} from "@remix-run/react";
import {json, MetaFunction} from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Nick Blow's Tech Blog" },
    {
      property: "og:title",
      content: "Nick Blow's Tech Blog",
    },
    {
      name: "og:description",
      content: "I'm the CTO of a startup called Wakelet. I write about Serverless, Web Tech and my experience engineering at a startup.",
    },
  ];
};


export const loader = async () => {
  return json({
    posts: [
      {
        slug: '9-lessons-from-9-years-of-serverless',
        title: '9 Lessons from 9 Years in Serverless',
        date: '18 March, 2024',
        description: "Serverless is great, and it keeps getting better. Here, I share some tips and tricks that I've learned over the years."
      },
      {
        slug: 'this-blog-is-open-source',
        title: 'This blog is open source!',
        date: '19 March, 2024',
        description: "Plus some fiddly things about deploying Remix to Cloudflare Pages."
      },
    ],
  });
};

const bio = "Hey, I’m Nick, CTO at a startup called Wakelet. I love Golang and infrastructure, but I enjoy learning about everything Web. Outside of work, I enjoy spending time with my wife and baby daughter, producing electronic music, and playing video games.";

export default function PostSlug() {
  const {posts} = useLoaderData<typeof loader>();
  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-center mb-4">About Me</h1>
          <p className="text-lg text-gray-700 text-center">{bio}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>
          <div className="space-y-4 pb-4">
            {posts.map(post => (
                <Link to={`/posts/${post.slug}`} key={post.slug} className="block">
                  <article className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl rounded-lg overflow-hidden">
                    <div className="p-6 bg-white dark:bg-gray-800">
                      <p className="text-gray-600 dark:text-gray-400 pb-2">{post.date}</p>
                      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{post.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{post.description}</p>
                    </div>
                  </article>
                </Link>
            ))}
          </div>
          <article className="transition duration-300 ease-in-out rounded-lg overflow-hidden block">
            <div className="p-6 bg-white dark:bg-gray-800">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">More posts coming soon!</h3>
            </div>
          </article>

        </section>
      </div>
  );
}
