import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { posts } from "../posts";

const title = "Nick Blow's Tech Blog";
const description =
	"Writing about serverless, web technology, and startup engineering.";

function escapeXml(value: string) {
	return value.replace(/[<>&"']/g, (character) => {
		const entities: Record<string, string> = {
			"<": "&lt;",
			">": "&gt;",
			"&": "&amp;",
			'"': "&quot;",
			"'": "&apos;",
		};

		return entities[character];
	});
}

export async function loader({ request }: LoaderFunctionArgs) {
	const origin = new URL(request.url).origin;
	const feedUrl = `${origin}/feed.xml`;
	const items = posts
		.map((post) => {
			const url = `${origin}/posts/${post.slug}`;
			const published = new Date(
				`${post.published}T00:00:00.000Z`,
			).toUTCString();

			return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${published}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
		})
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(origin)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			"Cache-Control": "max-age=300, s-maxage=3600",
			"Content-Type": "application/rss+xml; charset=utf-8",
		},
	});
}
