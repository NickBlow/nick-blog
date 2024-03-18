import {json, MetaFunction, LoaderFunctionArgs, HeadersFunction} from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";

export async function loader({
                                 params,
    request
                             }: LoaderFunctionArgs) {
    const host = request.headers.get("host");
    const route = params.slug;
    const {html: markdown, attributes} = await import(`../../public/articles/${route}/index.md`);

    const img = `https://${host}/articles/${route}/og-image.png`;
    return json({
        markdown,
        attributes,
        route,
        img
    });
}

export const headers: HeadersFunction = () => ({
    "Cache-Control": "max-age=300, s-maxage=3600",
});


export const meta: MetaFunction<typeof loader> = ({data}) => {

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
    const {markdown} = useLoaderData<typeof loader>();
    return (
        <main className="prose-stone prose-xl flex justify-center pt-10 px-6 prose-a:text-blue-600">
            <div className="max-w-prose" dangerouslySetInnerHTML={{__html: markdown}}>
            </div>
        </main>
    );
}
