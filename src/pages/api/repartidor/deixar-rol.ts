import type { APIRoute } from "astro";
import { verifyToken, getUserById } from "../../../lib/auth";
import { queryOperacional } from "../../../lib/db";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "No autenticat" }), {
        status: 401,
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Token invàlid" }), {
        status: 401,
      });
    }

    const user = await getUserById(payload.userId);
    if (!user || user.rol !== "repartidor") {
      return new Response(
        JSON.stringify({ error: "No tens permisos per aquesta acció" }),
        { status: 403 }
      );
    }

    // Verificar si té comandes pendents
    const comandesPendents = await queryOperacional<any[]>(
      `SELECT COUNT(*) as total FROM pedidos 
       WHERE repartidor_id = (SELECT id FROM repartidores WHERE usuario_id = ?) 
       AND estado NOT IN ('entregado', 'cancelado')`,
      [user.id]
    );

    if (comandesPendents[0]?.total > 0) {
      return new Response(
        JSON.stringify({
          error:
            "No pots deixar de ser repartidor mentre tens comandes pendents. Finalitza primer totes les teves entregues.",
        }),
        { status: 400 }
      );
    }

    // Eliminar de la taula repartidores
    await queryOperacional(
      "DELETE FROM repartidores WHERE usuario_id = ?",
      [user.id]
    );

    // Canviar el rol a cliente
    await queryOperacional(
      "UPDATE usuarios SET rol = 'cliente' WHERE id = ?",
      [user.id]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Has deixat de ser repartidor correctament",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deixant rol de repartidor:", error);
    return new Response(
      JSON.stringify({ error: "Error processant la sol·licitud" }),
      { status: 500 }
    );
  }
};
