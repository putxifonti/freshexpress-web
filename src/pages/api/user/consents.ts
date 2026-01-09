// src/pages/api/user/consents.ts - Actualitzar consentiments
import type { APIRoute } from 'astro';
import { verifyToken, updateUserConsents } from '../../../lib/auth';

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      console.error('No auth token');
      return new Response(JSON.stringify({ success: false, error: 'No autenticat' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.error('Token invàlid');
      return new Response(JSON.stringify({ success: false, error: 'Token invàlid' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { acepta_comunicaciones, analytics, compartir_datos } = body;

    console.log('=== API CONSENTIMENTS ===');
    console.log('Usuario ID:', payload.userId);
    console.log('Body rebut:', body);
    console.log('Consentiments a actualitzar:', {
      acepta_comunicaciones,
      analytics,
      compartir_datos
    });

    const success = await updateUserConsents(payload.userId, {
      acepta_comunicaciones,
      analytics,
      compartir_datos
    });

    if (success) {
      console.log('✅ Consentiments actualitzats correctament');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Consentiments actualitzats correctament' 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('❌ updateUserConsents ha retornat false');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Error actualitzant consentiments a la base de dades' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    console.error('❌ EXCEPCIÓ a API consentiments:', error);
    console.error('Stack trace:', error.stack);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Error del servidor: ' + (error.message || 'Unknown error')
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
