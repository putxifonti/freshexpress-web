import { v4 } from 'uuid';
import { a as queryBroker } from '../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../renderers.mjs';

function getDeviceType(userAgent) {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(ua) && !/tablet|ipad/.test(ua)) {
    return "mobile";
  }
  if (/tablet|ipad/.test(ua)) {
    return "tablet";
  }
  return "desktop";
}
function getBrowserFamily(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("edg")) return "Edge";
  if (ua.includes("chrome")) return "Chrome";
  if (ua.includes("safari")) return "Safari";
  if (ua.includes("opera") || ua.includes("opr")) return "Opera";
  return "Other";
}
function getOS(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac")) return "macOS";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("android")) return "Android";
  if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  return "Other";
}
function generateSessionId() {
  return `sess_${v4().replace(/-/g, "").substring(0, 16)}_${Date.now()}`;
}
async function processTrackingEvent(event) {
  try {
    await queryBroker(
      `INSERT INTO eventos_web (
        session_id, user_hash, tipo_evento, elemento, categoria_elemento,
        datos_evento, url, url_anterior, x_percent, y_percent,
        dispositivo, navegador_familia, sistema_operativo, resolucion_pantalla,
        pais, region, ciudad, fecha_evento, tiempo_en_pagina_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        event.session_id,
        event.user_hash || null,
        event.tipo_evento,
        event.elemento || null,
        event.categoria_elemento || null,
        event.datos_evento ? JSON.stringify(event.datos_evento) : null,
        event.url || null,
        event.url_anterior || null,
        event.x_percent || null,
        event.y_percent || null,
        event.dispositivo || "desktop",
        event.navegador_familia || null,
        event.sistema_operativo || null,
        event.resolucion_pantalla || null,
        event.pais || "ES",
        event.region || null,
        event.ciudad || null,
        event.tiempo_en_pagina_ms || null
      ]
    );
    const isEcoEvent = (event.elemento || "").includes("eco") || (event.categoria_elemento || "").includes("eco");
    await queryBroker(
      `INSERT INTO sesiones_web (
        session_id, user_hash, fecha_inicio, fecha_fin, 
        total_eventos, paginas_vistas, clics_eco, dispositivo, pais, region
      ) VALUES (?, ?, NOW(), NOW(), 1, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        user_hash = COALESCE(VALUES(user_hash), user_hash),
        fecha_fin = NOW(),
        duracion_segundos = TIMESTAMPDIFF(SECOND, fecha_inicio, NOW()),
        total_eventos = total_eventos + 1,
        paginas_vistas = paginas_vistas + ?,
        clics_eco = clics_eco + ?,
        llego_carrito = llego_carrito OR ?,
        llego_checkout = llego_checkout OR ?,
        compra_completada = compra_completada OR ?`,
      [
        event.session_id,
        event.user_hash || null,
        event.tipo_evento === "pageview" ? 1 : 0,
        isEcoEvent ? 1 : 0,
        event.dispositivo || "desktop",
        event.pais || "ES",
        event.region || null,
        event.tipo_evento === "pageview" ? 1 : 0,
        isEcoEvent ? 1 : 0,
        event.tipo_evento === "add_to_cart",
        event.tipo_evento === "checkout_start",
        event.tipo_evento === "purchase"
      ]
    );
    return true;
  } catch (error) {
    console.error("Error processant event de tracking:", error);
    return false;
  }
}
async function processTrackingBatch(events) {
  let success = 0;
  let failed = 0;
  for (const event of events) {
    const result = await processTrackingEvent(event);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }
  return { success, failed };
}

const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    let sessionId = cookies.get("tracking_session")?.value;
    if (!sessionId) {
      sessionId = generateSessionId();
      cookies.set("tracking_session", sessionId, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 30
        // 30 minuts
      });
    }
    let userHash;
    const authCookie = cookies.get("auth_token")?.value;
    if (authCookie) {
      userHash = body.userHash;
    }
    if (Array.isArray(body.events)) {
      const events = body.events.map((evt) => ({
        session_id: sessionId,
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
        pais: "ES",
        // Podria obtenir-se de geolocalització IP
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
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const event = {
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
        pais: "ES",
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
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error("Error en tracking:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error processant tracking"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const GET = async ({ cookies }) => {
  const sessionId = cookies.get("tracking_session")?.value;
  return new Response(
    JSON.stringify({
      tracking: true,
      hasSession: !!sessionId,
      sessionId: sessionId || null
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
