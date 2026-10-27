/* PÁGINA (contenedor) — Categorías.  Ruta: /categorias */
import { GrillaCategorias } from '../componentes/organismos/GrillaCategorias'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'
import { listarCategorias, listarProductos } from '../services/productosService'

export default function CategoriasPage() {
  const productos = listarProductos()
  const categorias = listarCategorias(productos).map((nombre) => ({
    nombre,
    cantidad: productos.filter((p) => p.categoria === nombre).length,
  }))

  return (
    <main className="contenedor seccion">
      <TituloSeccion principal etiqueta="Catálogo" titulo="Categorías" descripcion="Encuentra todo lo que necesitas para tu proyecto." />
      <GrillaCategorias categorias={categorias} />
    </main>
  )
}
