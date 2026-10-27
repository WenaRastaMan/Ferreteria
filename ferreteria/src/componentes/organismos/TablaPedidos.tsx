/* ORGANISMO — Tabla de pedidos.
   - modo "cliente": solo lectura (Mis pedidos)
   - modo "admin": incluye cliente y un selector para cambiar el estado */
import { Link } from 'react-router-dom'
import { ESTADOS_PEDIDO, type EstadoPedido, type Pedido } from '../../types/pedido'
import { formatearFecha, formatearPrecio } from '../../utils/formato'
import { Insignia } from '../atomos/Insignia'
import { tonoEstado } from '../../utils/estadoPedido'

export interface TablaPedidosProps {
  pedidos: Pedido[]
  modo: 'cliente' | 'admin'
  onCambiarEstado?: (pedido: Pedido, estado: EstadoPedido) => void
}

export function TablaPedidos({ pedidos, modo, onCambiarEstado }: TablaPedidosProps) {
  if (pedidos.length === 0) return <p className="estado-vacio">No hay pedidos para mostrar.</p>
  const cerrado = (p: Pedido) => p.estado === 'Cancelado' || p.estado === 'Pago rechazado'

  return (
    <div className="table-responsive">
      <table className={`tabla ${modo === 'admin' ? 'tabla--admin' : ''}`.trim()}>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Fecha</th>
            {modo === 'admin' && <th>Cliente</th>}
            <th>Entrega</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>
                <Link to={`/pedido/${p.id}`}>{p.id}</Link>
              </td>
              <td>{formatearFecha(p.fecha)}</td>
              {modo === 'admin' && (
                <td>
                  {p.nombreCliente}
                  <div className="texto-suave">{p.correoCliente}</div>
                </td>
              )}
              <td>{p.entrega === 'retiro' ? 'Retiro' : 'Despacho'}</td>
              <td>{formatearPrecio(p.total)}</td>
              <td>
                {modo === 'admin' && !cerrado(p) ? (
                  <select
                    aria-label={`Estado del pedido ${p.id}`}
                    value={p.estado}
                    onChange={(e) => onCambiarEstado?.(p, e.target.value as EstadoPedido)}
                  >
                    {ESTADOS_PEDIDO.filter((e) => e !== 'Pago rechazado').map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                ) : (
                  <Insignia texto={p.estado} tono={tonoEstado(p.estado)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
