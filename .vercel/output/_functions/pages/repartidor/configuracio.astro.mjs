/* empty css                                    */
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_D9o_KgyY.mjs';
import { v as verifyToken, g as getUserById } from '../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Configuracio = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Configuracio;
  const token = Astro2.cookies.get("auth_token")?.value;
  let user = null;
  let repartidor = null;
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      user = await getUserById(payload.userId);
    }
  }
  if (!user || user.rol !== "repartidor") {
    return Astro2.redirect("/dashboard");
  }
  try {
    const repartidorData = await queryOperacional(
      "SELECT * FROM repartidores WHERE usuario_id = ?",
      [user.id]
    );
    repartidor = repartidorData[0] || null;
  } catch (error) {
    console.error("Error obtenint dades repartidor:", error);
  }
  const vehiculosTipus = [
    { value: "bicicleta", label: "Bicicleta", icon: "\u{1F6B2}" },
    { value: "moto", label: "Moto", icon: "\u{1F3CD}\uFE0F" },
    { value: "coche", label: "Cotxe", icon: "\u{1F697}" },
    { value: "furgoneta", label: "Furgoneta", icon: "\u{1F690}" },
    { value: "a_pie", label: "A peu", icon: "\u{1F6B6}" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Configuraci\xF3 - Repartidor - FreshExpress" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100 py-6"> <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Navegació --> <div class="mb-6"> <a href="/repartidor" class="text-[#3BB143] hover:text-[#32a039] text-sm font-medium flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Tornar al panell
</a> </div> <h1 class="text-2xl font-bold text-gray-900 mb-6">
Configuració del repartidor
</h1> <form id="config-form" class="space-y-6"> <!-- Tipus de vehicle --> <div class="bg-white rounded-xl shadow p-6"> <h2 class="font-semibold text-gray-900 mb-4">Vehicle</h2> <div class="grid grid-cols-2 md:grid-cols-5 gap-3"> ${vehiculosTipus.map((v) => renderTemplate`<label${addAttribute(`relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${repartidor?.vehiculo_tipo === v.value ? "border-[#3BB143] bg-green-50" : "border-gray-200 hover:border-gray-300"}`, "class")}> <input type="radio" name="vehiculo_tipo"${addAttribute(v.value, "value")}${addAttribute(repartidor?.vehiculo_tipo === v.value, "checked")} class="sr-only"> <span class="text-2xl mb-1">${v.icon}</span> <span class="text-sm text-gray-700">${v.label}</span> </label>`)} </div> <div class="mt-4"> <label class="block text-sm font-medium text-gray-700 mb-1">Matrícula (opcional)</label> <input type="text" name="matricula"${addAttribute(repartidor?.matricula || "", "value")} placeholder="0000 XXX" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent outline-none"> </div> </div> <!-- Zona i radi --> <div class="bg-white rounded-xl shadow p-6"> <h2 class="font-semibold text-gray-900 mb-4">Zona de treball</h2> <div class="space-y-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Zona preferida</label> <select name="zona_preferida" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent outline-none"> <option value="">Sense preferència</option> <option value="Ciutat Vella"${addAttribute(repartidor?.zona_preferida === "Ciutat Vella", "selected")}>Ciutat Vella</option> <option value="Eixample"${addAttribute(repartidor?.zona_preferida === "Eixample", "selected")}>Eixample</option> <option value="Gràcia"${addAttribute(repartidor?.zona_preferida === "Gr\xE0cia", "selected")}>Gràcia</option> <option value="Sant Martí"${addAttribute(repartidor?.zona_preferida === "Sant Mart\xED", "selected")}>Sant Martí</option> <option value="Sants-Montjuïc"${addAttribute(repartidor?.zona_preferida === "Sants-Montju\xEFc", "selected")}>Sants-Montjuïc</option> <option value="Sarrià-Sant Gervasi"${addAttribute(repartidor?.zona_preferida === "Sarri\xE0-Sant Gervasi", "selected")}>Sarrià-Sant Gervasi</option> <option value="Les Corts"${addAttribute(repartidor?.zona_preferida === "Les Corts", "selected")}>Les Corts</option> <option value="Horta-Guinardó"${addAttribute(repartidor?.zona_preferida === "Horta-Guinard\xF3", "selected")}>Horta-Guinardó</option> <option value="Nou Barris"${addAttribute(repartidor?.zona_preferida === "Nou Barris", "selected")}>Nou Barris</option> <option value="Sant Andreu"${addAttribute(repartidor?.zona_preferida === "Sant Andreu", "selected")}>Sant Andreu</option> </select> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Radi màxim (km)</label> <div class="flex items-center gap-4"> <input type="range" name="radio_km" min="1" max="15" step="0.5"${addAttribute(repartidor?.radio_km || 5, "value")} class="flex-1" id="radio-slider"> <span id="radio-value" class="text-sm font-medium text-gray-900 w-12 text-right">${repartidor?.radio_km || 5} km</span> </div> </div> </div> </div> <!-- Documentació --> <div class="bg-white rounded-xl shadow p-6"> <h2 class="font-semibold text-gray-900 mb-4">Documentació</h2> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Llicència de conduir (opcional)</label> <input type="text" name="licencia_conducir"${addAttribute(repartidor?.licencia_conducir || "", "value")} placeholder="Número de llicència" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent outline-none"> </div> </div> <!-- Missatges --> <div id="error-message" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"></div> <div id="success-message" class="hidden bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"></div> <button type="submit" class="w-full py-3 bg-[#3BB143] text-white font-semibold rounded-lg hover:bg-[#32a039] transition-colors">
Desar canvis
</button> </form> </div> </div> ` })} ${renderScript($$result, "C:/dev/FreshExpress/src/pages/repartidor/configuracio.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dev/FreshExpress/src/pages/repartidor/configuracio.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/repartidor/configuracio.astro";
const $$url = "/repartidor/configuracio";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Configuracio,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
