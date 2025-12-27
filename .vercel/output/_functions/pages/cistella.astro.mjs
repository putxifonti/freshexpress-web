/* empty css                                 */
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Bh1FzlyL.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9o_KgyY.mjs';
import { v as verifyToken, g as getUserById } from '../chunks/auth_CxmgGjqm.mjs';
import { q as queryOperacional } from '../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Cistella = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Cistella;
  const token = Astro2.cookies.get("auth_token")?.value;
  let user = null;
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      user = await getUserById(payload.userId);
    }
  }
  if (!user) {
    return Astro2.redirect("/login");
  }
  let items = [];
  let subtotal = 0;
  let totalItems = 0;
  try {
    items = await queryOperacional(`
    SELECT 
      c.id as cart_id,
      c.cantidad,
      p.id as producto_id,
      p.nombre,
      p.precio,
      p.precio_oferta,
      p.unidad,
      p.destacado,
      p.imagen,
      e.nombre as empresa_nombre,
      e.id as empresa_id
    FROM carrito c
    JOIN productos p ON c.producto_id = p.id
    JOIN empresas e ON p.empresa_id = e.id
    WHERE c.usuario_id = ?
    ORDER BY e.nombre, p.nombre
  `, [user.id]);
    items.forEach((item) => {
      const precio = item.precio_oferta || item.precio;
      subtotal += precio * item.cantidad;
      totalItems += item.cantidad;
    });
    subtotal = Math.round(subtotal * 100) / 100;
  } catch (error) {
    console.error("Error carregant cistella:", error);
  }
  const itemsPerEmpresa = items.reduce((acc, item) => {
    if (!acc[item.empresa_id]) {
      acc[item.empresa_id] = {
        nombre: item.empresa_nombre,
        items: []
      };
    }
    acc[item.empresa_id].items.push(item);
    return acc;
  }, {});
  const costEnviament = subtotal >= 30 ? 0 : 3.99;
  const total = Math.round((subtotal + costEnviament) * 100) / 100;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cistella - FreshExpress" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100 py-8"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Navegació --> <div class="mb-6"> <a href="/productes" class="text-[#3BB143] hover:text-[#32a039] text-sm font-medium flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Continuar comprant
</a> </div> <h1 class="text-2xl font-bold text-gray-900 mb-6">La meva cistella</h1> ${items.length === 0 ? renderTemplate`<div class="bg-white rounded-xl shadow p-12 text-center"> <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path> </svg> <h2 class="text-xl font-medium text-gray-900 mb-2">La teva cistella està buida</h2> <p class="text-gray-500 mb-6">Afegeix productes per començar la teva comanda</p> <a href="/productes" class="inline-block px-6 py-3 bg-[#3BB143] text-white font-medium rounded-lg hover:bg-[#32a039] transition-colors">
Veure productes
</a> </div>` : renderTemplate`<div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <!-- Llista de productes --> <div class="lg:col-span-2 space-y-6"> ${Object.entries(itemsPerEmpresa).map(([empresaId, data]) => renderTemplate`<div class="bg-white rounded-xl shadow overflow-hidden"> <div class="px-5 py-4 bg-gray-50 border-b border-gray-200"> <h3 class="font-medium text-gray-900">${data.nombre}</h3> </div> <div class="divide-y divide-gray-100"> ${data.items.map((item) => renderTemplate`<div class="cart-item p-5 flex items-center gap-4"${addAttribute(item.cart_id, "data-cart-id")}> <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"> ${item.imagen ? renderTemplate`<img${addAttribute(item.imagen, "src")}${addAttribute(item.nombre, "alt")} class="w-full h-full object-cover">` : renderTemplate`<svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg>`} </div> <div class="flex-1 min-w-0"> <h4 class="font-medium text-gray-900 truncate">${item.nombre}</h4> <p class="text-sm text-gray-500">${Number(item.precio_oferta || item.precio).toFixed(2)} € / ${item.unidad}</p> ${item.destacado === 1 && renderTemplate`<span class="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Destacat</span>`} </div> <div class="flex items-center gap-2"> <button class="qty-btn w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100" data-action="decrease"${addAttribute(item.cart_id, "data-cart-id")}> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path> </svg> </button> <span class="w-8 text-center font-medium qty-display"${addAttribute(item.cart_id, "data-cart-id")}>${item.cantidad}</span> <button class="qty-btn w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100" data-action="increase"${addAttribute(item.cart_id, "data-cart-id")}> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg> </button> </div> <div class="text-right w-20"> <p class="font-bold text-gray-900"> ${(Number(item.precio_oferta || item.precio) * Number(item.cantidad)).toFixed(2)} €
</p> </div> <button class="remove-btn text-gray-400 hover:text-red-500 p-1"${addAttribute(item.cart_id, "data-cart-id")}> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path> </svg> </button> </div>`)} </div> </div>`)} </div> <!-- Resum de la comanda --> <div class="lg:col-span-1"> <div class="bg-white rounded-xl shadow p-6 sticky top-24"> <h3 class="font-semibold text-lg text-gray-900 mb-4">Resum de la comanda</h3> <div class="space-y-3 text-sm"> <div class="flex justify-between"> <span class="text-gray-600">Subtotal (${totalItems} articles)</span> <span class="font-medium" id="subtotal">${subtotal.toFixed(2)} €</span> </div> <div class="flex justify-between"> <span class="text-gray-600">Enviament</span> ${costEnviament === 0 ? renderTemplate`<span class="font-medium text-[#3BB143]">Gratis</span>` : renderTemplate`<span class="font-medium">${costEnviament.toFixed(2)} €</span>`} </div> ${costEnviament > 0 && renderTemplate`<p class="text-xs text-gray-500">Enviament gratis per comandes superiors a 30€</p>`} </div> <div class="border-t border-gray-200 mt-4 pt-4"> <div class="flex justify-between items-center mb-4"> <span class="font-semibold text-gray-900">Total</span> <span class="text-xl font-bold text-gray-900" id="total">${total.toFixed(2)} €</span> </div> <button id="checkout-btn" class="w-full py-3 bg-[#3BB143] text-white font-medium rounded-lg hover:bg-[#32a039] transition-colors">
Finalitzar comanda
</button> </div> <div class="mt-6 p-4 bg-green-50 rounded-lg"> <p class="text-sm text-green-700 flex items-start"> <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>
Lliurament 100% ecològic amb vehicles elèctrics
</p> </div> </div> </div> </div>`} </div> </div> ` })} ${renderScript($$result, "C:/dev/FreshExpress/src/pages/cistella.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dev/FreshExpress/src/pages/cistella.astro", void 0);

const $$file = "C:/dev/FreshExpress/src/pages/cistella.astro";
const $$url = "/cistella";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cistella,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
