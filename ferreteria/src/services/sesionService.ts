/* =========================================================
   sesionService — inicio y cierre de sesión.
   La sesión se guarda en localStorage SIN la contraseña.
========================================================= */
import type { ResultadoOperacion } from '../types/comun'
import type { Usuario, UsuarioSesion } from '../types/usuario'
import { CLAVES, borrar, guardarObjeto, leerObjeto } from './almacenamiento'
import { listarUsuarios, obtenerUsuarioPorCorreo } from './usuariosService'

/** Quita la contraseña antes de guardar el usuario como sesión. */
export function aSesion(usuario: Usuario): UsuarioSesion {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...sinPassword } = usuario
  return sinPassword
}

export function obtenerSesion(): UsuarioSesion | null {
  return leerObjeto<UsuarioSesion>(CLAVES.sesion)
}

export function guardarSesion(usuario: Usuario): UsuarioSesion {
  const sesion = aSesion(usuario)
  guardarObjeto(CLAVES.sesion, sesion)
  return sesion
}

export function cerrarSesion(): void {
  borrar(CLAVES.sesion)
}

/**
 * Sesión VIGENTE: vuelve a buscar al usuario en la fuente de datos.
 * - Si el admin lo eliminó o lo desactivó → se cierra la sesión (null).
 * - Si le cambiaron el rol, el nombre o la cuenta corriente → se
 *   devuelve (y se guarda) la versión actualizada.
 * Así un cambio hecho por el admin se aplica sin esperar a que el
 * usuario cierre sesión.
 */
export function obtenerSesionVigente(): UsuarioSesion | null {
  const guardada = obtenerSesion()
  if (!guardada) return null
  const usuario = listarUsuarios().find((u) => u.id === guardada.id)
  if (!usuario || !usuario.activo) {
    cerrarSesion()
    return null
  }
  const vigente = aSesion(usuario)
  if (JSON.stringify(vigente) !== JSON.stringify(guardada)) guardarObjeto(CLAVES.sesion, vigente)
  return vigente
}

/**
 * Verifica correo y contraseña. Si son correctos guarda la sesión.
 * Devuelve el campo con problema para mostrar el error junto a él.
 */
export function autenticar(correo: string, password: string): ResultadoOperacion<UsuarioSesion> {
  const usuario = obtenerUsuarioPorCorreo(correo)
  if (!usuario) return { ok: false, campo: 'correo', mensaje: 'No existe una cuenta registrada con este correo.' }
  if (usuario.password !== password) return { ok: false, campo: 'password', mensaje: 'Contraseña incorrecta.' }
  if (!usuario.activo) return { ok: false, campo: 'correo', mensaje: 'Tu cuenta está desactivada. Contacta a la ferretería.' }
  return { ok: true, dato: guardarSesion(usuario) }
}