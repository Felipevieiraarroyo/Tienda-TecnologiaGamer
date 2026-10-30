interface Props {
  pagina: number;
  hayMas: boolean;
  deshabilitado: boolean;
  onCambiarPagina: (nueva: number) => void;
}

export function Paginacion({
  pagina,
  hayMas,
  deshabilitado,
  onCambiarPagina,
}: Props) {
  const claseBoton =
    "rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-marca-700 transition hover:bg-marca-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav aria-label="Paginación de productos" className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        className={claseBoton}
        disabled={pagina <= 1 || deshabilitado}
        onClick={() => onCambiarPagina(pagina - 1)}
      >
        Anterior
      </button>
      <span aria-live="polite" aria-atomic="true" className="text-sm text-slate-600">
        Página {pagina}
      </span>
      <button
        type="button"
        className={claseBoton}
        disabled={!hayMas || deshabilitado}
        onClick={() => onCambiarPagina(pagina + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
}
