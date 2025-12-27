import { v as verifyToken, g as getUserById } from '../../../chunks/auth_CxmgGjqm.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
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
    const validModes = ["cliente", "repartidor", "admin"];
    if (!mode || !validModes.includes(mode)) {
      return new Response(
        JSON.stringify({ error: "Mode no vàlid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
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
    cookies.set("view_mode", mode, {
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24
      // 24 hores
    });
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
