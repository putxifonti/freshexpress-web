// src/pages/api/auth/logout.ts - Endpoint de logout
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Eliminar cookie d'autenticació
    cookies.delete('auth_token', {
      path: '/'
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sessió tancada correctament' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en logout:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error tancant sessió' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
