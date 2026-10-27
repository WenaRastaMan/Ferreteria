/* ORGANISMO — Portada de la página de inicio (imagen de fondo + llamado a la acción). */
import { EnlaceBoton } from '../atomos/EnlaceBoton'

export function HeroInicio() {
  return (
    <section className="hero">
      <div className="contenedor hero__contenido">
        <span className="hero__etiqueta">FERRETERÍA LOS MAESTROS · LA SERENA</span>
        <h1>
          Tus proyectos empiezan
          <br />
          <em>con buenas herramientas.</em>
        </h1>
        <p>
          Materiales de construcción, gasfitería, electricidad, herramientas y seguridad. Revisa el stock antes de venir
          y prepara tu pedido.
        </p>
        <div className="hero__acciones">
          <EnlaceBoton to="/productos">Explorar catálogo →</EnlaceBoton>
          <EnlaceBoton to="/ofertas" variante="claro">
            Ver ofertas
          </EnlaceBoton>
        </div>
      </div>
    </section>
  )
}
