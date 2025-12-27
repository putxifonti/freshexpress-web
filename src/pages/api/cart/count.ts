// API per obtenir el comptador de la cistella
import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ count: 0 }), { status: 200 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ count: 0 }), { status: 200 });
    }

    const result = await queryOperacional<any[]>(
      'SELECT SUM(cantidad) as total FROM carrito WHERE usuario_id = ?',
      [payload.userId]
    );

    return new Response(JSON.stringify({ 
      count: Number(result[0]?.total || 0) 
    }), { status: 200 });

  } catch (error) {
    console.error('Error obtenint comptador cistella:', error);
    return new Response(JSON.stringify({ count: 0 }), { status: 200 });
  }
};
