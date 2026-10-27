/* ÁTOMO — Insignia (badge) de rol, estado de cuenta o estado de pedido.
   El "tono" decide el color; el texto es libre. */
export type TonoInsignia = 'verde' | 'amarillo' | 'rojo' | 'gris' | 'oscuro'

export interface InsigniaProps {
  texto: string
  tono?: TonoInsignia
}

export function Insignia({ texto, tono = 'gris' }: InsigniaProps) {
  return <span className={`insignia insignia--${tono}`}>{texto}</span>
}
