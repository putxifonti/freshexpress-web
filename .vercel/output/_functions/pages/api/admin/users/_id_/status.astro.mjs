import { v as verifyToken, g as getUserById } from '../../../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../../../renderers.mjs';

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
    const { estado, rol } = body;
    if (parseInt(userId) === payload.userId && estado !== "activo") {
      return new Response(JSON.stringify({ success: false, error: "No pots desactivar el teu propi compte" }), { status: 400 });
    }
    if (estado) {
      await queryOperacional("UPDATE usuarios SET estado = ? WHERE id = ?", [estado, userId]);
    }
    if (rol) {
      await queryOperacional("UPDATE usuarios SET rol = ? WHERE id = ?", [rol, userId]);
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error actualitzant usuari:", error);
    return new Response(JSON.stringify({ success: false, error: "Error del servidor" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
