/* ORGANISMO — Barra superior verde de cada página del panel. */
import type { ReactNode } from 'react'

export function EncabezadoAdmin({ children }: { children: ReactNode }) {
  return (
    <header className="admin-topbar">
      <p className="admin-topbar-etiqueta">Panel de gestión</p>
      <h1>{children}</h1>
    </header>
  )
}
