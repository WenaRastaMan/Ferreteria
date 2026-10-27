/* ORGANISMO — Aviso flotante abajo a la derecha ("agregado al carrito").
   Se cierra solo a los 4 segundos o con la ✕.
   El "return" del useEffect cancela el temporizador si llega otro
   aviso antes, para no borrar el nuevo antes de tiempo. */
import { useEffect } from 'react'

export interface AvisoFlotanteProps {
  mensaje: string | null
  onCerrar: () => void
}

export function AvisoFlotante({ mensaje, onCerrar }: AvisoFlotanteProps) {
  useEffect(() => {
    if (!mensaje) return
    const temporizador = setTimeout(onCerrar, 4000)
    return () => clearTimeout(temporizador)
  }, [mensaje, onCerrar])

  if (!mensaje) return null
  return (
    <div className="aviso-flotante" role="status">
      <span>{mensaje}</span>
      <button type="button" onClick={onCerrar} aria-label="Cerrar aviso">
        ✕
      </button>
    </div>
  )
}
