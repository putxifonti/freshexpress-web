import { v as verifyToken } from '../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../renderers.mjs';

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
    const cartItemId = params.id;
    const body = await request.json();
    const { quantity } = body;
    if (quantity < 1) {
      await queryOperacional(
        "DELETE FROM carrito WHERE id = ? AND usuario_id = ?",
        [cartItemId, payload.userId]
      );
    } else {
      await queryOperacional(
        "UPDATE carrito SET cantidad = ? WHERE id = ? AND usuario_id = ?",
        [quantity, cartItemId, payload.userId]
      );
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error actualitzant cistella:", error);
    return new Response(JSON.stringify({ success: false, error: "Error del servidor" }), { status: 500 });
  }
};
const DELETE = async ({ cookies, params }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "No autenticat" }), { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: "Token invàlid" }), { status: 401 });
    }
    const cartItemId = params.id;
    await queryOperacional(
      "DELETE FROM carrito WHERE id = ? AND usuario_id = ?",
      [cartItemId, payload.userId]
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error eliminant de cistella:", error);
    return new Response(JSON.stringify({ success: false, error: "Error del servidor" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
