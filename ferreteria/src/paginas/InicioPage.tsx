/* PÁGINA (contenedor) — Inicio.  Ruta: /
   Hero + beneficios + categorías + ofertas destacadas. */
import { HeroInicio } from '../componentes/organismos/HeroInicio'
import { SeccionBeneficios } from '../componentes/organismos/SeccionBeneficios'
import { GrillaCategorias } from '../componentes/organismos/GrillaCategorias'
import { GrillaProductos } from '../componentes/organismos/GrillaProductos'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'
import { useCarrito } from '../context/CarritoContext'
import { listarCategorias, listarProductos } from '../services/productosService'

export default function InicioPage() {
  const { agregar } = useCarrito()
  const productos = listarProductos()
  const ofertas = productos.filter((p) => p.oferta).slice(0, 4)

  return (
    <main>
      <HeroInicio />
      <div className="contenedor seccion">
        <SeccionBeneficios />

        <section className="seccion">
          <TituloSeccion etiqueta="Catálogo" titulo="Encuentra lo que necesitas para tu obra" enlace={{ to: '/categorias', texto: 'Ver categorías' }} />
          <GrillaCategorias categorias={listarCategorias(productos).map((nombre) => ({ nombre }))} />
        </section>

        <section className="seccion">
          <TituloSeccion etiqueta="Precios rebajados" titulo="Ofertas de la semana" enlace={{ to: '/ofertas', texto: 'Ver todas' }} />
          <GrillaProductos productos={ofertas} onAgregar={(p) => agregar(p)} vacio="Por ahora no hay ofertas activas." />
        </section>
      </div>
    </main>
  )
}
