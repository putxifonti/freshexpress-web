// src/pages/api/admin/databroker/usuaris.ts - Estadístiques d'usuaris i comportament
import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../../lib/auth';
import { queryBroker, queryOperacional } from '../../../../lib/db';

export const GET: APIRoute = async ({ cookies, url }) => {
  try {
    // Verificar autenticació
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: 'No autenticat' }), { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Token invàlid' }), { status: 401 });
    }

    const user = await getUserById(payload.userId);
    if (!user || user.rol !== 'admin') {
      return new Response(JSON.stringify({ error: 'No autoritzat' }), { status: 403 });
    }

    // Paràmetres de filtre
    const periodo = url.searchParams.get('periodo') || '30d';
    let dateFilter = '';
    switch (periodo) {
      case '7d':
        dateFilter = 'AND fecha_registro >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case '30d':
        dateFilter = 'AND fecha_registro >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
      case '90d':
        dateFilter = 'AND fecha_registro >= DATE_SUB(NOW(), INTERVAL 90 DAY)';
        break;
      default:
        dateFilter = '';
    }

    // Usuaris registrats per dia
    const usuarisPerDia = await queryOperacional<any[]>(
      `SELECT 
        DATE(fecha_registro) as dia,
        COUNT(*) as nous_usuaris
      FROM usuarios
      WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(fecha_registro)
      ORDER BY dia`
    );

    // Usuaris per rol
    const usuarisPerRol = await queryOperacional<any[]>(
      `SELECT 
        rol,
        COUNT(*) as total
      FROM usuarios
      WHERE estado = 'activo'
      GROUP BY rol`
    );

    // Usuaris amb consentiments data broker
    const consentiments = await queryOperacional<any[]>(
      `SELECT 
        SUM(CASE WHEN compartir_datos = 1 THEN 1 ELSE 0 END) as compartir_datos,
        SUM(CASE WHEN acepta_comunicaciones = 1 THEN 1 ELSE 0 END) as acepta_comunicaciones,
        SUM(CASE WHEN analytics = 1 THEN 1 ELSE 0 END) as analytics,
        SUM(CASE WHEN recibir_ofertas = 1 THEN 1 ELSE 0 END) as recibir_ofertas,
        COUNT(*) as total
      FROM consentimientos`
    );

    // Comportament de compra (usuaris únics)
    const comportamentCompra = await queryOperacional<any[]>(
      `SELECT 
        u.id,
        COUNT(DISTINCT p.id) as total_pedidos,
        SUM(p.total) as total_gastado,
        AVG(p.total) as ticket_medio,
        MAX(p.fecha_pedido) as ultima_compra
      FROM usuarios u
      LEFT JOIN pedidos p ON u.id = p.cliente_id
      WHERE u.estado = 'activo' AND u.rol = 'cliente'
      GROUP BY u.id
      HAVING total_pedidos > 0
      ORDER BY total_gastado DESC
      LIMIT 20`
    );

    // Segments de clients
    const segments = await queryOperacional<any[]>(
      `SELECT 
        CASE 
          WHEN total_pedidos >= 10 THEN 'VIP (10+ pedidos)'
          WHEN total_pedidos >= 5 THEN 'Frequent (5-9 pedidos)'
          WHEN total_pedidos >= 2 THEN 'Regular (2-4 pedidos)'
          ELSE 'Nou (1 pedido)'
        END as segment,
        COUNT(*) as usuaris,
        AVG(total_gastado) as gasto_medio
      FROM (
        SELECT 
          u.id,
          COUNT(p.id) as total_pedidos,
          COALESCE(SUM(p.total), 0) as total_gastado
        FROM usuarios u
        LEFT JOIN pedidos p ON u.id = p.cliente_id
        WHERE u.estado = 'activo' AND u.rol = 'cliente'
        GROUP BY u.id
        HAVING total_pedidos > 0
      ) subquery
      GROUP BY segment
      ORDER BY gasto_medio DESC`
    );

    // Sessions per usuari (databroker)
    let sessionsUsuaris: any[] = [];
    try {
      sessionsUsuaris = await queryBroker<any[]>(
        `SELECT 
          DATE(fecha_inicio) as dia,
          COUNT(*) as sessions,
          COUNT(DISTINCT sesion_id) as sessions_uniques,
          AVG(duracion_segundos) as duracio_mitja
        FROM sesiones_web
        WHERE fecha_inicio >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(fecha_inicio)
        ORDER BY dia`
      );
    } catch (e) {
      console.error('Error obtenint sessions:', e);
    }

    // Dades anònimes (data broker)
    let dadesAnonimes: any[] = [];
    try {
      dadesAnonimes = await queryBroker<any[]>(
        `SELECT 
          nivel_compromiso_eco,
          frecuencia_compra,
          COUNT(*) as total
        FROM datos_anonimos
        GROUP BY nivel_compromiso_eco, frecuencia_compra`
      );
    } catch (e) {
      console.error('Error obtenint dades anònimes:', e);
    }

    // Resum
    const [totalUsuaris] = await queryOperacional<any[]>(
      `SELECT COUNT(*) as count FROM usuarios WHERE estado = 'activo'`
    );

    const [usuarisAmbCompres] = await queryOperacional<any[]>(
      `SELECT COUNT(DISTINCT cliente_id) as count FROM pedidos`
    );

    return new Response(JSON.stringify({
      success: true,
      resum: {
        totalUsuaris: totalUsuaris?.count || 0,
        usuarisAmbCompres: usuarisAmbCompres?.count || 0,
        consentimentsDataBroker: consentiments[0]?.compartir_datos || 0
      },
      usuarisPerDia,
      usuarisPerRol,
      consentiments: consentiments[0],
      comportamentCompra,
      segments,
      sessionsUsuaris,
      dadesAnonimes
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obtenint estadístiques usuaris:', error);
    return new Response(JSON.stringify({ 
      error: 'Error obtenint estadístiques',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
};
