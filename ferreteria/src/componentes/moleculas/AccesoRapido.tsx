/* MOLÉCULA — Acceso rápido del panel (ícono + título + descripción + flecha).
   Navega con "to" o ejecuta una acción con "onClick". */
import { Link } from 'react-router-dom'

export interface AccesoRapidoProps {
  icono: string
  titulo: string
  descripcion: string
  to?: string
  onClick?: () => void
}

export function AccesoRapido({ icono, titulo, descripcion, to, onClick }: AccesoRapidoProps) {
  const contenido = (
    <>
      <span className="admin-acceso-icono" aria-hidden="true">
        {icono}
      </span>
      <div>
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
      </div>
      <span className="admin-acceso-flecha" aria-hidden="true">
        →
      </span>
    </>
  )
  return to ? (
    <Link to={to} className="admin-acceso">
      {contenido}
    </Link>
  ) : (
    <button type="button" className="admin-acceso" onClick={onClick}>
      {contenido}
    </button>
  )
}
