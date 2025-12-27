/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9o_KgyY.mjs';
import { $ as $$Contacte$1 } from '../chunks/Contacte_Bn5pXLx4.mjs';
export { renderers } from '../renderers.mjs';

const $$Contacte = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contacte - FreshExpress", "description": "Contacta amb nosaltres. Tens alguna pregunta o suggeriment? Estem aqu\xED per ajudar-te." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="pt-4"> ${renderComponent($$result2, "ContacteSection", $$Contacte$1, {})} </main> ` })}`;
}, "C:/dev/FreshExpress/src/pages/contacte.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/contacte.astro";
const $$url = "/contacte";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contacte,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
