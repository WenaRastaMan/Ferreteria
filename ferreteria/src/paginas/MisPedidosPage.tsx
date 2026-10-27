/* PÁGINA (contenedor) — Mis pedidos.  Ruta: /mis-pedidos (requiere sesión)
   Historial propio + saldo de cuenta corriente (si el cliente está habilitado). */
import { useAuth } from '../context/AuthContext'
import { listarPedidos, listarPedidosDeUsuario, saldoCuentaCorriente } from '../services/pedidosService'
import { formatearPrecio } from '../utils/formato'
import { TablaPedidos } from '../componentes/organismos/TablaPedidos'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'

export default function MisPedidosPage() {
  const { usuario } = useAuth()
  if (!usuario) return null
  const pedidos = listarPedidosDeUsuario(usuario.id)

  return (
    <main className="contenedor seccion">
      <TituloSeccion principal etiqueta="Mi cuenta" titulo="Mis pedidos" />
      {usuario.cuentaCorriente && (
        <div className="panel cuenta-corriente">
          <span>🧾 Saldo de cuenta corriente (se paga a fin de mes)</span>
          <strong>{formatearPrecio(saldoCuentaCorriente(listarPedidos(), usuario.id))}</strong>
        </div>
      )}
      <TablaPedidos pedidos={pedidos} modo="cliente" />
    </main>
  )
}
