// src/pages/api/user/password.ts - Canviar contrasenya
import type { APIRoute } from 'astro';
import { verifyToken, hashPassword, verifyPassword } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';
import { isStrongPassword, PASSWORD_POLICY_MESSAGE } from '../../../lib/password-policy';

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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ success: false, error: 'Falten camps obligatoris' }), { status: 400 });
    }

    if (typeof currentPassword !== 'string' || !isStrongPassword(newPassword)) {
      return new Response(JSON.stringify({ success: false, error: PASSWORD_POLICY_MESSAGE }), { status: 400 });
    }

    // Obtenir contrasenya actual
    const users = await queryOperacional<any[]>(
      'SELECT password FROM usuarios WHERE id = ?',
      [payload.userId]
    );

    if (users.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Usuari no trobat' }), { status: 404 });
    }

    // Verificar contrasenya actual
    const isValid = await verifyPassword(currentPassword, users[0].password);
    if (!isValid) {
      return new Response(JSON.stringify({ success: false, error: 'Contrasenya actual incorrecta' }), { status: 400 });
    }

    // Actualitzar contrasenya
    const newHash = await hashPassword(newPassword);
    await queryOperacional(
      'UPDATE usuarios SET password = ? WHERE id = ?',
      [newHash, payload.userId]
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error canviant contrasenya:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};
