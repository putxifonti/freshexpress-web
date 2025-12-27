/* empty css                                    */
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute, x as Fragment } from '../../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_D9o_KgyY.mjs';
import { v as verifyToken, g as getUserById } from '../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Ruta = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Ruta;
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
  let ruta = [];
  try {
    ruta = await queryOperacional(`
    SELECT 
      p.id,
      p.numero_pedido,
      p.direccion_entrega,
      u.telefono as telefono_cliente,
      u.nombre as nombre_cliente,
      p.notas_cliente as notas_entrega,
      p.tiempo_estimado_min,
      p.estado,
      p.total
    FROM pedidos p
    JOIN usuarios u ON p.cliente_id = u.id
    WHERE p.repartidor_id = ? 
    AND p.estado NOT IN ('entregado', 'cancelado')
    ORDER BY 
      CASE p.estado 
        WHEN 'en_camino' THEN 1 
        WHEN 'listo' THEN 2 
        WHEN 'confirmado' THEN 3 
        WHEN 'pendiente' THEN 4 
        ELSE 5 
      END,
      p.fecha_pedido ASC
  `, [repartidor?.id || 0]);
  } catch (error) {
    console.error("Error obtenint ruta:", error);
  }
  const entregaActual = ruta.find((e) => e.estado === "en_camino") || ruta.find((e) => e.estado === "listo") || null;
  const entreguesPendents = ruta.filter((e) => e.estado !== "entregado" && e.estado !== "cancelado");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Ruta Actual - Repartidor - FreshExpress" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100"> <!-- Header de la ruta --> <div class="bg-[#3BB143] text-white py-6"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-between"> <div> <a href="/repartidor" class="text-white/80 hover:text-white text-sm flex items-center mb-2"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Tornar al panell
