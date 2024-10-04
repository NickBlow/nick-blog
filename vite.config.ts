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
		if (lang && hljs.getLanguage(lang)) {
			try {
				return (
					`<pre class="!p-0"><code class="hljs ${codeClasses}">` +
					hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
					"</code></pre>"
				);
			} catch (__) {
				/* empty */
			}
		}

		return (
			`<pre class="!p-0"><code class="hljs ${codeClasses}}">` + md.utils.escapeHtml(str) + "</code></pre>"
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
