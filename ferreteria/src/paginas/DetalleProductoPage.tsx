/* PÁGINA (contenedor) — Detalle de un producto.  Ruta: /productos/:id
   Lee el parámetro de la URL, muestra la ficha técnica, permite elegir
   cantidad y sugiere productos de la misma categoría. */
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerProductoPorId, listarProductos } from '../services/productosService'
import { useCarrito } from '../context/CarritoContext'
import { Precio } from '../componentes/atomos/Precio'
import { EtiquetaStock } from '../componentes/atomos/EtiquetaStock'
import { Boton } from '../componentes/atomos/Boton'
import { SelectorCantidad } from '../componentes/moleculas/SelectorCantidad'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'
import { GrillaProductos } from '../componentes/organismos/GrillaProductos'
import NoEncontradoPage from './NoEncontradoPage'

export default function DetalleProductoPage() {
  const { id } = useParams()
  // key: al pasar a un producto relacionado, la cantidad vuelve a 1
  return <VistaDetalle key={id} id={Number(id)} />
}

function VistaDetalle({ id }: { id: number }) {
  const { agregar } = useCarrito()
  const [cantidad, setCantidad] = useState(1)
  const producto = obtenerProductoPorId(id)

  if (!producto) return <NoEncontradoPage mensaje="El producto que buscas no existe o fue retirado del catálogo." />

  const relacionados = listarProductos()
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4)

  const ficha: [string, string][] = [
    ['Código', producto.codigo],
    ['Marca', producto.marca || 'Sin información'],
    ['Unidad', producto.unidad],
    ['Subcategoría', producto.subcategoria || 'General'],
    ['Disponibles', `${producto.stock} unidades`],
  ]

  return (
    <main className="contenedor seccion">
      <Link to="/productos" className="enlace-volver">
        ← Volver al catálogo
      </Link>
      <div className="row g-4 mt-1">
        <div className="col-md-6">
          <div className="detalle__imagen" aria-hidden="true">
            {producto.emoji}
          </div>
        </div>
        <div className="col-md-6 detalle__info">
          <span className="seccion-etiqueta">{producto.categoria}</span>
          <h1>{producto.nombre}</h1>
          <Precio producto={producto} grande />
          <EtiquetaStock stock={producto.stock} minimo={producto.minimo} />
          <table className="ficha">
            <tbody>
              {ficha.map(([dato, valor]) => (
                <tr key={dato}>
                  <th>{dato}</th>
                  <td>{valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {producto.stock > 0 && (
            <div className="detalle__comprar">
              <SelectorCantidad etiqueta="Cantidad a agregar" valor={cantidad} maximo={producto.stock} onCambio={setCantidad} />
              <Boton onClick={() => agregar(producto, cantidad)}>Agregar al carrito</Boton>
            </div>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="seccion">
          <TituloSeccion titulo={`También en ${producto.categoria}`} />
          <GrillaProductos productos={relacionados} onAgregar={(p) => agregar(p)} />
        </section>
      )}
    </main>
  )
}
