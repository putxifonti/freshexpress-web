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
    const { numeroPedido } = body;

    if (!numeroPedido) {
      return new Response(
        JSON.stringify({ error: "Número de comanda requerit" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtenir el pedido original
    const pedidos = await queryOperacional<any[]>(
      `SELECT id FROM pedidos WHERE (numero_pedido = ? OR id = ?) AND cliente_id = ?`,
      [numeroPedido, numeroPedido.replace('FE-', ''), user.id]
    );

    if (!pedidos || pedidos.length === 0) {
      return new Response(
        JSON.stringify({ error: "Comanda no trobada" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const pedidoId = pedidos[0].id;

    // Obtenir els detalls de la comanda
    const detalles = await queryOperacional<any[]>(
      `SELECT producto_id, cantidad FROM detalle_pedido WHERE pedido_id = ?`,
      [pedidoId]
    );

    if (!detalles || detalles.length === 0) {
      return new Response(
        JSON.stringify({ error: "La comanda no té productes" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Netejar cistella actual
    await queryOperacional(
      `DELETE FROM carrito WHERE usuario_id = ?`,
      [user.id]
    );

    // Afegir productes a la cistella
    let productesAfegits = 0;
    for (const detalle of detalles) {
      // Comprovar que el producte encara existeix i està disponible
      const productos = await queryOperacional<any[]>(
        `SELECT id, stock FROM productos WHERE id = ? AND activo = 1`,
        [detalle.producto_id]
      );

      if (productos && productos.length > 0) {
        const producto = productos[0];
        const cantidadFinal = Math.min(detalle.cantidad, producto.stock || 99);
        
        if (cantidadFinal > 0) {
          await queryOperacional(
            `INSERT INTO carrito (usuario_id, producto_id, cantidad) 
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE cantidad = ?`,
            [user.id, detalle.producto_id, cantidadFinal, cantidadFinal]
          );
          productesAfegits++;
        }
      }
    }

    if (productesAfegits === 0) {
      return new Response(
        JSON.stringify({ error: "Cap producte disponible per afegir" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${productesAfegits} producte(s) afegit(s) a la cistella`,
        redirect: "/cistella"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error repetint comanda:", error);
    return new Response(
      JSON.stringify({ error: "Error del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
