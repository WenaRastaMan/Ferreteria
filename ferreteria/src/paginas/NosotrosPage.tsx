/* PÁGINA — Nosotros.  Ruta: /nosotros */
import { NEGOCIO, VALORES } from '../data/contenidoTienda'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'
import { TarjetaBeneficio } from '../componentes/moleculas/TarjetaBeneficio'

export default function NosotrosPage() {
  return (
    <main className="contenedor seccion">
      <TituloSeccion principal etiqueta="Quiénes somos" titulo={NEGOCIO.nombre} />
      <div className="panel texto-largo">
        <p>
          Somos un negocio familiar de {NEGOCIO.ciudad}, con {NEGOCIO.anios} años de trayectoria, dedicado a materiales de
          construcción, herramientas, gasfitería, electricidad y ferretería general.
        </p>
        <p>
          Con esta plataforma nuestros clientes y contratistas pueden revisar el stock sin llamar por teléfono, armar su
          pedido y elegir retiro en tienda o despacho.
        </p>
      </div>
      <div className="row g-3 seccion">
        {VALORES.map((v) => (
          <div className="col-md-4" key={v.titulo}>
            <TarjetaBeneficio {...v} />
          </div>
        ))}
      </div>
    </main>
  )
}
