/* ORGANISMO — Resumen de productos y total (checkout y resultado de compra). */
import { formatearPrecio } from '../../utils/formato'

export interface ResumenPedidoProps {
  lineas: { nombre: string; cantidad: number; subtotal: number }[]
  total: number
  titulo?: string
}

export function ResumenPedido({ lineas, total, titulo = 'Resumen del pedido' }: ResumenPedidoProps) {
  return (
    <aside className="panel resumen">
      <h2>{titulo}</h2>
      <ul>
        {lineas.map((l) => (
          <li key={l.nombre}>
            <span>
              {l.nombre} × {l.cantidad}
            </span>
            <strong>{formatearPrecio(l.subtotal)}</strong>
          </li>
        ))}
      </ul>
      <p className="resumen__total">
        Total <strong>{formatearPrecio(total)}</strong>
      </p>
    </aside>
  )
}
