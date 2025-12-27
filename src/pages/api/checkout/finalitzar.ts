// API per finalitzar una comanda sense pagament
import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';

// Generar número de pedido únic
function generarNumeroPedido(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FE-${timestamp}-${random}`;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'No autenticat' }), { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Token invàlid' }), { status: 401 });
    }

    // Obtenir dades de la comanda
    const body = await request.json();
    const { direccion, notas } = body;

    // Verificar que hi ha items a la cistella
    const cartItems = await queryOperacional<any[]>(
      `SELECT 
        c.id, c.cantidad, c.producto_id,
        p.precio, p.precio_oferta, p.empresa_id, p.nombre as producto_nombre
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.usuario_id = ?`,
      [payload.userId]
    );

    if (cartItems.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'La cistella està buida' 
      }), { status: 400 });
    }

    // Calcular total
    let subtotal = 0;
    cartItems.forEach(item => {
      const precio = Number(item.precio_oferta || item.precio);
      subtotal += precio * Number(item.cantidad);
    });
    subtotal = Math.round(subtotal * 100) / 100;
    const costEnviament = subtotal >= 30 ? 0 : 3.99;
    const total = Math.round((subtotal + costEnviament) * 100) / 100;

    // Obtenir direcció de l'usuari si no s'ha proporcionat
    let direccionEntrega = direccion;
    if (!direccionEntrega) {
      const userData = await queryOperacional<any[]>(
        'SELECT direccion FROM usuarios WHERE id = ?',
        [payload.userId]
      );
      direccionEntrega = userData[0]?.direccion || 'Direcció per defecte';
    }

    // Generar número de pedido únic
    const numeroPedido = generarNumeroPedido();

    // Crear el pedido (un sol pedido amb tots els productes)
    const pedidoResult = await queryOperacional<any>(
      `INSERT INTO pedidos (
        numero_pedido, cliente_id, estado, 
        direccion_entrega, notas_cliente, 
        subtotal, coste_envio, total,
        metodo_pago, pagado, fecha_pedido
      ) VALUES (?, ?, 'pendiente', ?, ?, ?, ?, ?, 'efectivo', 0, NOW())`,
      [numeroPedido, payload.userId, direccionEntrega, notas || null, subtotal, costEnviament, total]
    );

    const pedidoId = pedidoResult.insertId;

    // Afegir els detalls del pedido
    for (const item of cartItems) {
      const precio = Number(item.precio_oferta || item.precio);
      const subtotalItem = Math.round(precio * Number(item.cantidad) * 100) / 100;
      await queryOperacional(
        `INSERT INTO detalle_pedido (
          pedido_id, producto_id, cantidad, precio_unitario, subtotal
        ) VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, item.producto_id, item.cantidad, precio, subtotalItem]
      );
    }

    // Buidar la cistella
    await queryOperacional(
      'DELETE FROM carrito WHERE usuario_id = ?',
      [payload.userId]
    );

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Comanda realitzada correctament',
      numeroPedido,
      pedidoId,
      total,
      metodePagament: 'Contra reemborsament (efectiu a l\'entrega)'
    }), { status: 200 });

  } catch (error: any) {
    console.error('Error finalitzant comanda:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Error del servidor al processar la comanda' 
    }), { status: 500 });
  }
};
