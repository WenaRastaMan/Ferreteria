/* ORGANISMO — Ventana modal.
   Renderizado condicional: si "abierto" es false no se dibuja nada.
   Se cierra con la ✕, haciendo clic fuera o con la tecla Escape. */
import { useEffect, type ReactNode } from 'react'

export interface ModalProps {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
  ancho?: boolean
}

export function Modal({ abierto, titulo, onCerrar, children, ancho = false }: ModalProps) {
  useEffect(() => {
    if (!abierto) return
    const alPresionar = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="modal-fondo" onClick={(e) => e.target === e.currentTarget && onCerrar()}>
      <section className={`modal-caja ${ancho ? 'modal-caja--ancha' : ''}`.trim()} role="dialog" aria-modal="true" aria-label={titulo}>
        <button type="button" className="modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
          ✕
        </button>
        <h2>{titulo}</h2>
        {children}
      </section>
    </div>
  )
}
