/* empty css                                    */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_D9o_KgyY.mjs';
import { v as verifyToken, g as getUserById } from '../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Historial = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Historial;
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
  const url = new URL(Astro2.request.url);
  const filtreAny = url.searchParams.get("any") || (/* @__PURE__ */ new Date()).getFullYear().toString();
  const filtreMes = url.searchParams.get("mes") || "";
  const filtreDia = url.searchParams.get("dia") || "";
  let whereClause = "WHERE p.repartidor_id = ? AND p.estado IN ('entregado', 'cancelado')";
  const params = [repartidor?.id || 0];
  if (filtreAny) {
    whereClause += " AND YEAR(COALESCE(p.fecha_entrega, p.fecha_pedido)) = ?";
    params.push(parseInt(filtreAny));
  }
  if (filtreMes) {
    whereClause += " AND MONTH(COALESCE(p.fecha_entrega, p.fecha_pedido)) = ?";
    params.push(parseInt(filtreMes));
  }
  if (filtreDia) {
    whereClause += " AND DAY(COALESCE(p.fecha_entrega, p.fecha_pedido)) = ?";
    params.push(parseInt(filtreDia));
  }
  let statsFiltre = {
    totalEntregues: 0,
    entreguesCompletades: 0,
    entreguesCancelades: 0,
    guanysTotal: 0,
    propinesTotal: 0,
    valoracioMitjana: 0
  };
  try {
    const statsRes = await queryOperacional(
      `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN p.estado = 'entregado' THEN 1 ELSE 0 END) as completades,
      SUM(CASE WHEN p.estado = 'cancelado' THEN 1 ELSE 0 END) as cancelades,
      COALESCE(SUM(CASE WHEN p.estado = 'entregado' THEN p.propina ELSE 0 END), 0) as propines,
      AVG(p.valoracion_cliente) as valoracio
    FROM pedidos p
    ${whereClause}`,
      params
    );
    if (statsRes[0]) {
      statsFiltre.totalEntregues = Number(statsRes[0].total) || 0;
      statsFiltre.entreguesCompletades = Number(statsRes[0].completades) || 0;
      statsFiltre.entreguesCancelades = Number(statsRes[0].cancelades) || 0;
      statsFiltre.propinesTotal = Number(statsRes[0].propines) || 0;
      statsFiltre.guanysTotal = statsFiltre.entreguesCompletades * 2.5 + statsFiltre.propinesTotal;
      statsFiltre.valoracioMitjana = Number(statsRes[0].valoracio) || 0;
    }
  } catch (error) {
    console.error("Error obtenint estad\xEDstiques:", error);
  }
  let historial = [];
  try {
    historial = await queryOperacional(
      `SELECT p.*, u.nombre as cliente_nombre
    FROM pedidos p
    JOIN usuarios u ON p.cliente_id = u.id
    ${whereClause}
    ORDER BY COALESCE(p.fecha_entrega, p.fecha_pedido) DESC
    LIMIT 100`,
      params
    );
  } catch (error) {
    console.error("Error obtenint historial:", error);
  }
  const anysDisponibles = [];
  const anyActual = (/* @__PURE__ */ new Date()).getFullYear();
  for (let i = anyActual; i >= anyActual - 2; i--) {
    anysDisponibles.push(i);
  }
  const mesos = [
    { num: 1, nom: "Gener" },
    { num: 2, nom: "Febrer" },
    { num: 3, nom: "Mar\xE7" },
    { num: 4, nom: "Abril" },
    { num: 5, nom: "Maig" },
    { num: 6, nom: "Juny" },
    { num: 7, nom: "Juliol" },
    { num: 8, nom: "Agost" },
    { num: 9, nom: "Setembre" },
    { num: 10, nom: "Octubre" },
    { num: 11, nom: "Novembre" },
    { num: 12, nom: "Desembre" }
  ];
  const historialPerData = historial.reduce((acc, pedido) => {
    const fecha = new Date(
      pedido.fecha_entrega || pedido.fecha_pedido
    ).toLocaleDateString("ca-ES", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(pedido);
    return acc;
  }, {});
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Historial - Repartidor - FreshExpress" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100 py-6"> <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Navegació --> <div class="mb-6"> <a href="/repartidor/compte" class="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Tornar al compte
</a> </div> <h1 class="text-2xl font-bold text-gray-900 mb-6">
Historial d'entregues
</h1> <!-- Filtres --> <div class="bg-white rounded-xl shadow p-6 mb-6"> <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center"> <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path> </svg>
Filtrar per data
</h2> <form method="GET" class="grid grid-cols-1 md:grid-cols-4 gap-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Any</label> <select name="any" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"> ${anysDisponibles.map((any) => renderTemplate`<option${addAttribute(any, "value")}${addAttribute(filtreAny === any.toString(), "selected")}> ${any} </option>`)} </select> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Mes</label> <select name="mes" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"> <option value="">Tots</option> ${mesos.map((mes) => renderTemplate`<option${addAttribute(mes.num, "value")}${addAttribute(filtreMes === mes.num.toString(), "selected")}> ${mes.nom} </option>`)} </select> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Dia</label> <select name="dia" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"> <option value="">Tots</option> ${Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => renderTemplate`<option${addAttribute(dia, "value")}${addAttribute(filtreDia === dia.toString(), "selected")}> ${dia} </option>`)} </select> </div> <div class="flex items-end gap-2"> <button type="submit" class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
Filtrar
</button> <a href="/repartidor/historial" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
Netejar
</a> </div> </form> </div> <!-- Resum del període --> <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 mb-6 text-white"> <h2 class="text-lg font-semibold mb-4">
Resum del període seleccionat
</h2> <div class="grid grid-cols-2 md:grid-cols-5 gap-4"> <div class="bg-white/10 rounded-lg p-4 text-center"> <p class="text-3xl font-bold">${statsFiltre.totalEntregues}</p> <p class="text-sm text-white/80">Total entregues</p> </div> <div class="bg-white/10 rounded-lg p-4 text-center"> <p class="text-3xl font-bold text-green-300"> ${statsFiltre.entreguesCompletades} </p> <p class="text-sm text-white/80">Completades</p> </div> <div class="bg-white/10 rounded-lg p-4 text-center"> <p class="text-3xl font-bold text-red-300"> ${statsFiltre.entreguesCancelades} </p> <p class="text-sm text-white/80">Cancel·lades</p> </div> <div class="bg-white/10 rounded-lg p-4 text-center"> <p class="text-3xl font-bold text-yellow-300"> ${statsFiltre.guanysTotal.toFixed(2)}€
</p> <p class="text-sm text-white/80">Guanys totals</p> </div> <div class="bg-white/10 rounded-lg p-4 text-center"> <div class="flex items-center justify-center mb-1"> <svg class="w-5 h-5 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <span class="text-2xl font-bold">${statsFiltre.valoracioMitjana > 0 ? statsFiltre.valoracioMitjana.toFixed(1) : "-"}</span> </div> <p class="text-sm text-white/80">Valoració mitjana</p> </div> </div> </div> ${Object.keys(historialPerData).length === 0 ? renderTemplate`<div class="bg-white rounded-xl shadow p-12 text-center"> <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path> </svg> <p class="text-gray-500">
No s'han trobat entregues per aquest període
</p> <p class="text-sm text-gray-400 mt-2">Prova amb altres filtres</p> </div>` : renderTemplate`<div class="space-y-6"> ${Object.entries(historialPerData).map(
    ([fecha, pedidos]) => renderTemplate`<div> <h2 class="text-sm font-medium text-gray-500 mb-3 capitalize"> ${fecha} </h2> <div class="bg-white rounded-xl shadow overflow-hidden divide-y divide-gray-100"> ${pedidos.map((pedido) => renderTemplate`<div class="p-4"> <div class="flex items-center justify-between mb-2"> <div class="flex items-center"> <span class="font-medium text-gray-900">
#${pedido.numero_pedido} </span> <span${addAttribute(`ml-2 px-2 py-0.5 text-xs rounded-full ${pedido.estado === "entregado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`, "class")}> ${pedido.estado === "entregado" ? "Entregat" : "Cancel\xB7lat"} </span> </div> <span class="text-sm font-medium text-gray-900"> ${Number(pedido.total || 0).toFixed(2)} €
</span> </div> <p class="text-sm text-gray-600"> ${pedido.cliente_nombre} </p> <p class="text-xs text-gray-400 mt-1 line-clamp-1"> ${pedido.direccion_entrega} </p> <div class="flex items-center justify-between mt-2"> <span class="text-xs text-gray-400"> ${new Date(
      pedido.fecha_entrega || pedido.fecha_pedido
    ).toLocaleTimeString("ca-ES", {
      hour: "2-digit",
      minute: "2-digit"
    })} </span> ${pedido.propina > 0 && renderTemplate`<span class="text-xs text-green-600 font-medium">
+${Number(pedido.propina).toFixed(2)} € propina
</span>`} ${pedido.valoracion_cliente && renderTemplate`<div class="flex items-center"> <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <span class="text-xs text-gray-600 ml-1"> ${pedido.valoracion_cliente} </span> </div>`} </div> </div>`)} </div> </div>`
  )} </div>`} </div> </div> ` })}`;
}, "C:/dev/FreshExpress/src/pages/repartidor/historial.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/repartidor/historial.astro";
const $$url = "/repartidor/historial";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Historial,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
