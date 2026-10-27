/* PÁGINA (contenedor) — Inventario.  Ruta: /admin/inventario
   Aquí se integran las 4 operaciones CRUD de productos:
     C → modal "Nuevo producto"   (crearProducto)
     R → tabla con filtros         (listarProductos + filtrarProductos)
     U → modal "Editar"            (actualizarProducto)
     D → confirmación "Eliminar"   (eliminarProducto)
   Después de cada operación se vuelve a leer la lista. */
import { useState } from 'react'
import type { FiltrosCatalogo, NuevoProducto, Producto } from '../../types/producto'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  filtrarProductos,
  listarCategorias,
  listarProductos,
} from '../../services/productosService'
import { exportarLibro, productosAFilas } from '../../utils/exportarExcel'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { TablaInventario } from '../../componentes/organismos/TablaInventario'
import { Modal } from '../../componentes/organismos/Modal'
import { ModalConfirmacion } from '../../componentes/organismos/ModalConfirmacion'
import { FormularioProducto, type ErrorProducto } from '../../componentes/organismos/FormularioProducto'
import { Boton } from '../../componentes/atomos/Boton'

type EstadoModal = { tipo: 'crear' } | { tipo: 'editar'; producto: Producto } | null

const SIN_FILTROS: FiltrosCatalogo = { texto: '', categoria: '', orden: 'predeterminado', soloConStock: false, soloOfertas: false }

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>(() => listarProductos())
  const [filtros, setFiltros] = useState(SIN_FILTROS)
  const [soloStockBajo, setSoloStockBajo] = useState(false)
  const [modal, setModal] = useState<EstadoModal>(null)
  const [aEliminar, setAEliminar] = useState<Producto | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const categorias = listarCategorias(productos)
  const visibles = filtrarProductos(productos, filtros).filter((p) => !soloStockBajo || p.stock <= p.minimo)
  const recargar = () => setProductos(listarProductos())

  /* ---------- CREAR ---------- */
  const crear = (datos: NuevoProducto): ErrorProducto | void => {
    const resultado = crearProducto(datos)
    if (!resultado.ok) return { campo: resultado.campo, mensaje: resultado.mensaje }
    recargar()
    setModal(null)
    setAviso(`Producto ${resultado.dato.nombre} creado.`)
  }

  /* ---------- ACTUALIZAR ---------- */
  const editar = (id: number) => (datos: NuevoProducto): ErrorProducto | void => {
    const resultado = actualizarProducto(id, datos)
    if (!resultado.ok) return { campo: resultado.campo, mensaje: resultado.mensaje }
    recargar()
    setModal(null)
    setAviso(`Cambios de ${resultado.dato.nombre} guardados.`)
  }

  /* ---------- ELIMINAR ---------- */
  const confirmarEliminacion = () => {
    if (!aEliminar) return
    eliminarProducto(aEliminar.id)
    setAviso(`${aEliminar.nombre} eliminado del catálogo.`)
    setAEliminar(null)
    recargar()
  }

  return (
    <>
      <EncabezadoAdmin>Inventario 📦</EncabezadoAdmin>

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
          <input
            type="search"
            aria-label="Buscar en inventario"
            placeholder="Buscar por nombre, código o marca"
            value={filtros.texto}
            onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })}
          />
          <select aria-label="Filtrar por categoría" value={filtros.categoria} onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <label className="casilla">
            <input type="checkbox" checked={soloStockBajo} onChange={(e) => setSoloStockBajo(e.target.checked)} />
            Solo stock bajo
          </label>
          <span className="texto-suave">
            {visibles.length} de {productos.length}
          </span>
          <div className="admin-filtros__botones">
            <Boton variante="exportar" onClick={() => exportarLibro({ Inventario: productosAFilas(visibles) }, 'inventario-los-maestros')}>
              📤 Exportar Excel
            </Boton>
            <Boton onClick={() => setModal({ tipo: 'crear' })}>+ Nuevo producto</Boton>
          </div>
        </div>
        <TablaInventario productos={visibles} onEditar={(p) => setModal({ tipo: 'editar', producto: p })} onEliminar={setAEliminar} />
      </section>

      <Modal abierto={modal !== null} titulo={modal?.tipo === 'editar' ? 'Editar producto' : 'Nuevo producto'} onCerrar={() => setModal(null)} ancho>
        {modal?.tipo === 'crear' && <FormularioProducto categorias={categorias} onSubmit={crear} onCancelar={() => setModal(null)} />}
        {modal?.tipo === 'editar' && (
          <FormularioProducto
            key={modal.producto.id}
            categorias={categorias}
            valoresIniciales={modal.producto}
            onSubmit={editar(modal.producto.id)}
            onCancelar={() => setModal(null)}
          />
        )}
      </Modal>

      <ModalConfirmacion
        abierto={aEliminar !== null}
        titulo="Eliminar producto"
        mensaje={`¿Eliminar "${aEliminar?.nombre ?? ''}" del catálogo? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  )
}
