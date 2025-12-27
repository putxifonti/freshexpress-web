import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../../lib/auth';
import { queryOperacional } from '../../../../lib/db';

// POST - Optimitzar ruta (ordenar per codi postal / zones)
export const POST: APIRoute = async ({ cookies }) => {
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

    // Obtenir repartidor_id
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

    // Obtenir tots els pedidos pendents assignats a aquest repartidor
    const pedidos = await queryOperacional<any[]>(`
      SELECT 
        p.id,
        p.direccion_entrega,
        p.estado,
        u.ciudad,
        u.codigo_postal
      FROM pedidos p
      JOIN usuarios u ON p.cliente_id = u.id
      WHERE p.repartidor_id = ? 
      AND p.estado NOT IN ('entregado', 'cancelado')
      ORDER BY p.fecha_pedido ASC
    `, [repartidorId]);

    if (pedidos.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No hi ha entregues per optimitzar' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Optimització simple: 
    // 1. Primer els que ja estan "en_camino"
    // 2. Després els "listo" (ja recollits)
    // 3. Finalment els "confirmado" (pendents de recollir)
    // Dins de cada grup, ordenar per codi postal per agrupar zones
    
    const prioritatEstat: Record<string, number> = {
      'en_camino': 1,
      'listo': 2,
      'confirmado': 3,
      'preparando': 4,
      'pendiente': 5
    };

    const pedidosOrdenats = [...pedidos].sort((a, b) => {
      // Primer per estat
      const estatA = prioritatEstat[a.estado] || 99;
      const estatB = prioritatEstat[b.estado] || 99;
      if (estatA !== estatB) return estatA - estatB;
      
      // Després per codi postal (agrupar per zones)
      const cpA = a.codigo_postal || '';
      const cpB = b.codigo_postal || '';
      return cpA.localeCompare(cpB);
    });

    // Calcular temps estimat per cada entrega
    let tempsAcumulat = 0;
    for (const pedido of pedidosOrdenats) {
      // Temps estimat: 5-15 min per entrega depenent de l'estat
      const tempsBase = pedido.estado === 'en_camino' ? 5 : 
                        pedido.estado === 'listo' ? 8 : 12;
      tempsAcumulat += tempsBase;
      
      // Actualitzar temps estimat
      await queryOperacional(
        'UPDATE pedidos SET tiempo_estimado_min = ? WHERE id = ?',
        [tempsAcumulat, pedido.id]
      );
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Ruta optimitzada amb ${pedidosOrdenats.length} entregues`,
      entregues: pedidosOrdenats.length,
      tempsTotal: tempsAcumulat
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error optimitzant ruta:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
