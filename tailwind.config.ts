import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./vite.config.ts"],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
} satisfies Config;
