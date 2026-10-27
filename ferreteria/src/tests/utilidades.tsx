/* Ayudante para las pruebas de páginas: monta la app completa
   (sesión + carrito + rutas) en la URL indicada, con datos iniciales
   cargados y, opcionalmente, con un usuario ya conectado. */
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CarritoProvider } from '../context/CarritoContext'
import { AppRoutes } from '../routes/AppRoutes'
import { asegurarDatosInicialesProductos } from '../services/productosService'
import { asegurarDatosInicialesUsuarios, obtenerUsuarioPorCorreo } from '../services/usuariosService'
import { guardarSesion } from '../services/sesionService'
import { guardarCarrito } from '../services/carritoService'
import type { ItemCarrito } from '../types/pedido'

export function montarApp(ruta: string, opciones: { correo?: string; carrito?: ItemCarrito[] } = {}) {
  asegurarDatosInicialesProductos()
  asegurarDatosInicialesUsuarios()
  if (opciones.correo) guardarSesion(obtenerUsuarioPorCorreo(opciones.correo)!)
  if (opciones.carrito) guardarCarrito(opciones.carrito)
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <CarritoProvider>
          <AppRoutes />
        </CarritoProvider>
      </AuthProvider>
    </MemoryRouter>,
  )
}
