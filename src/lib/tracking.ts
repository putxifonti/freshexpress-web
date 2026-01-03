// src/lib/tracking.ts - Sistema de tracking per data broker
import { v4 as uuidv4 } from 'uuid';
import { queryBroker } from './db';

// Interfícies
export interface TrackingEvent {
  session_id: string;
  user_hash?: string;
  tipo_evento: string;
  elemento?: string;
  categoria_elemento?: string;
  datos_evento?: object;
  url?: string;
  url_anterior?: string;
  x_percent?: number;
  y_percent?: number;
  dispositivo?: 'mobile' | 'tablet' | 'desktop';
  navegador_familia?: string;
  sistema_operativo?: string;
  resolucion_pantalla?: string;
  pais?: string;
  region?: string;
  ciudad?: string;
  tiempo_en_pagina_ms?: number;
}

// Determinar tipus de dispositiu
export function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(ua) && !/tablet|ipad/.test(ua)) {
    return 'mobile';
  }
  if (/tablet|ipad/.test(ua)) {
    return 'tablet';
  }
  return 'desktop';
}

// Obtenir família del navegador
export function getBrowserFamily(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('edg')) return 'Edge';
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('safari')) return 'Safari';
  if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
  return 'Other';
}

// Obtenir sistema operatiu
export function getOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('mac')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
  return 'Other';
}

// Anonimitzar IP
export function anonymizeIP(ip: string): string {
  if (ip.includes('.')) {
    // IPv4: 192.168.1.1 -> 192.168.0.0
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.0.0`;
  }
  // IPv6: simplificar
  return ip.split(':').slice(0, 4).join(':') + '::';
}

// Generar session ID
export function generateSessionId(): string {
  return `sess_${uuidv4().replace(/-/g, '').substring(0, 16)}_${Date.now()}`;
}

// Processar event de tracking
export async function processTrackingEvent(event: TrackingEvent): Promise<boolean> {
  try {
    // Insertar event - usant les columnes correctes de la taula eventos_web
    await queryBroker(
      `INSERT INTO eventos_web (
        sesion_id, usuario_id, tipo_evento, elemento, categoria_evento,
        datos_evento, url_actual, url_referrer, 
        dispositivo, navegador, sistema_operativo, resolucion_pantalla,
        pais, region, ciudad, fecha_evento, tiempo_en_pagina
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        event.session_id,
        null, // usuario_id - es pot afegir si tenim l'usuari autenticat
        event.tipo_evento,
        event.elemento || null,
        event.categoria_elemento || null,
        event.datos_evento ? JSON.stringify(event.datos_evento) : null,
        event.url || null,
        event.url_anterior || null,
        event.dispositivo || 'desktop',
        event.navegador_familia || null,
        event.sistema_operativo || null,
        event.resolucion_pantalla || null,
        event.pais || 'ES',
        event.region || null,
        event.ciudad || null,
        event.tiempo_en_pagina_ms ? Math.floor(event.tiempo_en_pagina_ms / 1000) : null
      ]
    );

    // Actualitzar o crear sessió - usant les columnes correctes de sesiones_web
    const isProductEvent = event.tipo_evento === 'product_click' || event.tipo_evento === 'product_impression';
    const isCartEvent = event.tipo_evento === 'add_to_cart';
    const isClickEvent = event.tipo_evento === 'click';
    const isScrollEvent = event.tipo_evento === 'scroll';
    
    await queryBroker(
      `INSERT INTO sesiones_web (
        sesion_id, usuario_id, fecha_inicio, fecha_fin, 
        paginas_vistas, eventos_totales, clics_totales, scrolls_totales,
        productos_vistos, productos_carrito, dispositivo, pais, ciudad
      ) VALUES (?, ?, NOW(), NOW(), ?, 1, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        fecha_fin = NOW(),
        duracion_segundos = TIMESTAMPDIFF(SECOND, fecha_inicio, NOW()),
        eventos_totales = eventos_totales + 1,
        paginas_vistas = paginas_vistas + ?,
        clics_totales = clics_totales + ?,
        scrolls_totales = scrolls_totales + ?,
        productos_vistos = productos_vistos + ?,
        productos_carrito = productos_carrito + ?,
        conversion = conversion OR ?`,
      [
        event.session_id,
        null, // usuario_id
        event.tipo_evento === 'pageview' ? 1 : 0,
        isClickEvent ? 1 : 0,
        isScrollEvent ? 1 : 0,
        isProductEvent ? 1 : 0,
        isCartEvent ? 1 : 0,
        event.dispositivo || 'desktop',
        event.pais || 'ES',
        event.ciudad || null,
        // ON DUPLICATE KEY UPDATE values
        event.tipo_evento === 'pageview' ? 1 : 0,
        isClickEvent ? 1 : 0,
        isScrollEvent ? 1 : 0,
        isProductEvent ? 1 : 0,
        isCartEvent ? 1 : 0,
        event.tipo_evento === 'purchase'
      ]
    );

    return true;
  } catch (error) {
    console.error('Error processant event de tracking:', error);
    return false;
  }
}

// Processar lot d'events
export async function processTrackingBatch(events: TrackingEvent[]): Promise<{ success: number; failed: number }> {
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

// Actualitzar comportament de compra anònim
export async function updateAnonymousBehavior(
  userHash: string,
  productHash: string,
  cantidad: number,
  precio: number,
  isEco: boolean
): Promise<boolean> {
  try {
    const periodo = new Date().toISOString().substring(0, 7); // YYYY-MM
    const month = new Date().getMonth();
    const temporada = month < 3 || month === 11 ? 'invierno' :
                     month < 6 ? 'primavera' :
                     month < 9 ? 'verano' : 'otoño';

    await queryBroker(
      `INSERT INTO comportamiento_compras_anonimo (
        hash_usuario, hash_producto, periodo_compra, temporada,
        veces_comprado, cantidad_total, gasto_total
      ) VALUES (?, ?, ?, ?, 1, ?, ?)
      ON DUPLICATE KEY UPDATE
        veces_comprado = veces_comprado + 1,
        cantidad_total = cantidad_total + ?,
        gasto_total = gasto_total + ?,
        frecuencia_producto = CASE
          WHEN veces_comprado + 1 >= 5 THEN 'frecuente'
          WHEN veces_comprado + 1 >= 3 THEN 'recurrente'
          WHEN veces_comprado + 1 >= 2 THEN 'ocasional'
          ELSE 'unica'
        END,
        fecha_actualizacion = NOW()`,
      [
        userHash, productHash, periodo, temporada,
        cantidad, precio * cantidad,
        cantidad, precio * cantidad
      ]
    );

    // Actualitzar dades anònimes de l'usuari
    await queryBroker(
      `UPDATE datos_anonimos SET 
        total_compras = total_compras + 1,
        fecha_ultima_compra = CURDATE(),
        ticket_promedio = (COALESCE(ticket_promedio, 0) * (total_compras - 1) + ?) / total_compras,
        porcentaje_compra_eco = CASE
          WHEN ? THEN LEAST(100, porcentaje_compra_eco + 5)
          ELSE GREATEST(0, porcentaje_compra_eco - 1)
        END,
        fecha_actualizacion = NOW()
      WHERE hash_usuario = ?`,
      [precio * cantidad, isEco, userHash]
    );

    return true;
  } catch (error) {
    console.error('Error actualitzant comportament anònim:', error);
    return false;
  }
}
