import { v as verifyToken, g as getUserById } from '../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ cookies }) => {
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
    const repartidorData = await queryOperacional(
      "SELECT id FROM repartidores WHERE usuario_id = ?",
      [user.id]
    );
    if (!repartidorData.length) {
      return new Response(JSON.stringify({ error: "Repartidor no trobat" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const repartidorId = repartidorData[0].id;
    const pendents = await queryOperacional(
      `
      SELECT p.id, p.numero_pedido, p.fecha_pedido, p.estado, p.total, 
             p.direccion_entrega, p.repartidor_id,
             u.nombre as cliente_nombre, u.telefono as cliente_telefono
      FROM pedidos p
      JOIN usuarios u ON p.cliente_id = u.id
      WHERE (p.repartidor_id = ? OR (p.repartidor_id IS NULL AND p.estado IN ('pendiente', 'listo', 'confirmado')))
      AND p.estado NOT IN ('entregado', 'cancelado')
      ORDER BY p.fecha_pedido ASC
      LIMIT 15
    `,
      [repartidorId]
    );
    const pedidoActual = pendents.find(
      (p) => p.repartidor_id === repartidorId && p.estado === "en_camino"
    );
    return new Response(JSON.stringify({
      success: true,
      pedidos: pendents,
      pedidoActualId: pedidoActual?.id || null,
      repartidorId,
      timestamp: Date.now()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (error) {
    console.error("Error obtenint pedidos disponibles:", error);
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
