/* Funciones puras de formato para mostrar datos en pantalla. */

const PESOS = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })

/** 5990 → "$5.990" */
export function formatearPrecio(valor: number): string {
  return PESOS.format(valor)
}

/** "2026-10-20T10:00:00Z" → "20-10-2026" */
export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
