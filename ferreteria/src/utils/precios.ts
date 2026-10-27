/* Funciones puras de precios y stock de un producto. */
import type { Producto } from '../types/producto'

/** Precio que realmente se cobra: el de oferta si existe. */
export function precioFinal(p: Producto): number {
  return p.oferta ?? p.precio
}

/** Porcentaje de descuento redondeado (0 si no hay oferta). */
export function porcentajeDescuento(p: Producto): number {
  return p.oferta ? Math.round((1 - p.oferta / p.precio) * 100) : 0
}

export type EstadoStock = 'agotado' | 'bajo' | 'disponible'

/** agotado (0) · bajo (≤ mínimo) · disponible */
export function estadoStock(stock: number, minimo: number): EstadoStock {
  if (stock <= 0) return 'agotado'
  if (stock <= minimo) return 'bajo'
  return 'disponible'
}
