/* Guardia de rutas por rol.
   - Sin sesión → redirige a /login (y recuerda a dónde quería ir)
   - Con sesión pero sin un rol permitido → redirige al inicio
   Ejemplos:
     <RutaProtegida>                             cualquier usuario con sesión
     <RutaProtegida roles={['admin', 'empleado']}>  personal de la ferretería
     <RutaProtegida roles={['admin']}>           solo administradores
   ⚠ Esto protege la INTERFAZ; la seguridad real la hará el backend con JWT. */
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Rol } from '../types/usuario'

export interface RutaProtegidaProps {
  children: ReactNode
  /** Roles que pueden entrar. Si se omite, basta con tener sesión. */
  roles?: Rol[]
}

export function RutaProtegida({ children, roles }: RutaProtegidaProps) {
  const { usuario } = useAuth()
  const location = useLocation()

  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname + location.search }} />
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />
  return <>{children}</>
}
