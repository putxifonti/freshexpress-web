/* empty css                                 */
import { e as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9o_KgyY.mjs';
/* empty css                               */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Faq = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", ` <script>
  // Toggle FAQ answers
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      const icon = button.querySelector("svg");

      // Toggle answer
      answer.classList.toggle("hidden");

      // Rotate icon
      if (answer.classList.contains("hidden")) {
        icon.classList.remove("rotate-180");
      } else {
        icon.classList.add("rotate-180");
      }
    });
  });

  // Filter by category
  document.querySelectorAll(".faq-filter").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      // Update active button
      document.querySelectorAll(".faq-filter").forEach((btn) => {
        btn.classList.remove("active", "bg-[#3BB143]", "text-white");
        btn.classList.add("bg-gray-100", "text-gray-700");
      });
      button.classList.add("active", "bg-[#3BB143]", "text-white");
      button.classList.remove("bg-gray-100", "text-gray-700");

      // Filter items
      document.querySelectorAll(".faq-item").forEach((item) => {
        if (category === "all" || item.dataset.category === category) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  // Search functionality
  const searchInput = document.getElementById("faq-search");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    document.querySelectorAll(".faq-item").forEach((item) => {
      const question = item
        .querySelector(".faq-question span")
        .textContent.toLowerCase();
      const answer = item
        .querySelector(".faq-answer")
        .textContent.toLowerCase();

      if (question.includes(searchTerm) || answer.includes(searchTerm)) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });

    // Reset category filter
    document.querySelectorAll(".faq-filter").forEach((btn) => {
      btn.classList.remove("active", "bg-[#3BB143]", "text-white");
      btn.classList.add("bg-gray-100", "text-gray-700");
    });
    document
      .querySelector('.faq-filter[data-category="all"]')
      .classList.add("active", "bg-[#3BB143]", "text-white");
    document
      .querySelector('.faq-filter[data-category="all"]')
      .classList.remove("bg-gray-100", "text-gray-700");
  });
