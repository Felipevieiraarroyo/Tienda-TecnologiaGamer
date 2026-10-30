import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ListaProductos } from "../components/ListaProductos";
import { Paginacion } from "../components/Paginacion";
import { useApi } from "../hooks/useApi";
import { productosService } from "../services/productos";
import { tema } from "../tema";

const POR_PAGINA = 6;

export function ProductosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paginaUrl = searchParams.get("pagina") ?? "1";
  const numeroPagina = Number(paginaUrl);
  // Evita NaN, decimales, negativos y desplazamientos fuera del rango seguro.
  const paginaValida = /^\d+$/.test(paginaUrl)
    && Number.isSafeInteger(numeroPagina)
    && numeroPagina >= 1
    && Number.isSafeInteger(numeroPagina * POR_PAGINA + 1);
  const pagina = paginaValida ? numeroPagina : 1;
  const categoriaUrl = searchParams.get("categoria") ?? "Todas";
  const categoriaValida = categoriaUrl === "Todas"
    || tema.categorias.some((cat) => cat.valor === categoriaUrl);
  const categoria = categoriaValida ? categoriaUrl : "Todas";

  // Corrige enlaces inválidos sin agregar una entrada al historial.
  useEffect(() => {
    if (!paginaValida || !categoriaValida) {
      const nuevos = new URLSearchParams(searchParams);
      nuevos.set("pagina", String(pagina));
      nuevos.set("categoria", categoria);
      setSearchParams(nuevos, { replace: true });
    }
  }, [searchParams, setSearchParams, paginaValida, categoriaValida, pagina, categoria]);

  const { data, cargando, error, recargar } = useApi(
    async () => ({
      ...await productosService.getPagina(pagina, POR_PAGINA, categoria),
      pagina,
      categoria,
    }),
    [pagina, categoria],
  );

  // useApi conserva la respuesta anterior mientras llega la nueva.
  // No mostramos sus productos ni habilitamos Siguiente para otra consulta.
  const datosActuales = data?.pagina === pagina && data.categoria === categoria;
  const esperando = cargando || (!error && !datosActuales);

  const cambiarCategoria = (nueva: string) => {
    const nuevos = new URLSearchParams(searchParams);
    nuevos.set("categoria", nueva);
    nuevos.set("pagina", "1");
    setSearchParams(nuevos);
  };

  const irAPagina = (nueva: number) => {
    const nuevos = new URLSearchParams(searchParams);
    nuevos.set("pagina", String(nueva));
    nuevos.set("categoria", categoria);
    setSearchParams(nuevos);
  };

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-marca-700">
            Catálogo
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        </div>

        <label className="text-sm font-semibold text-slate-700">
          Categoría
          <select
            value={categoria}
            onChange={(e) => cambiarCategoria(e.target.value)}
            className="mt-1 block h-10 rounded-xl border border-stone-300 bg-white px-3 font-normal"
          >
            <option value="Todas">Todas</option>
            {tema.categorias.map((cat) => (
              <option key={cat.valor} value={cat.valor}>
                {cat.etiqueta}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ListaProductos
        productos={datosActuales ? data.productos : []}
        cargando={esperando}
        error={error}
        porPagina={POR_PAGINA}
        onReintentar={recargar}
        onLimpiarFiltros={() => cambiarCategoria("Todas")}
      />

      <Paginacion
        pagina={pagina}
        hayMas={!error && datosActuales && (data?.hayMas ?? false)}
        deshabilitado={esperando}
        onCambiarPagina={irAPagina}
      />
    </section>
  );
}
