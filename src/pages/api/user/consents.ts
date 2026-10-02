// src/pages/api/user/consents.ts - Actualitzar consentiments
import type { APIRoute } from 'astro';
import { verifyToken, updateUserConsents } from '../../../lib/auth';

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'No autenticat' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Token invàlid' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { acepta_comunicaciones, analytics, compartir_datos } = body;

    const success = await updateUserConsents(payload.userId, {
      acepta_comunicaciones,
      analytics,
      compartir_datos
    });

    if (success) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Consentiments actualitzats correctament' 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Error actualitzant consentiments a la base de dades' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error actualitzant consentiments:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error intern del servidor'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
