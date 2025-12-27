import { v as verifyToken } from '../../../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../renderers.mjs';

const PUT = async ({ request, cookies }) => {
  try {
    const token = cookies.get("auth_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "No autenticat" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: "Token invàlid" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const { direccion } = body;
    if (!direccion || direccion.trim() === "") {
      return new Response(JSON.stringify({ success: false, error: "La direcció és obligatòria" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await queryOperacional(
      "UPDATE usuarios SET direccion = ? WHERE id = ?",
      [direccion.trim(), payload.userId]
    );
    return new Response(JSON.stringify({
      success: true,
      message: "Direcció actualitzada correctament"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error actualitzant direcció:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Error del servidor"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
