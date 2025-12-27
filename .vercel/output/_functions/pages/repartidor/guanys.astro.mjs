/* empty css                                    */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_D9o_KgyY.mjs';
import { v as verifyToken, g as getUserById } from '../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Guanys = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Guanys;
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
  let guanys = {
    avui: 0,
    setmana: 0,
    mes: 0,
    totalEntregues: repartidor?.entregas_completadas || 0
  };
  let entreguesPerDia = [];
  try {
    const avuiData = await queryOperacional(
      `
    SELECT COUNT(*) as entregas, COALESCE(SUM(propina), 0) as propinas
    FROM pedidos 
    WHERE repartidor_id = ? AND DATE(fecha_entrega) = CURDATE() AND estado = 'entregado'
  `,
      [repartidor?.id || 0]
    );
    if (avuiData[0]) {
      guanys.avui = Number(avuiData[0].entregas) * 2 + Number(avuiData[0].propinas);
    }
    const setmanaData = await queryOperacional(
      `
    SELECT COUNT(*) as entregas, COALESCE(SUM(propina), 0) as propinas
    FROM pedidos 
    WHERE repartidor_id = ? 
    AND fecha_entrega >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
    AND estado = 'entregado'
  `,
      [repartidor?.id || 0]
    );
    if (setmanaData[0]) {
      guanys.setmana = Number(setmanaData[0].entregas) * 2 + Number(setmanaData[0].propinas);
    }
    const mesData = await queryOperacional(
      `
    SELECT COUNT(*) as entregas, COALESCE(SUM(propina), 0) as propinas
    FROM pedidos 
    WHERE repartidor_id = ? 
    AND MONTH(fecha_entrega) = MONTH(CURDATE()) 
    AND YEAR(fecha_entrega) = YEAR(CURDATE())
    AND estado = 'entregado'
  `,
      [repartidor?.id || 0]
    );
    if (mesData[0]) {
      guanys.mes = Number(mesData[0].entregas) * 2 + Number(mesData[0].propinas);
    }
    entreguesPerDia = await queryOperacional(
      `
    SELECT 
      DATE(fecha_entrega) as dia,
      COUNT(*) as entregas,
      COALESCE(SUM(propina), 0) as propinas
    FROM pedidos 
    WHERE repartidor_id = ? 
    AND fecha_entrega >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    AND estado = 'entregado'
    GROUP BY DATE(fecha_entrega)
    ORDER BY dia DESC
  `,
      [repartidor?.id || 0]
    );
  } catch (error) {
    console.error("Error obtenint guanys:", error);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Guanys - Repartidor - FreshExpress" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100 py-6"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Navegació --> <div class="mb-6"> <a href="/repartidor" class="text-[#3BB143] hover:text-[#32a039] text-sm font-medium flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Tornar al panell
</a> </div> <h1 class="text-2xl font-bold text-gray-900 mb-6">Els meus guanys</h1> <!-- Resum de guanys --> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"> <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"> <p class="text-white/80 text-sm mb-1">Avui</p> <p class="text-3xl font-bold">${guanys.avui.toFixed(2)} €</p> </div> <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"> <p class="text-white/80 text-sm mb-1">Aquesta setmana</p> <p class="text-3xl font-bold">${guanys.setmana.toFixed(2)} €</p> </div> <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"> <p class="text-white/80 text-sm mb-1">Aquest mes</p> <p class="text-3xl font-bold">${guanys.mes.toFixed(2)} €</p> </div> </div> <!-- Informació de tarifes --> <div class="bg-white rounded-xl shadow p-6 mb-6"> <h2 class="font-semibold text-gray-900 mb-4">
Com es calculen els teus guanys
</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"> <div class="flex items-start"> <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"> <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <p class="font-medium text-gray-900">2,00 € per entrega</p> <p class="text-gray-500">
Tarifa base per cada comanda entregada
</p> </div> </div> <div class="flex items-start"> <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"> <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path> </svg> </div> <div> <p class="font-medium text-gray-900">Propines</p> <p class="text-gray-500">100% de les propines són per a tu</p> </div> </div> <div class="flex items-start"> <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"> <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg> </div> <div> <p class="font-medium text-gray-900">Bonus per rapidesa</p> <p class="text-gray-500">
+0,50 € si entregues en menys de 20 min
</p> </div> </div> <div class="flex items-start"> <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"> <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <p class="font-medium text-gray-900">Bonus hora punta</p> <p class="text-gray-500">
+1,00 € entre 13:00-15:00 i 20:00-22:00
</p> </div> </div> </div> </div> <!-- Historial per dia --> <div class="bg-white rounded-xl shadow overflow-hidden"> <div class="px-6 py-4 border-b border-gray-200"> <h2 class="font-semibold text-gray-900">Últims 7 dies</h2> </div> ${entreguesPerDia.length === 0 ? renderTemplate`<div class="p-8 text-center"> <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg> <p class="text-gray-500">
No tens entregues en els últims 7 dies
</p> </div>` : renderTemplate`<div class="divide-y divide-gray-100"> ${entreguesPerDia.map((dia) => {
    const guanyDia = dia.entregas * 2 + parseFloat(dia.propinas);
    return renderTemplate`<div class="p-4 flex items-center justify-between"> <div> <p class="font-medium text-gray-900"> ${new Date(dia.dia).toLocaleDateString("ca-ES", {
      weekday: "long",
      day: "numeric",
      month: "short"
    })} </p> <p class="text-sm text-gray-500"> ${dia.entregas} entregues
</p> </div> <div class="text-right"> <p class="font-bold text-gray-900"> ${guanyDia.toFixed(2)} €
</p> ${dia.propinas > 0 && renderTemplate`<p class="text-xs text-green-600">
+${parseFloat(dia.propinas).toFixed(2)} € propines
</p>`} </div> </div>`;
  })} </div>`} </div> <!-- Estadístiques totals --> <div class="mt-6 bg-gray-50 rounded-xl p-6 text-center"> <p class="text-gray-500 text-sm mb-1">Total d'entregues realitzades</p> <p class="text-4xl font-bold text-gray-900">${guanys.totalEntregues}</p> <p class="text-[#3BB143] text-sm mt-2">
≈ ${(guanys.totalEntregues * 2).toFixed(2)} € en tarifes base
</p> </div> </div> </div> ` })}`;
}, "C:/dev/FreshExpress/src/pages/repartidor/guanys.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/repartidor/guanys.astro";
const $$url = "/repartidor/guanys";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Guanys,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
