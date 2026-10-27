/* ORGANISMO — Menú lateral del panel.
   Usa el Offcanvas de Bootstrap con responsive="lg":
   - en computador (≥ 992px) se ve fijo a la izquierda
   - en tablet/móvil se oculta y se abre como panel deslizable
   El menú depende del rol: el empleado no ve Usuarios ni Reportes. */
import { NavLink } from 'react-router-dom'
import Offcanvas from 'react-bootstrap/Offcanvas'

export interface BarraLateralAdminProps {
  /** true = administrador; false = empleado */
  esAdmin: boolean
  nombre: string
  abierta: boolean
  onCerrar: () => void
  onCerrarSesion: () => void
}

const ITEMS = [
  { to: '/admin', texto: 'Resumen', icono: '📊', end: true },
  { to: '/admin/inventario', texto: 'Inventario', icono: '📦' },
  { to: '/admin/pedidos', texto: 'Pedidos', icono: '🧾' },
  { to: '/admin/usuarios', texto: 'Usuarios', icono: '👥', soloAdmin: true },
  { to: '/admin/reportes', texto: 'Reportes', icono: '📈', soloAdmin: true },
  { to: '/', texto: 'Ver tienda', icono: '🏪', end: true },
]

export function BarraLateralAdmin({ esAdmin, nombre, abierta, onCerrar, onCerrarSesion }: BarraLateralAdminProps) {
  const clase = ({ isActive }: { isActive: boolean }) => `admin-nav-item ${isActive ? 'admin-nav-item--activo' : ''}`.trim()

  return (
    <Offcanvas show={abierta} onHide={onCerrar} responsive="lg" className="admin-sidebar" aria-label="Menú del panel">
      <Offcanvas.Header closeButton closeVariant="white" className="d-lg-none p-0" />
      <div className="admin-sidebar-logo">
        🛠️ LOS MAESTROS <small>PANEL DE GESTIÓN</small>
      </div>
      <p className="admin-sidebar-usuario">
        {nombre}
        <span>{esAdmin ? 'Administrador' : 'Empleado'}</span>
      </p>
      <nav className="admin-nav" aria-label="Navegación del panel">
        {ITEMS.filter((item) => esAdmin || !item.soloAdmin).map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={clase} onClick={onCerrar}>
            <span aria-hidden="true">{item.icono}</span>
            <span>{item.texto}</span>
          </NavLink>
        ))}
        <button type="button" className="admin-nav-item admin-nav-item--salir" onClick={onCerrarSesion}>
          <span aria-hidden="true">🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </Offcanvas>
  )
}
