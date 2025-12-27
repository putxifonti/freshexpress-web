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
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      user = await getUserById(payload.userId);
    }
  }
  if (!user || user.rol !== "admin") {
    return Astro2.redirect("/dashboard");
  }
  const url = new URL(Astro2.request.url);
  const filtreAny = url.searchParams.get("any") || (/* @__PURE__ */ new Date()).getFullYear().toString();
  const filtreMes = url.searchParams.get("mes") || "";
  const filtreDia = url.searchParams.get("dia") || "";
  const filtreRepartidor = url.searchParams.get("repartidor") || "";
  const filtreEstat = url.searchParams.get("estat") || "";
  let whereClause = "WHERE 1=1";
  const params = [];
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
  if (filtreRepartidor) {
    whereClause += " AND p.repartidor_id = ?";
    params.push(parseInt(filtreRepartidor));
  }
  if (filtreEstat) {
    whereClause += " AND p.estado = ?";
    params.push(filtreEstat);
  }
  let statsFiltre = {
    totalComandes: 0,
    comandesEntregades: 0,
    comandesCancelades: 0,
    comandesPendents: 0,
    totalVendes: 0,
    propinesTotal: 0
  };
  try {
    const statsRes = await queryOperacional(
      `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN p.estado = 'entregado' THEN 1 ELSE 0 END) as entregades,
      SUM(CASE WHEN p.estado = 'cancelado' THEN 1 ELSE 0 END) as cancelades,
      SUM(CASE WHEN p.estado NOT IN ('entregado', 'cancelado') THEN 1 ELSE 0 END) as pendents,
      COALESCE(SUM(CASE WHEN p.estado = 'entregado' THEN p.total ELSE 0 END), 0) as vendes,
      COALESCE(SUM(CASE WHEN p.estado = 'entregado' THEN p.propina ELSE 0 END), 0) as propines
    FROM pedidos p
    ${whereClause}`,
      params
    );
    if (statsRes[0]) {
      statsFiltre.totalComandes = Number(statsRes[0].total) || 0;
      statsFiltre.comandesEntregades = Number(statsRes[0].entregades) || 0;
      statsFiltre.comandesCancelades = Number(statsRes[0].cancelades) || 0;
      statsFiltre.comandesPendents = Number(statsRes[0].pendents) || 0;
      statsFiltre.totalVendes = Number(statsRes[0].vendes) || 0;
      statsFiltre.propinesTotal = Number(statsRes[0].propines) || 0;
    }
  } catch (error) {
    console.error("Error obtenint estad\xEDstiques:", error);
  }
  let historial = [];
  try {
    historial = await queryOperacional(
      `SELECT 
      p.*, 
      uc.nombre as cliente_nombre,
      ur.nombre as repartidor_nombre
    FROM pedidos p
    JOIN usuarios uc ON p.cliente_id = uc.id
    LEFT JOIN repartidores r ON p.repartidor_id = r.id
    LEFT JOIN usuarios ur ON r.usuario_id = ur.id
    ${whereClause}
    ORDER BY COALESCE(p.fecha_entrega, p.fecha_pedido) DESC
    LIMIT 200`,
      params
    );
  } catch (error) {
    console.error("Error obtenint historial:", error);
  }
  let repartidors = [];
  try {
    repartidors = await queryOperacional(`
    SELECT r.id, u.nombre 
    FROM repartidores r 
    JOIN usuarios u ON r.usuario_id = u.id 
    ORDER BY u.nombre
  `);
  } catch (error) {
    console.error("Error obtenint repartidors:", error);
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
  const estats = [
    { valor: "pendiente", nom: "Pendent" },
    { valor: "confirmado", nom: "Confirmat" },
    { valor: "preparando", nom: "Preparant" },
    { valor: "listo", nom: "Llest" },
    { valor: "en_camino", nom: "En cam\xED" },
    { valor: "entregado", nom: "Entregat" },
    { valor: "cancelado", nom: "Cancel\xB7lat" }
  ];
  function traduirEstat(estat) {
    const traduccions = {
      pendiente: "Pendent",
      confirmado: "Confirmat",
      preparando: "Preparant",
      listo: "Llest",
      en_camino: "En cam\xED",
      entregado: "Entregat",
      cancelado: "Cancel\xB7lat"
    };
    return traduccions[estat] || estat;
  }
  function getEstatClass(estat) {
    const classes = {
      pendiente: "bg-yellow-100 text-yellow-800",
      confirmado: "bg-blue-100 text-blue-800",
      preparando: "bg-purple-100 text-purple-800",
      listo: "bg-indigo-100 text-indigo-800",
      en_camino: "bg-orange-100 text-orange-800",
      entregado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800"
    };
    return classes[estat] || "bg-gray-100 text-gray-800";
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Historial Entregues - Admin - FreshExpress" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100 py-6"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Navegació --> <div class="mb-6"> <a href="/admin/dashboard" class="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Tornar al dashboard
</a> </div> <h1 class="text-2xl font-bold text-gray-900 mb-6">
Historial d'entregues - Tots els repartidors
</h1> <!-- Filtres --> <div class="bg-white rounded-xl shadow p-6 mb-6"> <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center"> <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path> </svg>
Filtres
</h2> <form method="GET" class="grid grid-cols-2 md:grid-cols-6 gap-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Any</label> <select name="any" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"> ${anysDisponibles.map((any) => renderTemplate`<option${addAttribute(any, "value")}${addAttribute(filtreAny === any.toString(), "selected")}> ${any} </option>`)} </select> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Mes</label> <select name="mes" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"> <option value="">Tots</option> ${mesos.map((mes) => renderTemplate`<option${addAttribute(mes.num, "value")}${addAttribute(filtreMes === mes.num.toString(), "selected")}> ${mes.nom} </option>`)} </select> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Dia</label> <select name="dia" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"> <option value="">Tots</option> ${Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => renderTemplate`<option${addAttribute(dia, "value")}${addAttribute(filtreDia === dia.toString(), "selected")}> ${dia} </option>`)} </select> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Repartidor</label> <select name="repartidor" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"> <option value="">Tots</option> ${repartidors.map((rep) => renderTemplate`<option${addAttribute(rep.id, "value")}${addAttribute(filtreRepartidor === rep.id.toString(), "selected")}> ${rep.nombre} </option>`)} </select> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Estat</label> <select name="estat" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"> <option value="">Tots</option> ${estats.map((estat) => renderTemplate`<option${addAttribute(estat.valor, "value")}${addAttribute(filtreEstat === estat.valor, "selected")}> ${estat.nom} </option>`)} </select> </div> <div class="flex items-end gap-2"> <button type="submit" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
Filtrar
</button> <a href="/admin/historial" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
Netejar
</a> </div> </form> </div> <!-- Resum del període --> <div class="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-6 mb-6 text-white"> <h2 class="text-lg font-semibold mb-4">
Resum del període seleccionat
</h2> <div class="grid grid-cols-2 md:grid-cols-6 gap-4"> <div class="bg-white/10 rounded-lg p-4 text-center"> <p class="text-3xl font-bold">${statsFiltre.totalComandes}</p> <p class="text-sm text-white/80">Total comandes</p> </div> <div class="bg-white/10 rounded-lg p-4 text-center"> <p class="text-3xl font-bold text-green-300"> ${statsFiltre.comandesEntregades} </p> <p class="text-sm text-white/80">Entregades</p> </div> <div class="bg-white/10 rounded-lg p-4 text-center"> <p class="text-3xl font-bold text-yellow-300"> ${statsFiltre.comandesPendents} </p> <p class="text-sm text-white/80">Pendents</p> </div> <div class="bg-white/10 rounded-lg p-4 text-center"> <p class="text-3xl font-bold text-red-300"> ${statsFiltre.comandesCancelades} </p> <p class="text-sm text-white/80">Cancel·lades</p> </div> <div class="bg-white/10 rounded-lg p-4 text-center"> <p class="text-3xl font-bold"> ${statsFiltre.totalVendes.toFixed(2)}€
</p> <p class="text-sm text-white/80">Total vendes</p> </div> <div class="bg-white/10 rounded-lg p-4 text-center"> <p class="text-3xl font-bold text-yellow-300"> ${statsFiltre.propinesTotal.toFixed(2)}€
</p> <p class="text-sm text-white/80">Propines</p> </div> </div> </div> <!-- Taula historial --> <div class="bg-white rounded-xl shadow overflow-hidden"> <div class="px-6 py-4 border-b border-gray-200"> <h2 class="font-semibold text-gray-900">
Comandes (${historial.length})
</h2> </div> ${historial.length === 0 ? renderTemplate`<div class="p-12 text-center"> <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path> </svg> <p class="text-gray-500">
No s'han trobat comandes per aquest període
</p> <p class="text-sm text-gray-400 mt-2">Prova amb altres filtres</p> </div>` : renderTemplate`<div class="overflow-x-auto"> <table class="w-full"> <thead class="bg-gray-50"> <tr> <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Comanda
</th> <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Client
</th> <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Repartidor
</th> <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Estat
</th> <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Data
</th> <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
Total
</th> <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
Propina
</th> </tr> </thead> <tbody class="divide-y divide-gray-100"> ${historial.map((comanda) => renderTemplate`<tr class="hover:bg-gray-50"> <td class="px-4 py-3"> <span class="font-medium text-gray-900">
#${comanda.numero_pedido} </span> </td> <td class="px-4 py-3"> <p class="text-sm text-gray-900"> ${comanda.cliente_nombre} </p> <p class="text-xs text-gray-400 truncate max-w-xs"> ${comanda.direccion_entrega} </p> </td> <td class="px-4 py-3"> ${comanda.repartidor_nombre ? renderTemplate`<span class="text-sm text-gray-900"> ${comanda.repartidor_nombre} </span>` : renderTemplate`<span class="text-sm text-gray-400 italic">
No assignat
</span>`} </td> <td class="px-4 py-3"> <span${addAttribute(`px-2 py-1 text-xs rounded-full ${getEstatClass(comanda.estado)}`, "class")}> ${traduirEstat(comanda.estado)} </span> </td> <td class="px-4 py-3"> <p class="text-sm text-gray-900"> ${new Date(
    comanda.fecha_entrega || comanda.fecha_pedido
  ).toLocaleDateString("ca-ES")} </p> <p class="text-xs text-gray-400"> ${new Date(
    comanda.fecha_entrega || comanda.fecha_pedido
  ).toLocaleTimeString("ca-ES", {
    hour: "2-digit",
    minute: "2-digit"
  })} </p> </td> <td class="px-4 py-3 text-right"> <span class="font-bold text-gray-900"> ${Number(comanda.total || 0).toFixed(2)} €
</span> </td> <td class="px-4 py-3 text-right"> ${comanda.propina > 0 ? renderTemplate`<span class="text-green-600 font-medium">
+${Number(comanda.propina).toFixed(2)} €
</span>` : renderTemplate`<span class="text-gray-400">-</span>`} </td> </tr>`)} </tbody> </table> </div>`} </div> </div> </div> ` })}`;
}, "C:/dev/FreshExpress/src/pages/admin/historial.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/admin/historial.astro";
const $$url = "/admin/historial";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Historial,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
