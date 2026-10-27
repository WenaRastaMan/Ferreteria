/* MOLÉCULA — Beneficio o valor del negocio (ícono + título + texto). */
export interface TarjetaBeneficioProps {
  icono: string
  titulo: string
  texto: string
}

export function TarjetaBeneficio({ icono, titulo, texto }: TarjetaBeneficioProps) {
  return (
    <div className="tarjeta-beneficio">
      <span className="tarjeta-beneficio__icono" aria-hidden="true">
        {icono}
      </span>
      <div>
        <h3>{titulo}</h3>
        <p>{texto}</p>
      </div>
    </div>
  )
}
