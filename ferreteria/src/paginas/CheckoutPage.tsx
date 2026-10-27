/* PÁGINA (contenedor) — Checkout.  Ruta: /checkout (requiere sesión)
   El formulario valida los campos; esta página registra el pedido con el
   servicio y decide qué hacer: si el pago fue exitoso vacía el carrito.
   Siempre termina en /pedido/:id (éxito o pago rechazado).
   Se guarda el id del pedido en el estado y se redirige con <Navigate>:
   así, al vaciar el carrito, la página no salta a "/carrito" por error. */
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCarrito } from '../context/CarritoContext'
import { calcularTotal, detalleCarrito } from '../services/carritoService'
import { listarProductos } from '../services/productosService'
import { registrarPedido } from '../services/pedidosService'
import type { DatosCheckout } from '../types/pedido'
import { FormularioCheckout, type ErrorCheckout } from '../componentes/organismos/FormularioCheckout'
import { ResumenPedido } from '../componentes/organismos/ResumenPedido'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'

export default function CheckoutPage() {
  const { usuario } = useAuth()
  const { items, vaciar } = useCarrito()
  const [idPedido, setIdPedido] = useState<string | null>(null)
  const productos = listarProductos()
  const lineas = detalleCarrito(items, productos)

  if (idPedido) return <Navigate to={`/pedido/${idPedido}`} replace />
  if (!usuario) return null // la ruta ya está protegida
  if (lineas.length === 0) return <Navigate to="/carrito" replace />

  const confirmar = (datos: DatosCheckout): ErrorCheckout | void => {
    const resultado = registrarPedido(usuario, items, datos)
    if (!resultado.ok) return { campo: resultado.campo, mensaje: resultado.mensaje }
    if (resultado.dato.estado !== 'Pago rechazado') vaciar()
    setIdPedido(resultado.dato.id)
  }

  return (
    <main className="contenedor seccion">
      <TituloSeccion principal titulo="Finalizar pedido" descripcion="Simulación académica: no se realiza ningún cobro real." />
      <div className="row g-4">
        <div className="col-lg-7">
          <FormularioCheckout nombreInicial={usuario.nombre} permiteCuentaCorriente={usuario.cuentaCorriente} onSubmit={confirmar} />
        </div>
        <div className="col-lg-5">
          <ResumenPedido
            lineas={lineas.map((l) => ({ nombre: l.producto.nombre, cantidad: l.cantidad, subtotal: l.subtotal }))}
            total={calcularTotal(items, productos)}
          />
        </div>
      </div>
    </main>
  )
}
