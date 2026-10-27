/* PÁGINA — 404 para rutas (o productos/pedidos) que no existen. */
import { Etiqueta } from '../componentes/atomos/Etiqueta'
import { EnlaceBoton } from '../componentes/atomos/EnlaceBoton'

export interface NoEncontradoPageProps {
  mensaje?: string
}

export default function NoEncontradoPage({ mensaje = 'Puede que el enlace esté mal escrito o que la página se haya movido.' }: NoEncontradoPageProps) {
  return (
    <main className="contenedor seccion text-center">
      <Etiqueta>Error 404</Etiqueta>
      <h1>No encontramos lo que buscas 🔧</h1>
      <p className="texto-suave">{mensaje}</p>
      <EnlaceBoton to="/">Volver al inicio</EnlaceBoton>
    </main>
  )
}
