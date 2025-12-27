import { v as verifyToken, g as getUserById } from '../../../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../../../renderers.mjs';

const PUT = async ({ cookies, params, request }) => {
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
    const pedidoId = params.id;
    const body = await request.json();
    const { estado } = body;
    const estatsValids = ["confirmado", "preparando", "listo", "en_camino", "entregado"];
    if (!estatsValids.includes(estado)) {
      return new Response(JSON.stringify({ error: "Estat no vàlid" }), {
        status: 400,
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
    const pedido = await queryOperacional(
      "SELECT * FROM pedidos WHERE id = ? AND repartidor_id = ?",
      [pedidoId, repartidorId]
    );
    if (!pedido.length) {
      return new Response(JSON.stringify({ error: "Comanda no trobada o no assignada a tu" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let campsAddicionals = "";
    if (estado === "preparando") {
      campsAddicionals = ", fecha_preparacion = NOW()";
    } else if (estado === "listo") {
      campsAddicionals = ", fecha_recogida = NOW()";
    } else if (estado === "en_camino") {
      campsAddicionals = ", fecha_recogida = COALESCE(fecha_recogida, NOW())";
    } else if (estado === "entregado") {
      campsAddicionals = ", fecha_entrega = NOW()";
    }
    await queryOperacional(
      `UPDATE pedidos SET estado = ?${campsAddicionals} WHERE id = ?`,
      [estado, pedidoId]
    );
    if (estado === "entregado") {
      await queryOperacional(
        "UPDATE repartidores SET entregas_completadas = entregas_completadas + 1 WHERE id = ?",
        [repartidorId]
      );
    }
    return new Response(JSON.stringify({
      success: true,
      message: `Estat actualitzat a ${estado}`,
      nuevoEstado: estado
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error actualitzant estat:", error);
    return new Response(JSON.stringify({ error: "Error intern del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
