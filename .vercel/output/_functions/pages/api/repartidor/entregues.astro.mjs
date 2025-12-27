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
    const estado = url.searchParams.get("estado") || "pendiente";
    const entregues = await queryOperacional(`
      SELECT 
        e.*,
        p.nombre as pedido_nombre
      FROM entregues e
      LEFT JOIN pedidos p ON e.pedido_id = p.id
      WHERE e.repartidor_id = ? AND e.estado = ?
      ORDER BY e.hora_estimada_entrega ASC
    `, [user.id, estado]);
    return new Response(JSON.stringify({ success: true, entregues }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error obtenint entregues:", error);
    return new Response(JSON.stringify({ error: "Error intern del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ cookies, request }) => {
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
    const body = await request.json();
    const { entrega_ids } = body;
    if (!entrega_ids || !Array.isArray(entrega_ids) || entrega_ids.length === 0) {
      return new Response(JSON.stringify({ error: "IDs d'entrega requerits" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const placeholders = entrega_ids.map(() => "?").join(",");
    await queryOperacional(
      `UPDATE entregues SET repartidor_id = ?, estado = 'pendiente' WHERE id IN (${placeholders}) AND repartidor_id IS NULL`,
      [user.id, ...entrega_ids]
    );
    for (let i = 0; i < entrega_ids.length; i++) {
      await queryOperacional(`
        INSERT INTO ruta_actual (repartidor_id, entrega_id, orden)
        SELECT ?, ?, COALESCE(MAX(orden), 0) + 1
        FROM ruta_actual WHERE repartidor_id = ?
      `, [user.id, entrega_ids[i], user.id]);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error acceptant entregues:", error);
    return new Response(JSON.stringify({ error: "Error intern del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
