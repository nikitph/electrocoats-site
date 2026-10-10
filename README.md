# electrocoats.com

Static Astro site. Isometric fine-line illustrations are generated in code (`src/lib/iso.ts`),
motion is GSAP + ScrollTrigger (`src/scripts/motion.ts`), and every product lives in
`src/data/products.ts`, which feeds the finder, product pages, enquiry form and redirects.

```
npm install
npm run dev       # http://localhost:4321
npm run build     # → dist/ (also regenerates public/.htaccess)
```

## Deploy (current cPanel host)
Upload the contents of `dist/` to `public_html/`. The generated `.htaccess` 301-redirects
all 54 old `*.html` URLs, forces HTTPS, and returns 410 for the old template folders.

## Enquiry form
Set `PUBLIC_FORM_ENDPOINT` (Formspree, Web3Forms, etc.) at build time to POST JSON.
Without it the form opens the visitor's mail app addressed to mktg@electrocoats.com.

## Editing content
- Products, specs, filters: `src/data/products.ts` (`stub: true` = "datasheet on request")
- Company facts, clients, testimonials, awards, timeline: `src/data/site.ts`
- Logo: vector redraw of the original. See `tools/logo/README.md`.
