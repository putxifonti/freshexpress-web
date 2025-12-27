/* empty css                                 */
import { e as createComponent, m as maybeRenderHead, l as renderScript, r as renderTemplate, k as renderComponent } from '../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$LayoutSessio } from '../chunks/LayoutSessio_DNKFkQi6.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$IniciSessio = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full max-w-md"> <div class="text-center mb-8"> <img src="/logotip-icon.png" alt="FreshExpress Logo" class="h-16 w-auto mx-auto mb-6"> <h1 class="text-3xl font-bold text-[#0047AB] mb-2">Benvingut/da de nou</h1> <p class="text-gray-600">Inicia sessió per accedir al teu compte</p> </div> <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"> <form class="space-y-6"> <div> <label for="usuari" class="block text-sm font-semibold text-gray-700 mb-2">
Usuari
</label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </div> <input type="text" id="usuari" name="usuari" required autocomplete="username" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent transition-all outline-none" placeholder="usuari@exemple.cat"> </div> </div> <div> <div class="flex items-center justify-between mb-2"> <label for="contrasenya" class="block text-sm font-semibold text-gray-700">
Contrasenya
</label> <a href="/recuperar-contrasenya" class="text-sm text-[#3BB143] hover:text-[#32a039] font-medium transition-colors">
Has oblidat la contrasenya?
</a> </div> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg> </div> <input type="password" id="contrasenya" name="contrasenya" required autocomplete="current-password" class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent transition-all outline-none" placeholder="••••••••"> <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors" aria-label="Mostrar contrasenya"> <svg id="eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> </button> </div> </div> <div class="flex items-center"> <input type="checkbox" id="recordar" name="recordar" class="w-4 h-4 text-[#3BB143] border-gray-300 rounded focus:ring-[#3BB143] focus:ring-2"> <label for="recordar" class="ml-2 text-sm text-gray-700">
Recordar-me
</label> </div> <!-- Missatge d'error --> <div id="error-message" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"></div> <!-- Missatge d'èxit --> <div id="success-message" class="hidden bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"></div> <button type="submit" class="w-full px-8 py-3.5 bg-[#3BB143] text-white text-lg font-semibold rounded-lg hover:bg-[#32a039] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transform flex items-center justify-center">
Iniciar Sessió
<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path> </svg> </button> </form> <div class="mt-6 text-center"> <p class="text-sm text-gray-600">
No tens compte?
<a href="/registre" class="text-[#3BB143] hover:text-[#32a039] font-semibold transition-colors">
Crear compte
</a> </p> </div> </div> </div> ${renderScript($$result, "C:/dev/FreshExpress/src/components/IniciSessio.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dev/FreshExpress/src/components/IniciSessio.astro", void 0);

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "LayoutSessio", $$LayoutSessio, { "title": "Inicia Sessi\xF3 - FreshExpress", "description": "Accedeix al teu compte de FreshExpress per fer comandes i gestionar les teves entregues ultra-r\xE0pides." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "IniciSessio", $$IniciSessio, {})} ` })}`;
}, "C:/dev/FreshExpress/src/pages/login.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
