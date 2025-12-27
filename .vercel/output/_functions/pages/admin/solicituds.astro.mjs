/* empty css                                    */
import { e as createComponent, f as createAstro, r as renderTemplate, k as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_D9o_KgyY.mjs';
import { v as verifyToken, g as getUserById } from '../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Solicituds = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Solicituds;
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
  let solicituds = [];
  try {
    await queryOperacional(`
    CREATE TABLE IF NOT EXISTS solicitudes_repartidor (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      vehiculo_tipo VARCHAR(50) NOT NULL,
      zona_preferida VARCHAR(100) NOT NULL,
      dni VARCHAR(20) NOT NULL,
      telefono VARCHAR(20) NOT NULL,
      disponibilitat VARCHAR(200),
      motivacio TEXT,
      estat ENUM('pendent', 'aprovada', 'rebutjada') DEFAULT 'pendent',
      motiu_rebuig TEXT,
      fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      fecha_resposta TIMESTAMP NULL,
      admin_id INT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `);
    solicituds = await queryOperacional(`
    SELECT s.*, u.nombre, u.email
    FROM solicitudes_repartidor s
    JOIN usuarios u ON s.usuario_id = u.id
    ORDER BY 
      CASE s.estat WHEN 'pendent' THEN 0 ELSE 1 END,
      s.fecha_solicitud DESC
    LIMIT 100
  `) || [];
  } catch (error) {
    console.error("Error obtenint sol\xB7licituds:", error);
  }
  const pendents = solicituds.filter((s) => s.estat === "pendent");
  const aprovades = solicituds.filter((s) => s.estat === "aprovada");
  const rebutjades = solicituds.filter((s) => s.estat === "rebutjada");
  const vehicleIcons = {
    bicicleta: "\u{1F6B2}",
    moto: "\u{1F3CD}\uFE0F",
    coche: "\u{1F697}",
    furgoneta: "\u{1F690}",
    a_pie: "\u{1F6B6}"
  };
  function formatDate(date) {
    return new Date(date).toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  return renderTemplate(_a || (_a = __template(["", ` <script>
  async function aprovarSolicitud(id) {
    if (
      !confirm(
        "Est\xE0s segur que vols aprovar aquesta sol\xB7licitud? L'usuari passar\xE0 a ser repartidor."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/solicituds-repartidor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solicitud_id: id, accio: "aprovar" }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Sol\xB7licitud aprovada correctament!");
        window.location.reload();
      } else {
        alert(result.error || "Error aprovant sol\xB7licitud");
      }
    } catch (error) {
      alert("Error de connexi\xF3");
    }
  }

  async function rebutjarSolicitud(id) {
    const motiu = prompt("Motiu del rebuig (opcional):");
    if (motiu === null) return; // Cancelat

    try {
      const response = await fetch("/api/admin/solicituds-repartidor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solicitud_id: id,
          accio: "rebutjar",
          motiu_rebuig: motiu,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Sol\xB7licitud rebutjada");
        window.location.reload();
      } else {
        alert(result.error || "Error rebutjant sol\xB7licitud");
      }
    } catch (error) {
      alert("Error de connexi\xF3");
    }
  }
<\/script>`])), renderComponent($$result, "Layout", $$Layout, { "title": "Sol\xB7licituds de repartidor - Admin - FreshExpress" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100"> <main class="max-w-7xl mx-auto px-4 py-6"> <!-- Capçalera --> <div class="mb-6"> <a href="/admin/dashboard" class="text-[#3BB143] hover:text-[#32a039] text-sm font-medium flex items-center mb-4"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Tornar al dashboard
</a> <h1 class="text-2xl font-bold text-gray-900">
Sol·licituds de repartidor
</h1> <p class="text-gray-600">
Gestiona les sol·licituds d'usuaris que volen ser repartidors
</p> </div> <!-- Estadístiques --> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"> <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4"> <div class="flex items-center"> <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3"> <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <p class="text-2xl font-bold text-yellow-700"> ${pendents.length} </p> <p class="text-sm text-yellow-600">Pendents</p> </div> </div> </div> <div class="bg-green-50 border border-green-200 rounded-xl p-4"> <div class="flex items-center"> <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3"> <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> </div> <div> <p class="text-2xl font-bold text-green-700"> ${aprovades.length} </p> <p class="text-sm text-green-600">Aprovades</p> </div> </div> </div> <div class="bg-red-50 border border-red-200 rounded-xl p-4"> <div class="flex items-center"> <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3"> <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </div> <div> <p class="text-2xl font-bold text-red-700">${rebutjades.length}</p> <p class="text-sm text-red-600">Rebutjades</p> </div> </div> </div> </div> <!-- Sol·licituds pendents --> ${pendents.length > 0 && renderTemplate`<div class="bg-white rounded-xl shadow-lg mb-6"> <div class="p-4 border-b border-gray-200"> <h2 class="font-semibold text-gray-900 flex items-center"> <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
Sol·licituds pendents (${pendents.length})
</h2> </div> <div class="divide-y divide-gray-100"> ${pendents.map((sol) => renderTemplate`<div class="p-4 hover:bg-gray-50"${addAttribute(sol.id, "data-solicitud-id")}> <div class="flex flex-col md:flex-row md:items-center justify-between gap-4"> <div class="flex-1"> <div class="flex items-center gap-2 mb-2"> <span class="text-2xl"> ${vehicleIcons[sol.vehiculo_tipo] || "\u{1F697}"} </span> <div> <p class="font-semibold text-gray-900"> ${sol.nombre} </p> <p class="text-sm text-gray-500">${sol.email}</p> </div> </div> <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm"> <div> <span class="text-gray-500">Vehicle:</span> <span class="ml-1 font-medium"> ${sol.vehiculo_tipo} </span> </div> <div> <span class="text-gray-500">Zona:</span> <span class="ml-1 font-medium"> ${sol.zona_preferida} </span> </div> <div> <span class="text-gray-500">DNI:</span> <span class="ml-1 font-medium">${sol.dni}</span> </div> <div> <span class="text-gray-500">Telèfon:</span> <span class="ml-1 font-medium">${sol.telefono}</span> </div> </div> ${sol.disponibilitat && renderTemplate`<p class="text-sm text-gray-600 mt-1"> <span class="text-gray-500">Disponibilitat:</span>${" "} ${sol.disponibilitat} </p>`} ${sol.motivacio && renderTemplate`<p class="text-sm text-gray-600 mt-1 italic">
"${sol.motivacio}"
</p>`} <p class="text-xs text-gray-400 mt-2">
Sol·licitat: ${formatDate(sol.fecha_solicitud)} </p> </div> <div class="flex gap-2"> <button${addAttribute(`aprovarSolicitud(${sol.id})`, "onclick")} class="btn-aprovar px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>
Aprovar
</button> <button${addAttribute(`rebutjarSolicitud(${sol.id})`, "onclick")} class="btn-rebutjar px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg>
Rebutjar
</button> </div> </div> </div>`)} </div> </div>`} ${pendents.length === 0 && renderTemplate`<div class="bg-white rounded-xl shadow-lg p-8 text-center mb-6"> <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <p class="text-gray-500">No hi ha sol·licituds pendents</p> </div>`} <!-- Historial de sol·licituds --> ${(aprovades.length > 0 || rebutjades.length > 0) && renderTemplate`<div class="bg-white rounded-xl shadow-lg"> <div class="p-4 border-b border-gray-200"> <h2 class="font-semibold text-gray-900">
Historial de sol·licituds
</h2> </div> <div class="overflow-x-auto"> <table class="w-full"> <thead class="bg-gray-50"> <tr> <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
Usuari
</th> <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
Vehicle
</th> <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
Zona
</th> <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
Data
</th> <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
Estat
</th> </tr> </thead> <tbody class="divide-y divide-gray-100"> ${[...aprovades, ...rebutjades].map((sol) => renderTemplate`<tr class="hover:bg-gray-50"> <td class="px-4 py-3"> <p class="font-medium text-gray-900">${sol.nombre}</p> <p class="text-xs text-gray-500">${sol.email}</p> </td> <td class="px-4 py-3"> <span class="text-lg mr-1"> ${vehicleIcons[sol.vehiculo_tipo] || "\u{1F697}"} </span> ${sol.vehiculo_tipo} </td> <td class="px-4 py-3 text-gray-600"> ${sol.zona_preferida} </td> <td class="px-4 py-3 text-sm text-gray-500"> ${formatDate(sol.fecha_solicitud)} </td> <td class="px-4 py-3"> ${sol.estat === "aprovada" ? renderTemplate`<span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
Aprovada
</span>` : renderTemplate`<span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"${addAttribute(sol.motiu_rebuig, "title")}>
Rebutjada
</span>`} </td> </tr>`)} </tbody> </table> </div> </div>`} </main> </div> ` }));
}, "C:/dev/FreshExpress/src/pages/admin/solicituds.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/admin/solicituds.astro";
const $$url = "/admin/solicituds";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Solicituds,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
