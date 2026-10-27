/* ORGANISMO — Tabla del inventario con acciones Editar / Eliminar. */
import type { Producto } from '../../types/producto'
import { formatearPrecio } from '../../utils/formato'
import { EtiquetaStock } from '../atomos/EtiquetaStock'

export interface TablaInventarioProps {
  productos: Producto[]
  onEditar: (producto: Producto) => void
  onEliminar: (producto: Producto) => void
}

export function TablaInventario({ productos, onEditar, onEliminar }: TablaInventarioProps) {
  if (productos.length === 0) return <p className="estado-vacio">No hay productos que coincidan con la búsqueda.</p>
  return (
    <div className="table-responsive">
      <table className="tabla tabla--admin">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td className="tabla__codigo">{p.codigo}</td>
              <td>
                {p.emoji} {p.nombre}
              </td>
              <td>{p.categoria}</td>
              <td>
                {formatearPrecio(p.precio)}
                {p.oferta && <div className="texto-oferta">Oferta {formatearPrecio(p.oferta)}</div>}
              </td>
              <td>
                <EtiquetaStock stock={p.stock} minimo={p.minimo} />
              </td>
              <td className="tabla__acciones">
                <button type="button" className="boton-accion boton-accion--editar" onClick={() => onEditar(p)} aria-label={`Editar ${p.nombre}`}>
                  Editar
                </button>
                <button type="button" className="boton-accion boton-accion--eliminar" onClick={() => onEliminar(p)} aria-label={`Eliminar ${p.nombre}`}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
