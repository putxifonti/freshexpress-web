// API per actualitzar quantitat o eliminar item de la cistella
import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';

export const PUT: APIRoute = async ({ request, cookies, params }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'No autenticat' }), { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Token invàlid' }), { status: 401 });
    }

    const cartItemId = params.id;
    const body = await request.json();
    const { quantity } = body;

    if (quantity < 1) {
      // Eliminar si la quantitat és 0 o menys
      await queryOperacional(
        'DELETE FROM carrito WHERE id = ? AND usuario_id = ?',
        [cartItemId, payload.userId]
      );
    } else {
      await queryOperacional(
        'UPDATE carrito SET cantidad = ? WHERE id = ? AND usuario_id = ?',
        [quantity, cartItemId, payload.userId]
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Error actualitzant cistella:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ cookies, params }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'No autenticat' }), { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Token invàlid' }), { status: 401 });
    }

    const cartItemId = params.id;

    await queryOperacional(
      'DELETE FROM carrito WHERE id = ? AND usuario_id = ?',
      [cartItemId, payload.userId]
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Error eliminant de cistella:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};
