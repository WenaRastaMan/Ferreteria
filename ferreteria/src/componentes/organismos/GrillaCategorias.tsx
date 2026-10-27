/* ORGANISMO — Grilla de tarjetas de categoría (con cantidad opcional). */
import { TarjetaCategoria } from '../moleculas/TarjetaCategoria'

export interface GrillaCategoriasProps {
  categorias: { nombre: string; cantidad?: number }[]
}

export function GrillaCategorias({ categorias }: GrillaCategoriasProps) {
  return (
    <div className="row g-3">
      {categorias.map((c) => (
        <div className="col-6 col-md-4" key={c.nombre}>
          <TarjetaCategoria nombre={c.nombre} cantidad={c.cantidad} />
        </div>
      ))}
    </div>
  )
}
