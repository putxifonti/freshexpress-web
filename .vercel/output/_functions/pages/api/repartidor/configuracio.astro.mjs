import { v as verifyToken, g as getUserById } from '../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../renderers.mjs';

const PUT = async ({ cookies, request }) => {
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
    const { vehiculo_tipo, matricula, zona_preferida, radio_km, licencia_conducir } = body;
    const existeix = await queryOperacional(
      "SELECT id FROM repartidores WHERE usuario_id = ?",
      [user.id]
    );
    if (existeix.length > 0) {
      await queryOperacional(`
        UPDATE repartidores SET 
          vehiculo_tipo = ?,
          matricula = ?,
          zona_preferida = ?,
          radio_km = ?,
          licencia_conducir = ?,
          fecha_actualizacion = NOW()
        WHERE usuario_id = ?
      `, [vehiculo_tipo, matricula, zona_preferida, radio_km, licencia_conducir, user.id]);
    } else {
      await queryOperacional(`
        INSERT INTO repartidores (usuario_id, vehiculo_tipo, matricula, zona_preferida, radio_km, licencia_conducir)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [user.id, vehiculo_tipo, matricula, zona_preferida, radio_km, licencia_conducir]);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error actualitzant configuració:", error);
    return new Response(JSON.stringify({ error: "Error intern del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
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
    const repartidor = await queryOperacional(
      "SELECT * FROM repartidores WHERE usuario_id = ?",
      [user.id]
    );
    return new Response(JSON.stringify({
      success: true,
      configuracio: repartidor[0] || null
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error obtenint configuració:", error);
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
