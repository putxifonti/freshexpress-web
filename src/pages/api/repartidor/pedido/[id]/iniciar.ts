import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../../../lib/auth';
import { queryOperacional } from '../../../../../lib/db';

// POST - Iniciar entrega (canviar estat a en_camino)
export const POST: APIRoute = async ({ cookies, params }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: 'No autenticat' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Token invàlid' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await getUserById(payload.userId);
    if (!user || user.rol !== 'repartidor') {
      return new Response(JSON.stringify({ error: 'No autoritzat' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const pedidoId = params.id;

    // Obtenir el repartidor_id
    const repartidorData = await queryOperacional<any[]>(
      'SELECT id FROM repartidores WHERE usuario_id = ? AND (activo IS NULL OR activo = 1)',
      [user.id]
    );
    
    if (!repartidorData.length) {
      return new Response(JSON.stringify({ error: 'Repartidor no trobat' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const repartidorId = repartidorData[0].id;

    // Verificar que la comanda pertany a aquest repartidor
    const pedido = await queryOperacional<any[]>(
      'SELECT * FROM pedidos WHERE id = ? AND repartidor_id = ?',
      [pedidoId, repartidorId]
    );

    if (!pedido.length) {
      return new Response(JSON.stringify({ error: 'Comanda no trobada o no assignada a tu' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Canviar estat a en_camino
    await queryOperacional(
      'UPDATE pedidos SET estado = ?, fecha_recogida = COALESCE(fecha_recogida, NOW()) WHERE id = ?',
      ['en_camino', pedidoId]
    );

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Entrega iniciada' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error iniciant entrega:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
