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
    const { nombre, apellidos, telefono, direccion, ciudad, provincia, codigo_postal } = body;

    await queryOperacional(
      `UPDATE usuarios SET 
        nombre = COALESCE(?, nombre),
        apellidos = COALESCE(?, apellidos),
        telefono = ?,
        direccion = ?,
        ciudad = ?,
        provincia = ?,
        codigo_postal = ?
       WHERE id = ?`,
      [nombre, apellidos, telefono, direccion, ciudad, provincia, codigo_postal, payload.userId]
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error actualitzant perfil:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};
