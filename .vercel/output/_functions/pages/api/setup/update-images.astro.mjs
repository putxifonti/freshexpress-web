import { q as queryOperacional } from '../../../chunks/db_D0m2K8jx.mjs';
export { renderers } from '../../../renderers.mjs';

const productImages = {
  // FRUITES (empresa_id = 1)
  1: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=300&fit=crop",
  // Pomes Golden
  2: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop",
  // Taronges de Valencia
  3: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
  // Platans de Canaries
  4: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop",
  // Maduixes
  5: "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&h=300&fit=crop",
  // Kiwis
  6: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=400&h=300&fit=crop",
  // Peres Conference
  7: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop",
  // Raïm negre
  8: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&h=300&fit=crop",
  // Meló
  9: "https://images.unsplash.com/photo-1589984662646-e7b2e4f1f8e4?w=400&h=300&fit=crop",
  // Síndria
  10: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop",
  // Mangos
  // VERDURES (empresa_id = 2)
  11: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop",
  // Tomates de penjar
  12: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop",
  // Enciams
  13: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop",
  // Cebes
  14: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2f85?w=400&h=300&fit=crop",
  // Alls
  15: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=300&fit=crop",
  // Patates
  16: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop",
  // Pastanagues
  17: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=300&fit=crop",
  // Carabasses
  18: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop",
  // Albergínies
  19: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop",
  // Pebrots vermells
  20: "https://images.unsplash.com/photo-1596309418073-6f14c0cc7bfb?w=400&h=300&fit=crop",
  // Carbassons
  21: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
  // Espinacs frescos
  22: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop",
  // Bròquil
  // CARNS (empresa_id = 3)
  23: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=300&fit=crop",
  // Filet de vedella
  24: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop",
  // Costelles de porc
  25: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
  // Pit de pollastre
  26: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop",
  // Cuixes de pollastre
  27: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  // Hamburgueses casolanes
  28: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop",
  // Llom de porc
  29: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop",
  // Botifarra fresca
  30: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&h=300&fit=crop",
  // Xoriço ibèric
  31: "https://images.unsplash.com/photo-1524438418049-ab2acb7aa48f?w=400&h=300&fit=crop",
  // Pernil dolç
  32: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&h=300&fit=crop",
  // Carn picada mixta
  // PEIXOS (empresa_id = 4)
  33: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400&h=300&fit=crop",
  // Salmó fresc
  34: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
  // Gambes blanques
  35: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=300&fit=crop",
  // Llobarro
  36: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop",
  // Musclos
  37: "https://images.unsplash.com/photo-1590759668628-05b0fc34bb70?w=400&h=300&fit=crop",
  // Cloïsses
  38: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
  // Tonyina fresca
  39: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop",
  // Sardines
  40: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
  // Calamars
  41: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=400&h=300&fit=crop",
  // Rap
  42: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop",
  // Bacallà dessalat
  // LACTIS (empresa_id = 5)
  43: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
  // Llet fresca
  44: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
  // Iogurt natural
  45: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop",
  // Formatge fresc
  46: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=300&fit=crop",
  // Formatge curat
  47: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop",
  // Mantega
  48: "https://images.unsplash.com/photo-1634141510639-d691d86f47be?w=400&h=300&fit=crop",
  // Nata per cuinar
  49: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400&h=300&fit=crop",
  // Mató
  50: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop",
  // Ous de pagès
  // PA I FORN (empresa_id = 6)
  51: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop",
  // Pa de pagès
  52: "https://images.unsplash.com/photo-1568471173242-461f0a730452?w=400&h=300&fit=crop",
  // Baguette
  53: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
  // Pa integral
  54: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
  // Croissants
  55: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=400&h=300&fit=crop",
  // Ensaïmades
  56: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
  // Coca de vidre
  57: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400&h=300&fit=crop",
  // Pa de motlle
  58: "https://images.unsplash.com/photo-1558303289-68f854f77cec?w=400&h=300&fit=crop"
  // Magdalenes
};
const GET = async () => {
  try {
    let updated = 0;
    let errors = 0;
    const errorDetails = [];
    for (const [id, imagen] of Object.entries(productImages)) {
      try {
        await queryOperacional(
          "UPDATE productos SET imagen = ? WHERE id = ?",
          [imagen, id]
        );
        updated++;
      } catch (error) {
        errors++;
        errorDetails.push(`Producte ${id}: ${error.message}`);
      }
    }
    return new Response(JSON.stringify({
      success: true,
      message: `Actualitzats ${updated} productes amb ${errors} errors`,
      updated,
      errors,
      errorDetails: errorDetails.length > 0 ? errorDetails : void 0
    }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error actualitzant imatges:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Error del servidor"
    }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
