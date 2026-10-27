/* MOLÉCULA — Tarjeta de indicador (KPI) del panel.
   "alerta" la pinta en naranjo; si recibe "to", toda la tarjeta es un enlace. */
import { Link } from 'react-router-dom'

export interface TarjetaKpiProps {
  icono: string
  valor: number | string
  etiqueta: string
  alerta?: boolean
  to?: string
}

export function TarjetaKpi({ icono, valor, etiqueta, alerta = false, to }: TarjetaKpiProps) {
  const clase = `admin-kpi ${alerta ? 'admin-kpi--alerta' : ''} ${to ? 'admin-kpi--enlace' : ''}`.replace(/\s+/g, ' ').trim()
  const contenido = (
    <>
      <span className="admin-kpi-icono" aria-hidden="true">
        {icono}
      </span>
      <span className="admin-kpi-numero">{valor}</span>
      <span className="admin-kpi-label">{etiqueta}</span>
    </>
  )
  return to ? (
    <Link to={to} className={clase}>
      {contenido}
    </Link>
  ) : (
    <div className={clase}>{contenido}</div>
  )
}
