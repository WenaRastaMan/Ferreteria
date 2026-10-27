/* ÁTOMO — Disponibilidad de un producto.
   3 estados según props: agotado (rojo) · stock bajo (naranjo) · disponible (verde). */
import { estadoStock } from '../../utils/precios'

export interface EtiquetaStockProps {
  stock: number
  minimo: number
}

const TEXTO = {
  agotado: () => 'Sin stock',
  bajo: (n: number) => `Stock bajo: ${n} unidades`,
  disponible: (n: number) => `${n} disponibles`,
}

export function EtiquetaStock({ stock, minimo }: EtiquetaStockProps) {
  const estado = estadoStock(stock, minimo)
  return <span className={`stock stock--${estado}`}>{TEXTO[estado](stock)}</span>
}
