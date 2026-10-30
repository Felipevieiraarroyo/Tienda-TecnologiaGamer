// datos de la tienda: nombre, textos y categorias
// los colores y la fuente estan en index.css

export interface Categoria {
  valor: string; // como se guarda en la API
  etiqueta: string; // como se muestra
}

export const tema = {
  nombre: "mercado",
  inicial: "M",
  emoji: "🛒",
  login: {
    kicker: "Tu tienda, más simple",
    titulo: "Compra lo que te hace bien.",
    texto:
      "Encuentra productos seleccionados para tu día a día y disfruta una experiencia de compra sencilla.",
  },
  // El catálogo y el formulario de carga comparten estos valores exactos.
  categorias: [
    { valor: "Gamer-Teclados", etiqueta: "Teclados" },
    { valor: "Gamer-Mouses", etiqueta: "Mouses" },
    { valor: "Gamer-Audifonos", etiqueta: "Audífonos" },
    { valor: "Gamer-Monitores", etiqueta: "Monitores" },
  ] satisfies Categoria[],
};

export function etiquetaCategoria(valor: string) {
  return tema.categorias.find((c) => c.valor === valor)?.etiqueta ?? valor;
}
