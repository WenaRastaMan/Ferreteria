/* =========================================================
   Acceso a localStorage.
   Es la única parte del proyecto que habla directamente con
   el almacenamiento del navegador. Cuando exista el backend
   (Spring Boot), solo cambia este archivo y los servicios.
========================================================= */

/** Claves de todos los datos de la tienda. */
export const CLAVES = {
  productos: 'losMaestros_productos',
  usuarios: 'losMaestros_usuarios',
  sesion: 'losMaestros_sesion',
  carrito: 'losMaestros_carrito',
  pedidos: 'losMaestros_pedidos',
} as const

/**
 * Lee un arreglo JSON desde localStorage. Si la clave no existe
 * o el JSON está corrupto, devuelve [] en vez de romper la página.
 */
export function leerColeccion<T>(clave: string): T[] {
  try {
    const valor = JSON.parse(localStorage.getItem(clave) ?? '[]')
    return Array.isArray(valor) ? (valor as T[]) : []
  } catch {
    return []
  }
}

export function guardarColeccion<T>(clave: string, datos: T[]): void {
  localStorage.setItem(clave, JSON.stringify(datos))
}

/** Lee un objeto JSON (o null si no existe o está corrupto). */
export function leerObjeto<T>(clave: string): T | null {
  try {
    return JSON.parse(localStorage.getItem(clave) ?? 'null') as T | null
  } catch {
    return null
  }
}

export function guardarObjeto<T>(clave: string, dato: T): void {
  localStorage.setItem(clave, JSON.stringify(dato))
}

export function borrar(clave: string): void {
  localStorage.removeItem(clave)
}
