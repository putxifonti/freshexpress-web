import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';

// PUT - Actualitzar configuració del repartidor
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
    const { vehiculo_tipo, matricula, zona_preferida, radio_km, licencia_conducir } = body;

    // Convertir undefined a null per evitar errors SQL
    const values = {
      vehiculo_tipo: vehiculo_tipo ?? null,
      matricula: matricula ?? null,
      zona_preferida: zona_preferida ?? null,
      radio_km: radio_km ?? null,
      licencia_conducir: licencia_conducir ?? null
    };

    // Verificar si ja existeix un registre de repartidor
    const existeix = await queryOperacional<any[]>(
      'SELECT id FROM repartidores WHERE usuario_id = ?',
      [user.id]
    );

    if (existeix.length > 0) {
      // Actualitzar
      await queryOperacional(`
        UPDATE repartidores SET 
          vehiculo_tipo = ?,
          matricula = ?,
          zona_preferida = ?,
          radio_km = ?,
          licencia_conducir = ?,
          fecha_actualizacion = NOW()
        WHERE usuario_id = ?
      `, [values.vehiculo_tipo, values.matricula, values.zona_preferida, values.radio_km, values.licencia_conducir, user.id]);
    } else {
      // Error: No hauria d'arribar aquí si l'usuari té rol repartidor però no té registre
      return new Response(JSON.stringify({ 
        error: 'Error de consistència: No es pot trobar el registre de repartidor. Contacta amb l\'administrador.' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error actualitzant configuració:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET - Obtenir configuració del repartidor
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
      'SELECT * FROM repartidores WHERE usuario_id = ?',
      [user.id]
    );

    return new Response(JSON.stringify({ 
      success: true, 
      configuracio: repartidor[0] || null 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obtenint configuració:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
