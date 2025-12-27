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
    if (!user || user.rol !== "admin") {
      return new Response(JSON.stringify({ error: "No autoritzat" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const solicituds = await queryOperacional(`
      SELECT s.*, u.nombre, u.email
      FROM solicitudes_repartidor s
      JOIN usuarios u ON s.usuario_id = u.id
      ORDER BY 
        CASE s.estat WHEN 'pendent' THEN 0 ELSE 1 END,
        s.fecha_solicitud DESC
      LIMIT 50
    `);
    return new Response(JSON.stringify({ success: true, solicituds }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error obtenint sol·licituds:", error);
    return new Response(JSON.stringify({ error: "Error intern" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request, cookies }) => {
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
    const admin = await getUserById(payload.userId);
    if (!admin || admin.rol !== "admin") {
      return new Response(JSON.stringify({ error: "No autoritzat" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const { solicitud_id, accio, motiu_rebuig } = body;
    if (!solicitud_id || !accio || !["aprovar", "rebutjar"].includes(accio)) {
      return new Response(
        JSON.stringify({ error: "Paràmetres invàlids" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const solicituds = await queryOperacional(
      "SELECT * FROM solicitudes_repartidor WHERE id = ?",
      [solicitud_id]
    );
    if (!solicituds || solicituds.length === 0) {
      return new Response(
        JSON.stringify({ error: "Sol·licitud no trobada" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const solicitud = solicituds[0];
    if (solicitud.estat !== "pendent") {
      return new Response(
        JSON.stringify({ error: "Aquesta sol·licitud ja ha estat processada" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (accio === "aprovar") {
      await queryOperacional(
        "UPDATE usuarios SET rol = 'repartidor' WHERE id = ?",
        [solicitud.usuario_id]
      );
      await queryOperacional(
        `INSERT INTO repartidores (usuario_id, vehiculo_tipo, zona_preferida, disponible) 
         VALUES (?, ?, ?, 0)`,
        [solicitud.usuario_id, solicitud.vehiculo_tipo, solicitud.zona_preferida]
      );
      await queryOperacional(
        `UPDATE solicitudes_repartidor 
         SET estat = 'aprovada', fecha_resposta = NOW(), admin_id = ? 
         WHERE id = ?`,
        [admin.id, solicitud_id]
      );
      return new Response(
        JSON.stringify({
          success: true,
          message: "Sol·licitud aprovada. L'usuari ara és repartidor."
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      await queryOperacional(
        `UPDATE solicitudes_repartidor 
         SET estat = 'rebutjada', motiu_rebuig = ?, fecha_resposta = NOW(), admin_id = ? 
         WHERE id = ?`,
        [motiu_rebuig || "Sol·licitud rebutjada", admin.id, solicitud_id]
      );
      return new Response(
        JSON.stringify({
          success: true,
          message: "Sol·licitud rebutjada."
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error processant sol·licitud:", error);
    return new Response(
      JSON.stringify({ error: "Error intern del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
