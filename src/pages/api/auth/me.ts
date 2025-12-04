// src/pages/api/auth/me.ts - Endpoint per obtenir usuari actual
import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get('auth_token')?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No autenticat' 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar token
    const payload = verifyToken(token);
    if (!payload) {
      cookies.delete('auth_token', { path: '/' });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Token invàlid o expirat' 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtenir dades de l'usuari
    const user = await getUserById(payload.userId);
    if (!user) {
      cookies.delete('auth_token', { path: '/' });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Usuari no trobat' 
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error obtenint usuari:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error intern del servidor' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
