import { api } from "../lib/axios";
import { tema } from "../tema";
import type {
  CrearProductoDTO,
  PaginaProductos,
  Producto,
} from "../types/producto";

interface ProductoApi {
  id: number;
  name: string;
  category: string | null;
  price: string | number;
  stock: number;
  description: string | null;
  image_url: string | null;
}

const convertirProducto = (producto: ProductoApi): Producto => ({
  id: producto.id,
  nombre: producto.name,
  categoria: producto.category ?? "Sin categoría",
  precio: Number(producto.price),
  stock: producto.stock,
  descripcion: producto.description ?? "",
  imagenUrl: producto.image_url,
});

export const productosService = {
  getTodos: async (): Promise<Producto[]> => {
    const respuesta = await api.get<ProductoApi[]>("/products/", {
      params: { limit: 500 },
    });
    return respuesta.data.map(convertirProducto);
  },

  // Un producto adicional permite saber si existe la página siguiente
  // sin necesitar un total en la respuesta de la API.
  getPagina: async (
    pagina: number,
    porPagina: number,
    categoria: string,
  ): Promise<PaginaProductos> => {
    const skip = (pagina - 1) * porPagina;
    const categorias = tema.categorias.map((cat) => cat.valor);
    let productos: ProductoApi[];

    if (categoria === "Todas") {
      // La API acepta una sola categoría exacta. Consultamos únicamente las
      // de la tienda; filtrar una página global podría dejar huecos y mezclar grupos.
      // Para ordenar el conjunto por id necesitamos el prefijo de cada categoría
      // hasta la página solicitada, más un producto para calcular hayMas.
      const respuestas = await Promise.all(
        categorias.map((category) =>
          api.get<ProductoApi[]>("/products/", {
            params: { skip: 0, limit: skip + porPagina + 1, category },
          }),
        ),
      );
      productos = respuestas
        .flatMap((respuesta) => respuesta.data)
        .sort((a, b) => a.id - b.id)
        .slice(skip, skip + porPagina + 1);
    } else if (categorias.includes(categoria)) {
      const respuesta = await api.get<ProductoApi[]>("/products/", {
        params: { skip, limit: porPagina + 1, category: categoria },
      });
      productos = respuesta.data;
    } else {
      // Nunca consultar categorías de otros equipos.
      productos = [];
    }

    return {
      productos: productos.slice(0, porPagina).map(convertirProducto),
      hayMas: productos.length > porPagina,
    };
  },

  crear: async (datos: CrearProductoDTO): Promise<Producto> => {
    const respuesta = await api.post<ProductoApi>("/products/", {
      name: datos.nombre,
      category: datos.categoria,
      price: datos.precio,
      stock: datos.stock,
      description: datos.descripcion || null,
      image_url: datos.imagenUrl || null,
    });
    return convertirProducto(respuesta.data);
  },
};
