/* PRUEBAS — Panel de gestión: pedidos, usuarios y reportes.
   Los gráficos (Chart.js necesita <canvas>, que jsdom no tiene) y la
   descarga de Excel se reemplazan por "mocks": así se prueba la página
   sin dibujar gráficos ni descargar archivos de verdad. */
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as XLSX from 'xlsx'
import { montarApp } from './utilidades'
import { asegurarDatosInicialesProductos, obtenerProductoPorId } from '../services/productosService'
import { asegurarDatosInicialesUsuarios, obtenerUsuarioPorCorreo } from '../services/usuariosService'
import { listarPedidos, registrarPedido } from '../services/pedidosService'
import { aSesion } from '../services/sesionService'

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="grafico-barras" />,
  Doughnut: () => <div data-testid="grafico-dona" />,
}))
vi.mock('xlsx', async (original) => ({ ...(await original<typeof import('xlsx')>()), writeFile: vi.fn() }))

/** Crea un pedido de 2 taladros a cuenta corriente para el cliente de ejemplo. */
function crearPedidoDeEjemplo() {
  asegurarDatosInicialesProductos()
  asegurarDatosInicialesUsuarios()
  const cliente = aSesion(obtenerUsuarioPorCorreo('cliente@gmail.com')!)
  const r = registrarPedido(cliente, [{ idProducto: 30, cantidad: 2 }], {
    nombre: 'Carlos Contratista', entrega: 'retiro', direccion: '', metodoPago: 'cuenta-corriente', simularRechazo: false,
  })
  if (!r.ok) throw new Error(r.mensaje)
  return r.dato
}

describe('Panel: pedidos, usuarios y reportes', () => {
  it('P29 cancelar un pedido devuelve el stock y ya no se puede cambiar su estado', async () => {
    const pedido = crearPedidoDeEjemplo()
    expect(obtenerProductoPorId(30)?.stock).toBe(6)
    montarApp('/admin/pedidos', { correo: 'empleado@losmaestros.cl' })
    await userEvent.selectOptions(screen.getByLabelText(`Estado del pedido ${pedido.id}`), 'Cancelado')
    expect(obtenerProductoPorId(30)?.stock).toBe(8)
    expect(listarPedidos()[0].estado).toBe('Cancelado')
    expect(screen.queryByLabelText(`Estado del pedido ${pedido.id}`)).not.toBeInTheDocument()
    expect(screen.getByText(/stock devuelto al inventario/)).toBeInTheDocument()
  })

  it('P30 usuarios: el admin no puede desactivarse a sí mismo y sí puede cambiar roles', async () => {
    montarApp('/admin/usuarios', { correo: 'admin@losmaestros.cl' })
    expect(screen.getByLabelText('Cuenta activa de admin@losmaestros.cl')).toBeDisabled()
    await userEvent.click(screen.getByLabelText('Cuenta activa de empleado@losmaestros.cl'))
    await userEvent.selectOptions(screen.getByLabelText('Rol de cliente@gmail.com'), 'empleado')
    expect(obtenerUsuarioPorCorreo('empleado@losmaestros.cl')?.activo).toBe(false)
    // al dejar de ser cliente pierde la cuenta corriente
    expect(obtenerUsuarioPorCorreo('cliente@gmail.com')).toMatchObject({ rol: 'empleado', cuentaCorriente: false })
  })

  it('P31 reportes muestra ventas y saldos, y exporta un Excel con 3 hojas', async () => {
    crearPedidoDeEjemplo()
    montarApp('/admin/reportes', { correo: 'admin@losmaestros.cl' })
    expect(screen.getAllByText('$139.980').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('grafico-barras')).toHaveLength(2)
    await userEvent.click(screen.getByRole('button', { name: /Exportar reporte completo/ }))
    const [libro, archivo] = vi.mocked(XLSX.writeFile).mock.calls[0]
    expect(archivo).toBe('reporte-los-maestros.xlsx')
    expect(libro.SheetNames).toEqual(['Pedidos', 'Inventario', 'Cuentas corrientes'])
  })

  it('P32 cerrar sesión desde el menú lateral vuelve al login', async () => {
    montarApp('/admin', { correo: 'admin@losmaestros.cl' })
    await userEvent.click(screen.getByRole('button', { name: /Cerrar sesión/ }))
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(localStorage.getItem('losMaestros_sesion')).toBeNull()
  })
})
