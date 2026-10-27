/* Funciones puras para los reportes: agrupar, contar y sumar. */

/** Cuenta cuántos elementos hay por cada valor de "clave" y ordena de mayor a menor. */
export function contarPor<T>(items: T[], clave: (item: T) => string): [string, number][] {
  return sumarPor(items, clave, () => 1)
}

/** Suma "valor" agrupando por "clave" y ordena de mayor a menor. */
export function sumarPor<T>(items: T[], clave: (item: T) => string, valor: (item: T) => number): [string, number][] {
  const total: Record<string, number> = {}
  items.forEach((item) => {
    const k = clave(item)
    total[k] = (total[k] ?? 0) + valor(item)
  })
  return Object.entries(total).sort((a, b) => b[1] - a[1])
}

/** Recorta textos largos para las etiquetas de los gráficos. */
export const recortar = (texto: string, max: number) => (texto.length > max ? `${texto.slice(0, max)}…` : texto)
