/* PÁGINA — Contacto.  Ruta: /contacto
   El mapa de cobertura (Leaflet) queda para la etapa con backend:
   el caso no entrega dirección exacta ni radio de despacho. */
import { NEGOCIO } from '../data/contenidoTienda'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'
import { FormularioContacto } from '../componentes/organismos/FormularioContacto'

export default function ContactoPage() {
  return (
    <main className="contenedor seccion">
      <TituloSeccion principal etiqueta="Contacto" titulo="Hablemos de tu obra" />
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="panel contacto-datos">
            <h2>{NEGOCIO.nombre}</h2>
            <p>📍 {NEGOCIO.ciudad}</p>
            <p>☎ {NEGOCIO.telefono}</p>
            <p>✉ {NEGOCIO.correo}</p>
            <p>🕘 {NEGOCIO.horario}</p>
            <p className="texto-suave">El mapa con la zona de despacho se agregará cuando el negocio confirme su cobertura.</p>
          </div>
        </div>
        <div className="col-lg-7">
          <FormularioContacto />
        </div>
      </div>
    </main>
  )
}
