// API per afegir producte a la cistella
import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';
import { queryOperacional } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
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

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return new Response(JSON.stringify({ success: false, error: 'ID de producte requerit' }), { status: 400 });
    }

    // Verificar que el producte existeix
    const products = await queryOperacional<any[]>(
      'SELECT id FROM productos WHERE id = ? AND activo = 1',
      [productId]
    );

    if (products.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Producte no trobat' }), { status: 404 });
    }

    // Inserir o actualitzar la cistella
    await queryOperacional(`
      INSERT INTO carrito (usuario_id, producto_id, cantidad)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE cantidad = cantidad + ?
    `, [payload.userId, productId, quantity, quantity]);

    // Obtenir el total d'articles a la cistella
    const cartCount = await queryOperacional<any[]>(
      'SELECT SUM(cantidad) as total FROM carrito WHERE usuario_id = ?',
      [payload.userId]
    );

    return new Response(JSON.stringify({ 
      success: true, 
      cartCount: cartCount[0]?.total || 0 
    }), { status: 200 });

  } catch (error) {
    console.error('Error afegint a cistella:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 });
  }
};
