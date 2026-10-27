/* PÁGINA (contenedor) — Resultado de la compra.  Ruta: /pedido/:id (requiere sesión)
   Muestra "pedido registrado" o "pago rechazado". Un cliente solo puede ver
   SUS pedidos; el personal de la ferretería puede ver cualquiera. */
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerPedidoPorId } from '../services/pedidosService'
import { formatearFecha } from '../utils/formato'
import { ResumenPedido } from '../componentes/organismos/ResumenPedido'
import { EnlaceBoton } from '../componentes/atomos/EnlaceBoton'
import NoEncontradoPage from './NoEncontradoPage'

export default function ResultadoPedidoPage() {
  const { id = '' } = useParams()
  const { usuario, esPersonal } = useAuth()
  const pedido = obtenerPedidoPorId(id)

  if (!pedido || (!esPersonal && pedido.idUsuario !== usuario?.id)) {
    return <NoEncontradoPage mensaje="No encontramos ese pedido en tu cuenta." />
  }

  const rechazado = pedido.estado === 'Pago rechazado'
  return (
    <main className="contenedor seccion">
      <div className={`panel resultado ${rechazado ? 'resultado--error' : 'resultado--ok'}`}>
        <h1>{rechazado ? '❌ No se pudo realizar el pago' : '✅ Pedido registrado correctamente'}</h1>
        <p>
          Código: <strong>{pedido.id}</strong> · {formatearFecha(pedido.fecha)}
        </p>
        <p>
          Entrega: {pedido.entrega === 'retiro' ? 'Retiro en tienda' : `Despacho a ${pedido.direccion}`} · Pago:{' '}
          {pedido.metodoPago === 'cuenta-corriente' ? 'Cuenta corriente' : 'Pago simulado'}
        </p>
        <p className="texto-suave">
          {rechazado
            ? 'No se descontó stock y tu carrito sigue intacto. Puedes intentarlo de nuevo.'
            : 'Te avisaremos cuando tu pedido cambie de estado. Puedes revisarlo en "Mis pedidos".'}
        </p>
        <ResumenPedido
          titulo="Detalle"
          lineas={pedido.items.map((i) => ({ nombre: i.nombre, cantidad: i.cantidad, subtotal: i.precioUnitario * i.cantidad }))}
          total={pedido.total}
        />
        <div className="resultado__botones">
          <EnlaceBoton to={rechazado ? '/carrito' : '/mis-pedidos'}>{rechazado ? 'Volver al carrito' : 'Ver mis pedidos'}</EnlaceBoton>
          <EnlaceBoton to="/productos" variante="secundario">
            Seguir comprando
          </EnlaceBoton>
        </div>
      </div>
    </main>
  )
}
