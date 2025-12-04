// src/pages/api/auth/register.ts - Endpoint de registre
import type { APIRoute } from 'astro';
import { registerUser } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    
    const { 
      nombre, 
      apellidos, 
      email, 
      telefono, 
      password, 
      direccion_envio,
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

    // Validar contrasenya (mínim 8 caràcters)
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'La contrasenya ha de tenir mínim 8 caràcters' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Processar consentiments
    const consents = {
      marketing: consentimientos?.marketing || false,
      analytics: consentimientos?.analytics || false,
      databroker: consentimientos?.databroker || false,
      comunicaciones: consentimientos?.comunicaciones || false
    };

    // Registrar usuari
    const result = await registerUser({
      nombre,
      apellidos: apellidos || '',
      email,
      telefono: telefono || null,
      password,
      direccion: direccion_envio || null,
      consentimiento_marketing: consents.marketing,
      consentimiento_analytics: consents.analytics,
      consentimiento_databroker: consents.databroker
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
