import { Navigate, Outlet } from "react-router-dom"; 
import { useAuthHidratado } from "../hooks/useAuthHidratado";       //imports.natanael
import { useAuthStore } from "../store/useAuthStore";       

// TODO [A]: si ya hay sesion y entra a /login, mandarlo a /dashboard
export function RutaPublica() {
  const hidratado = useAuthHidratado();
  const autenticado = useAuthStore((s) => s.autenticado);
                                                                        // funcion que espera a que el store se rehidrate (useAuthHidratado)
  if (!hidratado) return null;
  if (autenticado) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}