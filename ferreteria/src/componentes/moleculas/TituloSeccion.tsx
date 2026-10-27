/* MOLÉCULA — Encabezado de sección (etiqueta + título + bajada opcional).
   Si recibe "enlace", agrega un "Ver todo →" a la derecha. */
import { Link } from 'react-router-dom'
import { Etiqueta } from '../atomos/Etiqueta'

export interface TituloSeccionProps {
  etiqueta?: string
  titulo: string
  descripcion?: string
  enlace?: { to: string; texto: string }
  /** h1 para el título principal de una página; h2 por defecto. */
  principal?: boolean
}

export function TituloSeccion({ etiqueta, titulo, descripcion, enlace, principal = false }: TituloSeccionProps) {
  const Titulo = principal ? 'h1' : 'h2'
  return (
    <div className="titulo-seccion">
      <div>
        {etiqueta && <Etiqueta>{etiqueta}</Etiqueta>}
        <Titulo>{titulo}</Titulo>
        {descripcion && <p>{descripcion}</p>}
      </div>
      {enlace && (
        <Link to={enlace.to} className="titulo-seccion__enlace">
          {enlace.texto} →
        </Link>
      )}
    </div>
  )
}