<\/script> `])), renderComponent($$result, "Layout", $$Layout, { "title": "Preguntes Freq\xFCents (FAQ) - FreshExpress", "data-astro-cid-6kmwghhu": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 py-16" data-astro-cid-6kmwghhu> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-6kmwghhu> <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12" data-astro-cid-6kmwghhu> <div class="text-center mb-12" data-astro-cid-6kmwghhu> <div class="inline-flex items-center justify-center w-16 h-16 bg-[#3BB143]/10 rounded-full mb-4" data-astro-cid-6kmwghhu> <svg class="w-8 h-8 text-[#3BB143]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-6kmwghhu></path> </svg> </div> <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-astro-cid-6kmwghhu>
Preguntes Freqüents
</h1> <p class="text-gray-600 max-w-2xl mx-auto" data-astro-cid-6kmwghhu>
Troba respostes a les preguntes més comunes sobre FreshExpress. Si
            no trobes el que busques, contacta amb nosaltres.
</p> </div> <!-- Cerca --> <div class="mb-10" data-astro-cid-6kmwghhu> <div class="relative" data-astro-cid-6kmwghhu> <input type="text" id="faq-search" placeholder="Cerca una pregunta..." class="w-full px-5 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3BB143] focus:border-transparent" data-astro-cid-6kmwghhu> <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-6kmwghhu></path> </svg> </div> </div> <!-- Categories --> <div class="flex flex-wrap gap-2 mb-8 justify-center" data-astro-cid-6kmwghhu> <button class="faq-filter active px-4 py-2 rounded-full text-sm font-medium bg-[#3BB143] text-white" data-category="all" data-astro-cid-6kmwghhu>
Totes
</button> <button class="faq-filter px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200" data-category="comandes" data-astro-cid-6kmwghhu>
Comandes
</button> <button class="faq-filter px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200" data-category="lliurament" data-astro-cid-6kmwghhu>
Lliurament
</button> <button class="faq-filter px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200" data-category="pagament" data-astro-cid-6kmwghhu>
Pagament
</button> <button class="faq-filter px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200" data-category="compte" data-astro-cid-6kmwghhu>
Compte
</button> <button class="faq-filter px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200" data-category="sostenibilitat" data-astro-cid-6kmwghhu>
Sostenibilitat
</button> </div> <!-- FAQ Items --> <div class="space-y-4" id="faq-list" data-astro-cid-6kmwghhu> <!-- Comandes --> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="comandes" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Com puc fer una comanda?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>Per fer una comanda a FreshExpress:</p> <ol class="list-decimal pl-5 mt-2 space-y-1" data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>Registra't o inicia sessió al teu compte</li> <li data-astro-cid-6kmwghhu>Navega pels productes i afegeix-los a la cistella</li> <li data-astro-cid-6kmwghhu>Revisa la cistella i fes clic a "Tramitar comanda"</li> <li data-astro-cid-6kmwghhu>Selecciona l'adreça de lliurament</li> <li data-astro-cid-6kmwghhu>Confirma el pagament</li> </ol> </div> </div> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="comandes" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Puc cancel·lar una comanda?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
Sí, pots cancel·lar una comanda sempre que encara no s'hagi
                començat a preparar. Accedeix al teu historial de comandes i
                selecciona "Cancel·lar" si l'opció està disponible. Si la
                comanda ja s'està preparant, contacta amb nosaltres
                immediatament.
</p> </div> </div> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="comandes" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Quin és el mínim de comanda?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
El mínim de comanda és de 15€. Aquest import ens permet oferir
                un servei de lliurament sostenible i de qualitat. Les despeses
                d'enviament són gratuïtes per a comandes superiors a 30€.
</p> </div> </div> <!-- Lliurament --> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="lliurament" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Quins són els horaris de lliurament?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
Lliurem de dilluns a dissabte de 8:00 a 21:00. Pots seleccionar
                una franja horària de 2 hores durant el procés de compra. Els
                diumenges i festius no realitzem lliuraments.
</p> </div> </div> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="lliurament" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Com puc fer el seguiment de la meva comanda?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>Pots fer el seguiment de la teva comanda de dues maneres:</p> <ul class="list-disc pl-5 mt-2 space-y-1" data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>Des del teu dashboard, a la secció "Les meves comandes"</li> <li data-astro-cid-6kmwghhu>
Amb el codi de seguiment a la pàgina de <a href="/rastreig" class="text-[#3BB143] hover:underline" data-astro-cid-6kmwghhu>Rastreig</a> </li> </ul> <p class="mt-2" data-astro-cid-6kmwghhu>
Rebràs notificacions per email quan l'estat de la comanda
                canviï.
</p> </div> </div> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="lliurament" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Què passa si no estic a casa quan arriba el repartidor?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
El repartidor intentarà contactar-te per telèfon. Si no respon
                ningú, esperarà 5 minuts i deixarà un avís. Ens posarem en
                contacte per reprogramar el lliurament. Recorda que pots indicar
                instruccions especials (deixar amb el veí, porter, etc.) durant
                la compra.
</p> </div> </div> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="lliurament" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>A quines zones lliureu?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
Actualment lliurem a Barcelona i l'àrea metropolitana. Pots
                comprovar si la teva zona té cobertura a la nostra pàgina de <a href="/cobertura" class="text-[#3BB143] hover:underline" data-astro-cid-6kmwghhu>Cobertura</a>. Estem expandint constantment les nostres zones de lliurament!
</p> </div> </div> <!-- Pagament --> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="pagament" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Quins mètodes de pagament accepteu?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>Acceptem els següents mètodes de pagament:</p> <ul class="list-disc pl-5 mt-2 space-y-1" data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>
Targetes de crèdit/dèbit (Visa, Mastercard, American Express)
</li> <li data-astro-cid-6kmwghhu>PayPal</li> <li data-astro-cid-6kmwghhu>Google Pay / Apple Pay</li> <li data-astro-cid-6kmwghhu>Transferència bancària (per a empreses)</li> </ul> </div> </div> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="pagament" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Les meves dades de pagament són segures?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
Absolutament! Utilitzem encriptació SSL de 256 bits i complim
                amb els estàndards PCI-DSS. Mai emmagatzemem les dades completes
                de la teva targeta als nostres servidors. Tots els pagaments es
                processen a través de passarel·les de pagament certificades.
</p> </div> </div> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="pagament" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Com puc sol·licitar una factura?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
Pots sol·licitar una factura des de la configuració del teu
                compte, afegint les dades fiscals. Un cop configurades, totes
                les comandes inclouran factura automàticament. També pots
                descarregar factures de comandes anteriors des del teu
                historial.
</p> </div> </div> <!-- Compte --> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="compte" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Com puc canviar la meva contrasenya?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
Pots canviar la contrasenya des de la pàgina de <a href="/configuracio" class="text-[#3BB143] hover:underline" data-astro-cid-6kmwghhu>Configuració</a>
del teu compte. Si has oblidat la contrasenya, utilitza l'opció
<a href="/recuperar-contrasenya" class="text-[#3BB143] hover:underline" data-astro-cid-6kmwghhu>"He oblidat la contrasenya"</a> a la pàgina d'inici de sessió.
</p> </div> </div> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="compte" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Com puc eliminar el meu compte?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
Pots sol·licitar l'eliminació del teu compte des de la pàgina de
                Configuració, a la secció "Zona de perill". Tingues en compte
                que aquesta acció és irreversible i es perdran totes les dades
                associades al compte, incloent l'historial de comandes.
</p> </div> </div> <!-- Sostenibilitat --> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="sostenibilitat" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Com és el vostre compromís ecològic?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>La sostenibilitat és al cor de FreshExpress:</p> <ul class="list-disc pl-5 mt-2 space-y-1" data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu> <strong data-astro-cid-6kmwghhu>Vehicles elèctrics:</strong> Tota la nostra flota és 100%
                  elèctrica
</li> <li data-astro-cid-6kmwghhu> <strong data-astro-cid-6kmwghhu>Embalatges ecològics:</strong> Utilitzem materials reciclats
                  i biodegradables
</li> <li data-astro-cid-6kmwghhu> <strong data-astro-cid-6kmwghhu>Optimització de rutes:</strong> Minimitzem el quilometratge
                  amb rutes intel·ligents
</li> <li data-astro-cid-6kmwghhu> <strong data-astro-cid-6kmwghhu>Compensació de CO₂:</strong> Calculem i compensem les emissions
                  residuals
</li> </ul> </div> </div> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="sostenibilitat" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Com calculeu el CO₂ estalviat?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
Calculem el CO₂ estalviat comparant les emissions que generaria
                un lliurament tradicional amb vehicle de combustió versus el
                nostre lliurament elèctric. Tenim en compte factors com:
</p> <ul class="list-disc pl-5 mt-2 space-y-1" data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>Distància recorreguda</li> <li data-astro-cid-6kmwghhu>Tipus de vehicle (bici, patinet, furgoneta elèctrica)</li> <li data-astro-cid-6kmwghhu>Consolidació de comandes en una mateixa ruta</li> <li data-astro-cid-6kmwghhu>Origen de l'energia elèctrica utilitzada</li> </ul> </div> </div> <div class="faq-item border border-gray-200 rounded-xl overflow-hidden" data-category="sostenibilitat" data-astro-cid-6kmwghhu> <button class="faq-question w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50" data-astro-cid-6kmwghhu> <span class="font-medium text-gray-900" data-astro-cid-6kmwghhu>Puc ser repartidor amb FreshExpress?</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-6kmwghhu></path> </svg> </button> <div class="faq-answer hidden px-6 pb-4 text-gray-600" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>
Sí! Busquem repartidors compromesos amb el medi ambient. Per
                unir-te:
</p> <ol class="list-decimal pl-5 mt-2 space-y-1" data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>Registra't com a usuari</li> <li data-astro-cid-6kmwghhu>Accedeix a la Configuració del teu compte</li> <li data-astro-cid-6kmwghhu>Sol·licita convertir-te en repartidor</li> <li data-astro-cid-6kmwghhu>Espera l'aprovació del nostre equip</li> </ol> <p class="mt-2" data-astro-cid-6kmwghhu>
Consulta els <a href="/termes-repartidor" class="text-[#3BB143] hover:underline" data-astro-cid-6kmwghhu>Termes per a Repartidors</a> per més informació.
</p> </div> </div> </div> <!-- No has trobat resposta? --> <div class="mt-12 text-center bg-gray-50 rounded-xl p-8" data-astro-cid-6kmwghhu> <h2 class="text-xl font-bold text-gray-900 mb-2" data-astro-cid-6kmwghhu>
No has trobat el que buscaves?
</h2> <p class="text-gray-600 mb-4" data-astro-cid-6kmwghhu>
El nostre equip està aquí per ajudar-te!
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center" data-astro-cid-6kmwghhu> <a href="/contacte" class="inline-flex items-center justify-center px-6 py-3 bg-[#3BB143] text-white rounded-lg hover:bg-[#32a039] transition-colors" data-astro-cid-6kmwghhu> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-astro-cid-6kmwghhu></path> </svg>
Contacta'ns
</a> <a href="/suport" class="inline-flex items-center justify-center px-6 py-3 border border-[#0047AB] text-[#0047AB] rounded-lg hover:bg-[#0047AB] hover:text-white transition-colors" data-astro-cid-6kmwghhu> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-6kmwghhu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" data-astro-cid-6kmwghhu></path> </svg>
Centre de Suport
</a> </div> </div> </div> </div> </div> ` }));
}, "C:/dev/FreshExpress/src/pages/faq.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/faq.astro";
const $$url = "/faq";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Faq,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
