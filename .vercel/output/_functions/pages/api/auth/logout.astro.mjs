export { renderers } from '../../../renderers.mjs';

const POST = async ({ cookies }) => {
  try {
    cookies.delete("auth_token", {
      path: "/"
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Sessió tancada correctament"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en logout:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error tancant sessió"
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
