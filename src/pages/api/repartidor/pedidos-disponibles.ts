import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';

// GET - Obtenir comandes disponibles (per polling en temps real)
export const GET: APIRoute = async ({ cookies }) => {
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

    // Obtenir el repartidor_id i comprovar si està actiu
    const repartidorData = await queryOperacional<any[]>(
      'SELECT id, disponible FROM repartidores WHERE usuario_id = ?',
      [user.id]
    );
    
    if (!repartidorData.length) {
      return new Response(JSON.stringify({ error: 'Repartidor no trobat' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const repartidor = repartidorData[0];
    const repartidorId = repartidor.id;

    // Si el repartidor no està actiu, retornar llista buida
    if (repartidor.disponible !== 1) {
      return new Response(JSON.stringify({ 
        success: true,
        pedidos: [],
        pedidoActualId: null,
        repartidorId: repartidorId,
        activo: false,
        mensaje: 'Has de activar el teu estat per veure comandes disponibles',
        timestamp: Date.now()
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // Comandes pendents d'assignar o assignades a mi
    const pendents = await queryOperacional<any[]>(
      `
      SELECT p.id, p.numero_pedido, p.fecha_pedido, p.estado, p.total, 
             p.direccion_entrega, p.repartidor_id,
             u.nombre as cliente_nombre, u.telefono as cliente_telefono
      FROM pedidos p
      JOIN usuarios u ON p.cliente_id = u.id
      WHERE (p.repartidor_id = ? OR (p.repartidor_id IS NULL AND p.estado IN ('pendiente', 'listo', 'confirmado')))
      AND p.estado NOT IN ('entregado', 'cancelado')
      ORDER BY p.fecha_pedido ASC
      LIMIT 15
    `,
      [repartidorId]
    );

    // Trobar pedido actual (en_camino)
    const pedidoActual = pendents.find(
      (p: any) => p.repartidor_id === repartidorId && p.estado === 'en_camino'
    );

    return new Response(JSON.stringify({ 
      success: true,
      pedidos: pendents,
      pedidoActualId: pedidoActual?.id || null,
      repartidorId: repartidorId,
      activo: true,
      timestamp: Date.now()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('Error obtenint pedidos disponibles:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
