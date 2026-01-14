// src/pages/api/admin/databroker/productes.ts - Estadístiques de productes
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
    let dateFilterPedidos = '';
    switch (periodo) {
      case '7d':
        dateFilter = 'AND ew.fecha_evento >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        dateFilterPedidos = 'AND p.fecha_pedido >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case '30d':
        dateFilter = 'AND ew.fecha_evento >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        dateFilterPedidos = 'AND p.fecha_pedido >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
      case '90d':
        dateFilter = 'AND ew.fecha_evento >= DATE_SUB(NOW(), INTERVAL 90 DAY)';
        dateFilterPedidos = 'AND p.fecha_pedido >= DATE_SUB(NOW(), INTERVAL 90 DAY)';
        break;
      default:
        dateFilter = '';
        dateFilterPedidos = '';
    }

    // Productes més demanats (de la BD operacional)
    const productesMesDemands = await queryOperacional<any[]>(
      `SELECT 
        pr.id,
        pr.nombre,
        pr.categoria,
        pr.precio,
        pr.imagen,
        e.nombre as empresa,
        COUNT(dp.id) as vegades_demanat,
        SUM(dp.cantidad) as unitats_venudes,
        SUM(dp.subtotal) as ingressos
      FROM productos pr
      LEFT JOIN detalle_pedido dp ON pr.id = dp.producto_id
      LEFT JOIN pedidos p ON dp.pedido_id = p.id ${dateFilterPedidos}
      LEFT JOIN empresas e ON pr.empresa_id = e.id
      GROUP BY pr.id, pr.nombre, pr.categoria, pr.precio, pr.imagen, e.nombre
      HAVING unitats_venudes > 0
      ORDER BY unitats_venudes DESC
      LIMIT 20`
    );

    // Productes menys demanats (amb almenys 1 venda)
    const productesMenysDemands = await queryOperacional<any[]>(
      `SELECT 
        pr.id,
        pr.nombre,
        pr.categoria,
        pr.precio,
        pr.imagen,
        e.nombre as empresa,
        COUNT(dp.id) as vegades_demanat,
        SUM(dp.cantidad) as unitats_venudes
      FROM productos pr
      LEFT JOIN detalle_pedido dp ON pr.id = dp.producto_id
      LEFT JOIN pedidos p ON dp.pedido_id = p.id ${dateFilterPedidos}
      LEFT JOIN empresas e ON pr.empresa_id = e.id
      GROUP BY pr.id, pr.nombre, pr.categoria, pr.precio, pr.imagen, e.nombre
      HAVING unitats_venudes > 0
      ORDER BY unitats_venudes ASC
      LIMIT 10`
    );

    // Productes mai venuts
    const productesNoVenuts = await queryOperacional<any[]>(
      `SELECT 
        pr.id,
        pr.nombre,
        pr.categoria,
        pr.precio,
        pr.imagen,
        e.nombre as empresa,
        pr.fecha_creacion
      FROM productos pr
      LEFT JOIN detalle_pedido dp ON pr.id = dp.producto_id
      LEFT JOIN empresas e ON pr.empresa_id = e.id
      WHERE dp.id IS NULL AND pr.activo = 1
      ORDER BY pr.fecha_creacion DESC
      LIMIT 10`
    );

    // Vendes per categoria
    const vendesPerCategoria = await queryOperacional<any[]>(
      `SELECT 
        pr.categoria,
        COUNT(DISTINCT dp.pedido_id) as pedidos,
        SUM(dp.cantidad) as unitats,
        SUM(dp.subtotal) as ingressos
      FROM productos pr
      JOIN detalle_pedido dp ON pr.id = dp.producto_id
      JOIN pedidos p ON dp.pedido_id = p.id
      WHERE 1=1 ${dateFilterPedidos}
      GROUP BY pr.categoria
      ORDER BY ingressos DESC`
    );

    // Productes afegits al carret (tracking)
    let productesCarret: any[] = [];
    try {
      productesCarret = await queryBroker<any[]>(
        `SELECT 
          JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productId')) as product_id,
          COALESCE(
            p.nombre,
            JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productName')),
            CONCAT('Producte #', JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productId')))
          ) as product_name,
          COUNT(*) as vegades_afegit
        FROM eventos_web ew
        LEFT JOIN freshexpress_operacional.productos p 
          ON p.id = JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productId'))
        WHERE ew.tipo_evento = 'add_to_cart'
          AND ew.datos_evento IS NOT NULL ${dateFilter}
        GROUP BY product_id, product_name
        HAVING product_id IS NOT NULL
        ORDER BY vegades_afegit DESC
        LIMIT 15`
      );
    } catch (e) {
      console.error('Error obtenint productes carret:', e);
    }

    // Clicks en productes (tracking)
    let clicksProductes: any[] = [];
    try {
      clicksProductes = await queryBroker<any[]>(
        `SELECT 
          JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productId')) as product_id,
          COALESCE(
            p.nombre,
            JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productName')),
            CONCAT('Producte #', JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productId')))
          ) as product_name,
          COUNT(*) as clics
        FROM eventos_web ew
        LEFT JOIN freshexpress_operacional.productos p 
          ON p.id = JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productId'))
        WHERE ew.tipo_evento = 'product_click' 
          AND ew.datos_evento IS NOT NULL ${dateFilter}
        GROUP BY product_id, product_name
        HAVING product_id IS NOT NULL
        ORDER BY clics DESC
        LIMIT 15`
      );
    } catch (e) {
      console.error('Error obtenint clicks productes:', e);
    }

    // Resum general
    const [totalProductes] = await queryOperacional<any[]>(
      `SELECT COUNT(*) as count FROM productos WHERE activo = 1`
    );

    const [totalVenuts] = await queryOperacional<any[]>(
      `SELECT COUNT(DISTINCT producto_id) as count FROM detalle_pedido`
    );

    const [ingressosTotals] = await queryOperacional<any[]>(
      `SELECT SUM(dp.subtotal) as total 
       FROM detalle_pedido dp 
       JOIN pedidos p ON dp.pedido_id = p.id
       WHERE 1=1 ${dateFilterPedidos}`
    );

    return new Response(JSON.stringify({
      success: true,
      resum: {
        totalProductes: totalProductes?.count || 0,
        productesVenuts: totalVenuts?.count || 0,
        ingressosTotals: ingressosTotals?.total || 0
      },
      productesMesDemands,
      productesMenysDemands,
      productesNoVenuts,
      vendesPerCategoria,
      productesCarret,
      clicksProductes
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obtenint estadístiques productes:', error);
    return new Response(JSON.stringify({ 
      error: 'Error obtenint estadístiques',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
};
