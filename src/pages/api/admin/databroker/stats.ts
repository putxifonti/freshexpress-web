// src/pages/api/admin/databroker/stats.ts - Estadístiques del Data Broker
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
    const periodo = url.searchParams.get('periodo') || '7d'; // 7d, 30d, 90d, all
    let dateFilter = '';
    switch (periodo) {
      case '7d':
        dateFilter = 'AND fecha_evento >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case '30d':
        dateFilter = 'AND fecha_evento >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
      case '90d':
        dateFilter = 'AND fecha_evento >= DATE_SUB(NOW(), INTERVAL 90 DAY)';
        break;
      default:
        dateFilter = '';
    }

    // Estadístiques generals
    const [totalSessions] = await queryBroker<any[]>(
      `SELECT COUNT(*) as count FROM sesiones_web WHERE 1=1 ${dateFilter.replace('fecha_evento', 'fecha_inicio')}`
    );

    const [totalEvents] = await queryBroker<any[]>(
      `SELECT COUNT(*) as count FROM eventos_web WHERE 1=1 ${dateFilter}`
    );

    const [totalClicks] = await queryBroker<any[]>(
      `SELECT COUNT(*) as count FROM eventos_web WHERE tipo_evento = 'click' ${dateFilter}`
    );

    const [totalPageviews] = await queryBroker<any[]>(
      `SELECT COUNT(*) as count FROM eventos_web WHERE tipo_evento = 'pageview' ${dateFilter}`
    );

    // Pàgines més visitades
    const paginasVisitades = await queryBroker<any[]>(
      `SELECT 
        url_actual as pagina,
        COUNT(*) as visites,
        COUNT(DISTINCT sesion_id) as sessions_uniques
      FROM eventos_web 
      WHERE tipo_evento = 'pageview' ${dateFilter}
      GROUP BY url_actual
      ORDER BY visites DESC
      LIMIT 10`
    );

    // Elements més clicats
    const elementsClicats = await queryBroker<any[]>(
      `SELECT 
        elemento,
        categoria_evento as categoria,
        COUNT(*) as clics
      FROM eventos_web 
      WHERE tipo_evento = 'click' AND elemento IS NOT NULL ${dateFilter}
      GROUP BY elemento, categoria_evento
      ORDER BY clics DESC
      LIMIT 15`
    );

    // Distribució per dispositiu
    const dispositius = await queryBroker<any[]>(
      `SELECT 
        dispositivo as dispositiu,
        COUNT(*) as total
      FROM eventos_web 
      WHERE dispositivo IS NOT NULL ${dateFilter}
      GROUP BY dispositivo
      ORDER BY total DESC`
    );

    // Distribució per navegador
    const navegadors = await queryBroker<any[]>(
      `SELECT 
        navegador as navegador,
        COUNT(*) as total
      FROM eventos_web 
      WHERE navegador IS NOT NULL ${dateFilter}
      GROUP BY navegador
      ORDER BY total DESC`
    );

    // Events per hora (últims 7 dies)
    const eventsPerHora = await queryBroker<any[]>(
      `SELECT 
        HOUR(fecha_evento) as hora,
        COUNT(*) as total
      FROM eventos_web 
      WHERE fecha_evento >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY HOUR(fecha_evento)
      ORDER BY hora`
    );

    // Events per dia (últims 30 dies)
    const eventsPerDia = await queryBroker<any[]>(
      `SELECT 
        DATE(fecha_evento) as dia,
        COUNT(*) as total,
        COUNT(DISTINCT sesion_id) as sessions
      FROM eventos_web 
      WHERE fecha_evento >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(fecha_evento)
      ORDER BY dia`
    );

    return new Response(JSON.stringify({
      success: true,
      stats: {
        totalSessions: totalSessions?.count || 0,
        totalEvents: totalEvents?.count || 0,
        totalClicks: totalClicks?.count || 0,
        totalPageviews: totalPageviews?.count || 0
      },
      paginasVisitades,
      elementsClicats,
      dispositius,
      navegadors,
      eventsPerHora,
      eventsPerDia
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obtenint estadístiques data broker:', error);
    return new Response(JSON.stringify({ 
      error: 'Error obtenint estadístiques',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
};
