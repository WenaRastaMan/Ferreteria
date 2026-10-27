/* =========================================================
   pedidosService — registro y seguimiento de pedidos.
   - registrarPedido: valida stock, guarda el pedido y descuenta
     el inventario (si el pago fue rechazado no descuenta nada).
   - cambiarEstadoPedido: al CANCELAR se devuelve el stock.
   - Reportes: ventas válidas, saldo de cuenta corriente, top productos.
========================================================= */
import type { ResultadoOperacion } from '../types/comun'
import type { DatosCheckout, EstadoPedido, ItemCarrito, Pedido } from '../types/pedido'
import type { UsuarioSesion } from '../types/usuario'
import { CLAVES, guardarColeccion, leerColeccion } from './almacenamiento'
import { listarProductos, moverStock } from './productosService'
import { carritoDisponible, detalleCarrito } from './carritoService'
import { sumarPor } from '../utils/estadisticas'

/** Estados que NO cuentan como venta (y no tienen stock descontado). */
const SIN_VENTA: EstadoPedido[] = ['Cancelado', 'Pago rechazado']

export function listarPedidos(): Pedido[] {
  return leerColeccion<Pedido>(CLAVES.pedidos)
}

export function obtenerPedidoPorId(id: string): Pedido | null {
  return listarPedidos().find((p) => p.id === id) ?? null
}

/** Pedidos de un cliente, del más reciente al más antiguo. */
export function listarPedidosDeUsuario(idUsuario: string): Pedido[] {
  return listarPedidos()
    .filter((p) => p.idUsuario === idUsuario)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export function registrarPedido(
  usuario: UsuarioSesion,
  carrito: ItemCarrito[],
  datos: DatosCheckout,
): ResultadoOperacion<Pedido> {
  if (!datos.nombre.trim()) return { ok: false, campo: 'nombre', mensaje: 'Ingresa el nombre de quien recibe.' }
  if (datos.entrega === 'despacho' && !datos.direccion.trim()) {
    return { ok: false, campo: 'direccion', mensaje: 'Ingresa la dirección de despacho.' }
  }
  if (datos.metodoPago === 'cuenta-corriente' && !usuario.cuentaCorriente) {
    return { ok: false, campo: 'metodoPago', mensaje: 'Tu cuenta no está habilitada para cuenta corriente.' }
  }

  // Se vuelve a leer el stock justo antes de comprar (otro pedido pudo descontarlo)
  const productos = listarProductos()
  if (!carritoDisponible(carrito, productos)) {
    return { ok: false, campo: 'carrito', mensaje: 'Algún producto ya no tiene stock suficiente. Revisa tu carrito.' }
  }

  const lineas = detalleCarrito(carrito, productos)
  const pedido: Pedido = {
    id: `PED-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
    idUsuario: usuario.id,
    correoCliente: usuario.correo,
    nombreCliente: datos.nombre.trim(),
    fecha: new Date().toISOString(),
    items: lineas.map((l) => ({
      idProducto: l.producto.id,
      nombre: l.producto.nombre,
      precioUnitario: l.subtotal / l.cantidad,
      cantidad: l.cantidad,
    })),
    total: lineas.reduce((s, l) => s + l.subtotal, 0),
    entrega: datos.entrega,
    direccion: datos.entrega === 'despacho' ? datos.direccion.trim() : '',
    metodoPago: datos.metodoPago,
    estado: datos.simularRechazo ? 'Pago rechazado' : 'Confirmado',
  }

  if (!datos.simularRechazo) moverStock(carrito.map((i) => ({ idProducto: i.idProducto, cantidad: -i.cantidad })))
  guardarColeccion(CLAVES.pedidos, [...listarPedidos(), pedido])
  return { ok: true, dato: pedido }
}

/** Cambia el estado. Cancelar un pedido con stock descontado lo devuelve al inventario. */
export function cambiarEstadoPedido(id: string, estado: EstadoPedido): ResultadoOperacion<Pedido> {
  const pedidos = listarPedidos()
  const pedido = pedidos.find((p) => p.id === id)
  if (!pedido) return { ok: false, campo: 'id', mensaje: 'El pedido no existe.' }
  if (SIN_VENTA.includes(pedido.estado)) {
    return { ok: false, campo: 'estado', mensaje: 'Un pedido cancelado o rechazado no se puede modificar.' }
  }
  if (estado === 'Cancelado') moverStock(pedido.items.map((i) => ({ idProducto: i.idProducto, cantidad: i.cantidad })))

  const actualizado = { ...pedido, estado }
  guardarColeccion(CLAVES.pedidos, pedidos.map((p) => (p.id === id ? actualizado : p)))
  return { ok: true, dato: actualizado }
}

/* ---------------- REPORTES ---------------- */

/** Pedidos que cuentan como venta. */
export const pedidosValidos = (pedidos: Pedido[]) => pedidos.filter((p) => !SIN_VENTA.includes(p.estado))

/** Saldo pendiente de cuenta corriente de un cliente. */
export function saldoCuentaCorriente(pedidos: Pedido[], idUsuario: string): number {
  return pedidosValidos(pedidos)
    .filter((p) => p.idUsuario === idUsuario && p.metodoPago === 'cuenta-corriente')
    .reduce((s, p) => s + p.total, 0)
}

/** Unidades vendidas por producto, de mayor a menor. */
export function unidadesVendidasPorProducto(pedidos: Pedido[]): [string, number][] {
  const lineas = pedidosValidos(pedidos).flatMap((p) => p.items)
  return sumarPor(lineas, (i) => i.nombre, (i) => i.cantidad)
}
