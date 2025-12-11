import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../../lib/auth';
import { queryOperacional } from '../../../../lib/db';

// GET - Obtenir ruta actual
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

    const ruta = await queryOperacional<any[]>(`
      SELECT 
        e.id,
        e.direccion_entrega,
        e.codigo_postal,
        e.telefono_cliente,
        e.nombre_cliente,
        e.notas_entrega,
        e.hora_estimada_entrega,
        e.estado,
        r.orden,
        r.distancia_km,
        r.tiempo_estimado_min
      FROM ruta_actual r
      JOIN entregues e ON r.entrega_id = e.id
      WHERE r.repartidor_id = ?
      ORDER BY r.orden ASC
    `, [user.id]);

    return new Response(JSON.stringify({ success: true, ruta }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obtenint ruta:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT - Actualitzar ordre de la ruta
export const PUT: APIRoute = async ({ cookies, request }) => {
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

    const body = await request.json();
    const { ordre } = body; // Array de { entrega_id, orden }

    if (!ordre || !Array.isArray(ordre)) {
      return new Response(JSON.stringify({ error: 'Ordre requerit' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Actualitzar l'ordre de cada entrega
    for (const item of ordre) {
      await queryOperacional(
        'UPDATE ruta_actual SET orden = ? WHERE repartidor_id = ? AND entrega_id = ?',
        [item.orden, user.id, item.entrega_id]
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error actualitzant ruta:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Netejar ruta actual
export const DELETE: APIRoute = async ({ cookies }) => {
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

    await queryOperacional('DELETE FROM ruta_actual WHERE repartidor_id = ?', [user.id]);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error netejant ruta:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
