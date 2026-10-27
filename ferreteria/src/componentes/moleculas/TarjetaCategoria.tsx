/* MOLÉCULA — Acceso directo a una categoría del catálogo. */
import { Link } from 'react-router-dom'
import { ICONOS_CATEGORIA } from '../../data/contenidoTienda'

export interface TarjetaCategoriaProps {
  nombre: string
  cantidad?: number
}

export function TarjetaCategoria({ nombre, cantidad }: TarjetaCategoriaProps) {
  return (
    <Link className="tarjeta-categoria" to={`/categorias/${encodeURIComponent(nombre)}`}>
      <span className="tarjeta-categoria__icono" aria-hidden="true">
        {ICONOS_CATEGORIA[nombre] ?? '📦'}
      </span>
      <strong>{nombre}</strong>
      <small>{cantidad !== undefined ? `${cantidad} productos · ` : ''}Ver productos →</small>
    </Link>
  )
}
