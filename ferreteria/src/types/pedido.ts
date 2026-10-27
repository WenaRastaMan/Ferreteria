/* =========================================================
   Tipos del carrito y de los pedidos.
========================================================= */

/** Lo que guarda el carrito: solo id y cantidad (el precio se lee del catálogo). */
export interface ItemCarrito {
  idProducto: number
  cantidad: number
}

/** Estados por los que pasa un pedido. */
export type EstadoPedido =
  | 'Confirmado'
  | 'Preparando'
  | 'Listo para retiro'
  | 'En despacho'
  | 'Entregado'
  | 'Cancelado'
  | 'Pago rechazado'

export const ESTADOS_PEDIDO: EstadoPedido[] = [
  'Confirmado',
  'Preparando',
  'Listo para retiro',
  'En despacho',
  'Entregado',
  'Cancelado',
  'Pago rechazado',
]

export type ModalidadEntrega = 'retiro' | 'despacho'
export type MetodoPago = 'simulado' | 'cuenta-corriente'

/** Línea del pedido: guarda nombre y precio del MOMENTO de la compra. */
export interface ItemPedido {
  idProducto: number
  nombre: string
  precioUnitario: number
  cantidad: number
}

export interface Pedido {
  id: string // "PED-..."
  idUsuario: string
  correoCliente: string
  nombreCliente: string
  fecha: string // ISO
  items: ItemPedido[]
  total: number
  entrega: ModalidadEntrega
  direccion: string
  metodoPago: MetodoPago
  estado: EstadoPedido
}

/** Datos que el cliente completa en el checkout. */
export interface DatosCheckout {
  nombre: string
  entrega: ModalidadEntrega
  direccion: string
  metodoPago: MetodoPago
  simularRechazo: boolean
}
