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

    // Només clients poden sol·licitar ser repartidor (incloent ex-repartidors que ara són clients)
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

    // Validar DNI/NIE (8 números + 1 lletra, o lletra X/Y/Z + 7 números + 1 lletra)
    const dniNieRegex = /^[XYZ0-9][0-9]{7}[A-Z]$/i;
    const dniSenseEspais = dni.replace(/\s/g, '').toUpperCase();
    
    if (!dniNieRegex.test(dniSenseEspais) || dniSenseEspais.length !== 9) {
      return new Response(
        JSON.stringify({ error: "Format de DNI/NIE invàlid. Ha de tenir 9 caràcters: 12345678A (DNI) o X1234567A (NIE)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

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
