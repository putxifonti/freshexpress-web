// src/pages/api/auth/register.ts - Endpoint de registre
import type { APIRoute } from 'astro';
import { registerUser } from '../../../lib/auth';
import { isStrongPassword, PASSWORD_POLICY_MESSAGE } from '../../../lib/password-policy';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    
    const { 
      nombre, 
      email, 
      telefono, 
      password, 
      consentimientos 
    } = body;

    // Validacions bàsiques
    if (!nombre || !email || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Falten camps obligatoris: nom, email i contrasenya' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Format d\'email invàlid' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Enforce the same policy on the server, even if browser checks are bypassed.
    if (!isStrongPassword(password)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: PASSWORD_POLICY_MESSAGE
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Processar consentiments (usar noms correctes de columnes)
    const consents = {
      acepta_comunicaciones: consentimientos?.acepta_comunicaciones || false,
      analytics: consentimientos?.analytics || false,
      compartir_datos: consentimientos?.compartir_datos || false
    };

    // Registrar usuari
    const result = await registerUser({
      nombre,
      email,
      telefono: telefono || null,
      password,
      acepta_comunicaciones: consents.acepta_comunicaciones,
      analytics: consents.analytics,
      compartir_datos: consents.compartir_datos
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: result.error 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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
        message: 'Usuari registrat correctament',
        user: result.user
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en registre:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error intern del servidor' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
