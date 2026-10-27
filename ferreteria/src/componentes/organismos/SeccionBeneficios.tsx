/* ORGANISMO — Fila de beneficios bajo el hero. */
import { BENEFICIOS } from '../../data/contenidoTienda'
import { TarjetaBeneficio } from '../moleculas/TarjetaBeneficio'

export function SeccionBeneficios() {
  return (
    <section className="beneficios row g-3" aria-label="Beneficios">
      {BENEFICIOS.map((b) => (
        <div className="col-md-4" key={b.titulo}>
          <TarjetaBeneficio {...b} />
        </div>
      ))}
    </section>
  )
}
