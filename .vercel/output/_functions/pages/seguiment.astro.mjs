/* empty css                                 */
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9o_KgyY.mjs';
import { v as verifyToken, g as getUserById } from '../chunks/auth_CxmgGjqm.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Seguiment = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Seguiment;
  const token = Astro2.cookies.get("auth_token")?.value;
  let user = null;
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      user = await getUserById(payload.userId);
    }
  }
  if (!user) {
    return Astro2.redirect("/login");
  }
  const codeFromUrl = Astro2.url.searchParams.get("code") || "";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Seguiment de Comandes - FreshExpress" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100 py-8"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Navegació --> <div class="mb-6"> <a href="/dashboard" class="text-[#3BB143] hover:text-[#32a039] text-sm font-medium flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Tornar al Dashboard
</a> </div> <div class="bg-white rounded-xl shadow-lg p-6 md:p-8"> <h1 class="text-2xl font-bold text-gray-900 mb-6 flex items-center"> <svg class="w-7 h-7 mr-3 text-[#3BB143]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg>
Seguiment de Comandes
</h1> <!-- Cercador de comandes --> <div class="mb-8"> <label class="block text-sm font-medium text-gray-700 mb-2">
Introdueix el codi de seguiment
</label> <div class="flex gap-3"> <input type="text" id="tracking-code" placeholder="Ex: FE-M1ABCD-XY12"${addAttribute(codeFromUrl, "value")} class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent"> <button id="search-btn" class="px-6 py-3 bg-[#3BB143] text-white font-medium rounded-lg hover:bg-[#32a039] transition-colors">
Cercar
</button> </div> </div> <!-- Loading --> <div id="loading" class="hidden text-center py-8"> <svg class="animate-spin h-8 w-8 text-[#3BB143] mx-auto" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> <p class="text-gray-500 mt-2">Cercant comanda...</p> </div> <!-- Error --> <div id="error-message" class="hidden bg-red-50 border border-red-200 rounded-lg p-4 mb-6"> <p class="text-red-700" id="error-text">Error cercant la comanda</p> </div> <!-- Resultat de seguiment --> <div id="tracking-result" class="hidden"> <div class="border border-gray-200 rounded-lg p-6"> <!-- Capçalera --> <div class="flex items-center justify-between mb-6"> <div> <p class="text-sm text-gray-500">Comanda</p> <p class="text-lg font-bold text-gray-900" id="result-code"></p> </div> <span id="result-status" class="px-3 py-1 rounded-full text-sm font-medium"></span> </div> <!-- Direcció d'entrega --> <div id="direccio-section" class="mb-6 p-4 bg-gray-50 rounded-lg"> <p class="text-sm text-gray-500 mb-1">Adreça d'entrega</p> <p class="font-medium text-gray-900" id="result-direccio"></p> </div> <!-- Timeline --> <div class="relative mb-8" id="timeline-container"> <div class="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div> <div id="timeline" class="space-y-6"></div> </div> <!-- Detalls productes --> <div id="productes-section" class="mb-6"> <h3 class="font-semibold text-gray-900 mb-3">Productes</h3> <div id="productes-list" class="space-y-3"></div> </div> <!-- Resum de preus --> <div class="border-t border-gray-200 pt-4"> <div class="flex justify-between text-sm text-gray-600 mb-2"> <span>Subtotal</span> <span id="result-subtotal">0.00 €</span> </div> <div class="flex justify-between text-sm text-gray-600 mb-2"> <span>Enviament</span> <span id="result-enviament">0.00 €</span> </div> <div class="flex justify-between font-bold text-gray-900 text-lg"> <span>Total</span> <span id="result-total">0.00 €</span> </div> </div> <!-- Info repartidor (si en camí) --> <div id="repartidor-section" class="hidden mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg"> <div class="flex items-center"> <svg class="w-6 h-6 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path> </svg> <div> <p class="font-medium text-orange-800">Repartidor assignat</p> <p class="text-sm text-orange-600" id="repartidor-info"></p> </div> </div> </div> <!-- Info ecològica --> <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"> <div class="flex items-center"> <svg class="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path> </svg> <div> <p class="font-medium text-green-800">
Lliurament 100% ecològic
</p> <p class="text-sm text-green-600">
Aquesta comanda es lliura amb transport sostenible
</p> </div> </div> </div> </div> </div> <!-- Estat buit --> <div id="no-orders" class="text-center py-12"> <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path> </svg> <p class="text-gray-500">
Introdueix un codi de seguiment per veure l'estat de la teva comanda
</p> </div> </div> </div> </div> ` })} ${renderScript($$result, "C:/dev/FreshExpress/src/pages/seguiment.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dev/FreshExpress/src/pages/seguiment.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/seguiment.astro";
const $$url = "/seguiment";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Seguiment,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
