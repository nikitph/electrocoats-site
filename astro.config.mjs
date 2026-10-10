import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// PUBLIC_PREVIEW=1 builds the shareable GitHub Pages preview, served under /electrocoats-site/.
const preview = process.env.PUBLIC_PREVIEW === '1';

export default defineConfig({
  site: preview ? 'https://nikitph.github.io' : 'https://electrocoats.com',
  base: preview ? '/electrocoats-site' : '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: preview ? [] : [sitemap()],
});
