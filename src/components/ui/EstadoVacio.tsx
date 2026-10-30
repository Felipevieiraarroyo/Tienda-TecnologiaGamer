interface Props {
  titulo: string;
  descripcion?: string;
  accion?: { label: string; onClick: () => void };
}

// TODO [D]: estado vacio con icono, titulo, descripcion y boton opcional
export function EstadoVacio({ titulo, descripcion, accion }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
      <span className="text-4xl" aria-hidden="true">
        📦
      </span>

      <h3 className="font-bold text-slate-800">{titulo}</h3>

      {descripcion && <p className="text-sm text-slate-500">{descripcion}</p>}

      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="rounded-lg bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700"
        >
          {accion.label}
        </button>
      )}
    </div>
  );
}
