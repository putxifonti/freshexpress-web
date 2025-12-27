/* empty css                                 */
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9o_KgyY.mjs';
import { v as verifyToken, g as getUserById, b as getUserConsents } from '../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Configuracio = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Configuracio;
  const token = Astro2.cookies.get("auth_token")?.value;
  let user = null;
  let consents = null;
  let solicitudRepartidor = null;
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      user = await getUserById(payload.userId);
      consents = await getUserConsents(payload.userId);
      if (user && user.rol === "cliente") {
        try {
          const solicituds = await queryOperacional(
            "SELECT * FROM solicitudes_repartidor WHERE usuario_id = ? ORDER BY fecha_solicitud DESC LIMIT 1",
            [user.id]
          );
          solicitudRepartidor = solicituds?.[0] || null;
        } catch (error) {
          console.log("Taula solicitudes_repartidor no existeix o error:", error);
        }
      }
    }
  }
  if (!user) {
    return Astro2.redirect("/login");
  }
  if (user.rol === "repartidor") {
    return Astro2.redirect("/repartidor/configuracio");
  }
  if (user.rol === "admin") {
    return Astro2.redirect("/admin/dashboard");
  }
  const vehiculosTipus = [
    { value: "bicicleta", label: "Bicicleta", icon: "\u{1F6B2}" },
    { value: "moto", label: "Moto", icon: "\u{1F3CD}\uFE0F" },
    { value: "coche", label: "Cotxe", icon: "\u{1F697}" },
    { value: "furgoneta", label: "Furgoneta", icon: "\u{1F690}" },
    { value: "a_pie", label: "A peu", icon: "\u{1F6B6}" }
  ];
  const zonesBCN = [
    "Ciutat Vella",
    "Eixample",
    "Gr\xE0cia",
    "Sant Mart\xED",
    "Sants-Montju\xEFc",
    "Sarri\xE0-Sant Gervasi",
    "Les Corts",
    "Horta-Guinard\xF3",
    "Nou Barris",
    "Sant Andreu"
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Configuraci\xF3 del compte - FreshExpress" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 py-8"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Capçalera --> <div class="mb-8"> <a href="/dashboard" class="text-[#3BB143] hover:text-[#32a039] text-sm font-medium flex items-center mb-4"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Tornar al dashboard
</a> <h1 class="text-3xl font-bold text-gray-900">
Configuració del compte
</h1> <p class="text-gray-600 mt-2">
Gestiona les teves dades personals i preferències
</p> </div> <div class="space-y-6"> <!-- Informació personal --> <section class="bg-white rounded-2xl shadow-lg p-6"> <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center"> <svg class="w-6 h-6 mr-2 text-[#0047AB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg>
Informació personal
</h2> <form id="profile-form" class="space-y-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label> <input type="text" name="nombre"${addAttribute(user.nombre, "value")} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent"> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Email</label> <input type="email" name="email"${addAttribute(user.email, "value")} disabled class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"> <p class="text-xs text-gray-500 mt-1">
L'email no es pot canviar
</p> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Telèfon</label> <input type="tel" name="telefono"${addAttribute(user.telefono || "", "value")} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent"> </div> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Adreça d'enviament</label> <input type="text" name="direccion"${addAttribute(user.direccion || "", "value")} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent" placeholder="Carrer, número, pis..."> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Ciutat</label> <input type="text" name="ciudad"${addAttribute(user.ciudad || "", "value")} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent"> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Codi postal</label> <input type="text" name="codigo_postal"${addAttribute(user.codigo_postal || "", "value")} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent"> </div> </div> <div class="pt-4"> <button type="submit" class="px-6 py-2 bg-[#3BB143] text-white font-semibold rounded-lg hover:bg-[#32a039] transition-colors">
Guardar canvis
</button> </div> </form> </section> <!-- Canviar contrasenya --> <section class="bg-white rounded-2xl shadow-lg p-6"> <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center"> <svg class="w-6 h-6 mr-2 text-[#0047AB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg>
Canviar contrasenya
</h2> <form id="password-form" class="space-y-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Contrasenya actual</label> <input type="password" name="current_password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent"> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Nova contrasenya</label> <input type="password" name="new_password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent"> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar nova contrasenya</label> <input type="password" name="confirm_password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB143] focus:border-transparent"> </div> </div> <div class="pt-4"> <button type="submit" class="px-6 py-2 bg-[#0047AB] text-white font-semibold rounded-lg hover:bg-[#003a8c] transition-colors">
Canviar contrasenya
</button> </div> </form> </section> <!-- Gestió de consentiments --> <section id="consentiments" class="bg-white rounded-2xl shadow-lg p-6"> <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center"> <svg class="w-6 h-6 mr-2 text-[#3BB143]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg>
Gestió de consentiments
</h2> <form id="consents-form" class="space-y-4"> <div class="flex items-start p-4 bg-gray-50 rounded-lg"> <input type="checkbox" id="consent-marketing" name="acepta_comunicaciones"${addAttribute(consents?.acepta_comunicaciones, "checked")} class="w-5 h-5 text-[#3BB143] border-gray-300 rounded focus:ring-[#3BB143] mt-0.5"> <label for="consent-marketing" class="ml-3"> <span class="font-medium text-gray-900">Comunicacions comercials</span> <p class="text-sm text-gray-600">
Rebre ofertes personalitzades i novetats per email.
</p> </label> </div> <div class="flex items-start p-4 bg-gray-50 rounded-lg"> <input type="checkbox" id="consent-analytics" name="analytics"${addAttribute(consents?.analytics, "checked")} class="w-5 h-5 text-[#3BB143] border-gray-300 rounded focus:ring-[#3BB143] mt-0.5"> <label for="consent-analytics" class="ml-3"> <span class="font-medium text-gray-900">Anàlisi de comportament</span> <p class="text-sm text-gray-600">
Permetre l'anàlisi de navegació per millorar el servei.
</p> </label> </div> <div class="flex items-start p-4 bg-green-50 rounded-lg border border-green-100"> <input type="checkbox" id="consent-databroker" name="compartir_datos"${addAttribute(consents?.compartir_datos, "checked")} class="w-5 h-5 text-[#3BB143] border-gray-300 rounded focus:ring-[#3BB143] mt-0.5"> <label for="consent-databroker" class="ml-3"> <span class="font-medium text-[#3BB143]">Programa Data for Good</span> <p class="text-sm text-gray-600">
Participar en el programa ètic de dades amb beneficis
                  exclusius.
<a href="/politica-dades" class="text-[#3BB143] hover:underline">Més informació →</a> </p> </label> </div> <div class="flex items-start p-4 bg-gray-50 rounded-lg"> <input type="checkbox" id="consent-newsletter" name="recibir_ofertas"${addAttribute(consents?.recibir_ofertas, "checked")} class="w-5 h-5 text-[#3BB143] border-gray-300 rounded focus:ring-[#3BB143] mt-0.5"> <label for="consent-newsletter" class="ml-3"> <span class="font-medium text-gray-900">Newsletter setmanal</span> <p class="text-sm text-gray-600">
Rebre la newsletter amb consells de sostenibilitat.
</p> </label> </div> <div class="pt-4"> <button type="submit" class="px-6 py-2 bg-[#3BB143] text-white font-semibold rounded-lg hover:bg-[#32a039] transition-colors">
Actualitzar consentiments
</button> </div> </form> </section> <!-- Convertir-se en repartidor --> <section class="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100"> <h2 class="text-xl font-bold text-orange-600 mb-4 flex items-center"> <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path> </svg>
Convertir-se en repartidor
</h2> ${solicitudRepartidor?.estat === "pendent" ? renderTemplate`<div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200"> <div class="flex items-center"> <svg class="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <span class="font-medium text-yellow-700">
Sol·licitud pendent de revisió
</span> </div> <p class="text-sm text-yellow-600 mt-2">
La teva sol·licitud està sent revisada. T'avisarem per email
                  quan tinguem una resposta.
</p> </div>` : solicitudRepartidor?.estat === "rebutjada" ? renderTemplate`<div class="p-4 bg-red-50 rounded-lg border border-red-200 mb-4"> <div class="flex items-center"> <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> <span class="font-medium text-red-700">
Sol·licitud anterior rebutjada
</span> </div> <p class="text-sm text-red-600 mt-2"> ${solicitudRepartidor.motiu_rebuig || "Pots tornar a sol\xB7licitar-ho si ho desitges."} </p> </div>` : null} ${(!solicitudRepartidor || solicitudRepartidor?.estat === "rebutjada") && renderTemplate`<div> <p class="text-gray-600 mb-4">
Vols guanyar diners extra fent entregues amb FreshExpress?
                  Omple el formulari i ens posarem en contacte amb tu.
</p> <form id="repartidor-form" class="space-y-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-2">
Tipus de vehicle
</label> <div class="grid grid-cols-2 md:grid-cols-5 gap-3"> ${vehiculosTipus.map((v) => renderTemplate`<label class="vehicle-option relative flex flex-col items-center p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-orange-300 transition-all"> <input type="radio" name="vehiculo_tipo"${addAttribute(v.value, "value")} class="sr-only" required> <span class="text-2xl mb-1">${v.icon}</span> <span class="text-xs text-gray-700">${v.label}</span> </label>`)} </div> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">
Zona preferida de treball
</label> <select name="zona_preferida" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"> <option value="">Selecciona una zona...</option> ${zonesBCN.map((zona) => renderTemplate`<option${addAttribute(zona, "value")}>${zona}</option>`)} </select> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-1">
DNI/NIE
</label> <input type="text" name="dni" required placeholder="12345678A" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">
Telèfon de contacte
</label> <input type="tel" name="telefono" required placeholder="612 345 678"${addAttribute(user.telefono || "", "value")} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"> </div> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">
Disponibilitat horària
</label> <div class="grid grid-cols-2 md:grid-cols-4 gap-2"> <label class="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50"> <input type="checkbox" name="disponibilitat[]" value="matins" class="mr-2 text-orange-500"> <span class="text-sm">Matins</span> </label> <label class="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50"> <input type="checkbox" name="disponibilitat[]" value="migdies" class="mr-2 text-orange-500"> <span class="text-sm">Migdies</span> </label> <label class="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50"> <input type="checkbox" name="disponibilitat[]" value="tardes" class="mr-2 text-orange-500"> <span class="text-sm">Tardes</span> </label> <label class="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50"> <input type="checkbox" name="disponibilitat[]" value="caps_setmana" class="mr-2 text-orange-500"> <span class="text-sm">Caps de setmana</span> </label> </div> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">
Per què vols ser repartidor? (opcional)
</label> <textarea name="motivacio" rows="3" placeholder="Explica'ns breument..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"></textarea> </div> <div class="flex items-start p-4 bg-orange-50 rounded-lg"> <input type="checkbox" id="accept-terms" required class="mt-1 mr-3"> <label for="accept-terms" class="text-sm text-gray-700">
Accepto els${" "} <a href="/termes-repartidor" class="text-orange-600 hover:underline">
termes i condicions
</a>
per a repartidors i confirmo que les dades proporcionades
                      són correctes.
</label> </div> <button type="submit" id="submit-repartidor" class="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path> </svg>
Enviar sol·licitud
</button> </form> </div>`} </section> <!-- Zona de perill --> <section class="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100"> <h2 class="text-xl font-bold text-red-600 mb-6 flex items-center"> <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path> </svg>
Zona de perill
</h2> <div class="space-y-4"> <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg"> <div> <h3 class="font-medium text-gray-900">Eliminar compte</h3> <p class="text-sm text-gray-600">
Eliminar permanentment el teu compte i totes les dades.
</p> </div> <button id="delete-account-btn" class="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
Eliminar
</button> </div> </div> </section> </div> </div> </div> ` })} ${renderScript($$result, "C:/dev/FreshExpress/src/pages/configuracio.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dev/FreshExpress/src/pages/configuracio.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/configuracio.astro";
const $$url = "/configuracio";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Configuracio,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
