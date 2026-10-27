/* ORGANISMO — Encabezado del sitio público (barra superior + menú).
   Usa el Navbar de Bootstrap (react-bootstrap) para que en móviles y
   tablets el menú se colapse en un botón hamburguesa.
   Es un componente de PRESENTACIÓN: recibe todo por props
   (la plantilla le pasa la sesión y el carrito). */
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import { Buscador } from '../moleculas/Buscador'

export interface EncabezadoProps {
  nombreUsuario: string | null // null = visitante
  /** Personal de la ferretería (admin o empleado): ve el acceso al panel. */
  accesoPanel: boolean
  unidadesCarrito: number
  onBuscar: (texto: string) => void
  onCerrarSesion: () => void
}

interface EnlaceMenu {
  to: string
  texto: string
  soloSesion?: boolean
}

const ENLACES: EnlaceMenu[] = [
  { to: '/', texto: 'Inicio' },
  { to: '/productos', texto: 'Productos' },
  { to: '/categorias', texto: 'Categorías' },
  { to: '/ofertas', texto: 'Ofertas' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/contacto', texto: 'Contacto' },
  { to: '/mis-pedidos', texto: 'Mis pedidos', soloSesion: true },
]

export function Encabezado({ nombreUsuario, accesoPanel, unidadesCarrito, onBuscar, onCerrarSesion }: EncabezadoProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const sesionActiva = nombreUsuario !== null
  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="encabezado">
      {/* -------- Barra superior: marca, buscador, cuenta y carrito -------- */}
      <div className="encabezado__barra">
        <div className="contenedor encabezado__barra-contenido">
          <Link to="/" className="marca" onClick={cerrarMenu}>
            🛠️ LOS MAESTROS <small>FERRETERÍA · LA SERENA</small>
          </Link>
          <div className="encabezado__acciones">
            <Buscador onBuscar={onBuscar} />
            {nombreUsuario !== null ? (
              <>
                <span className="encabezado__saludo">Hola, {nombreUsuario.split(' ')[0]}</span>
                <button type="button" className="boton boton--claro boton--chico" onClick={onCerrarSesion}>
                  Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="boton boton--claro boton--chico">
                Ingresar
              </Link>
            )}
            <Link to="/carrito" className="boton boton--principal boton--chico" aria-label={`Carrito, ${unidadesCarrito} unidades`}>
              🛒 {unidadesCarrito}
            </Link>
          </div>
        </div>
      </div>

      {/* -------- Menú de navegación (colapsable) -------- */}
      <Navbar expand="lg" variant="dark" expanded={menuAbierto} onToggle={setMenuAbierto} className="encabezado__menu">
        <div className="contenedor">
          <Navbar.Toggle aria-controls="menu-principal" label="Abrir menú" />
          <Navbar.Collapse id="menu-principal">
            <nav aria-label="Navegación principal">
              <ul>
                {ENLACES.filter((e) => !e.soloSesion || sesionActiva).map((e) => (
                  <li key={e.to}>
                    <NavLink to={e.to} end={e.to === '/'} onClick={cerrarMenu}>
                      {e.texto}
                    </NavLink>
                  </li>
                ))}
                {accesoPanel && (
                  <li>
                    <NavLink to="/admin" className="enlace-panel" onClick={cerrarMenu}>
                      Panel de gestión
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </header>
  )
}
