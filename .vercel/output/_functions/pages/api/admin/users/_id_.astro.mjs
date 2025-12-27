import { v as verifyToken, g as getUserById } from '../../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../../renderers.mjs';

const PUT = async ({ request, cookies, params }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "No autenticat" }), { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: "Token invàlid" }), { status: 401 });
    }
    const currentUser = await getUserById(payload.userId);
    if (!currentUser || currentUser.rol !== "admin") {
      return new Response(JSON.stringify({ success: false, error: "No autoritzat" }), { status: 403 });
    }
    const userId = params.id;
    const body = await request.json();
    const { nombre, email, rol } = body;
    const rolsValids = ["admin", "repartidor", "cliente"];
    if (rol && !rolsValids.includes(rol)) {
      return new Response(JSON.stringify({ success: false, error: "Rol no vàlid" }), { status: 400 });
    }
    if (parseInt(userId) === payload.userId && rol !== "admin") {
      return new Response(JSON.stringify({ success: false, error: "No pots canviar el teu propi rol d'admin" }), { status: 400 });
    }
    if (email) {
      const existingUser = await queryOperacional(
        "SELECT id FROM usuarios WHERE email = ? AND id != ?",
        [email, userId]
      );
      if (existingUser.length > 0) {
        return new Response(JSON.stringify({ success: false, error: "Aquest email ja està en ús" }), { status: 400 });
      }
    }
    const updates = [];
    const values = [];
    if (nombre !== void 0) {
      updates.push("nombre = ?");
      values.push(nombre);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (rol) {
      updates.push("rol = ?");
      values.push(rol);
    }
    if (updates.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Cap dada a actualitzar" }), { status: 400 });
    }
    values.push(userId);
    await queryOperacional(
      `UPDATE usuarios SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error actualitzant usuari:", error);
    return new Response(JSON.stringify({ success: false, error: "Error del servidor" }), { status: 500 });
  }
};
const GET = async ({ cookies, params }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "No autenticat" }), { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: "Token invàlid" }), { status: 401 });
    }
    const currentUser = await getUserById(payload.userId);
    if (!currentUser || currentUser.rol !== "admin") {
      return new Response(JSON.stringify({ success: false, error: "No autoritzat" }), { status: 403 });
    }
    const userId = params.id;
    const users = await queryOperacional(
      `SELECT u.id, u.email, u.nombre, u.estado, u.rol, u.fecha_registro, u.ultimo_login,
              c.compartir_datos, c.acepta_comunicaciones
       FROM usuarios u
       LEFT JOIN consentimientos c ON u.id = c.usuario_id
       WHERE u.id = ?`,
      [userId]
    );
    if (users.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Usuari no trobat" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, user: users[0] }), { status: 200 });
  } catch (error) {
    console.error("Error obtenint usuari:", error);
    return new Response(JSON.stringify({ success: false, error: "Error del servidor" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
