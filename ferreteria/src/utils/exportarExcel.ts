/* =========================================================
   Exportación a Excel con SheetJS (librería xlsx).
========================================================= */
import * as XLSX from 'xlsx'
import type { Pedido } from '../types/pedido'
import type { Producto } from '../types/producto'

/** Productos con encabezados "bonitos" para la hoja de inventario. */
export function productosAFilas(productos: Producto[]) {
  return productos.map((p) => ({
    Codigo: p.codigo,
    Producto: p.nombre,
    Categoria: p.categoria,
    Marca: p.marca,
    Precio: p.precio,
    Oferta: p.oferta ?? '',
    Stock: p.stock,
    Minimo: p.minimo,
    Alerta: p.stock <= p.minimo ? 'Reponer' : '',
  }))
}

/** Una fila por pedido (sin el detalle de productos). */
export function pedidosAFilas(pedidos: Pedido[]) {
  return pedidos.map((p) => ({
    Pedido: p.id,
    Fecha: p.fecha.slice(0, 10),
    Cliente: p.nombreCliente,
    Correo: p.correoCliente,
    Entrega: p.entrega,
    Pago: p.metodoPago,
    Estado: p.estado,
    Total: p.total,
  }))
}

/**
 * Crea un libro con una hoja por cada entrada de `hojas` y lo descarga.
 * Ej: exportarLibro({ Pedidos: [...], Inventario: [...] }, 'reporte')
 */
export function exportarLibro(hojas: Record<string, object[]>, nombreArchivo: string): void {
  const libro = XLSX.utils.book_new()
  Object.entries(hojas).forEach(([nombre, filas]) => {
    // Una hoja vacía igual se crea, con un aviso, para que el archivo no quede incompleto
    const datos = filas.length > 0 ? filas : [{ Aviso: 'Sin registros' }]
    XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(datos), nombre)
  })
  XLSX.writeFile(libro, `${nombreArchivo}.xlsx`)
}
