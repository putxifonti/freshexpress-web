import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';

// PUT - Actualitzar direcció de l'usuari
export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'No autenticat' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Token invàlid' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { direccion } = body;

    if (!direccion || direccion.trim() === '') {
      return new Response(JSON.stringify({ success: false, error: 'La direcció és obligatòria' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Actualitzar direcció
    await queryOperacional(
      'UPDATE usuarios SET direccion = ? WHERE id = ?',
      [direccion.trim(), payload.userId]
    );

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Direcció actualitzada correctament'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error actualitzant direcció:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Error del servidor' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
