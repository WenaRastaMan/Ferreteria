/* MOLÉCULA — Campo de formulario = etiqueta + input + mensaje de error.
   Es un input CONTROLADO: su valor vive en el estado del formulario
   padre (prop "valor") y cada cambio se avisa con "onCambio". */
import type { HTMLInputTypeAttribute } from 'react'
import { MensajeError } from '../atomos/MensajeError'

export interface CampoFormularioProps {
  id: string
  etiqueta: string
  valor: string
  onCambio: (valor: string) => void
  tipo?: HTMLInputTypeAttribute
  error?: string | null
  ayuda?: string
  placeholder?: string
  maxLength?: number
  min?: number
  disabled?: boolean
  autoComplete?: string
}

export function CampoFormulario({
  id,
  etiqueta,
  valor,
  onCambio,
  tipo = 'text',
  error,
  ayuda,
  placeholder,
  maxLength,
  min,
  disabled,
  autoComplete,
}: CampoFormularioProps) {
  return (
    <div className={`campo ${error ? 'campo--invalido' : ''}`.trim()}>
      <label htmlFor={id}>{etiqueta}</label>
      <input
        id={id}
        name={id}
        type={tipo}
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {ayuda && <p className="campo__ayuda">{ayuda}</p>}
      <MensajeError mensaje={error} id={`${id}-error`} />
    </div>
  )
}
