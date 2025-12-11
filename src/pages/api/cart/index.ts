// API per obtenir la cistella
import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Verificar autenticació
    const token = cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'No autenticat' }), { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Token invàlid' }), { status: 401 });
    }

    // Obtenir items de la cistella amb informació del producte i empresa
    const items = await queryOperacional<any[]>(`
      SELECT 
        c.id as cart_id,
        c.cantidad,
        p.id as producto_id,
        p.nombre,
        p.precio,
        p.precio_oferta,
        p.unidad,
        p.eco,
        e.nombre as empresa_nombre,
        e.id as empresa_id
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      JOIN empresas e ON p.empresa_id = e.id
      WHERE c.usuario_id = ?
      ORDER BY e.nombre, p.nombre
    `, [payload.userId]);

    // Calcular totals
    let subtotal = 0;
    let totalItems = 0;
    items.forEach(item => {
      const precio = item.precio_oferta || item.precio;
      subtotal += precio * item.cantidad;
      totalItems += item.cantidad;
    });

    return new Response(JSON.stringify({ 
      success: true, 
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      totalItems
    }), { status: 200 });

  } catch (error) {
    console.error('Error obtenint cistella:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};
