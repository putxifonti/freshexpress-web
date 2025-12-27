import type { APIRoute } from 'astro';
import { queryOperacional } from '../../../lib/db';
import { verifyToken, getUserById } from '../../../lib/auth';

export const GET: APIRoute = async ({ params, cookies }) => {
  const code = params.code;
  
  if (!code) {
    return new Response(JSON.stringify({ error: 'Codi no proporcionat' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Verificar autenticació
  const token = cookies.get('auth_token')?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: 'No autoritzat' }), {
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
  if (!user) {
    return new Response(JSON.stringify({ error: 'Usuari no trobat' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Buscar la comanda per numero_pedido
    const pedidos = await queryOperacional<any[]>(`
      SELECT 
        p.id,
        p.numero_pedido,
        p.fecha_pedido,
        p.fecha_entrega,
        p.estado,
        p.total,
        p.subtotal,
        p.coste_envio,
        p.direccion_entrega,
        p.notas_cliente,
        p.metodo_pago,
        p.pagado,
        u.nombre as cliente_nombre,
        r.usuario_id as repartidor_usuario_id,
        ur.nombre as repartidor_nombre,
        ur.telefono as repartidor_telefono
      FROM pedidos p
      JOIN usuarios u ON p.cliente_id = u.id
      LEFT JOIN repartidores r ON p.repartidor_id = r.id
      LEFT JOIN usuarios ur ON r.usuario_id = ur.id
      WHERE p.numero_pedido = ?
    `, [code]);

    if (pedidos.length === 0) {
      // Intentar buscar per ID si no es troba per numero_pedido
      const pedidosPorId = await queryOperacional<any[]>(`
        SELECT 
          p.id,
          p.numero_pedido,
          p.fecha_pedido,
          p.fecha_entrega,
          p.estado,
          p.total,
          p.subtotal,
          p.coste_envio,
          p.direccion_entrega,
          p.notas_cliente,
          p.metodo_pago,
          p.pagado,
          u.nombre as cliente_nombre,
          r.usuario_id as repartidor_usuario_id,
          ur.nombre as repartidor_nombre,
          ur.telefono as repartidor_telefono
        FROM pedidos p
        JOIN usuarios u ON p.cliente_id = u.id
        LEFT JOIN repartidores r ON p.repartidor_id = r.id
        LEFT JOIN usuarios ur ON r.usuario_id = ur.id
        WHERE p.id = ? OR p.numero_pedido LIKE ?
      `, [code.replace(/\D/g, '') || 0, `%${code}%`]);

      if (pedidosPorId.length === 0) {
        return new Response(JSON.stringify({ error: 'Comanda no trobada' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      pedidos.push(pedidosPorId[0]);
    }

    const pedido = pedidos[0];

    // Verificar que el client pot veure aquesta comanda (només el seu propietari o admin)
    const isOwner = await queryOperacional<any[]>(
      'SELECT id FROM pedidos WHERE id = ? AND cliente_id = ?',
      [pedido.id, user.id]
    );

    if (isOwner.length === 0 && user.rol !== 'admin') {
      return new Response(JSON.stringify({ error: 'No tens permís per veure aquesta comanda' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtenir detalls dels productes
    const detalls = await queryOperacional<any[]>(`
      SELECT 
        dp.cantidad,
        dp.precio_unitario,
        dp.subtotal,
        pr.nombre,
        pr.imagen
      FROM detalle_pedido dp
      JOIN productos pr ON dp.producto_id = pr.id
      WHERE dp.pedido_id = ?
    `, [pedido.id]);

    // Calcular el timeline segons l'estat
    const timeline = generarTimeline(pedido);

    return new Response(JSON.stringify({
      success: true,
      comanda: {
        id: pedido.id,
        numeroPedido: pedido.numero_pedido || `FE-${pedido.id}`,
        dataPedido: pedido.fecha_pedido,
        dataEntrega: pedido.fecha_entrega,
        estat: pedido.estado,
        estatText: traduirEstat(pedido.estado),
        total: Number(pedido.total) || 0,
        subtotal: Number(pedido.subtotal) || 0,
        costEnviament: Number(pedido.coste_envio) || 0,
        direccio: pedido.direccion_entrega,
        notes: pedido.notas_cliente,
        metodePagament: pedido.metodo_pago,
        pagat: pedido.pagado,
        client: pedido.cliente_nombre,
        repartidor: pedido.repartidor_nombre,
        telefonRepartidor: pedido.repartidor_telefono,
        productes: detalls.map((d: any) => ({
          nom: d.nombre,
          quantitat: d.cantidad,
          preu: Number(d.precio_unitario),
          subtotal: Number(d.subtotal),
          imatge: d.imagen
        })),
        timeline
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error buscant comanda:', error);
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function traduirEstat(estat: string): string {
  const traduccions: Record<string, string> = {
    'pendiente': 'Pendent de confirmació',
    'confirmado': 'Confirmat',
    'preparando': 'En preparació',
    'listo': 'Llest per recollir',
    'en_camino': 'En camí',
    'entregado': 'Lliurat',
    'cancelado': 'Cancel·lat'
  };
  return traduccions[estat] || estat;
}

function generarTimeline(pedido: any) {
  const estats = ['pendiente', 'confirmado', 'preparando', 'listo', 'en_camino', 'entregado'];
  const estatActual = pedido.estado;
  const indexActual = estats.indexOf(estatActual);
  
  if (estatActual === 'cancelado') {
    return [{
      pas: 'cancel·lat',
      text: 'Comanda cancel·lada',
      completat: true,
      actiu: true,
      data: pedido.fecha_pedido
    }];
  }

  return [
    {
      pas: 'rebut',
      text: 'Comanda rebuda',
      completat: indexActual >= 0,
      actiu: indexActual === 0,
      data: pedido.fecha_pedido
    },
    {
      pas: 'confirmat',
      text: 'Confirmat',
      completat: indexActual >= 1,
      actiu: indexActual === 1,
      data: indexActual >= 1 ? 'Completat' : null
    },
    {
      pas: 'preparant',
      text: 'En preparació',
      completat: indexActual >= 2,
      actiu: indexActual === 2,
      data: indexActual >= 2 ? 'Completat' : null
    },
    {
      pas: 'llest',
      text: 'Llest per enviar',
      completat: indexActual >= 3,
      actiu: indexActual === 3,
      data: indexActual >= 3 ? 'Completat' : null
    },
    {
      pas: 'en_cami',
      text: 'En camí',
      completat: indexActual >= 4,
      actiu: indexActual === 4,
      data: indexActual >= 4 ? (pedido.repartidor_nombre ? `Repartidor: ${pedido.repartidor_nombre}` : 'En ruta') : null
    },
    {
      pas: 'entregat',
      text: 'Lliurat',
      completat: indexActual >= 5,
      actiu: indexActual === 5,
      data: indexActual >= 5 ? (pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleString('ca-ES') : 'Completat') : null
    }
  ];
}
