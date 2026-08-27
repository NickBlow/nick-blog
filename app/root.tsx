import "./tailwind.css";

import type { LinksFunction } from "@remix-run/cloudflare";
import { Links, Meta, Outlet, ScrollRestoration } from "@remix-run/react";
import { Header } from "./components/Header";

export const links: LinksFunction = () => [
	{
		rel: "alternate",
		type: "application/rss+xml",
		title: "Nick Blow's Tech Blog",
		href: "/feed.xml",
	},
];

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="bg-slate-100">
				<Header />
				<Outlet />
				<ScrollRestoration />
			</body>
		</html>
	);
}
