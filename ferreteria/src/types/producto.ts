/* =========================================================
   Tipos del módulo de productos (catálogo e inventario).
========================================================= */

/** Producto tal como se guarda en la fuente de datos (localStorage). */
export interface Producto {
  id: number
  codigo: string // ej: "MC001" (viene de la planilla Forma E)
  nombre: string
  categoria: string
  subcategoria: string
  marca: string
  unidad: string // Saco, Unidad, Metro...
  precio: number
  oferta?: number // precio rebajado; si existe, es el que se cobra
  stock: number
  minimo: number // umbral de reposición: stock <= minimo → alerta
  emoji: string
}

/** Datos para crear un producto (el servicio genera el id). */
export type NuevoProducto = Omit<Producto, 'id'>

/** Opciones de orden del catálogo. */
export type OrdenCatalogo = 'predeterminado' | 'precio-asc' | 'precio-desc' | 'nombre'

/** Filtros del catálogo y del inventario. */
export interface FiltrosCatalogo {
  texto: string // busca en nombre, código y marca
  categoria: string // '' = todas
  orden: OrdenCatalogo
  soloConStock: boolean
  soloOfertas: boolean
}
