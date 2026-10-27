/* PÁGINA (contenedor) — Reportes.  Ruta: /admin/reportes (solo administrador)
   Gráficos con Chart.js (react-chartjs-2) y exportación a Excel con
   tres hojas: Pedidos, Inventario y Cuentas corrientes. */
import type { ReactNode } from 'react'
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { listarPedidos, pedidosValidos, saldoCuentaCorriente, unidadesVendidasPorProducto } from '../../services/pedidosService'
import { listarProductos, productosStockBajo } from '../../services/productosService'
import { listarUsuarios } from '../../services/usuariosService'
import { contarPor, recortar, sumarPor } from '../../utils/estadisticas'
import { exportarLibro, pedidosAFilas, productosAFilas } from '../../utils/exportarExcel'
import { formatearPrecio } from '../../utils/formato'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { TarjetaKpi } from '../../componentes/moleculas/TarjetaKpi'
import { Boton } from '../../componentes/atomos/Boton'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

// Paleta de la ferretería para los gráficos
const COLORES = ['#214330', '#ffc453', '#3f7a52', '#e3bc6d', '#7fa88a', '#ad6321', '#b9c8bc', '#152b20']
const barras = {
  indexAxis: 'y' as const,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { ticks: { precision: 0 } } },
}
const dona = { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const } } }

function Grafico({ titulo, vacio, children }: { titulo: string; vacio: boolean; children: ReactNode }) {
  return (
    <div className="admin-grafico">
      <h2>{titulo}</h2>
      {vacio ? <p className="estado-vacio">Sin datos todavía.</p> : <div className="admin-grafico__lienzo">{children}</div>}
    </div>
  )
}

export default function ReportesPage() {
  const pedidos = listarPedidos()
  const productos = listarProductos()
  const validos = pedidosValidos(pedidos)
  const monto = validos.reduce((s, p) => s + p.total, 0)
  const porEstado = contarPor(pedidos, (p) => p.estado)
  const topProductos = unidadesVendidasPorProducto(pedidos).slice(0, 8)
  const ventasPorCategoria = sumarPor(
    validos.flatMap((p) => p.items),
    (i) => productos.find((x) => x.id === i.idProducto)?.categoria ?? 'Sin categoría',
    (i) => i.precioUnitario * i.cantidad,
  )
  const cuentas = listarUsuarios()
    .filter((u) => u.cuentaCorriente)
    .map((u) => ({ Cliente: u.nombre, Correo: u.correo, Saldo: saldoCuentaCorriente(pedidos, u.id) }))

  return (
    <>
      <EncabezadoAdmin>Reportes 📈</EncabezadoAdmin>

      <section className="admin-kpis">
        <TarjetaKpi icono="🧾" valor={validos.length} etiqueta="Pedidos válidos" />
        <TarjetaKpi icono="💰" valor={formatearPrecio(monto)} etiqueta="Monto vendido" />
        <TarjetaKpi icono="🎟️" valor={formatearPrecio(validos.length ? Math.round(monto / validos.length) : 0)} etiqueta="Ticket promedio" />
        <TarjetaKpi icono="⚠️" valor={productosStockBajo(productos).length} etiqueta="Productos por reponer" />
      </section>

      <section className="admin-graficos">
        <Grafico titulo="Pedidos por estado" vacio={pedidos.length === 0}>
          <Doughnut options={dona} data={{ labels: porEstado.map(([e]) => e), datasets: [{ data: porEstado.map(([, n]) => n), backgroundColor: COLORES, borderWidth: 2 }] }} />
        </Grafico>
        <Grafico titulo="Productos más vendidos (unidades)" vacio={topProductos.length === 0}>
          <Bar
            options={barras}
            data={{ labels: topProductos.map(([n]) => recortar(n, 24)), datasets: [{ data: topProductos.map(([, u]) => u), backgroundColor: '#214330', borderRadius: 6 }] }}
          />
        </Grafico>
        <Grafico titulo="Ventas por categoría ($)" vacio={ventasPorCategoria.length === 0}>
          <Bar
            options={barras}
            data={{ labels: ventasPorCategoria.map(([c]) => c), datasets: [{ data: ventasPorCategoria.map(([, m]) => m), backgroundColor: '#ffc453', borderRadius: 6 }] }}
          />
        </Grafico>
      </section>

      <section className="admin-seccion">
        <h2>Cuentas corrientes</h2>
        <div className="table-responsive">
          <table className="tabla tabla--admin">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Saldo pendiente</th>
              </tr>
            </thead>
            <tbody>
              {cuentas.map((c) => (
                <tr key={c.Correo}>
                  <td>{c.Cliente}</td>
                  <td>{c.Correo}</td>
                  <td>{formatearPrecio(c.Saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="admin-reportes-exportar">
        <Boton
          variante="exportar"
          onClick={() =>
            exportarLibro(
              { Pedidos: pedidosAFilas(pedidos), Inventario: productosAFilas(productos), 'Cuentas corrientes': cuentas },
              'reporte-los-maestros',
            )
          }
        >
          📤 Exportar reporte completo (Excel)
        </Boton>
      </div>
    </>
  )
}
