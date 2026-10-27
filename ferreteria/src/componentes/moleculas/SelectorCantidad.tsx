/* MOLÉCULA — Botones − / + para la cantidad.
   Controlado por el padre: recibe "valor" y avisa con onCambio.
   Nunca deja bajar de 1 ni subir sobre "maximo" (el stock). */
export interface SelectorCantidadProps {
  valor: number
  maximo: number
  onCambio: (cantidad: number) => void
  etiqueta: string
}

export function SelectorCantidad({ valor, maximo, onCambio, etiqueta }: SelectorCantidadProps) {
  return (
    <div className="selector-cantidad" role="group" aria-label={etiqueta}>
      <button type="button" aria-label="Restar uno" disabled={valor <= 1} onClick={() => onCambio(valor - 1)}>
        −
      </button>
      <span aria-live="polite">{valor}</span>
      <button type="button" aria-label="Sumar uno" disabled={valor >= maximo} onClick={() => onCambio(valor + 1)}>
        +
      </button>
    </div>
  )
}
