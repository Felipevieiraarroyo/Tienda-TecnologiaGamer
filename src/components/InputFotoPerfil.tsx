import { useEffect, useRef, useState } from "react";

interface Props {
  fotoActual: string | null;
  iniciales: string;
  onChange: (file: File | undefined) => void;
}

export function InputFotoPerfil({
  fotoActual,
  iniciales,
  onChange,
}: Props) {
  const [archivo, setArchivo] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  
  useEffect(() => {
    if (!archivo) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(archivo);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  
  const seleccionarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }

    if (file.size >= 2 * 1024 * 1024) {
      setError("La imagen debe pesar menos de 2 MB.");
      return;
    }

    setError("");
    setArchivo(file);
    onChange(file);
  };

  
  const quitarFoto = () => {
    setArchivo(undefined);
    setError("");
    onChange(undefined);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid size-28 place-items-center overflow-hidden rounded-full border-4 border-marca-600 bg-marca-100 text-2xl font-bold text-marca-800">
        {preview || fotoActual ? (
          <img
            src={preview ?? fotoActual ?? ""}
            alt="Foto de perfil"
            className="size-full object-cover"
          />
        ) : (
          iniciales
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={seleccionarFoto}
        className="text-xs"
      />

      {preview && (
        <button
          type="button"
          onClick={quitarFoto}
          className="text-sm font-semibold text-red-600 hover:text-red-800"
        >
          Quitar foto
        </button>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
