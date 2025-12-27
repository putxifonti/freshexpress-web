import { q as queryOperacional } from '../../../chunks/db_D0m2K8jx.mjs';
import { v as verifyToken, g as getUserById } from '../../../chunks/auth_CxmgGjqm.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(
        JSON.stringify({ error: "No autenticat" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Token invàlid" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const user = await getUserById(payload.userId);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuari no trobat" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const body = await request.json();
    const { numeroPedido, valoracion, comentario } = body;
    if (!numeroPedido) {
      return new Response(
        JSON.stringify({ error: "Número de comanda requerit" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!valoracion || valoracion < 1 || valoracion > 5) {
      return new Response(
        JSON.stringify({ error: "Valoració ha de ser entre 1 i 5" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const pedidos = await queryOperacional(
      `SELECT id, repartidor_id, valoracion_cliente 
       FROM pedidos 
       WHERE (numero_pedido = ? OR id = ?) 
       AND cliente_id = ? 
       AND estado = 'entregado'`,
      [numeroPedido, numeroPedido.replace("FE-", ""), user.id]
    );
    if (!pedidos || pedidos.length === 0) {
      return new Response(
        JSON.stringify({ error: "Comanda no trobada o no lliurada" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const pedido = pedidos[0];
    if (!pedido.repartidor_id) {
      return new Response(
        JSON.stringify({ error: "Aquesta comanda no té repartidor assignat" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (pedido.valoracion_cliente) {
      return new Response(
        JSON.stringify({ error: "Ja has valorat aquesta comanda" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    await queryOperacional(
      `UPDATE pedidos SET valoracion_cliente = ?, comentario_valoracion = ? WHERE id = ?`,
      [valoracion, comentario || null, pedido.id]
    );
    const valoracions = await queryOperacional(
      `SELECT AVG(valoracion_cliente) as media, COUNT(*) as total
       FROM pedidos 
       WHERE repartidor_id = ? AND valoracion_cliente IS NOT NULL`,
      [pedido.repartidor_id]
    );
    if (valoracions && valoracions.length > 0) {
      const novaMedia = valoracions[0].media || 5;
      await queryOperacional(
        `UPDATE repartidores SET valoracion_media = ? WHERE id = ?`,
        [novaMedia, pedido.repartidor_id]
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Gràcies per la teva valoració!"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error valorant repartidor:", error);
    return new Response(
      JSON.stringify({ error: "Error del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
