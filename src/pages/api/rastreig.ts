import type { APIRoute } from 'astro';
import { queryOperacional } from '../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const codiSeguiment = body.codiSeguiment?.trim().toUpperCase();

    if (!codiSeguiment) {
      return new Response(
        JSON.stringify({ error: 'Codi de seguiment no proporcionat' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Buscar la comanda per numero_pedido
    let pedidos = await queryOperacional<any[]>(
      `
      SELECT 
        p.id,
        p.numero_pedido,
        p.fecha_pedido,
        p.fecha_entrega,
        p.estado,
        p.total,
        p.direccion_entrega,
        r.usuario_id as repartidor_usuario_id,
        ur.nombre as repartidor_nombre,
        ur.telefono as repartidor_telefono
      FROM pedidos p
      LEFT JOIN repartidores r ON p.repartidor_id = r.id
      LEFT JOIN usuarios ur ON r.usuario_id = ur.id
      WHERE p.numero_pedido = ? OR p.numero_pedido LIKE ?
    `,
      [codiSeguiment, `%${codiSeguiment}%`]
    );

    // Si no es troba per numero_pedido, intentar per ID
    if (pedidos.length === 0) {
      const idNum = parseInt(codiSeguiment.replace(/\D/g, ''), 10);
      if (!isNaN(idNum)) {
        pedidos = await queryOperacional<any[]>(
          `
          SELECT 
            p.id,
            p.numero_pedido,
            p.fecha_pedido,
            p.fecha_entrega,
            p.estado,
            p.total,
            p.direccion_entrega,
            r.usuario_id as repartidor_usuario_id,
            ur.nombre as repartidor_nombre,
            ur.telefono as repartidor_telefono
          FROM pedidos p
          LEFT JOIN repartidores r ON p.repartidor_id = r.id
          LEFT JOIN usuarios ur ON r.usuario_id = ur.id
          WHERE p.id = ?
        `,
          [idNum]
        );
      }
    }

    if (pedidos.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No s\'ha trobat cap comanda amb aquest codi' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const pedido = pedidos[0];

    // Generar resposta
    const estatText = traduirEstat(pedido.estado);
    const estatColor = obtenirColorEstat(pedido.estado);
    const tempsEstimat = calcularTempsEstimat(pedido);
    const timeline = generarTimeline(pedido);

    return new Response(
      JSON.stringify({
        success: true,
        codiSeguiment: pedido.numero_pedido || `FE-${pedido.id}`,
        estat: estatText,
        estatColor,
        tempsEstimat,
        adreca: pedido.direccion_entrega || 'No especificada',
        repartidor: pedido.repartidor_nombre,
        telefon: pedido.repartidor_telefono,
        timeline,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en rastreig:', error);
    return new Response(
      JSON.stringify({ error: 'Error del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

function traduirEstat(estat: string): string {
  const traduccions: Record<string, string> = {
    pendiente: 'Pendent de confirmació',
    confirmado: 'Confirmat',
    preparando: 'En preparació',
    listo: 'Llest per recollir',
    en_camino: 'En camí',
    entregado: 'Lliurat',
    cancelado: 'Cancel·lat',
  };
  return traduccions[estat] || estat;
}

function obtenirColorEstat(estat: string): string {
  const colors: Record<string, string> = {
    pendiente: 'yellow',
    confirmado: 'blue',
    preparando: 'blue',
    listo: 'indigo',
    en_camino: 'purple',
    entregado: 'green',
    cancelado: 'red',
  };
  return colors[estat] || 'gray';
}

function calcularTempsEstimat(pedido: any): string {
  const estat = pedido.estado;

  if (estat === 'entregado') {
    const dataEntrega = pedido.fecha_entrega
      ? new Date(pedido.fecha_entrega).toLocaleString('ca-ES')
      : 'Completat';
    return `Lliurat: ${dataEntrega}`;
  }

  if (estat === 'cancelado') {
    return 'Comanda cancel·lada';
  }

  if (estat === 'en_camino') {
    return 'Arribant en 10-20 minuts';
  }

  return 'Menys de 30 minuts';
}

function generarTimeline(pedido: any) {
  const estat = pedido.estado;
  const timeline: any[] = [];

  // Comanda rebuda
  timeline.push({
    titol: '✓ Comanda rebuda',
    hora: new Date(pedido.fecha_pedido).toLocaleString('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  });

  // Confirmada (si estat >= confirmado)
  if (['confirmado', 'preparando', 'listo', 'en_camino', 'entregado'].includes(estat)) {
    timeline.push({
      titol: '✓ Comanda confirmada',
      hora: 'Processat',
    });
  }

  // En camí (si estat >= en_camino)
  if (['en_camino', 'entregado'].includes(estat)) {
    timeline.push({
      titol: pedido.repartidor_nombre
        ? `✓ En camí - Repartidor: ${pedido.repartidor_nombre}`
        : '✓ En camí',
      hora: pedido.repartidor_telefono
        ? `Telèfon: ${pedido.repartidor_telefono}`
        : 'En ruta',
    });
  }

  // Lliurat
  if (estat === 'entregado') {
    timeline.push({
      titol: '✓ Lliurat',
      hora: pedido.fecha_entrega
        ? new Date(pedido.fecha_entrega).toLocaleString('ca-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Completat',
    });
  }

  // Cancel·lat
  if (estat === 'cancelado') {
    timeline.push({
      titol: '✗ Comanda cancel·lada',
      hora: 'Cancel·lada pel sistema',
    });
  }

  return timeline;
}
