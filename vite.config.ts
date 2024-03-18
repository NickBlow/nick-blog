import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import {defineConfig} from "vite";
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItAttributes from 'markdown-it-attrs';

import  {plugin, Mode} from "vite-plugin-markdown";
const md = MarkdownIt();
md.use(MarkdownItAnchor, {});
md.use(MarkdownItAttributes, {});

export default defineConfig({
  plugins: [remixCloudflareDevProxy(), plugin({mode: [Mode.HTML], markdownIt: md}), remix()],
});
