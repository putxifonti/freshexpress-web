/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9o_KgyY.mjs';
import { $ as $$ComFunciona$1 } from '../chunks/ComFunciona_777OxFVk.mjs';
export { renderers } from '../renderers.mjs';

const $$ComFunciona = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Com Funciona - FreshExpress", "description": "Descobreix com funciona FreshExpress. El servei d'entrega m\xE9s r\xE0pid de Catalunya." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="pt-4"> ${renderComponent($$result2, "ComFuncionaComponent", $$ComFunciona$1, {})} </main> ` })}`;
}, "C:/dev/FreshExpress/src/pages/com-funciona.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/com-funciona.astro";
const $$url = "/com-funciona";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ComFunciona,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
