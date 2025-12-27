import { e as createComponent, m as maybeRenderHead, l as renderScript, r as renderTemplate } from './astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import 'clsx';

const $$Restreo = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="rastreig" class="bg-gradient-to-br from-[#F5F5F5] to-white min-h-screen flex items-center py-20"> <div class="container mx-auto px-4"> <div class="text-center mb-12 pt-8"> <h2 class="text-4xl md:text-5xl font-bold text-[#0047AB] mb-4">
Segueix la teva Comanda
</h2> <p class="text-lg text-gray-600 max-w-2xl mx-auto">
Introdueix el teu codi de seguiment per veure l'estat de la teva entrega
        en temps real
</p> </div> <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"> <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"> <div class="mb-6"> <div class="w-16 h-16 bg-[#3BB143] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-[#3BB143]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </div> <h3 class="text-2xl font-bold text-[#0047AB] text-center mb-2">
Codi de Seguiment
</h3> <p class="text-gray-600 text-center text-sm">
Trobaràs el codi al correu de confirmació
</p> </div> <form id="rastreig-form" class="space-y-6"> <div> <label for="codi-seguiment" class="block text-sm font-semibold text-gray-700 mb-2">
Codi de Seguiment
</label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path> </svg> </div> <input type="text" id="codi-seguiment" name="codi-seguiment" required class="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent transition-all outline-none uppercase" placeholder="FE-2024-12345" pattern="[A-Za-z0-9\-]+"> </div> <p class="text-xs text-gray-500 mt-2">Format: FE-XXXX-XXXXX</p> </div> <button type="submit" class="w-full px-8 py-4 bg-[#3BB143] text-white text-lg font-semibold rounded-lg hover:bg-[#32a039] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transform flex items-center justify-center"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg>
Buscar Comanda
</button> </form> <div class="mt-8 pt-6 border-t border-gray-200"> <p class="text-sm font-semibold text-gray-700 mb-3">
Exemples de codi:
</p> <div class="flex flex-wrap gap-2"> <button type="button" class="exemple-codi px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-[#3BB143] hover:text-white transition-all duration-200" data-codi="FE-2024-12345">
FE-2024-12345
</button> <button type="button" class="exemple-codi px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-[#3BB143] hover:text-white transition-all duration-200" data-codi="FE-2024-67890">
FE-2024-67890
</button> </div> </div> </div> <div id="resultat-rastreig" class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 min-h-[400px] flex items-center justify-center"> <!-- Estat Inicial: Sense Cerca --> <div id="estat-inicial" class="text-center"> <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"> <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path> </svg> </div> <h3 class="text-xl font-bold text-gray-700 mb-2">
Introdueix un codi de seguiment
</h3> <p class="text-gray-500">El resultat apareixerà aquí</p> </div> <div id="estat-carregant" class="hidden text-center"> <div class="animate-spin w-16 h-16 border-4 border-[#3BB143] border-t-transparent rounded-full mx-auto mb-6"></div> <h3 class="text-xl font-bold text-gray-700 mb-2">
Buscant la teva comanda...
</h3> <p class="text-gray-500">Espereu un moment</p> </div> <div id="estat-resultats" class="hidden w-full"></div> </div> </div> </div> </section> ${renderScript($$result, "C:/dev/FreshExpress/src/components/Restreo.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dev/FreshExpress/src/components/Restreo.astro", void 0);

export { $$Restreo as $ };
