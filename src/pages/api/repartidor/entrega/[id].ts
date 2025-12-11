import type { APIRoute } from 'astro';
import { verifyToken, getUserById } from '../../../../lib/auth';
import { queryOperacional } from '../../../../lib/db';

// GET - Obtenir detalls d'una entrega
export const GET: APIRoute = async ({ params, cookies }) => {
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

    const { id } = params;

    const entrega = await queryOperacional<any[]>(`
      SELECT e.*, p.nombre as pedido_nombre
      FROM entregues e
      LEFT JOIN pedidos p ON e.pedido_id = p.id
      WHERE e.id = ? AND e.repartidor_id = ?
    `, [id, user.id]);

    if (entrega.length === 0) {
      return new Response(JSON.stringify({ error: 'Entrega no trobada' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, entrega: entrega[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obtenint entrega:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT - Actualitzar estat d'una entrega
export const PUT: APIRoute = async ({ params, cookies, request }) => {
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

    const { id } = params;
    const body = await request.json();
    const { estado, motivo_fallo, notas } = body;

    const estadosValids = ['pendiente', 'en_proceso', 'entregado', 'fallido'];
    if (!estado || !estadosValids.includes(estado)) {
      return new Response(JSON.stringify({ error: 'Estat invàlid' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar que l'entrega pertany al repartidor
    const entregaExistent = await queryOperacional<any[]>(
      'SELECT * FROM entregues WHERE id = ? AND repartidor_id = ?',
      [id, user.id]
    );

    if (entregaExistent.length === 0) {
      return new Response(JSON.stringify({ error: 'Entrega no trobada' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Actualitzar l'estat
    let updateQuery = 'UPDATE entregues SET estado = ?';
    const updateParams: any[] = [estado];

    if (estado === 'entregado') {
      updateQuery += ', hora_entrega = NOW()';
    }

    if (estado === 'fallido' && motivo_fallo) {
      updateQuery += ', motivo_fallo = ?';
      updateParams.push(motivo_fallo);
    }

    if (notas) {
      updateQuery += ', notas_entrega = CONCAT(IFNULL(notas_entrega, ""), ?)';
      updateParams.push('\n[Repartidor]: ' + notas);
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(id);

    await queryOperacional(updateQuery, updateParams);

    // Si està entregat o fallat, moure a historial i treure de ruta actual
    if (estado === 'entregado' || estado === 'fallido') {
      // Afegir a historial
      await queryOperacional(`
        INSERT INTO historial_entregues (entrega_id, repartidor_id, estado, fecha_entrega)
        VALUES (?, ?, ?, NOW())
      `, [id, user.id, estado]);

      // Treure de ruta actual
      await queryOperacional('DELETE FROM ruta_actual WHERE entrega_id = ?', [id]);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error actualitzant entrega:', error);
    return new Response(JSON.stringify({ error: 'Error intern del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
