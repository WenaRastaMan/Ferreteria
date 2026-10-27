/* =========================================================
   carritoService — reglas del carrito de compras.
   Funciones PURAS (reciben el carrito y devuelven uno nuevo)
   + lectura/escritura en localStorage. La regla principal del
   caso: nunca se puede pedir más de lo que hay en stock.
========================================================= */
import type { ItemCarrito } from '../types/pedido'
import type { Producto } from '../types/producto'
import { precioFinal } from '../utils/precios'
import { CLAVES, guardarColeccion, leerColeccion } from './almacenamiento'

export function leerCarrito(): ItemCarrito[] {
  return leerColeccion<ItemCarrito>(CLAVES.carrito)
}

export function guardarCarrito(items: ItemCarrito[]): void {
  guardarColeccion(CLAVES.carrito, items)
}

/** Agrega unidades. Devuelve null si se superaría el stock. */
export function agregarItem(carrito: ItemCarrito[], producto: Producto, cantidad = 1): ItemCarrito[] | null {
  const actual = carrito.find((i) => i.idProducto === producto.id)?.cantidad ?? 0
  if (actual + cantidad > producto.stock) return null
  return actual
    ? carrito.map((i) => (i.idProducto === producto.id ? { ...i, cantidad: actual + cantidad } : i))
    : [...carrito, { idProducto: producto.id, cantidad }]
}

/** Cambia la cantidad respetando el rango 1..stock. */
export function cambiarCantidad(carrito: ItemCarrito[], producto: Producto, cantidad: number): ItemCarrito[] {
  const n = Math.max(1, Math.min(producto.stock, Math.floor(cantidad) || 1))
  return carrito.map((i) => (i.idProducto === producto.id ? { ...i, cantidad: n } : i))
}

export function quitarItem(carrito: ItemCarrito[], idProducto: number): ItemCarrito[] {
  return carrito.filter((i) => i.idProducto !== idProducto)
}

/** Une cada ítem con su producto (descarta productos que ya no existen). */
export function detalleCarrito(carrito: ItemCarrito[], productos: Producto[]) {
  return carrito.flatMap((item) => {
    const producto = productos.find((p) => p.id === item.idProducto)
    return producto ? [{ producto, cantidad: item.cantidad, subtotal: precioFinal(producto) * item.cantidad }] : []
  })
}

export function calcularTotal(carrito: ItemCarrito[], productos: Producto[]): number {
  return detalleCarrito(carrito, productos).reduce((suma, linea) => suma + linea.subtotal, 0)
}

export function contarUnidades(carrito: ItemCarrito[]): number {
  return carrito.reduce((n, i) => n + i.cantidad, 0)
}

/** ¿Se puede comprar? Carrito no vacío y cada cantidad entre 1 y el stock actual. */
export function carritoDisponible(carrito: ItemCarrito[], productos: Producto[]): boolean {
  return (
    carrito.length > 0 &&
    carrito.every((i) => {
      const p = productos.find((x) => x.id === i.idProducto)
      return !!p && i.cantidad > 0 && i.cantidad <= p.stock
    })
  )
}
