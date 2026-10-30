import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputFotoPerfil } from "../components/InputFotoPerfil";
import { perfilService } from "../services/perfil";
import { useAuthStore } from "../store/useAuthStore";

interface PerfilForm {
  nombre: string;
}

export function PerfilPage() {
  const usuarioNombre = useAuthStore((s) => s.usuarioNombre);
  const usuarioAvatar = useAuthStore((s) => s.usuarioAvatar);
  const actualizarPerfil = useAuthStore((s) => s.actualizarPerfil);

  const [fotoArchivo, setFotoArchivo] = useState<File | undefined>();
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PerfilForm>({
    defaultValues: { nombre: usuarioNombre ?? "" },
  });

   
  const onSubmit = async (data: PerfilForm) => {
    setMensaje("");
    setError("");

    try {
      const usuario = await perfilService.actualizar(
        data.nombre,
        fotoArchivo,
      );

      actualizarPerfil(usuario.name, usuario.avatar_url);
      setFotoArchivo(undefined);
      setMensaje("¡Perfil actualizado correctamente!");
    } catch {
      setError("No se pudo actualizar el perfil. Intentá nuevamente.");
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Mi perfil</h1>

      <div className="mb-6 flex justify-center">
        <InputFotoPerfil
          fotoActual={usuarioAvatar}
          iniciales={(usuarioNombre ?? "").substring(0, 2).toUpperCase()}
          onChange={setFotoArchivo}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Nombre completo
          <input
            {...register("nombre", { required: "Ingresá tu nombre." })}
            className="mt-1 h-11 w-full rounded-xl border border-stone-300 px-4 font-normal outline-none focus:border-marca-600 focus:ring-4 focus:ring-marca-600/10"
          />
        </label>

        {mensaje && (
          <p role="status" className="text-sm text-green-700">
            {mensaje}
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl bg-marca-600 text-sm font-bold text-white hover:bg-marca-700 disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}
