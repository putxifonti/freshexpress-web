// src/pages/api/user/delete.ts - Eliminar compte
import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';
import { queryOperacional, queryBroker } from '../../../lib/db';

export const DELETE: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'No autenticat' }), { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Token invàlid' }), { status: 401 });
    }

    // Obtenir hash d'anonimització per eliminar del data broker
    const users = await queryOperacional<any[]>(
      'SELECT hash_anonimizacion FROM usuarios WHERE id = ?',
      [payload.userId]
    );

    if (users.length > 0 && users[0].hash_anonimizacion) {
      // Eliminar dades del data broker
      try {
        await queryBroker('DELETE FROM datos_anonimos WHERE hash_usuario = ?', [users[0].hash_anonimizacion]);
      } catch {
        // Ignorar errors del data broker
      }
    }

    // Eliminar consentiments
    await queryOperacional('DELETE FROM consentimientos WHERE usuario_id = ?', [payload.userId]);

    // Marcar usuari com eliminat (soft delete) o eliminar
    await queryOperacional(
      "UPDATE usuarios SET estado = 'eliminado', email = CONCAT('deleted_', id, '_', email) WHERE id = ?",
      [payload.userId]
    );

    // Eliminar cookie
    cookies.delete('auth_token', { path: '/' });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error eliminant compte:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};
