import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';

// PUT - Actualitzar disponibilitat del repartidor
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
    const { disponible } = body;

    if (typeof disponible !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Valor de disponibilitat invàlid' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Actualitzar disponibilitat
    await queryOperacional(
      'UPDATE repartidores SET disponible = ? WHERE usuario_id = ?',
      [disponible ? 1 : 0, user.id]
    );

    return new Response(JSON.stringify({ 
      success: true, 
      disponible,
      message: disponible ? 'Ara estàs disponible per rebre comandes' : 'Has desactivat la teva disponibilitat'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error actualitzant disponibilitat:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET - Obtenir estat de disponibilitat
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

    const repartidor = await queryOperacional<any[]>(
      'SELECT disponible FROM repartidores WHERE usuario_id = ?',
      [user.id]
    );

    return new Response(JSON.stringify({ 
      success: true, 
      disponible: repartidor[0]?.disponible === 1
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obtenint disponibilitat:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
