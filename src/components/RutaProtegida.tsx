
import { Navigate, Outlet } from "react-router-dom";
import { useAuthHidratado } from "../hooks/useAuthHidratado";         // imports.natanael
import { useAuthStore } from "../store/useAuthStore";

// TODO [A]: ahora deja pasar a cualquiera
// - esperar a que el store se rehidrate (useAuthHidratado)
// - sin sesion: <Navigate to="/login" replace />
// - con sesion: <Outlet />
export function RutaProtegida() {
  const hidratado = useAuthHidratado();
  const autenticado = useAuthStore((s) => s.autenticado);

  // Mientras persist lee localStorage, autenticado vale false aunque haya sesión.
  // Si redirigimos ya, un F5 en /dashboard te tiraría al login sin motivo.
  if (!hidratado) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-slate-500">         //export y if natanael.
        Verificando sesión...
      </div>
    );
  }

  if (!autenticado) return <Navigate to="/login" replace />;

  return <Outlet />;
}