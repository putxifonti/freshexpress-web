import { v as verifyToken, a as verifyPassword, h as hashPassword } from '../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../renderers.mjs';

const PUT = async ({ request, cookies }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "No autenticat" }), { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: "Token invàlid" }), { status: 401 });
    }
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ success: false, error: "Falten camps obligatoris" }), { status: 400 });
    }
    if (newPassword.length < 8) {
      return new Response(JSON.stringify({ success: false, error: "La contrasenya ha de tenir mínim 8 caràcters" }), { status: 400 });
    }
    const users = await queryOperacional(
      "SELECT password FROM usuarios WHERE id = ?",
      [payload.userId]
    );
    if (users.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Usuari no trobat" }), { status: 404 });
    }
    const isValid = await verifyPassword(currentPassword, users[0].password);
    if (!isValid) {
      return new Response(JSON.stringify({ success: false, error: "Contrasenya actual incorrecta" }), { status: 400 });
    }
    const newHash = await hashPassword(newPassword);
    await queryOperacional(
      "UPDATE usuarios SET password = ? WHERE id = ?",
      [newHash, payload.userId]
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error canviant contrasenya:", error);
    return new Response(JSON.stringify({ success: false, error: "Error del servidor" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
