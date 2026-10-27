/* ORGANISMO — Tabla del carrito (producto, precio, cantidad, subtotal, quitar).
   Presentacional: recibe las líneas ya calculadas y avisa los cambios. */
import type { Producto } from '../../types/producto'
import { formatearPrecio } from '../../utils/formato'
import { precioFinal } from '../../utils/precios'
import { SelectorCantidad } from '../moleculas/SelectorCantidad'

export interface LineaCarrito {
  producto: Producto
  cantidad: number
  subtotal: number
}

export interface TablaCarritoProps {
  lineas: LineaCarrito[]
  onCambiarCantidad: (producto: Producto, cantidad: number) => void
  onQuitar: (producto: Producto) => void
}

export function TablaCarrito({ lineas, onCambiarCantidad, onQuitar }: TablaCarritoProps) {
  return (
    <div className="table-responsive">
      <table className="tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>
              <span className="visually-hidden">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {lineas.map(({ producto: p, cantidad, subtotal }) => (
            <tr key={p.id}>
              <td>
                <span className="tabla__emoji" aria-hidden="true">
                  {p.emoji}
                </span>{' '}
                {p.nombre}
                {cantidad > p.stock && <div className="texto-error">Solo quedan {p.stock} unidades</div>}
              </td>
              <td>{formatearPrecio(precioFinal(p))}</td>
              <td>
                <SelectorCantidad
                  etiqueta={`Cantidad de ${p.nombre}`}
                  valor={cantidad}
                  maximo={p.stock}
                  onCambio={(n) => onCambiarCantidad(p, n)}
                />
              </td>
              <td>{formatearPrecio(subtotal)}</td>
              <td>
                <button type="button" className="boton-accion boton-accion--eliminar" onClick={() => onQuitar(p)} aria-label={`Quitar ${p.nombre}`}>
                  Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
