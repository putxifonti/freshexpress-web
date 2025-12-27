import { v as verifyToken } from '../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ cookies }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ count: 0 }), { status: 200 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ count: 0 }), { status: 200 });
    }
    const result = await queryOperacional(
      "SELECT SUM(cantidad) as total FROM carrito WHERE usuario_id = ?",
      [payload.userId]
    );
    return new Response(JSON.stringify({
      count: Number(result[0]?.total || 0)
    }), { status: 200 });
  } catch (error) {
    console.error("Error obtenint comptador cistella:", error);
    return new Response(JSON.stringify({ count: 0 }), { status: 200 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
