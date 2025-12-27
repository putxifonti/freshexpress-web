import { v as verifyToken, g as getUserById } from '../../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../../renderers.mjs';

const POST = async ({ cookies }) => {
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
    const pedidos = await queryOperacional(`
      SELECT 
        p.id,
        p.direccion_entrega,
        p.estado,
        u.ciudad,
        u.codigo_postal
      FROM pedidos p
      JOIN usuarios u ON p.cliente_id = u.id
      WHERE p.repartidor_id = ? 
      AND p.estado NOT IN ('entregado', 'cancelado')
      ORDER BY p.fecha_pedido ASC
    `, [repartidorId]);
    if (pedidos.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: "No hi ha entregues per optimitzar"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const prioritatEstat = {
      "en_camino": 1,
      "listo": 2,
      "confirmado": 3,
      "preparando": 4,
      "pendiente": 5
    };
    const pedidosOrdenats = [...pedidos].sort((a, b) => {
      const estatA = prioritatEstat[a.estado] || 99;
      const estatB = prioritatEstat[b.estado] || 99;
      if (estatA !== estatB) return estatA - estatB;
      const cpA = a.codigo_postal || "";
      const cpB = b.codigo_postal || "";
      return cpA.localeCompare(cpB);
    });
    let tempsAcumulat = 0;
    for (const pedido of pedidosOrdenats) {
      const tempsBase = pedido.estado === "en_camino" ? 5 : pedido.estado === "listo" ? 8 : 12;
      tempsAcumulat += tempsBase;
      await queryOperacional(
        "UPDATE pedidos SET tiempo_estimado_min = ? WHERE id = ?",
        [tempsAcumulat, pedido.id]
      );
    }
    return new Response(JSON.stringify({
      success: true,
      message: `Ruta optimitzada amb ${pedidosOrdenats.length} entregues`,
      entregues: pedidosOrdenats.length,
      tempsTotal: tempsAcumulat
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error optimitzant ruta:", error);
    return new Response(JSON.stringify({ error: "Error intern del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
