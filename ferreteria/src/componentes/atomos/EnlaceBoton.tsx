/* ÁTOMO — Enlace con apariencia de botón (usa Link de React Router).
   Ej.: "Explorar catálogo" del hero o "Seguir comprando". */
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface EnlaceBotonProps {
  to: string
  children: ReactNode
  variante?: 'principal' | 'secundario' | 'claro'
}

export function EnlaceBoton({ to, children, variante = 'principal' }: EnlaceBotonProps) {
  return (
    <Link to={to} className={`boton boton--${variante}`}>
      {children}
    </Link>
  )
}
