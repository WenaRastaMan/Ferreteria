/* ÁTOMO — Precio en pesos chilenos.
   Si el producto tiene oferta: precio normal tachado + precio rebajado + "-N%". */
import type { Producto } from '../../types/producto'
import { formatearPrecio } from '../../utils/formato'
import { porcentajeDescuento, precioFinal } from '../../utils/precios'

export interface PrecioProps {
  producto: Producto
  grande?: boolean
}

export function Precio({ producto, grande = false }: PrecioProps) {
  const descuento = porcentajeDescuento(producto)
  return (
    <div className={`precio ${grande ? 'precio--grande' : ''}`.trim()}>
      {descuento > 0 && <del className="precio__anterior">{formatearPrecio(producto.precio)}</del>}
      <strong className="precio__actual">{formatearPrecio(precioFinal(producto))}</strong>
      {descuento > 0 && <span className="precio__descuento">-{descuento}%</span>}
    </div>
  )
}
