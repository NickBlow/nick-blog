import {
	json,
	MetaFunction,
	LoaderFunctionArgs,
	HeadersFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import "highlight.js/styles/github-dark-dimmed.css";

export async function loader({ params, request }: LoaderFunctionArgs) {
	const host = request.headers.get("host");
	const route = params.slug;
	try {
		const { html: markdown, attributes } = await import(
			`../../public/articles/${route}/index.md`
		);

		const img = `https://${host}/articles/${route}/og-image.png`;
		return json({
			markdown,
			attributes,
			route,
			img,
		});
	} catch (e) {
		throw new Response(null, {
			status: 404,
			statusText: "Not Found",
		});
	}
}

export const headers: HeadersFunction = () => ({
	"Cache-Control": "max-age=300, s-maxage=3600",
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: data?.attributes.title },
		{
			property: "og:title",
			content: data?.attributes.title,
		},
		{
			property: "og:image",
			content: data?.img,
		},
		{
			name: "og:description",
			content: data?.attributes.description,
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:site",
			content: "@nickb9994",
		},
		{
			name: "twitter:title",
			content: data?.attributes.title,
		},
		{
			name: "twitter:description",
			content: data?.attributes.description,
		},
		{
			name: "twitter:image",
			content: data?.img,
		},
		{
			name: "twitter:creator",
			content: "@nickb9994",
		},
	];
};

export default function PostSlug() {
	const { markdown } = useLoaderData<typeof loader>();
	return (
		<main className="prose-stone prose-base md:prose-lg lg:prose-xl mx-auto justify-center pt-10 px-4 sm:px-6 min-w-[90%]">
			<div
				className="max-w-full sm:max-w-[70%] mx-auto w-full sm:w-[80ch] markdown-content"
				dangerouslySetInnerHTML={{ __html: markdown }}
			></div>
		</main>
	);
}
