/* PÁGINA (contenedor) — Resumen del panel.  Ruta: /admin
   KPIs, alertas de stock bajo y accesos rápidos según el rol. */
import { useAuth } from '../../context/AuthContext'
import { listarProductos, productosStockBajo } from '../../services/productosService'
import { listarPedidos, pedidosValidos } from '../../services/pedidosService'
import { listarUsuarios } from '../../services/usuariosService'
import { formatearPrecio } from '../../utils/formato'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { TarjetaKpi } from '../../componentes/moleculas/TarjetaKpi'
import { AccesoRapido } from '../../componentes/moleculas/AccesoRapido'

const POR_ATENDER = ['Confirmado', 'Preparando', 'Listo para retiro', 'En despacho']

export default function DashboardPage() {
  const { usuario, esAdmin } = useAuth()
  const productos = listarProductos()
  const pedidos = listarPedidos()
  const bajos = productosStockBajo(productos)
  const ventas = pedidosValidos(pedidos).reduce((s, p) => s + p.total, 0)

  return (
    <>
      <EncabezadoAdmin>
        Bienvenido, <span>{usuario?.nombre.split(' ')[0]}</span> 🛠️
      </EncabezadoAdmin>

      <section className="admin-kpis">
        <TarjetaKpi icono="📦" valor={productos.length} etiqueta="Productos en catálogo" to="/admin/inventario" />
        <TarjetaKpi icono="🧾" valor={pedidos.filter((p) => POR_ATENDER.includes(p.estado)).length} etiqueta="Pedidos por atender" to="/admin/pedidos" />
        <TarjetaKpi icono="⚠️" valor={bajos.length} etiqueta="Productos con stock bajo" alerta={bajos.length > 0} />
        {esAdmin ? (
          <TarjetaKpi icono="💰" valor={formatearPrecio(ventas)} etiqueta="Ventas registradas" />
        ) : (
          <TarjetaKpi icono="👥" valor={listarUsuarios().filter((u) => u.rol === 'cliente').length} etiqueta="Clientes" />
        )}
      </section>

      <section className="admin-accesos">
        <AccesoRapido icono="📦" titulo="Inventario" descripcion="Agregar, editar o eliminar productos y ofertas." to="/admin/inventario" />
        <AccesoRapido icono="🧾" titulo="Pedidos" descripcion="Actualizar el estado de los pedidos de clientes." to="/admin/pedidos" />
        {esAdmin && <AccesoRapido icono="📈" titulo="Reportes" descripcion="Ventas, productos más vendidos y cuentas corrientes." to="/admin/reportes" />}
      </section>

      <section className="admin-seccion">
        <h2>Alertas de inventario</h2>
        {bajos.length === 0 ? (
          <p className="estado-vacio">Sin alertas: todo el stock está sobre el mínimo.</p>
        ) : (
          <ul className="lista-alertas">
            {bajos.map((p) => (
              <li key={p.id}>
                <span aria-hidden="true">⚠️</span> <strong>{p.nombre}</strong> — {p.stock} unidades (mínimo {p.minimo})
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
