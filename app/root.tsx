import "./tailwind.css";

import { Links, Meta, Outlet, ScrollRestoration } from "@remix-run/react";
import { Header } from "./components/Header";

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
