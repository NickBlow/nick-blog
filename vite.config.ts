import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItAttributes from "markdown-it-attrs";
import hljs from "highlight.js"; // https://highlightjs.org

import { plugin, Mode } from "vite-plugin-markdown";
// @ts-expect-error the plugin uses the initialiser.
const md = MarkdownIt({
	highlight: function (str, lang) {
		const codeClasses = "p-[15px] pt-[30px] m-0 w-full rounded-[16px]";
		// @ts-expect-error using the plugin inside the plugin
		let content = md.utils.escapeHtml(str);
		if (lang && hljs.getLanguage(lang)) {
			try {
				content = hljs.highlight(str, {
					language: lang,
					ignoreIllegals: true,
				}).value;
			} catch (e) {
				console.error(e);
			}
		}
		return (
			`<pre class="!p-0"><code class="hljs ${codeClasses}">` +
			content +
			"</code></pre>"
		);
	},
});
md.use(MarkdownItAnchor, {});
md.use(MarkdownItAttributes, {});

export default defineConfig({
	plugins: [
		remixCloudflareDevProxy(),
		plugin({ mode: [Mode.HTML], markdownIt: md }),
		remix(),
	],
});
