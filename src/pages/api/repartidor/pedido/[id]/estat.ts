import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../../../lib/auth';
import { queryOperacional } from '../../../../../lib/db';

// PUT - Actualitzar estat d'una comanda
export const PUT: APIRoute = async ({ cookies, params, request }) => {
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
    const body = await request.json();
    const { estado } = body;

    // Validar estat
    const estatsValids = ['confirmado', 'preparando', 'listo', 'en_camino', 'entregado'];
    if (!estatsValids.includes(estado)) {
      return new Response(JSON.stringify({ error: 'Estat no vàlid' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    // Determinar quina columna de data actualitzar segons l'estat
    let campsAddicionals = '';
    if (estado === 'preparando') {
      campsAddicionals = ', fecha_preparacion = NOW()';
    } else if (estado === 'listo') {
      campsAddicionals = ', fecha_recogida = NOW()';
    } else if (estado === 'en_camino') {
      campsAddicionals = ', fecha_recogida = COALESCE(fecha_recogida, NOW())';
    } else if (estado === 'entregado') {
      campsAddicionals = ', fecha_entrega = NOW()';
    }

    // Actualitzar estat
    await queryOperacional(
      `UPDATE pedidos SET estado = ?${campsAddicionals} WHERE id = ?`,
      [estado, pedidoId]
    );

    // Si és entregat, actualitzar estadístiques del repartidor
    if (estado === 'entregado') {
      await queryOperacional(
        'UPDATE repartidores SET entregas_completadas = entregas_completadas + 1 WHERE id = ?',
        [repartidorId]
      );
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Estat actualitzat a ${estado}`,
      nuevoEstado: estado
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error actualitzant estat:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
