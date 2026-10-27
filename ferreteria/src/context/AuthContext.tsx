/* =========================================================
   AuthContext — estado global de la sesión.
   Comparte al usuario conectado con toda la app (encabezado,
   rutas protegidas, checkout, panel) sin pasarlo por props.

   La sesión se RE-VALIDA contra la fuente de datos:
   - cada vez que cambia la página (useLocation), y
   - cuando otra pestaña modifica usuarios o sesión (evento "storage").
   Si el admin desactiva una cuenta o le cambia el rol, el cambio se
   aplica en la siguiente navegación, sin esperar a cerrar sesión.
========================================================= */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { Usuario, UsuarioSesion } from '../types/usuario'
import * as sesionService from '../services/sesionService'
import { CLAVES } from '../services/almacenamiento'

interface AuthContextValor {
  usuario: UsuarioSesion | null
  esAdmin: boolean
  /** Personal de la ferretería (admin o empleado): puede entrar al panel. */
  esPersonal: boolean
  iniciarSesion: (correo: string, password: string) => ReturnType<typeof sesionService.autenticar>
  cerrarSesion: () => void
  /** Deja conectado a un usuario recién registrado. */
  conectar: (usuario: Usuario) => void
}

const AuthContext = createContext<AuthContextValor | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Cambiar "version" obliga a volver a leer la sesión (después de login, logout o cambios en otra pestaña)
  const [, setVersion] = useState(0)
  const refrescar = () => setVersion((v) => v + 1)

  // Al navegar, el componente se vuelve a dibujar y la sesión se re-valida
  useLocation()

  // Cambios hechos en OTRA pestaña del mismo navegador
  useEffect(() => {
    const alCambiar = (e: StorageEvent) => {
      if (e.key === CLAVES.usuarios || e.key === CLAVES.sesion) setVersion((v) => v + 1)
    }
    window.addEventListener('storage', alCambiar)
    return () => window.removeEventListener('storage', alCambiar)
  }, [])

  const usuario = sesionService.obtenerSesionVigente()

  const iniciarSesion: AuthContextValor['iniciarSesion'] = (correo, password) => {
    const resultado = sesionService.autenticar(correo, password)
    if (resultado.ok) refrescar()
    return resultado
  }

  const cerrarSesion = () => {
    sesionService.cerrarSesion()
    refrescar()
  }

  const conectar = (nuevo: Usuario) => {
    sesionService.guardarSesion(nuevo)
    refrescar()
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        esAdmin: usuario?.rol === 'admin',
        esPersonal: usuario?.rol === 'admin' || usuario?.rol === 'empleado',
        iniciarSesion,
        cerrarSesion,
        conectar,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return contexto
}