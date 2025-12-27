/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9o_KgyY.mjs';
import { $ as $$Restreo } from '../chunks/Restreo_DELqYwP0.mjs';
export { renderers } from '../renderers.mjs';

const $$Rastreig = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Rastreig de Comandes - FreshExpress", "description": "Segueix la teva comanda en temps real. Introdueix el teu codi de seguiment per veure l'estat de la teva entrega." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="pt-4"> ${renderComponent($$result2, "Restreo", $$Restreo, {})} </main> ` })}`;
}, "C:/dev/FreshExpress/src/pages/rastreig.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/rastreig.astro";
const $$url = "/rastreig";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Rastreig,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
