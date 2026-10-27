/* MOLÉCULA — Etiqueta + <select> controlado + mensaje de error. */
import { MensajeError } from '../atomos/MensajeError'

export interface OpcionSelector {
  valor: string
  texto: string
}

export interface CampoSelectorProps {
  id: string
  etiqueta: string
  valor: string
  opciones: OpcionSelector[]
  onCambio: (valor: string) => void
  error?: string | null
  disabled?: boolean
}

export function CampoSelector({ id, etiqueta, valor, opciones, onCambio, error, disabled }: CampoSelectorProps) {
  return (
    <div className={`campo ${error ? 'campo--invalido' : ''}`.trim()}>
      <label htmlFor={id}>{etiqueta}</label>
      <select id={id} name={id} value={valor} onChange={(e) => onCambio(e.target.value)} disabled={disabled}>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
      <MensajeError mensaje={error} id={`${id}-error`} />
    </div>
  )
}
