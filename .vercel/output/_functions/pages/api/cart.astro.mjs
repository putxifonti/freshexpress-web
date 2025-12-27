import { v as verifyToken } from '../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ cookies }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "No autenticat" }), { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: "Token invàlid" }), { status: 401 });
    }
    const items = await queryOperacional(`
      SELECT 
        c.id as cart_id,
        c.cantidad,
        p.id as producto_id,
        p.nombre,
        p.precio,
        p.precio_oferta,
        p.unidad,
        p.destacado,
        e.nombre as empresa_nombre,
        e.id as empresa_id
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      JOIN empresas e ON p.empresa_id = e.id
      WHERE c.usuario_id = ?
      ORDER BY e.nombre, p.nombre
    `, [payload.userId]);
    let subtotal = 0;
    let totalItems = 0;
    items.forEach((item) => {
      const precio = item.precio_oferta || item.precio;
      subtotal += precio * item.cantidad;
      totalItems += item.cantidad;
    });
    return new Response(JSON.stringify({
      success: true,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      totalItems
    }), { status: 200 });
  } catch (error) {
    console.error("Error obtenint cistella:", error);
    return new Response(JSON.stringify({ success: false, error: "Error del servidor" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
