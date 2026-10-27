/* PÁGINA (contenedor) — Gestión de pedidos.  Ruta: /admin/pedidos
   El personal cambia el estado de cada pedido. Al cancelar, el servicio
   devuelve el stock al inventario. */
import { useState } from 'react'
import { ESTADOS_PEDIDO, type EstadoPedido, type Pedido } from '../../types/pedido'
import { cambiarEstadoPedido, listarPedidos } from '../../services/pedidosService'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { TablaPedidos } from '../../componentes/organismos/TablaPedidos'

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(() => listarPedidos())
  const [filtro, setFiltro] = useState<'' | EstadoPedido>('')
  const [aviso, setAviso] = useState<string | null>(null)

  const visibles = pedidos.filter((p) => !filtro || p.estado === filtro).sort((a, b) => b.fecha.localeCompare(a.fecha))

  const cambiar = (pedido: Pedido, estado: EstadoPedido) => {
    const resultado = cambiarEstadoPedido(pedido.id, estado)
    setAviso(resultado.ok ? `Pedido ${pedido.id}: ${estado}${estado === 'Cancelado' ? ' (stock devuelto al inventario)' : ''}.` : resultado.mensaje)
    setPedidos(listarPedidos())
  }

  return (
    <>
      <EncabezadoAdmin>Pedidos 🧾</EncabezadoAdmin>
      {aviso && (
        <div className="admin-aviso" role="status">
          {aviso}
          <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso">
            ✕
          </button>
        </div>
      )}
      <section className="admin-seccion">
        <div className="admin-filtros">
          <select aria-label="Filtrar por estado" value={filtro} onChange={(e) => setFiltro(e.target.value as '' | EstadoPedido)}>
            <option value="">Todos los estados</option>
            {ESTADOS_PEDIDO.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
          <span className="texto-suave">{visibles.length} pedidos</span>
        </div>
        <TablaPedidos pedidos={visibles} modo="admin" onCambiarEstado={cambiar} />
      </section>
    </>
  )
}
