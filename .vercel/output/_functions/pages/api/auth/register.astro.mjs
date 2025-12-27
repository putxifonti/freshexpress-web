import { r as registerUser } from '../../../chunks/auth_CxmgGjqm.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const {
      nombre,
      email,
      telefono,
      password,
      consentimientos
    } = body;
    if (!nombre || !email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Falten camps obligatoris: nom, email i contrasenya"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Format d'email invàlid"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (password.length < 8) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "La contrasenya ha de tenir mínim 8 caràcters"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const consents = {
      acepta_comunicaciones: consentimientos?.acepta_comunicaciones || false,
      analytics: consentimientos?.analytics || false,
      compartir_datos: consentimientos?.compartir_datos || false,
      recibir_ofertas: consentimientos?.recibir_ofertas || false
    };
    const result = await registerUser({
      nombre,
      email,
      telefono: telefono || null,
      password,
      acepta_comunicaciones: consents.acepta_comunicaciones,
      analytics: consents.analytics,
      compartir_datos: consents.compartir_datos
    });
    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    cookies.set("auth_token", result.token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7
      // 7 dies
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Usuari registrat correctament",
        user: result.user
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en registre:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error intern del servidor"
      }),
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
