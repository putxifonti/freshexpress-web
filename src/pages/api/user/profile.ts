// src/pages/api/user/profile.ts - Actualitzar perfil
import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'No autenticat' }), { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Token invàlid' }), { status: 401 });
    }

    const body = await request.json();
    const { nombre, telefono, direccion, ciudad, codigo_postal } = body;

    await queryOperacional(
      `UPDATE usuarios SET 
        nombre = COALESCE(?, nombre),
        telefono = ?,
        direccion = ?,
        ciudad = ?,
        codigo_postal = ?
       WHERE id = ?`,
      [nombre, telefono || null, direccion || null, ciudad || null, codigo_postal || null, payload.userId]
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error actualitzant perfil:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};
