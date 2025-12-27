import { v as verifyToken } from '../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional, a as queryBroker } from '../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../renderers.mjs';

const DELETE = async ({ cookies }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "No autenticat" }), { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: "Token invàlid" }), { status: 401 });
    }
    const users = await queryOperacional(
      "SELECT hash_anonimizacion FROM usuarios WHERE id = ?",
      [payload.userId]
    );
    if (users.length > 0 && users[0].hash_anonimizacion) {
      try {
        await queryBroker("DELETE FROM datos_anonimos WHERE hash_usuario = ?", [users[0].hash_anonimizacion]);
      } catch {
      }
    }
    await queryOperacional("DELETE FROM consentimientos WHERE usuario_id = ?", [payload.userId]);
    await queryOperacional(
      "UPDATE usuarios SET estado = 'eliminado', email = CONCAT('deleted_', id, '_', email) WHERE id = ?",
      [payload.userId]
    );
    cookies.delete("auth_token", { path: "/" });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error eliminant compte:", error);
    return new Response(JSON.stringify({ success: false, error: "Error del servidor" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
