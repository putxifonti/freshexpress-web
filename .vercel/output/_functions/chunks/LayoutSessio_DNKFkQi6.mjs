import { e as createComponent, f as createAstro, h as addAttribute, w as renderHead, v as renderSlot, r as renderTemplate } from './astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$LayoutSessio = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LayoutSessio;
  const { title, description = "FreshExpress - Accedeix al teu compte" } = Astro2.props;
  return renderTemplate`<html lang="ca"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/png" href="/logotip-cut.png"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="keywords" content="entrega ràpida, micro-logística, productes frescos, 30 minuts, Catalunya, Barcelona"><meta name="author" content="FreshExpress"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><title>${title}</title>${renderHead()}</head> <body class="bg-white min-h-screen"> <div class="absolute top-6 left-6 z-10"> <a href="/" class="inline-flex items-center space-x-2 px-4 py-2 text-[#0047AB] hover:text-[#3BB143] transition-colors duration-200 group"> <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg> <span class="font-medium">Tornar</span> </a> </div> <main class="min-h-screen flex items-center justify-center px-4 py-12"> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "C:/dev/FreshExpress/src/layouts/LayoutSessio.astro", void 0);

export { $$LayoutSessio as $ };
