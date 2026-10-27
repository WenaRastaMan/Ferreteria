/* ORGANISMO — Grilla responsive de TarjetaProducto.
   Bootstrap: 2 columnas en móvil, 3 en tablet, 4 en computador.
   Si la lista viene vacía muestra el mensaje "vacio". */
import type { Producto } from '../../types/producto'
import { TarjetaProducto } from '../moleculas/TarjetaProducto'

export interface GrillaProductosProps {
  productos: Producto[]
  onAgregar: (producto: Producto) => void
  vacio?: string
}

export function GrillaProductos({ productos, onAgregar, vacio = 'No encontramos productos con esos filtros.' }: GrillaProductosProps) {
  if (productos.length === 0) return <p className="estado-vacio">{vacio}</p>
  return (
    <div className="row g-3">
      {productos.map((p) => (
        <div className="col-6 col-md-4 col-xl-3" key={p.id}>
          <TarjetaProducto producto={p} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  )
}
