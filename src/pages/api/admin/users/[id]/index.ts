// src/pages/api/admin/users/[id]/index.ts - Actualitzar usuari
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
    const { nombre, email, rol } = body;

    // Validar rol
    const rolsValids = ['admin', 'repartidor', 'cliente'];
    if (rol && !rolsValids.includes(rol)) {
      return new Response(JSON.stringify({ success: false, error: 'Rol no vàlid' }), { status: 400 });
    }

    // No permetre auto-degradació d'admin
    if (parseInt(userId!) === payload.userId && rol !== 'admin') {
      return new Response(JSON.stringify({ success: false, error: 'No pots canviar el teu propi rol d\'admin' }), { status: 400 });
    }

    // Verificar si l'email ja existeix per un altre usuari
    if (email) {
      const existingUser = await queryOperacional<any[]>(
        'SELECT id FROM usuarios WHERE email = ? AND id != ?',
        [email, userId]
      );
      if (existingUser.length > 0) {
        return new Response(JSON.stringify({ success: false, error: 'Aquest email ja està en ús' }), { status: 400 });
      }
    }

    // Construir query dinàmica
    const updates: string[] = [];
    const values: any[] = [];

    if (nombre !== undefined) {
      updates.push('nombre = ?');
      values.push(nombre);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (rol) {
      updates.push('rol = ?');
      values.push(rol);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Cap dada a actualitzar' }), { status: 400 });
    }

    values.push(userId);
    await queryOperacional(
      `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error actualitzant usuari:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};

export const GET: APIRoute = async ({ cookies, params }) => {
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
    const users = await queryOperacional<any[]>(
      `SELECT u.id, u.email, u.nombre, u.estado, u.rol, u.fecha_registro, u.ultimo_login,
              c.compartir_datos, c.acepta_comunicaciones
       FROM usuarios u
       LEFT JOIN consentimientos c ON u.id = c.usuario_id
       WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Usuari no trobat' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, user: users[0] }), { status: 200 });
  } catch (error) {
    console.error('Error obtenint usuari:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};
