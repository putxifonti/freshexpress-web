import type { APIRoute } from "astro";
import { verifyToken, getUserById } from "../../../lib/auth";
import { queryOperacional } from "../../../lib/db";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verificar autenticació
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "No autenticat" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Token invàlid" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "Usuari no trobat" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Només clients poden sol·licitar ser repartidor
    if (user.rol !== "cliente") {
      return new Response(
        JSON.stringify({ error: "Només els clients poden sol·licitar ser repartidor" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { vehiculo_tipo, zona_preferida, dni, telefono, disponibilitat, motivacio } = body;

    // Validacions
    if (!vehiculo_tipo || !zona_preferida || !dni || !telefono) {
      return new Response(
        JSON.stringify({ error: "Falten camps obligatoris" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validar DNI/NIE
    const dniRegex = /^[0-9XYZ][0-9]{7}[A-Z]$/i;
    if (!dniRegex.test(dni.replace(/\s/g, ""))) {
      return new Response(
        JSON.stringify({ error: "Format de DNI/NIE invàlid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear taula si no existeix
    await queryOperacional(`
      CREATE TABLE IF NOT EXISTS solicitudes_repartidor (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        vehiculo_tipo VARCHAR(50) NOT NULL,
        zona_preferida VARCHAR(100) NOT NULL,
        dni VARCHAR(20) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        disponibilitat VARCHAR(200),
        motivacio TEXT,
        estat ENUM('pendent', 'aprovada', 'rebutjada') DEFAULT 'pendent',
        motiu_rebuig TEXT,
        fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_resposta TIMESTAMP NULL,
        admin_id INT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);

    // Comprovar si ja té una sol·licitud pendent
    const solicitudsPendents = await queryOperacional<any[]>(
      "SELECT id FROM solicitudes_repartidor WHERE usuario_id = ? AND estat = 'pendent'",
      [user.id]
    );

    if (solicitudsPendents && solicitudsPendents.length > 0) {
      return new Response(
        JSON.stringify({ error: "Ja tens una sol·licitud pendent" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Inserir la sol·licitud
    await queryOperacional(
      `INSERT INTO solicitudes_repartidor 
        (usuario_id, vehiculo_tipo, zona_preferida, dni, telefono, disponibilitat, motivacio) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        vehiculo_tipo,
        zona_preferida,
        dni.replace(/\s/g, "").toUpperCase(),
        telefono,
        disponibilitat || "",
        motivacio || "",
      ]
    );

    // Actualitzar telèfon de l'usuari si no en tenia
    if (!user.telefono) {
      await queryOperacional(
        "UPDATE usuarios SET telefono = ? WHERE id = ?",
        [telefono, user.id]
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Sol·licitud enviada correctament",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processant sol·licitud repartidor:", error);
    return new Response(
      JSON.stringify({ error: "Error intern del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
