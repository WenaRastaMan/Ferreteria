/* PÁGINA (contenedor) — Catálogo. Una sola página para 3 rutas:
     /productos?q=texto     todos (con la búsqueda del encabezado)
     /categorias/:nombre    filtrada por categoría
     /ofertas               solo productos en oferta
   Estado: los filtros (useState). La lista visible se calcula en cada render.

   Truco: el componente exterior le pone una "key" según la URL. Si la URL
   cambia (otra categoría u otra búsqueda), React crea la vista de nuevo
   con los filtros iniciales correctos, sin necesidad de un useEffect. */
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import type { FiltrosCatalogo as Filtros } from '../types/producto'
import { filtrarProductos, listarCategorias, listarProductos } from '../services/productosService'
import { useCarrito } from '../context/CarritoContext'
import { FiltrosCatalogo } from '../componentes/organismos/FiltrosCatalogo'
import { GrillaProductos } from '../componentes/organismos/GrillaProductos'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'

export interface CatalogoPageProps {
  soloOfertas?: boolean
}

export default function CatalogoPage({ soloOfertas = false }: CatalogoPageProps) {
  const { nombre } = useParams()
  const [params] = useSearchParams()
  const iniciales: Filtros = {
    texto: params.get('q') ?? '',
    categoria: nombre ?? '',
    orden: 'predeterminado',
    soloConStock: false,
    soloOfertas,
  }
  return <VistaCatalogo key={`${nombre}|${params.get('q')}|${soloOfertas}`} iniciales={iniciales} />
}

function VistaCatalogo({ iniciales }: { iniciales: Filtros }) {
  const { agregar } = useCarrito()
  const [filtros, setFiltros] = useState<Filtros>(iniciales)
  const productos = listarProductos()
  const visibles = filtrarProductos(productos, filtros)

  const titulo = filtros.soloOfertas ? 'Ofertas especiales' : filtros.categoria || 'Todos los productos'

  return (
    <main className="contenedor seccion">
      <TituloSeccion
        principal
        etiqueta={filtros.soloOfertas ? 'Precios rebajados' : 'Catálogo'}
        titulo={titulo}
        descripcion="Busca por nombre, código o marca. El stock se actualiza con cada compra."
      />
      <FiltrosCatalogo
        filtros={filtros}
        categorias={listarCategorias(productos)}
        onCambio={setFiltros}
        onLimpiar={() => setFiltros({ ...iniciales, texto: '', categoria: '' })}
      />
      <p className="resumen-resultados" aria-live="polite">
        {visibles.length} {visibles.length === 1 ? 'producto encontrado' : 'productos encontrados'}
      </p>
      <GrillaProductos productos={visibles} onAgregar={(p) => agregar(p)} />
    </main>
  )
}
