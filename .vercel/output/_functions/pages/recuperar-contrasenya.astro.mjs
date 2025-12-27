/* empty css                                 */
import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$LayoutSessio } from '../chunks/LayoutSessio_DNKFkQi6.mjs';
export { renderers } from '../renderers.mjs';

const $$RecuperarContrasenya = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "LayoutSessio", $$LayoutSessio, { "title": "Recuperar Contrasenya - FreshExpress" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#e0f2fe] py-12 px-4 sm:px-6 lg:px-8"> <div class="max-w-md w-full space-y-8"> <!-- Logo i títol --> <div class="text-center"> <a href="/" class="inline-flex items-center justify-center mb-6"> <span class="text-3xl font-bold bg-gradient-to-r from-[#3BB143] to-[#0047AB] bg-clip-text text-transparent">
FreshExpress
</span> </a> <h2 class="text-2xl font-bold text-gray-900">Recuperar Contrasenya</h2> <p class="mt-2 text-gray-600">
Introdueix el teu email i t'enviarem instruccions per restablir la
          contrasenya.
</p> </div> <!-- Formulari --> <div class="bg-white rounded-2xl shadow-xl p-8"> <form id="recovery-form" class="space-y-6"> <div> <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
Correu electrònic
</label> <input type="email" id="email" name="email" required placeholder="exemple@email.com" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent transition-colors"> </div> <!-- Missatge d'estat --> <div id="message" class="hidden rounded-lg p-4 text-sm"></div> <button type="submit" id="submit-btn" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-[#3BB143] to-[#2d8a33] hover:from-[#2d8a33] hover:to-[#226d27] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3BB143] font-medium transition-all"> <span id="btn-text">Enviar instruccions</span> <span id="btn-loading" class="hidden"> <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </span> </button> </form> <div class="mt-6 text-center"> <a href="/login" class="text-[#3BB143] hover:text-[#2d8a33] text-sm font-medium">
← Tornar a iniciar sessió
</a> </div> </div> <!-- Informació addicional --> <div class="bg-blue-50 border border-blue-200 rounded-lg p-4"> <div class="flex"> <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <div class="ml-3"> <p class="text-sm text-blue-700">
Si no reps el correu en uns minuts, comprova la carpeta de correu
              brossa o contacta'ns a <strong>suport@freshexpress.cat</strong> </p> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "C:/dev/FreshExpress/src/pages/recuperar-contrasenya.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dev/FreshExpress/src/pages/recuperar-contrasenya.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/recuperar-contrasenya.astro";
const $$url = "/recuperar-contrasenya";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$RecuperarContrasenya,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
