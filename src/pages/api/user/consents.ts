// src/pages/api/user/consents.ts - Actualitzar consentiments
import type { APIRoute } from 'astro';
import { verifyToken, updateUserConsents } from '../../../lib/auth';

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
    const { marketing, analitica, data_broker, newsletter } = body;

    const success = await updateUserConsents(payload.userId, {
      marketing,
      analitica,
      data_broker,
      newsletter
    });

    if (success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Error actualitzant consentiments' }), { status: 500 });
    }
  } catch (error) {
    console.error('Error actualitzant consentiments:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};
