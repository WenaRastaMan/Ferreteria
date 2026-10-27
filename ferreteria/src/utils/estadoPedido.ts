/* Color de la insignia según el estado del pedido. */
import type { TonoInsignia } from '../componentes/atomos/Insignia'
import type { EstadoPedido } from '../types/pedido'

export function tonoEstado(estado: EstadoPedido): TonoInsignia {
  if (estado === 'Cancelado' || estado === 'Pago rechazado') return 'rojo'
  if (estado === 'Entregado') return 'verde'
  if (estado === 'Confirmado') return 'amarillo'
  return 'gris'
}
