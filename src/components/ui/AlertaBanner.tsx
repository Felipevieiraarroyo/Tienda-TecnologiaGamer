export type TipoAlerta = "info" | "exito" | "advertencia" | "error";

interface Props {
  tipo: TipoAlerta;
  titulo: string;
  mensaje: string;
  onCerrar?: () => void;
  onReintentar?: () => void;
}

const estilos: Record<TipoAlerta, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  exito: "border-green-200 bg-green-50 text-green-800",
  advertencia: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

// TODO [D]: alerta reutilizable
// - un color distinto por tipo (info, exito, advertencia, error)
// - role="alert"
// - boton cerrar si llega onCerrar, boton reintentar si llega onReintentar
export function AlertaBanner({
  tipo,
  titulo,
  mensaje,
  onCerrar,
  onReintentar,
}: Props) {
  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${estilos[tipo]}`}
    >
      <div>
        <strong>{titulo}</strong>
        <p className="text-sm">{mensaje}</p>
      </div>

      <div className="flex gap-2">
        {onReintentar && (
          <button
            type="button"
            onClick={onReintentar}
            className="rounded-lg border border-current px-3 py-1 text-sm font-semibold"
          >
            Reintentar
          </button>
        )}

        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg px-3 py-1 text-sm font-semibold"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}
