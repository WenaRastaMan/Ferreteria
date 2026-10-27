/* ORGANISMO — Pie de página del sitio público. */
import { Link } from 'react-router-dom'
import { NEGOCIO } from '../../data/contenidoTienda'

export function PiePagina() {
  return (
    <footer className="pie">
      <div className="contenedor pie__contenido">
        <div>
          <Link to="/" className="marca">
            🛠️ LOS MAESTROS <small>FERRETERÍA · LA SERENA</small>
          </Link>
          <p>Materiales, herramientas y soluciones para tu obra desde hace {NEGOCIO.anios} años.</p>
        </div>
        <div>
          <h3>Contacto</h3>
          <p>✉ {NEGOCIO.correo}</p>
          <p>☎ {NEGOCIO.telefono}</p>
          <p>📍 {NEGOCIO.ciudad}</p>
        </div>
        <div>
          <h3>Horario</h3>
          <p>🕘 {NEGOCIO.horario}</p>
        </div>
      </div>
      <div className="pie__inferior">
        <p>© 2026 {NEGOCIO.nombre} · Proyecto académico DSY1104</p>
      </div>
    </footer>
  )
}
