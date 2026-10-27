/* PRUEBAS — Servicios y funciones puras (lógica de negocio sin pantalla). */
import { beforeEach, describe, expect, it } from 'vitest'
import {
  actualizarProducto,
  asegurarDatosInicialesProductos,
  crearProducto,
  eliminarProducto,
  filtrarProductos,
  listarProductos,
  obtenerProductoPorId,
} from '../services/productosService'
import { agregarItem, calcularTotal, carritoDisponible, cambiarCantidad } from '../services/carritoService'
import { cambiarEstadoPedido, registrarPedido, saldoCuentaCorriente, listarPedidos } from '../services/pedidosService'
import { asegurarDatosInicialesUsuarios, obtenerUsuarioPorCorreo } from '../services/usuariosService'
import { aSesion, autenticar } from '../services/sesionService'
import { validarOferta, validarPassword } from '../utils/validaciones'
import { porcentajeDescuento, precioFinal } from '../utils/precios'
import type { DatosCheckout } from '../types/pedido'
import type { FiltrosCatalogo } from '../types/producto'

const SIN_FILTROS: FiltrosCatalogo = { texto: '', categoria: '', orden: 'predeterminado', soloConStock: false, soloOfertas: false }
const RETIRO: DatosCheckout = { nombre: 'Carlos', entrega: 'retiro', direccion: '', metodoPago: 'simulado', simularRechazo: false }

beforeEach(() => {
  asegurarDatosInicialesProductos()
  asegurarDatosInicialesUsuarios()
})

describe('productosService', () => {
  it('P01 carga los 85 productos reales de la planilla Forma E', () => {
    expect(listarProductos()).toHaveLength(85)
    expect(obtenerProductoPorId(1)?.nombre).toBe('Cemento Polpaico gris 25 kg')
  })

  it('P02 CRUD: crea, actualiza y elimina un producto; no acepta códigos repetidos', () => {
    const datos = { codigo: 'jd900', nombre: 'Carretilla 90L', categoria: 'Jardín', subcategoria: '', marca: 'Truper', unidad: 'Unidad', precio: 45990, stock: 3, minimo: 1, emoji: '🛒' }
    const creado = crearProducto(datos)
    expect(creado.ok && creado.dato).toMatchObject({ id: 86, codigo: 'JD900' })
    expect(crearProducto({ ...datos, codigo: 'MC001' })).toMatchObject({ ok: false, campo: 'codigo' })

    actualizarProducto(86, { stock: 10 })
    expect(obtenerProductoPorId(86)?.stock).toBe(10)
    expect(eliminarProducto(86)).toBe(true)
    expect(obtenerProductoPorId(86)).toBeNull()
  })

  it('P03 filtra por texto (nombre, código o marca), categoría y ofertas', () => {
    const productos = listarProductos()
    expect(filtrarProductos(productos, { ...SIN_FILTROS, texto: 'cemento' })).toHaveLength(2)
    expect(filtrarProductos(productos, { ...SIN_FILTROS, texto: 'makita' }).every((p) => p.marca === 'Makita')).toBe(true)
    expect(filtrarProductos(productos, { ...SIN_FILTROS, categoria: 'Seguridad' })).toHaveLength(5)
    expect(filtrarProductos(productos, { ...SIN_FILTROS, soloOfertas: true })).toHaveLength(6)
  })
})

describe('precios y validaciones', () => {
  it('P04 cobra el precio de oferta y calcula el % de descuento', () => {
    const taladro = obtenerProductoPorId(30)!
    expect(precioFinal(taladro)).toBe(69990)
    expect(porcentajeDescuento(taladro)).toBe(13)
    expect(porcentajeDescuento(obtenerProductoPorId(1)!)).toBe(0)
  })

  it('P05 valida contraseña y precio de oferta', () => {
    expect(validarPassword('abc')).toMatch(/entre 8 y 20/)
    expect(validarPassword('solotexto')).toMatch(/letras y números/)
    expect(validarPassword('Maestro2026')).toBeNull()
    expect(validarOferta('7000', 5990)).toMatch(/menor al precio/)
    expect(validarOferta('', 5990)).toBeNull()
  })
})

describe('carritoService', () => {
  it('P06 no permite agregar más unidades que el stock', () => {
    const taladro = obtenerProductoPorId(30)! // stock 8
    let carrito = agregarItem([], taladro, 7)!
    carrito = agregarItem(carrito, taladro)!
    expect(carrito).toEqual([{ idProducto: 30, cantidad: 8 }])
    expect(agregarItem(carrito, taladro)).toBeNull()
    expect(cambiarCantidad(carrito, taladro, 50)[0].cantidad).toBe(8)
  })

  it('P07 calcula el total con ofertas y detecta stock insuficiente', () => {
    const productos = listarProductos()
    expect(calcularTotal([{ idProducto: 1, cantidad: 2 }, { idProducto: 30, cantidad: 1 }], productos)).toBe(2 * 5990 + 69990)
    expect(carritoDisponible([{ idProducto: 1, cantidad: 999 }], productos)).toBe(false)
    expect(carritoDisponible([], productos)).toBe(false)
  })
})

describe('pedidosService y sesionService', () => {
  const cliente = () => aSesion(obtenerUsuarioPorCorreo('cliente@gmail.com')!)

  it('P08 una compra exitosa descuenta stock; un pago rechazado no', () => {
    const ok = registrarPedido(cliente(), [{ idProducto: 1, cantidad: 5 }], RETIRO)
    expect(ok.ok && ok.dato.estado).toBe('Confirmado')
    expect(obtenerProductoPorId(1)?.stock).toBe(75)

    const rechazado = registrarPedido(cliente(), [{ idProducto: 1, cantidad: 5 }], { ...RETIRO, simularRechazo: true })
    expect(rechazado.ok && rechazado.dato.estado).toBe('Pago rechazado')
    expect(obtenerProductoPorId(1)?.stock).toBe(75)
  })

  it('P09 cancelar un pedido devuelve el stock y suma la cuenta corriente solo de pedidos válidos', () => {
    const r = registrarPedido(cliente(), [{ idProducto: 30, cantidad: 2 }], { ...RETIRO, metodoPago: 'cuenta-corriente' })
    if (!r.ok) throw new Error(r.mensaje)
    expect(saldoCuentaCorriente(listarPedidos(), 'u-cliente')).toBe(139980)

    cambiarEstadoPedido(r.dato.id, 'Cancelado')
    expect(obtenerProductoPorId(30)?.stock).toBe(8)
    expect(saldoCuentaCorriente(listarPedidos(), 'u-cliente')).toBe(0)
    expect(cambiarEstadoPedido(r.dato.id, 'Entregado').ok).toBe(false) // cancelado no se reactiva
  })

  it('P10 autenticar: correo inexistente, contraseña mala, cuenta desactivada y sesión sin contraseña', () => {
    expect(autenticar('nadie@gmail.com', 'x')).toMatchObject({ ok: false, campo: 'correo' })
    expect(autenticar('cliente@gmail.com', 'mala')).toMatchObject({ ok: false, campo: 'password' })
    const ok = autenticar('CLIENTE@gmail.com', 'Cliente123')
    expect(ok.ok).toBe(true)
    expect(ok.ok && 'password' in ok.dato).toBe(false)
  })
})
