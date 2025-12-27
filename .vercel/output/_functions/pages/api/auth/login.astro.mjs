import { l as loginUser } from '../../../chunks/auth_CxmgGjqm.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email i contrasenya són obligatoris"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const result = await loginUser(email, password);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
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
        message: "Sessió iniciada correctament",
        user: result.user
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en login:", error);
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
