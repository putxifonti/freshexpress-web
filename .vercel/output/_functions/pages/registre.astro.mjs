/* empty css                                 */
import { e as createComponent, m as maybeRenderHead, l as renderScript, r as renderTemplate, k as renderComponent } from '../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$LayoutSessio } from '../chunks/LayoutSessio_DNKFkQi6.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$CrearCompte = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full max-w-4xl"> <div class="text-center mb-8"> <img src="/logotip-icon.png" alt="FreshExpress Logo" class="h-16 w-auto mx-auto mb-6"> <h1 class="text-3xl font-bold text-[#0047AB] mb-2">Crea el teu compte</h1> <p class="text-gray-600">Comença a rebre productes frescos en 30 minuts</p> </div> <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"> <form class="space-y-6"> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div class="space-y-5"> <div> <label for="nom-cognoms" class="block text-sm font-semibold text-gray-700 mb-2">
Nom i Cognoms
</label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </div> <input type="text" id="nom-cognoms" name="nom-cognoms" required autocomplete="name" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent transition-all outline-none" placeholder="Joan Garcia Pérez"> </div> </div> <div> <label for="nom-usuari" class="block text-sm font-semibold text-gray-700 mb-2">
Nom d'Usuari
</label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <input type="text" id="nom-usuari" name="nom-usuari" required autocomplete="username" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent transition-all outline-none" placeholder="joangp"> </div> </div> <div> <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
Correu electrònic
</label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> </div> <input type="email" id="email" name="email" required autocomplete="email" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent transition-all outline-none" placeholder="joan@exemple.cat"> </div> </div> </div> <div class="space-y-5"> <div> <label for="mobil" class="block text-sm font-semibold text-gray-700 mb-2">
Mòbil <span class="text-gray-400 font-normal">(opcional)</span> </label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path> </svg> </div> <input type="tel" id="mobil" name="mobil" autocomplete="tel" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent transition-all outline-none" placeholder="+34 600 000 000"> </div> </div> <div> <label for="contrasenya" class="block text-sm font-semibold text-gray-700 mb-2">
Contrasenya
</label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg> </div> <input type="password" id="contrasenya" name="contrasenya" required autocomplete="new-password" class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent transition-all outline-none" placeholder="Mínim 8 caràcters"> <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors" aria-label="Mostrar contrasenya"> <svg id="eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> </button> </div> </div> <div> <label for="confirmar-contrasenya" class="block text-sm font-semibold text-gray-700 mb-2">
Confirmar Contrasenya
</label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <input type="password" id="confirmar-contrasenya" name="confirmar-contrasenya" required autocomplete="new-password" class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent transition-all outline-none" placeholder="Repeteix la contrasenya"> <button type="button" id="toggle-password-confirm" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors" aria-label="Mostrar contrasenya"> <svg id="eye-icon-confirm" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> </button> </div> </div> </div> </div> <!-- Secció de Consentiments --> <div class="space-y-4 border-t border-gray-200 pt-6"> <h3 class="text-sm font-semibold text-gray-700 mb-3">
Gestió del consentiment
</h3> <!-- Termes obligatoris --> <div class="flex items-start"> <div class="flex items-center h-5"> <input type="checkbox" id="termes" name="termes" required class="w-4 h-4 text-[#3BB143] border-gray-300 rounded focus:ring-[#3BB143] focus:ring-2"> </div> <label for="termes" class="ml-3 text-sm text-gray-700"> <span class="text-red-500">*</span> Accepto els
<a href="/termes-condicions" class="text-[#3BB143] hover:text-[#32a039] font-semibold transition-colors">
Termes i Condicions
</a>
i la
<a href="/politica-privacitat" class="text-[#3BB143] hover:text-[#32a039] font-semibold transition-colors">
Política de Privacitat
</a> </label> </div> <!-- Consentiment Marketing --> <div class="flex items-start bg-gray-50 p-3 rounded-lg"> <div class="flex items-center h-5"> <input type="checkbox" id="consent-marketing" name="consent-marketing" class="w-4 h-4 text-[#3BB143] border-gray-300 rounded focus:ring-[#3BB143] focus:ring-2"> </div> <label for="consent-marketing" class="ml-3 text-sm text-gray-700"> <span class="font-medium">Comunicacions comercials</span> <p class="text-xs text-gray-500 mt-1">
Vull rebre ofertes personalitzades, novetats i promocions
              exclusives per email.
</p> </label> </div> <!-- Consentiment Analytics --> <div class="flex items-start bg-gray-50 p-3 rounded-lg"> <div class="flex items-center h-5"> <input type="checkbox" id="consent-analytics" name="consent-analytics" class="w-4 h-4 text-[#3BB143] border-gray-300 rounded focus:ring-[#3BB143] focus:ring-2"> </div> <label for="consent-analytics" class="ml-3 text-sm text-gray-700"> <span class="font-medium">Anàlisi de comportament</span> <p class="text-xs text-gray-500 mt-1">
Permetre l'anàlisi del meu comportament de navegació per millorar
              l'experiència del servei.
</p> </label> </div> <!-- Consentiment Data Broker --> <div class="flex items-start bg-green-50 p-3 rounded-lg border border-green-100"> <div class="flex items-center h-5"> <input type="checkbox" id="consent-databroker" name="consent-databroker" class="w-4 h-4 text-[#3BB143] border-gray-300 rounded focus:ring-[#3BB143] focus:ring-2"> </div> <label for="consent-databroker" class="ml-3 text-sm text-gray-700"> <span class="font-medium text-[#3BB143]">Programa Data for Good</span> <p class="text-xs text-gray-500 mt-1">
Participar en el nostre programa ètic de dades. Les teves dades <strong>anonimitzades</strong> ajuden a investigació sobre sostenibilitat i consum responsable. Rebràs
<strong>descomptes exclusius</strong> i el 10% dels ingressos generats
              es destinen a projectes ecològics.
<a href="/politica-dades" class="text-[#3BB143] hover:underline ml-1">Més informació →</a> </p> </label> </div> </div> <!-- Missatge d'error --> <div id="error-message" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"></div> <!-- Missatge d'èxit --> <div id="success-message" class="hidden bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"></div> <button type="submit" class="w-full px-8 py-3.5 bg-[#3BB143] text-white text-lg font-semibold rounded-lg hover:bg-[#32a039] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transform flex items-center justify-center">
Crear Compte
<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path> </svg> </button> </form> <div class="mt-6 text-center"> <p class="text-sm text-gray-600">
Ja tens compte?
<a href="/login" class="text-[#3BB143] hover:text-[#32a039] font-semibold transition-colors">
Inicia sessió
</a> </p> </div> </div> </div> ${renderScript($$result, "C:/dev/FreshExpress/src/components/CrearCompte.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dev/FreshExpress/src/components/CrearCompte.astro", void 0);

const $$Registre = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "LayoutSessio", $$LayoutSessio, { "title": "Crear Compte - FreshExpress", "description": "Registra't a FreshExpress i comen\xE7a a rebre productes frescos en menys de 30 minuts. Crea el teu compte ara." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CrearCompte", $$CrearCompte, {})} ` })}`;
}, "C:/dev/FreshExpress/src/pages/registre.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/registre.astro";
const $$url = "/registre";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Registre,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
