import { v as verifyToken } from '../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
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
    const { productId, quantity = 1 } = body;
    if (!productId) {
      return new Response(JSON.stringify({ success: false, error: "ID de producte requerit" }), { status: 400 });
    }
    const products = await queryOperacional(
      "SELECT id FROM productos WHERE id = ? AND activo = 1",
      [productId]
    );
    if (products.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Producte no trobat" }), { status: 404 });
    }
    await queryOperacional(`
      INSERT INTO carrito (usuario_id, producto_id, cantidad)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE cantidad = cantidad + ?
    `, [payload.userId, productId, quantity, quantity]);
    const cartCount = await queryOperacional(
      "SELECT SUM(cantidad) as total FROM carrito WHERE usuario_id = ?",
      [payload.userId]
    );
    return new Response(JSON.stringify({
      success: true,
      cartCount: cartCount[0]?.total || 0
    }), { status: 200 });
  } catch (error) {
    console.error("Error afegint a cistella:", error);
    return new Response(JSON.stringify({ success: false, error: "Error del servidor" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