</a> <h1 class="text-2xl font-bold">Ruta Actual</h1> <p class="text-white/80 text-sm"> ${entreguesPendents.length} entregues pendents
</p> </div> ${entreguesPendents.length > 0 && renderTemplate`<button id="btn-optimitzar" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg>
Optimitzar ruta
</button>`} </div> </div> </div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> ${ruta.length === 0 ? renderTemplate`<div class="bg-white rounded-xl shadow p-12 text-center"> <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path> </svg> <h3 class="text-lg font-medium text-gray-900 mb-2">No tens cap ruta activa</h3> <p class="text-gray-500 mb-6">Torna al panell per acceptar noves entregues</p> <a href="/repartidor" class="inline-flex items-center px-4 py-2 bg-[#3BB143] text-white rounded-lg hover:bg-[#32a039] transition-colors">
Anar al panell
</a> </div>` : renderTemplate`<div class="grid lg:grid-cols-3 gap-6"> <!-- Mapa (placeholder) --> <div class="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden"> <div class="h-[500px] bg-gray-200 relative"> <!-- Aquí aniria el mapa real (Google Maps, Mapbox, etc.) --> <div class="absolute inset-0 flex items-center justify-center flex-col"> <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path> </svg> <p class="text-gray-500 font-medium">Mapa de ruta</p> <p class="text-gray-400 text-sm">Integració amb Google Maps pendent</p> </div> <!-- Marcadors de les entregues --> <div class="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs"> <div class="text-sm font-medium text-gray-900 mb-2">Resum de ruta</div> ${ruta.slice(0, 3).map((e, i) => renderTemplate`<div${addAttribute(`flex items-start gap-2 ${i > 0 ? "mt-2 pt-2 border-t" : ""}`, "class")}> <div${addAttribute(`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${e.estado === "en_proceso" ? "bg-blue-500 text-white" : e.estado === "entregado" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`, "class")}> ${i + 1} </div> <div class="flex-1 min-w-0"> <p class="text-xs font-medium text-gray-900 truncate">${e.direccion_entrega}</p> <p class="text-xs text-gray-500">${e.tiempo_estimado_min || "?"} min</p> </div> </div>`)} ${ruta.length > 3 && renderTemplate`<p class="text-xs text-gray-400 mt-2">+${ruta.length - 3} més</p>`} </div> </div> </div> <!-- Llista d'entregues --> <div class="space-y-4">  ${entregaActual && renderTemplate`<div class="bg-white rounded-xl shadow border-2 border-[#3BB143] overflow-hidden"> <div class="bg-[#3BB143] text-white px-4 py-2 text-sm font-medium">
Pròxima entrega
</div> <div class="p-4"> <div class="flex items-start gap-3"> <div class="w-10 h-10 rounded-full bg-[#3BB143] text-white flex items-center justify-center font-bold"> ${entregaActual.orden || 1} </div> <div class="flex-1"> <h3 class="font-semibold text-gray-900">${entregaActual.nombre_cliente}</h3> <p class="text-sm text-gray-600 mt-1">${entregaActual.direccion_entrega}</p> <p class="text-sm text-gray-500">${entregaActual.codigo_postal}</p> ${entregaActual.telefono_cliente && renderTemplate`<a${addAttribute(`tel:${entregaActual.telefono_cliente}`, "href")} class="inline-flex items-center text-sm text-[#3BB143] hover:underline mt-2"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path> </svg> ${entregaActual.telefono_cliente} </a>`} ${entregaActual.notas_entrega && renderTemplate`<div class="mt-3 p-2 bg-yellow-50 border border-yellow-100 rounded-lg"> <p class="text-xs text-yellow-800">${entregaActual.notas_entrega}</p> </div>`} <div class="flex gap-2 mt-4">  ${entregaActual.estado === "confirmado" && renderTemplate`<button${addAttribute(entregaActual.id, "data-id")} data-nou-estat="listo" class="btn-canvi-estat flex-1 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path> </svg>
Productes recollits
</button>`} ${entregaActual.estado === "listo" && renderTemplate`<button${addAttribute(entregaActual.id, "data-id")} data-nou-estat="en_camino" class="btn-canvi-estat flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path> </svg>
Començar entrega
</button>`} ${entregaActual.estado === "en_camino" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <button${addAttribute(entregaActual.id, "data-id")} class="btn-navegar flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg>
Navegar
</button> <button${addAttribute(entregaActual.id, "data-id")} class="btn-entregat flex-1 bg-[#3BB143] hover:bg-[#32a039] text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
✓ Entregat
</button> ` })}`} <button${addAttribute(entregaActual.id, "data-id")} class="btn-problema bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-lg transition-colors" title="Reportar problema"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path> </svg> </button> </div>  <div class="mt-3 pt-3 border-t"> <p class="text-xs text-gray-500 mb-2">Estat actual:</p> <div class="flex items-center gap-2"> <span${addAttribute(`px-2 py-1 rounded-full text-xs font-medium ${entregaActual.estado === "confirmado" ? "bg-blue-100 text-blue-700" : entregaActual.estado === "listo" ? "bg-purple-100 text-purple-700" : entregaActual.estado === "en_camino" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`, "class")}> ${entregaActual.estado === "confirmado" ? "\u{1F4CB} Confirmat - Pendent recollida" : entregaActual.estado === "listo" ? "\u{1F4E6} Productes recollits" : entregaActual.estado === "en_camino" ? "\u{1F6B4} En cam\xED al client" : entregaActual.estado} </span> </div> </div> </div> </div> </div> </div>`}  <div class="bg-white rounded-xl shadow divide-y"> <div class="px-4 py-3 border-b"> <h2 class="font-semibold text-gray-900">Totes les entregues</h2> </div> ${ruta.map((entrega, index) => renderTemplate`<div${addAttribute(`p-4 ${entrega.id === entregaActual?.id ? "bg-green-50" : ""}`, "class")}> <div class="flex items-start gap-3"> <div${addAttribute(`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${entrega.estado === "entregado" ? "bg-green-500 text-white" : entrega.estado === "en_proceso" ? "bg-blue-500 text-white" : entrega.estado === "fallido" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"}`, "class")}> ${entrega.estado === "entregado" ? renderTemplate`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>` : entrega.estado === "fallido" ? renderTemplate`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg>` : index + 1} </div> <div class="flex-1 min-w-0"> <p${addAttribute(`font-medium ${entrega.estado === "entregado" ? "text-gray-400 line-through" : "text-gray-900"}`, "class")}> ${entrega.nombre_cliente} </p> <p${addAttribute(`text-sm ${entrega.estado === "entregado" ? "text-gray-400" : "text-gray-600"} truncate`, "class")}> ${entrega.direccion_entrega} </p> ${entrega.tiempo_estimado_min && renderTemplate`<p class="text-xs text-gray-400 mt-1">
~${entrega.tiempo_estimado_min} min · ${entrega.distancia_km} km
</p>`} </div> ${entrega.estado === "pendiente" && entrega.id !== entregaActual?.id && renderTemplate`<div class="flex gap-1"> <button${addAttribute(entrega.id, "data-id")}${addAttribute(index, "data-ordre")} class="btn-up text-gray-400 hover:text-gray-600 p-1"${addAttribute(index === 0, "disabled")}> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path> </svg> </button> <button${addAttribute(entrega.id, "data-id")}${addAttribute(index, "data-ordre")} class="btn-down text-gray-400 hover:text-gray-600 p-1"${addAttribute(index === ruta.length - 1, "disabled")}> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> </div>`} </div> </div>`)} </div> </div> </div>`} </div> </div>  <div id="modal-problema" class="fixed inset-0 bg-black/50 items-center justify-center z-50" style="display: none;"> <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"> <h3 class="text-lg font-bold text-gray-900 mb-4">Reportar problema</h3> <input type="hidden" id="problema-entrega-id"> <div class="space-y-3 mb-4"> <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"> <input type="radio" name="motiu" value="no_contesta" class="text-[#3BB143]"> <span class="text-sm">El client no contesta</span> </label> <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"> <input type="radio" name="motiu" value="direccio_incorrecta" class="text-[#3BB143]"> <span class="text-sm">Direcció incorrecta</span> </label> <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"> <input type="radio" name="motiu" value="client_absent" class="text-[#3BB143]"> <span class="text-sm">Client absent</span> </label> <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"> <input type="radio" name="motiu" value="altre" class="text-[#3BB143]"> <span class="text-sm">Altre motiu</span> </label> </div> <textarea id="problema-notes" placeholder="Notes addicionals (opcional)" class="w-full px-3 py-2 border rounded-lg text-sm resize-none h-20 mb-4"></textarea> <div class="flex gap-3"> <button id="btn-cancel-problema" class="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
Cancel·lar
</button> <button id="btn-confirm-problema" class="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">
Reportar
</button> </div> </div> </div> ` })} ${renderScript($$result, "C:/dev/FreshExpress/src/pages/repartidor/ruta.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dev/FreshExpress/src/pages/repartidor/ruta.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/repartidor/ruta.astro";
const $$url = "/repartidor/ruta";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Ruta,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
