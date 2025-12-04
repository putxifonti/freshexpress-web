// src/pages/api/track.ts - Endpoint de tracking per recollida de dades
import type { APIRoute } from 'astro';
import { 
  processTrackingEvent, 
  processTrackingBatch,
  getDeviceType,
  getBrowserFamily,
  getOS,
  generateSessionId,
  type TrackingEvent
} from '../../lib/tracking';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    
    // Obtenir informació del navegador
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Obtenir o crear session_id
    let sessionId = cookies.get('tracking_session')?.value;
    if (!sessionId) {
      sessionId = generateSessionId();
      cookies.set('tracking_session', sessionId, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 30 // 30 minuts
      });
    }

    // Obtenir hash d'usuari si està autenticat
    let userHash: string | undefined;
    const authCookie = cookies.get('auth_token')?.value;
    if (authCookie) {
      // Podríem verificar el token i obtenir el hash, però per ara simplifiquem
      userHash = body.userHash;
    }

    // Determinar si és un lot d'events o un sol event
    if (Array.isArray(body.events)) {
      // Processar lot d'events
      const events: TrackingEvent[] = body.events.map((evt: any) => ({
        session_id: sessionId!,
        user_hash: userHash,
        tipo_evento: evt.type || evt.tipo_evento,
        elemento: evt.element || evt.elemento,
        categoria_elemento: evt.category || evt.categoria_elemento,
        datos_evento: evt.data || evt.datos_evento,
        url: evt.url,
        url_anterior: evt.previousUrl || referer,
        x_percent: evt.x,
        y_percent: evt.y,
        dispositivo: getDeviceType(userAgent),
        navegador_familia: getBrowserFamily(userAgent),
        sistema_operativo: getOS(userAgent),
        resolucion_pantalla: evt.resolution || evt.resolucion_pantalla,
        pais: 'ES', // Podria obtenir-se de geolocalització IP
        region: evt.region,
        ciudad: evt.city || evt.ciudad,
        tiempo_en_pagina_ms: evt.timeOnPage || evt.tiempo_en_pagina_ms
      }));

      const result = await processTrackingBatch(events);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          processed: result.success,
          failed: result.failed
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Processar un sol event
      const event: TrackingEvent = {
        session_id: sessionId,
        user_hash: userHash,
        tipo_evento: body.type || body.tipo_evento,
        elemento: body.element || body.elemento,
        categoria_elemento: body.category || body.categoria_elemento,
        datos_evento: body.data || body.datos_evento,
        url: body.url,
        url_anterior: body.previousUrl || referer,
        x_percent: body.x,
        y_percent: body.y,
        dispositivo: getDeviceType(userAgent),
        navegador_familia: getBrowserFamily(userAgent),
        sistema_operativo: getOS(userAgent),
        resolucion_pantalla: body.resolution || body.resolucion_pantalla,
        pais: 'ES',
        region: body.region,
        ciudad: body.city || body.ciudad,
        tiempo_en_pagina_ms: body.timeOnPage || body.tiempo_en_pagina_ms
      };

      const success = await processTrackingEvent(event);
      
      return new Response(
        JSON.stringify({ 
          success,
          sessionId
        }),
        { 
          status: success ? 200 : 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error en tracking:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error processant tracking' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// GET per verificar estat del tracking
export const GET: APIRoute = async ({ cookies }) => {
  const sessionId = cookies.get('tracking_session')?.value;
  
  return new Response(
    JSON.stringify({ 
      tracking: true,
      hasSession: !!sessionId,
      sessionId: sessionId || null
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
