/* ORGANISMO — Filtros del catálogo (texto, categoría, orden y "solo con stock").
   Presentacional: el estado de los filtros vive en la página. */
import type { FiltrosCatalogo as Filtros, OrdenCatalogo } from '../../types/producto'

export interface FiltrosCatalogoProps {
  filtros: Filtros
  categorias: string[]
  onCambio: (filtros: Filtros) => void
  onLimpiar: () => void
}

const ORDENES: { valor: OrdenCatalogo; texto: string }[] = [
  { valor: 'predeterminado', texto: 'Orden predeterminado' },
  { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
  { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
  { valor: 'nombre', texto: 'Nombre A–Z' },
]

export function FiltrosCatalogo({ filtros, categorias, onCambio, onLimpiar }: FiltrosCatalogoProps) {
  return (
    <form className="filtros row g-3 align-items-end" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="col-12 col-lg-4 campo mb-0">
        <label htmlFor="filtro-texto">Buscar</label>
        <input
          id="filtro-texto"
          type="search"
          value={filtros.texto}
          placeholder="Nombre, código o marca"
          onChange={(e) => onCambio({ ...filtros, texto: e.target.value })}
        />
      </div>
      <div className="col-6 col-lg-3 campo mb-0">
        <label htmlFor="filtro-categoria">Categoría</label>
        <select id="filtro-categoria" value={filtros.categoria} onChange={(e) => onCambio({ ...filtros, categoria: e.target.value })}>
          <option value="">Todas</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="col-6 col-lg-3 campo mb-0">
        <label htmlFor="filtro-orden">Ordenar</label>
        <select id="filtro-orden" value={filtros.orden} onChange={(e) => onCambio({ ...filtros, orden: e.target.value as OrdenCatalogo })}>
          {ORDENES.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-lg-2 d-flex flex-lg-column gap-2 justify-content-between">
        <label className="casilla">
          <input type="checkbox" checked={filtros.soloConStock} onChange={(e) => onCambio({ ...filtros, soloConStock: e.target.checked })} />
          Solo con stock
        </label>
        <button type="button" className="filtros__limpiar" onClick={onLimpiar}>
          Limpiar
        </button>
      </div>
    </form>
  )
}
