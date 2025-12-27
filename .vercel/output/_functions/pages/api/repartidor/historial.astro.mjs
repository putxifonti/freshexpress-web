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
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const dataInici = url.searchParams.get("data_inici");
    const dataFi = url.searchParams.get("data_fi");
    let query = `
      SELECT 
        h.id,
        h.fecha_entrega,
        h.estado,
        e.direccion_entrega,
        e.codigo_postal,
        e.nombre_cliente,
        e.telefono_cliente,
        e.motivo_fallo
      FROM historial_entregues h
      JOIN entregues e ON h.entrega_id = e.id
      WHERE h.repartidor_id = ?
    `;
    const params = [user.id];
    if (dataInici) {
      query += " AND DATE(h.fecha_entrega) >= ?";
      params.push(dataInici);
    }
    if (dataFi) {
      query += " AND DATE(h.fecha_entrega) <= ?";
      params.push(dataFi);
    }
    query += " ORDER BY h.fecha_entrega DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const historial = await queryOperacional(query, params);
    let countQuery = "SELECT COUNT(*) as total FROM historial_entregues WHERE repartidor_id = ?";
    const countParams = [user.id];
    if (dataInici) {
      countQuery += " AND DATE(fecha_entrega) >= ?";
      countParams.push(dataInici);
    }
    if (dataFi) {
      countQuery += " AND DATE(fecha_entrega) <= ?";
      countParams.push(dataFi);
    }
    const totalResult = await queryOperacional(countQuery, countParams);
    const total = totalResult[0]?.total || 0;
    return new Response(JSON.stringify({
      success: true,
      historial,
      total,
      limit,
      offset
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error obtenint historial:", error);
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
