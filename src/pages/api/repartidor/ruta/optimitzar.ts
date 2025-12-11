import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../../lib/auth';
import { queryOperacional } from '../../../../lib/db';

// POST - Optimitzar ruta (ordenar per proximitat)
export const POST: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: 'No autenticat' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Token invàlid' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await getUserById(payload.userId);
    if (!user || user.rol !== 'repartidor') {
      return new Response(JSON.stringify({ error: 'No autoritzat' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtenir totes les entregues pendents de la ruta
    const entregues = await queryOperacional<any[]>(`
      SELECT 
        r.id as ruta_id,
        r.entrega_id,
        e.direccion_entrega,
        e.codigo_postal,
        e.estado,
        e.latitud,
        e.longitud
      FROM ruta_actual r
      JOIN entregues e ON r.entrega_id = e.id
      WHERE r.repartidor_id = ? AND e.estado IN ('pendiente', 'en_proceso')
      ORDER BY r.orden ASC
    `, [user.id]);

    if (entregues.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No hi ha entregues per optimitzar' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Optimització simple: ordenar per codi postal (agrupació per zones)
    // En producció, s'utilitzaria una API de routing real (Google Directions, OSRM, etc.)
    const entreguesOrdenades = [...entregues].sort((a, b) => {
      // Primer per codi postal
      const cpCompare = (a.codigo_postal || '').localeCompare(b.codigo_postal || '');
      if (cpCompare !== 0) return cpCompare;
      
      // Si tenen coordenades, ordenar per distància (simplificat)
      if (a.latitud && b.latitud && a.longitud && b.longitud) {
        // Aquí es podria calcular distància real
        return a.latitud - b.latitud;
      }
      
      return 0;
    });

    // Actualitzar l'ordre a la base de dades
    for (let i = 0; i < entreguesOrdenades.length; i++) {
      await queryOperacional(
        'UPDATE ruta_actual SET orden = ? WHERE id = ?',
        [i + 1, entreguesOrdenades[i].ruta_id]
      );
      
      // Calcular temps i distància estimats (simulació)
      const tempsEstimat = 5 + Math.floor(Math.random() * 15); // 5-20 min
      const distanciaEstimada = 0.5 + Math.random() * 3; // 0.5-3.5 km
      
      await queryOperacional(
        'UPDATE ruta_actual SET tiempo_estimado_min = ?, distancia_km = ? WHERE id = ?',
        [tempsEstimat, distanciaEstimada.toFixed(2), entreguesOrdenades[i].ruta_id]
      );
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Ruta optimitzada amb ${entreguesOrdenades.length} entregues`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error optimitzant ruta:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
