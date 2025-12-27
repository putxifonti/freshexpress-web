import { v as verifyToken, g as getUserById } from '../../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../../renderers.mjs';

const GET = async ({ params, cookies }) => {
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
    const { id } = params;
    const entrega = await queryOperacional(`
      SELECT e.*, p.nombre as pedido_nombre
      FROM entregues e
      LEFT JOIN pedidos p ON e.pedido_id = p.id
      WHERE e.id = ? AND e.repartidor_id = ?
    `, [id, user.id]);
    if (entrega.length === 0) {
      return new Response(JSON.stringify({ error: "Entrega no trobada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true, entrega: entrega[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error obtenint entrega:", error);
    return new Response(JSON.stringify({ error: "Error intern del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const PUT = async ({ params, cookies, request }) => {
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
    const { id } = params;
    const body = await request.json();
    const { estado, motivo_fallo, notas } = body;
    const estadosValids = ["pendiente", "en_proceso", "entregado", "fallido"];
    if (!estado || !estadosValids.includes(estado)) {
      return new Response(JSON.stringify({ error: "Estat invàlid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const entregaExistent = await queryOperacional(
      "SELECT * FROM entregues WHERE id = ? AND repartidor_id = ?",
      [id, user.id]
    );
    if (entregaExistent.length === 0) {
      return new Response(JSON.stringify({ error: "Entrega no trobada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    let updateQuery = "UPDATE entregues SET estado = ?";
    const updateParams = [estado];
    if (estado === "entregado") {
      updateQuery += ", hora_entrega = NOW()";
    }
    if (estado === "fallido" && motivo_fallo) {
      updateQuery += ", motivo_fallo = ?";
      updateParams.push(motivo_fallo);
    }
    if (notas) {
      updateQuery += ', notas_entrega = CONCAT(IFNULL(notas_entrega, ""), ?)';
      updateParams.push("\n[Repartidor]: " + notas);
    }
    updateQuery += " WHERE id = ?";
    updateParams.push(id);
    await queryOperacional(updateQuery, updateParams);
    if (estado === "entregado" || estado === "fallido") {
      await queryOperacional(`
        INSERT INTO historial_entregues (entrega_id, repartidor_id, estado, fecha_entrega)
        VALUES (?, ?, ?, NOW())
      `, [id, user.id, estado]);
      await queryOperacional("DELETE FROM ruta_actual WHERE entrega_id = ?", [id]);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error actualitzant entrega:", error);
    return new Response(JSON.stringify({ error: "Error intern del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
