import type { APIRoute } from "astro";
import { queryOperacional } from "../../../lib/db";
import { verifyToken, getUserById } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verificar autenticació
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

    // Obtenir el pedido i verificar que pertany al client i està entregat
    const pedidos = await queryOperacional<any[]>(
      `SELECT id, repartidor_id, valoracion_cliente 
       FROM pedidos 
       WHERE (numero_pedido = ? OR id = ?) 
       AND cliente_id = ? 
       AND estado = 'entregado'`,
      [numeroPedido, numeroPedido.replace('FE-', ''), user.id]
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

    // Guardar valoració al pedido
    await queryOperacional(
      `UPDATE pedidos SET valoracion_cliente = ?, comentario_valoracion = ? WHERE id = ?`,
      [valoracion, comentario || null, pedido.id]
    );

    // Actualitzar mitjana del repartidor
    const valoracions = await queryOperacional<any[]>(
      `SELECT AVG(valoracion_cliente) as media, COUNT(*) as total
       FROM pedidos 
       WHERE repartidor_id = ? AND valoracion_cliente IS NOT NULL`,
      [pedido.repartidor_id]
    );

    if (valoracions && valoracions.length > 0) {
      const novaMedia = valoracions[0].media || 5.0;
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
