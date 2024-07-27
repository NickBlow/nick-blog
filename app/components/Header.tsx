import photoUrl from "./me.jpg";
import { Link } from "@remix-run/react";

const twitterHandle = "NickBlowTech";

export const Header = () => {
	return (
		<header className="bg-gray-800 text-white p-4 flex items-center justify-center">
			<div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl">
				{/* Photo and Welcome Text, centered in their own container */}
				<div className="flex items-center justify-center mb-4 md:mb-0">
					<img
						src={photoUrl}
						alt="Profile"
						className="h-12 w-12 rounded-full mr-4"
					/>
					<Link to="/" className="text-xl md:text-3xl font-bold">
						nickblow.tech
					</Link>
				</div>

				{/* Twitter Link, adjusted for better alignment */}
				<a
					href={`https://twitter.com/${twitterHandle}`}
					target="_blank"
					rel="noopener noreferrer"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
				>
					Follow me on Twitter
				</a>
			</div>
		</header>
	);
};
