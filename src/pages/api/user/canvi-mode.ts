import type { APIRoute } from "astro";
import { verifyToken, getUserById } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verificar autenticació
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(
        JSON.stringify({ error: "No autenticat" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Token invàlid" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuari no trobat" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { mode } = body;

    // Validar mode
    const validModes = ["cliente", "repartidor", "admin"];
    if (!mode || !validModes.includes(mode)) {
      return new Response(
        JSON.stringify({ error: "Mode no vàlid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar permisos per canviar al mode sol·licitat
    if (mode === "admin" && user.rol !== "admin") {
      return new Response(
        JSON.stringify({ error: "No tens permisos per a mode admin" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    if (mode === "repartidor" && user.rol !== "repartidor" && user.rol !== "admin") {
      return new Response(
        JSON.stringify({ error: "No tens permisos per a mode repartidor" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Establir cookie de mode
    cookies.set("view_mode", mode, {
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // 24 hores
    });

    // Determinar URL de redirecció
    let redirectUrl = "/dashboard";
    if (mode === "admin") {
      redirectUrl = "/admin";
    } else if (mode === "repartidor") {
      redirectUrl = "/repartidor";
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        mode,
        redirect: redirectUrl
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error canviant mode:", error);
    return new Response(
      JSON.stringify({ error: "Error del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
