/* PLANTILLA — Estructura del sitio público: Encabezado + página + Pie.
   <Outlet /> es el "hueco" donde React Router dibuja la página actual.
   Es el contenedor del Encabezado: le pasa la sesión y el carrito por props. */
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCarrito } from '../../context/CarritoContext'
import { Encabezado } from '../organismos/Encabezado'
import { PiePagina } from '../organismos/PiePagina'
import { AvisoFlotante } from '../organismos/AvisoFlotante'

export function PlantillaPublica() {
  const { usuario, esPersonal, cerrarSesion } = useAuth()
  const { unidades, aviso, cerrarAviso } = useCarrito()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Al cambiar de página, volver arriba
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="pagina">
      <Encabezado
        nombreUsuario={usuario?.nombre ?? null}
        accesoPanel={esPersonal}
        unidadesCarrito={unidades}
        onBuscar={(texto) => navigate(texto ? `/productos?q=${encodeURIComponent(texto)}` : '/productos')}
        onCerrarSesion={() => {
          cerrarSesion()
          navigate('/')
        }}
      />
      <Outlet />
      <PiePagina />
      <AvisoFlotante mensaje={aviso} onCerrar={cerrarAviso} />
    </div>
  )
}
