import type { Producto } from "../types/producto";
import { CardProducto } from "./CardProducto";
import { SkeletonCardProducto } from "./ui/SkeletonCardProducto";
import { AlertaBanner } from "./ui/AlertaBanner";
import { EstadoVacio } from "./ui/EstadoVacio";

// C le pasa los datos y D se encarga de como se ve cada estado,
// si cambian las props avisen al equipo

interface Props {
  productos: Producto[];
  cargando: boolean;
  error: string | null;
  porPagina: number;
  onReintentar: () => void;
  onLimpiarFiltros: () => void;
}

// TODO [D]: los 4 estados de la lista
// - cargando: grilla con porPagina <SkeletonCardProducto />
// - error: <AlertaBanner tipo="error" /> con boton para reintentar
// - vacio: <EstadoVacio /> con accion para limpiar filtros
// - datos: la grilla de productos (ya funciona)
export function ListaProductos({
  productos,
  cargando,
  error,
  porPagina,
  onReintentar,
  onLimpiarFiltros,
}: Props) {
  // 1. Estado de carga
  if (cargando) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: porPagina }, (_, index) => (
          <SkeletonCardProducto key={index} />
        ))}
      </div>
    );
  }

  // 2. Estado de error
  if (error) {
    return (
      <AlertaBanner
        tipo="error"
        titulo="Error al cargar productos"
        mensaje={error}
        onReintentar={onReintentar}
      />
    );
  }

  // 3. Estado vacío
  if (productos.length === 0) {
    return (
      <EstadoVacio
        titulo="No encontramos productos"
        descripcion="No hay productos disponibles con los filtros seleccionados."
        accion={{
          label: "Limpiar filtros",
          onClick: onLimpiarFiltros,
        }}
      />
    );
  }

  // 4. Estado con datos
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {productos.map((producto) => (
        <CardProducto key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
