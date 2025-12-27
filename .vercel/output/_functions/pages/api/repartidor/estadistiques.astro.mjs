import { v as verifyToken, g as getUserById } from '../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ cookies, url }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "No autenticat" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Token invàlid" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const user = await getUserById(payload.userId);
    if (!user || user.rol !== "repartidor") {
      return new Response(JSON.stringify({ error: "No autoritzat" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const periode = url.searchParams.get("periode") || "dia";
    let dataFiltre;
    const ara = /* @__PURE__ */ new Date();
    switch (periode) {
      case "setmana":
        const setmanaPasada = new Date(ara);
        setmanaPasada.setDate(ara.getDate() - 7);
        dataFiltre = setmanaPasada.toISOString().split("T")[0];
        break;
      case "mes":
        const mesPasat = new Date(ara);
        mesPasat.setMonth(ara.getMonth() - 1);
        dataFiltre = mesPasat.toISOString().split("T")[0];
        break;
      default:
        dataFiltre = ara.toISOString().split("T")[0];
    }
    const statsEntregues = await queryOperacional(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'entregado' THEN 1 ELSE 0 END) as entregades,
        SUM(CASE WHEN estado = 'fallido' THEN 1 ELSE 0 END) as fallides,
        SUM(CASE WHEN estado = 'pendiente' OR estado = 'en_proceso' THEN 1 ELSE 0 END) as pendents
      FROM entregues 
      WHERE repartidor_id = ? AND DATE(fecha_creacion) >= ?
    `, [user.id, dataFiltre]);
    const tempsMitja = await queryOperacional(`
      SELECT AVG(TIMESTAMPDIFF(MINUTE, fecha_creacion, hora_entrega)) as temps_mitja
      FROM entregues 
      WHERE repartidor_id = ? 
        AND estado = 'entregado' 
        AND hora_entrega IS NOT NULL
        AND DATE(fecha_creacion) >= ?
    `, [user.id, dataFiltre]);
    const historialDiari = await queryOperacional(`
      SELECT 
        DATE(fecha_entrega) as dia,
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'entregado' THEN 1 ELSE 0 END) as entregades
      FROM historial_entregues
      WHERE repartidor_id = ? AND fecha_entrega >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(fecha_entrega)
      ORDER BY dia ASC
    `, [user.id]);
    const stats = statsEntregues[0];
    const taxaExit = stats.entregades > 0 ? (stats.entregades / (stats.entregades + stats.fallides) * 100).toFixed(1) : "100.0";
    return new Response(JSON.stringify({
      success: true,
      estadistiques: {
        total: stats.total || 0,
        entregades: stats.entregades || 0,
        fallides: stats.fallides || 0,
        pendents: stats.pendents || 0,
        tempsMitja: tempsMitja[0]?.temps_mitja ? Math.round(tempsMitja[0].temps_mitja) : null,
        taxaExit: parseFloat(taxaExit),
        historialDiari
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error obtenint estadístiques:", error);
    return new Response(JSON.stringify({ error: "Error intern del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
