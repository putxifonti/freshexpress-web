import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../../../lib/auth';
import { queryOperacional } from '../../../../../lib/db';

// POST - Reportar problema amb una entrega
export const POST: APIRoute = async ({ cookies, params, request }) => {
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

    const pedidoId = params.id;
    const body = await request.json();
    const { motiu, notes } = body;

    // Validar motiu
    const motiusValids = ['no_contesta', 'direccio_incorrecta', 'client_absent', 'producte_danyat', 'altre'];
    if (!motiu || !motiusValids.includes(motiu)) {
      return new Response(JSON.stringify({ error: 'Motiu no vàlid' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtenir el repartidor_id
    const repartidorData = await queryOperacional<any[]>(
      'SELECT id FROM repartidores WHERE usuario_id = ?',
      [user.id]
    );
    
    if (!repartidorData.length) {
      return new Response(JSON.stringify({ error: 'Repartidor no trobat' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const repartidorId = repartidorData[0].id;

    // Verificar que la comanda pertany a aquest repartidor
    const pedido = await queryOperacional<any[]>(
      'SELECT * FROM pedidos WHERE id = ? AND repartidor_id = ?',
      [pedidoId, repartidorId]
    );

    if (!pedido.length) {
      return new Response(JSON.stringify({ error: 'Comanda no trobada o no assignada a tu' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Traduir motiu a text descriptiu
    const motiuTexts: Record<string, string> = {
      'no_contesta': 'El client no contesta',
      'direccio_incorrecta': 'Direcció incorrecta',
      'client_absent': 'Client absent',
      'producte_danyat': 'Producte danyat',
      'altre': 'Altre motiu'
    };

    const motiuText = motiuTexts[motiu] || motiu;
    const notaCompleta = notes ? `${motiuText}: ${notes}` : motiuText;

    // Actualitzar pedido amb estat 'fallido' i guardar notes
    await queryOperacional(
      `UPDATE pedidos SET 
        estado = 'cancelado',
        notas_repartidor = ?,
        fecha_entrega = NOW()
       WHERE id = ?`,
      [notaCompleta, pedidoId]
    );

    // Crear registre d'incidència (opcional - si la taula existeix)
    try {
      await queryOperacional(`
        CREATE TABLE IF NOT EXISTS incidencias_entrega (
          id INT AUTO_INCREMENT PRIMARY KEY,
          pedido_id INT NOT NULL,
          repartidor_id INT NOT NULL,
          motiu VARCHAR(100) NOT NULL,
          notes TEXT,
          fecha_incidencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
        )
      `);
      
      await queryOperacional(
        `INSERT INTO incidencias_entrega (pedido_id, repartidor_id, motiu, notes) VALUES (?, ?, ?, ?)`,
        [pedidoId, repartidorId, motiu, notes || '']
      );
    } catch (e) {
      // Si falla la taula d'incidències, no és crític
      console.log('Nota: Taula incidencias_entrega no creada');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Problema reportat correctament' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error reportant problema:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
