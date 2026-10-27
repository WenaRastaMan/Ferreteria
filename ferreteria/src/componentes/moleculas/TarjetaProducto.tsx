/* MOLÉCULA — Tarjeta de producto del catálogo.
   Combina átomos: Precio + EtiquetaStock + Boton.
   No sabe nada del carrito: solo avisa con onAgregar(producto),
   así la misma tarjeta sirve en Inicio, Catálogo, Ofertas y Detalle. */
import { Link } from 'react-router-dom'
import type { Producto } from '../../types/producto'
import { Boton } from '../atomos/Boton'
import { EtiquetaStock } from '../atomos/EtiquetaStock'
import { Precio } from '../atomos/Precio'

export interface TarjetaProductoProps {
  producto: Producto
  onAgregar: (producto: Producto) => void
}

export function TarjetaProducto({ producto: p, onAgregar }: TarjetaProductoProps) {
  return (
    <article className="tarjeta-producto">
      <Link to={`/productos/${p.id}`} className="tarjeta-producto__imagen" aria-label={`Ver ${p.nombre}`}>
        <span aria-hidden="true">{p.emoji}</span>
        {p.oferta && <span className="tarjeta-producto__oferta">Oferta</span>}
      </Link>
      <div className="tarjeta-producto__cuerpo">
        <span className="tarjeta-producto__meta">
          {p.categoria} · {p.codigo}
        </span>
        <Link to={`/productos/${p.id}`} className="tarjeta-producto__nombre">
          {p.nombre}
        </Link>
        <Precio producto={p} />
        <EtiquetaStock stock={p.stock} minimo={p.minimo} />
      </div>
      <Boton disabled={p.stock <= 0} onClick={() => onAgregar(p)} className="tarjeta-producto__boton">
        {p.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
      </Boton>
    </article>
  )
}
