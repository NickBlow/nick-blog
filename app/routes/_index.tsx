import { type MetaFunction, json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { posts } from "../posts";

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
				"Formerly CTO at Wakelet, now at Iterate. I write about Serverless, Web Tech and my experience engineering at a startup.",
		},
	];
};

export const loader = async () => {
	return json({ posts });
};

const bio =
	"Hey, I’m Nick. I was a former CTO at Wakelet, a founding eng at iterate.com and now I'm a cofounder of an AI startup. I love systems and infrastructure, but I enjoy learning about everything Web. Outside of work, I spend time with my wife and two young daughters, write and paint miniatures.";

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
