/* ÁTOMO — Botón reutilizable.
   Una sola pieza para todos los botones del sitio: la "variante"
   decide qué clase CSS se aplica (colores de la ferretería). */
import type { ReactNode } from 'react'

export type VarianteBoton =
  | 'principal' // amarillo de la marca (acción principal)
  | 'secundario' // borde verde (acción secundaria)
  | 'claro' // borde blanco, sobre fondos oscuros
  | 'limpiar' // gris del panel
  | 'exportar' // verde del panel
  | 'editar'
  | 'eliminar'

const CLASES: Record<VarianteBoton, string> = {
  principal: 'boton boton--principal',
  secundario: 'boton boton--secundario',
  claro: 'boton boton--claro',
  limpiar: 'boton boton--limpiar',
  exportar: 'boton boton--exportar',
  editar: 'boton-accion boton-accion--editar',
  eliminar: 'boton-accion boton-accion--eliminar',
}

export interface BotonProps {
  children: ReactNode
  variante?: VarianteBoton
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  /** Ocupa todo el ancho disponible. */
  ancho?: boolean
  className?: string
  'aria-label'?: string
}

export function Boton({
  children,
  variante = 'principal',
  type = 'button',
  onClick,
  disabled = false,
  ancho = false,
  className = '',
  'aria-label': ariaLabel,
}: BotonProps) {
  return (
    <button
      type={type}
      className={`${CLASES[variante]} ${ancho ? 'boton--ancho' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
