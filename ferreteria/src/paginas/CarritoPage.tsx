/* PÁGINA (contenedor) — Carrito.  Ruta: /carrito
   El botón de checkout se deshabilita si algo del carrito ya no tiene stock. */
import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { calcularTotal, carritoDisponible, detalleCarrito } from '../services/carritoService'
import { listarProductos } from '../services/productosService'
import { formatearPrecio } from '../utils/formato'
import { TablaCarrito } from '../componentes/organismos/TablaCarrito'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'
import { Boton } from '../componentes/atomos/Boton'
import { EnlaceBoton } from '../componentes/atomos/EnlaceBoton'

export default function CarritoPage() {
  const { items, cambiarCantidad, quitar, vaciar } = useCarrito()
  const navigate = useNavigate()
  const productos = listarProductos()
  const lineas = detalleCarrito(items, productos)

  return (
    <main className="contenedor seccion">
      <TituloSeccion principal titulo="Tu carrito" />
      {lineas.length === 0 ? (
        <div className="estado-vacio estado-vacio--grande">
          <p>Tu carrito está vacío.</p>
          <EnlaceBoton to="/productos">Ver productos</EnlaceBoton>
        </div>
      ) : (
        <>
          <TablaCarrito lineas={lineas} onCambiarCantidad={cambiarCantidad} onQuitar={(p) => quitar(p.id)} />
          <div className="carrito__pie">
            <p className="carrito__total">
              Total: <strong>{formatearPrecio(calcularTotal(items, productos))}</strong>
            </p>
            <div className="carrito__botones">
              <Boton variante="secundario" onClick={vaciar}>
                Vaciar carrito
              </Boton>
              <Boton disabled={!carritoDisponible(items, productos)} onClick={() => navigate('/checkout')}>
                Continuar al checkout
              </Boton>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
