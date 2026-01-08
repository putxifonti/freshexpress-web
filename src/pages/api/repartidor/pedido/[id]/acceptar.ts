import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../../../lib/auth';
import { queryOperacional } from '../../../../../lib/db';

// POST - Acceptar una comanda (assignar repartidor)
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
      'SELECT id FROM repartidores WHERE usuario_id = ?',
      [user.id]
    );
    
    if (!repartidorData.length) {
      return new Response(JSON.stringify({ error: 'Repartidor no trobat' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const repartidorId = repartidorData[0].id;

    // Verificar que la comanda està disponible
    const pedido = await queryOperacional<any[]>(
      'SELECT * FROM pedidos WHERE id = ? AND (repartidor_id IS NULL OR repartidor_id = ?)',
      [pedidoId, repartidorId]
    );

    if (!pedido.length) {
      return new Response(JSON.stringify({ error: 'Comanda no disponible o ja assignada' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Assignar repartidor i canviar estat a confirmado
    await queryOperacional(
      'UPDATE pedidos SET repartidor_id = ?, estado = "confirmado", fecha_confirmacion = NOW() WHERE id = ?',
      [repartidorId, pedidoId]
    );

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Comanda acceptada correctament' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error acceptant comanda:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
