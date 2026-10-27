/* =========================================================
   productosService — fuente de datos simulada del inventario.
   Implementa el CRUD completo sobre localStorage:
     C → crearProducto
     R → listarProductos / obtenerProductoPorId / listarCategorias
     U → actualizarProducto
     D → eliminarProducto
   Además: filtros del catálogo, alertas de stock y movimientos
   de stock al comprar o cancelar. Las páginas NUNCA leen
   localStorage directamente: siempre pasan por este módulo.
========================================================= */
import type { ResultadoOperacion } from '../types/comun'
import type { FiltrosCatalogo, NuevoProducto, Producto } from '../types/producto'
import { CATALOGO_INICIAL } from '../data/catalogoInicial'
import { precioFinal } from '../utils/precios'
import { CLAVES, guardarColeccion, leerColeccion } from './almacenamiento'

const mismoCodigo = (a: string, b: string) => a.trim().toUpperCase() === b.trim().toUpperCase()

/* ---------------- LEER (Read) ---------------- */

export function listarProductos(): Producto[] {
  return leerColeccion<Producto>(CLAVES.productos)
}

export function obtenerProductoPorId(id: number): Producto | null {
  return listarProductos().find((p) => p.id === id) ?? null
}

/** Categorías únicas ordenadas alfabéticamente. */
export function listarCategorias(productos: Producto[] = listarProductos()): string[] {
  return [...new Set(productos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b))
}

/* ---------------- CREAR (Create) ---------------- */

export function crearProducto(datos: NuevoProducto): ResultadoOperacion<Producto> {
  const productos = listarProductos()
  if (productos.some((p) => mismoCodigo(p.codigo, datos.codigo))) {
    return { ok: false, campo: 'codigo', mensaje: 'Ya existe un producto con este código.' }
  }
  const nuevo: Producto = {
    ...datos,
    codigo: datos.codigo.trim().toUpperCase(),
    id: Math.max(0, ...productos.map((p) => p.id)) + 1, // id correlativo
  }
  guardarColeccion(CLAVES.productos, [...productos, nuevo])
  return { ok: true, dato: nuevo }
}

/* ---------------- ACTUALIZAR (Update) ---------------- */

export function actualizarProducto(id: number, cambios: Partial<NuevoProducto>): ResultadoOperacion<Producto> {
  const productos = listarProductos()
  const indice = productos.findIndex((p) => p.id === id)
  if (indice === -1) return { ok: false, campo: 'id', mensaje: 'El producto no existe.' }

  // El código nuevo no puede pertenecer a OTRO producto
  if (cambios.codigo && productos.some((p) => p.id !== id && mismoCodigo(p.codigo, cambios.codigo!))) {
    return { ok: false, campo: 'codigo', mensaje: 'Ese código ya lo usa otro producto.' }
  }

  const actualizado: Producto = { ...productos[indice], ...cambios, id }
  // "oferta: undefined" en los cambios significa quitar la oferta
  if ('oferta' in cambios && cambios.oferta === undefined) delete actualizado.oferta
  const copia = [...productos]
  copia[indice] = actualizado
  guardarColeccion(CLAVES.productos, copia)
  return { ok: true, dato: actualizado }
}

/* ---------------- ELIMINAR (Delete) ---------------- */

/** Devuelve true si se eliminó, false si el id no existía. */
export function eliminarProducto(id: number): boolean {
  const productos = listarProductos()
  const restantes = productos.filter((p) => p.id !== id)
  if (restantes.length === productos.length) return false
  guardarColeccion(CLAVES.productos, restantes)
  return true
}

/* ---------------- FILTROS Y ALERTAS ---------------- */

/**
 * Búsqueda por texto (nombre, código o marca), categoría, solo con stock,
 * solo ofertas y orden. No modifica el arreglo original.
 */
export function filtrarProductos(productos: Producto[], filtros: FiltrosCatalogo): Producto[] {
  const texto = filtros.texto.trim().toLowerCase()
  const resultado = productos.filter(
    (p) =>
      (!texto || `${p.nombre} ${p.codigo} ${p.marca}`.toLowerCase().includes(texto)) &&
      (!filtros.categoria || p.categoria === filtros.categoria) &&
      (!filtros.soloConStock || p.stock > 0) &&
      (!filtros.soloOfertas || p.oferta !== undefined),
  )
  const orden: Record<FiltrosCatalogo['orden'], (a: Producto, b: Producto) => number> = {
    predeterminado: (a, b) => a.id - b.id,
    'precio-asc': (a, b) => precioFinal(a) - precioFinal(b),
    'precio-desc': (a, b) => precioFinal(b) - precioFinal(a),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre),
  }
  return [...resultado].sort(orden[filtros.orden])
}

/** Productos con stock en o bajo el mínimo (hay que reponer). */
export function productosStockBajo(productos: Producto[] = listarProductos()): Producto[] {
  return productos.filter((p) => p.stock <= p.minimo)
}

/* ---------------- MOVIMIENTOS DE STOCK ---------------- */

/** Suma (positivo) o resta (negativo) unidades. Nunca deja stock negativo. */
export function moverStock(movimientos: { idProducto: number; cantidad: number }[]): void {
  const productos = listarProductos().map((p) => {
    const mov = movimientos.find((m) => m.idProducto === p.id)
    return mov ? { ...p, stock: Math.max(0, p.stock + mov.cantidad) } : p
  })
  guardarColeccion(CLAVES.productos, productos)
}

/* ---------------- DATOS INICIALES ---------------- */

/** Si no hay productos guardados, carga los 85 de la planilla Forma E. */
export function asegurarDatosInicialesProductos(): void {
  if (listarProductos().length === 0) guardarColeccion(CLAVES.productos, CATALOGO_INICIAL)
}
