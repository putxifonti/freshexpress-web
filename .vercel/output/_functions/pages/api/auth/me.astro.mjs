import { v as verifyToken, g as getUserById } from '../../../chunks/auth_CxmgGjqm.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ cookies }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No autenticat"
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const payload = verifyToken(token);
    if (!payload) {
      cookies.delete("auth_token", { path: "/" });
      return new Response(
        JSON.stringify({
          success: false,
          error: "Token invàlid o expirat"
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const user = await getUserById(payload.userId);
    if (!user) {
      cookies.delete("auth_token", { path: "/" });
      return new Response(
        JSON.stringify({
          success: false,
          error: "Usuari no trobat"
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        user
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error obtenint usuari:", error);
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
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
