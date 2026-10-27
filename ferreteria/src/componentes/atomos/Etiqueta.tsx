/* ÁTOMO — Etiqueta de sección (texto pequeño en mayúsculas sobre los títulos). */
import type { ReactNode } from 'react'

export function Etiqueta({ children }: { children: ReactNode }) {
  return <span className="seccion-etiqueta">{children}</span>
}
