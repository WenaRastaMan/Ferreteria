/* =========================================================
   usuariosService — fuente de datos simulada de usuarios.
   CRUD sobre localStorage (crear, listar, actualizar, eliminar)
   y carga de las cuentas de demostración.
========================================================= */
import type { ResultadoOperacion } from '../types/comun'
import type { CambiosUsuario, NuevoUsuario, Usuario } from '../types/usuario'
import { CLIENTES_EJEMPLO, CUENTAS_FIJAS } from '../data/usuariosIniciales'
import { CLAVES, guardarColeccion, leerColeccion } from './almacenamiento'

/** Genera un id único y corto (ej: "u-lz3k9a-4f2c"). */
export function generarId(): string {
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

const mismoCorreo = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/* ---------------- LEER ---------------- */

export function listarUsuarios(): Usuario[] {
  return leerColeccion<Usuario>(CLAVES.usuarios)
}

export function obtenerUsuarioPorCorreo(correo: string): Usuario | null {
  return listarUsuarios().find((u) => mismoCorreo(u.correo, correo)) ?? null
}

/* ---------------- CREAR ---------------- */

export function crearUsuario(datos: NuevoUsuario): ResultadoOperacion<Usuario> {
  const usuarios = listarUsuarios()
  if (usuarios.some((u) => mismoCorreo(u.correo, datos.correo))) {
    return { ok: false, campo: 'correo', mensaje: 'Ya existe una cuenta registrada con este correo.' }
  }
  const nuevo: Usuario = {
    ...datos,
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim().toLowerCase(),
    id: generarId(),
    fechaRegistro: new Date().toISOString(),
  }
  guardarColeccion(CLAVES.usuarios, [...usuarios, nuevo])
  return { ok: true, dato: nuevo }
}

/* ---------------- ACTUALIZAR ---------------- */

export function actualizarUsuario(id: string, cambios: CambiosUsuario): ResultadoOperacion<Usuario> {
  const usuarios = listarUsuarios()
  const indice = usuarios.findIndex((u) => u.id === id)
  if (indice === -1) return { ok: false, campo: 'id', mensaje: 'El usuario no existe.' }
  const actualizado: Usuario = { ...usuarios[indice], ...cambios }
  const copia = [...usuarios]
  copia[indice] = actualizado
  guardarColeccion(CLAVES.usuarios, copia)
  return { ok: true, dato: actualizado }
}

/* ---------------- ELIMINAR ---------------- */

export function eliminarUsuario(id: string): boolean {
  const usuarios = listarUsuarios()
  const restantes = usuarios.filter((u) => u.id !== id)
  if (restantes.length === usuarios.length) return false
  guardarColeccion(CLAVES.usuarios, restantes)
  return true
}

/* ---------------- DATOS INICIALES ---------------- */

/**
 * Se ejecuta al iniciar la app:
 * 1. Si no hay usuarios, carga los de ejemplo.
 * 2. Garantiza que las cuentas fijas (admin y empleado) existan con su rol y contraseña.
 */
export function asegurarDatosInicialesUsuarios(): void {
  let usuarios = listarUsuarios()
  if (usuarios.length === 0) usuarios = [...CUENTAS_FIJAS, ...CLIENTES_EJEMPLO]

  CUENTAS_FIJAS.forEach((cuenta) => {
    const existente = usuarios.find((u) => mismoCorreo(u.correo, cuenta.correo))
    if (existente) {
      existente.rol = cuenta.rol
      existente.password = cuenta.password
      existente.activo = true
    } else {
      usuarios.push({ ...cuenta })
    }
  })
  guardarColeccion(CLAVES.usuarios, usuarios)
}
