import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_AqPKDHpK.mjs';
import { manifest } from './manifest_CQJByTJU.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/dashboard.astro.mjs');
const _page2 = () => import('./pages/admin/historial.astro.mjs');
const _page3 = () => import('./pages/admin/solicituds.astro.mjs');
const _page4 = () => import('./pages/admin.astro.mjs');
const _page5 = () => import('./pages/api/admin/solicituds-repartidor.astro.mjs');
const _page6 = () => import('./pages/api/admin/update-images.astro.mjs');
const _page7 = () => import('./pages/api/admin/users/_id_/status.astro.mjs');
const _page8 = () => import('./pages/api/admin/users/_id_.astro.mjs');
const _page9 = () => import('./pages/api/auth/login.astro.mjs');
const _page10 = () => import('./pages/api/auth/logout.astro.mjs');
const _page11 = () => import('./pages/api/auth/me.astro.mjs');
const _page12 = () => import('./pages/api/auth/register.astro.mjs');
const _page13 = () => import('./pages/api/cart/add.astro.mjs');
const _page14 = () => import('./pages/api/cart/count.astro.mjs');
const _page15 = () => import('./pages/api/cart/repetir.astro.mjs');
const _page16 = () => import('./pages/api/cart/_id_.astro.mjs');
const _page17 = () => import('./pages/api/cart.astro.mjs');
const _page18 = () => import('./pages/api/checkout/finalitzar.astro.mjs');
const _page19 = () => import('./pages/api/repartidor/configuracio.astro.mjs');
const _page20 = () => import('./pages/api/repartidor/disponibilitat.astro.mjs');
const _page21 = () => import('./pages/api/repartidor/entrega/_id_.astro.mjs');
const _page22 = () => import('./pages/api/repartidor/entregues.astro.mjs');
const _page23 = () => import('./pages/api/repartidor/estadistiques.astro.mjs');
const _page24 = () => import('./pages/api/repartidor/historial.astro.mjs');
const _page25 = () => import('./pages/api/repartidor/pedido/_id_/acceptar.astro.mjs');
const _page26 = () => import('./pages/api/repartidor/pedido/_id_/entregar.astro.mjs');
const _page27 = () => import('./pages/api/repartidor/pedido/_id_/estat.astro.mjs');
const _page28 = () => import('./pages/api/repartidor/pedido/_id_/iniciar.astro.mjs');
const _page29 = () => import('./pages/api/repartidor/pedido/_id_/problema.astro.mjs');
const _page30 = () => import('./pages/api/repartidor/pedidos-disponibles.astro.mjs');
const _page31 = () => import('./pages/api/repartidor/ruta/optimitzar.astro.mjs');
const _page32 = () => import('./pages/api/repartidor/ruta.astro.mjs');
const _page33 = () => import('./pages/api/seguiment/_code_.astro.mjs');
const _page34 = () => import('./pages/api/setup/update-images.astro.mjs');
const _page35 = () => import('./pages/api/track.astro.mjs');
const _page36 = () => import('./pages/api/user/canvi-mode.astro.mjs');
const _page37 = () => import('./pages/api/user/consents.astro.mjs');
const _page38 = () => import('./pages/api/user/delete.astro.mjs');
const _page39 = () => import('./pages/api/user/password.astro.mjs');
const _page40 = () => import('./pages/api/user/profile.astro.mjs');
const _page41 = () => import('./pages/api/user/solicitud-repartidor.astro.mjs');
const _page42 = () => import('./pages/api/user/update-address.astro.mjs');
const _page43 = () => import('./pages/api/user/valorar-repartidor.astro.mjs');
const _page44 = () => import('./pages/avis-legal.astro.mjs');
const _page45 = () => import('./pages/checkout.astro.mjs');
const _page46 = () => import('./pages/cistella.astro.mjs');
const _page47 = () => import('./pages/cobertura.astro.mjs');
const _page48 = () => import('./pages/com-funciona.astro.mjs');
const _page49 = () => import('./pages/configuracio.astro.mjs');
const _page50 = () => import('./pages/contacte.astro.mjs');
const _page51 = () => import('./pages/dashboard.astro.mjs');
const _page52 = () => import('./pages/faq.astro.mjs');
const _page53 = () => import('./pages/historial.astro.mjs');
const _page54 = () => import('./pages/login.astro.mjs');
const _page55 = () => import('./pages/politica-cookies.astro.mjs');
const _page56 = () => import('./pages/politica-dades.astro.mjs');
const _page57 = () => import('./pages/politica-privacitat.astro.mjs');
const _page58 = () => import('./pages/productes.astro.mjs');
const _page59 = () => import('./pages/rastreig.astro.mjs');
const _page60 = () => import('./pages/recuperar-contrasenya.astro.mjs');
const _page61 = () => import('./pages/registre.astro.mjs');
const _page62 = () => import('./pages/repartidor/compte.astro.mjs');
const _page63 = () => import('./pages/repartidor/configuracio.astro.mjs');
const _page64 = () => import('./pages/repartidor/guanys.astro.mjs');
const _page65 = () => import('./pages/repartidor/historial.astro.mjs');
const _page66 = () => import('./pages/repartidor/ruta.astro.mjs');
const _page67 = () => import('./pages/repartidor.astro.mjs');
const _page68 = () => import('./pages/seguiment.astro.mjs');
const _page69 = () => import('./pages/sobre-nosaltres.astro.mjs');
const _page70 = () => import('./pages/suport.astro.mjs');
const _page71 = () => import('./pages/termes-condicions.astro.mjs');
const _page72 = () => import('./pages/termes-repartidor.astro.mjs');
const _page73 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/dashboard.astro", _page1],
    ["src/pages/admin/historial.astro", _page2],
    ["src/pages/admin/solicituds.astro", _page3],
    ["src/pages/admin.astro", _page4],
    ["src/pages/api/admin/solicituds-repartidor.ts", _page5],
    ["src/pages/api/admin/update-images.ts", _page6],
    ["src/pages/api/admin/users/[id]/status.ts", _page7],
    ["src/pages/api/admin/users/[id]/index.ts", _page8],
    ["src/pages/api/auth/login.ts", _page9],
    ["src/pages/api/auth/logout.ts", _page10],
    ["src/pages/api/auth/me.ts", _page11],
    ["src/pages/api/auth/register.ts", _page12],
    ["src/pages/api/cart/add.ts", _page13],
    ["src/pages/api/cart/count.ts", _page14],
    ["src/pages/api/cart/repetir.ts", _page15],
    ["src/pages/api/cart/[id].ts", _page16],
    ["src/pages/api/cart/index.ts", _page17],
    ["src/pages/api/checkout/finalitzar.ts", _page18],
    ["src/pages/api/repartidor/configuracio.ts", _page19],
    ["src/pages/api/repartidor/disponibilitat.ts", _page20],
    ["src/pages/api/repartidor/entrega/[id].ts", _page21],
    ["src/pages/api/repartidor/entregues.ts", _page22],
    ["src/pages/api/repartidor/estadistiques.ts", _page23],
    ["src/pages/api/repartidor/historial/index.ts", _page24],
    ["src/pages/api/repartidor/pedido/[id]/acceptar.ts", _page25],
    ["src/pages/api/repartidor/pedido/[id]/entregar.ts", _page26],
    ["src/pages/api/repartidor/pedido/[id]/estat.ts", _page27],
    ["src/pages/api/repartidor/pedido/[id]/iniciar.ts", _page28],
    ["src/pages/api/repartidor/pedido/[id]/problema.ts", _page29],
    ["src/pages/api/repartidor/pedidos-disponibles.ts", _page30],
    ["src/pages/api/repartidor/ruta/optimitzar.ts", _page31],
    ["src/pages/api/repartidor/ruta/index.ts", _page32],
    ["src/pages/api/seguiment/[code].ts", _page33],
    ["src/pages/api/setup/update-images.ts", _page34],
    ["src/pages/api/track.ts", _page35],
    ["src/pages/api/user/canvi-mode.ts", _page36],
    ["src/pages/api/user/consents.ts", _page37],
    ["src/pages/api/user/delete.ts", _page38],
    ["src/pages/api/user/password.ts", _page39],
    ["src/pages/api/user/profile.ts", _page40],
    ["src/pages/api/user/solicitud-repartidor.ts", _page41],
    ["src/pages/api/user/update-address.ts", _page42],
    ["src/pages/api/user/valorar-repartidor.ts", _page43],
    ["src/pages/avis-legal.astro", _page44],
    ["src/pages/checkout.astro", _page45],
    ["src/pages/cistella.astro", _page46],
    ["src/pages/cobertura.astro", _page47],
    ["src/pages/com-funciona.astro", _page48],
    ["src/pages/configuracio.astro", _page49],
    ["src/pages/contacte.astro", _page50],
    ["src/pages/dashboard.astro", _page51],
    ["src/pages/faq.astro", _page52],
    ["src/pages/historial.astro", _page53],
    ["src/pages/login.astro", _page54],
    ["src/pages/politica-cookies.astro", _page55],
    ["src/pages/politica-dades.astro", _page56],
    ["src/pages/politica-privacitat.astro", _page57],
    ["src/pages/productes.astro", _page58],
    ["src/pages/rastreig.astro", _page59],
    ["src/pages/recuperar-contrasenya.astro", _page60],
    ["src/pages/registre.astro", _page61],
    ["src/pages/repartidor/compte.astro", _page62],
    ["src/pages/repartidor/configuracio.astro", _page63],
    ["src/pages/repartidor/guanys.astro", _page64],
    ["src/pages/repartidor/historial.astro", _page65],
    ["src/pages/repartidor/ruta.astro", _page66],
    ["src/pages/repartidor/index.astro", _page67],
    ["src/pages/seguiment.astro", _page68],
    ["src/pages/sobre-nosaltres.astro", _page69],
    ["src/pages/suport.astro", _page70],
    ["src/pages/termes-condicions.astro", _page71],
    ["src/pages/termes-repartidor.astro", _page72],
    ["src/pages/index.astro", _page73]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "4731145b-9bf4-4dbb-a66d-17bbfcd9a6c2",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
