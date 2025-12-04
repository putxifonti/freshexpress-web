// src/pages/api/auth/login.ts - Endpoint de login
import type { APIRoute } from 'astro';
import { loginUser } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validacions bàsiques
    if (!email || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email i contrasenya són obligatoris' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Intentar login
    const result = await loginUser(email, password);

    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: result.error 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Establir cookie amb el token
    cookies.set('auth_token', result.token!, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dies
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sessió iniciada correctament',
        user: result.user
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en login:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error intern del servidor' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
