// src/pages/api/admin/users/[id]/status.ts - Canviar estat d'usuari
import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../../../lib/auth';
import { queryOperacional } from '../../../../../lib/db';

export const PUT: APIRoute = async ({ request, cookies, params }) => {
  try {
    // Verificar autenticació
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'No autenticat' }), { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Token invàlid' }), { status: 401 });
    }

    // Verificar que és admin
    const currentUser = await getUserById(payload.userId);
    if (!currentUser || currentUser.rol !== 'admin') {
      return new Response(JSON.stringify({ success: false, error: 'No autoritzat' }), { status: 403 });
    }

    const userId = params.id;
    const body = await request.json();
    const { estado, rol } = body;

    // No permetre auto-desactivació
    if (parseInt(userId!) === payload.userId && estado !== 'activo') {
      return new Response(JSON.stringify({ success: false, error: 'No pots desactivar el teu propi compte' }), { status: 400 });
    }

    // Actualitzar estat o rol
    if (estado) {
      await queryOperacional('UPDATE usuarios SET estado = ? WHERE id = ?', [estado, userId]);
    }
    if (rol) {
      await queryOperacional('UPDATE usuarios SET rol = ? WHERE id = ?', [rol, userId]);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error actualitzant usuari:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};
