/* =========================================================
   Mapa de rutas de la aplicación (React Router).
   - PlantillaPublica: tienda (encabezado + pie)
   - PlantillaAdmin: panel con menú lateral (admin y empleado)
========================================================= */
import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { PlantillaPublica } from '../componentes/plantillas/PlantillaPublica'
import { PlantillaAdmin } from '../componentes/plantillas/PlantillaAdmin'
import { RutaProtegida } from './RutaProtegida'
import InicioPage from '../paginas/InicioPage'
import CatalogoPage from '../paginas/CatalogoPage'
import CategoriasPage from '../paginas/CategoriasPage'
import DetalleProductoPage from '../paginas/DetalleProductoPage'
import CarritoPage from '../paginas/CarritoPage'
import CheckoutPage from '../paginas/CheckoutPage'
import ResultadoPedidoPage from '../paginas/ResultadoPedidoPage'
import MisPedidosPage from '../paginas/MisPedidosPage'
import LoginPage from '../paginas/LoginPage'
import RegistroPage from '../paginas/RegistroPage'
import NosotrosPage from '../paginas/NosotrosPage'
import ContactoPage from '../paginas/ContactoPage'
import NoEncontradoPage from '../paginas/NoEncontradoPage'
import DashboardPage from '../paginas/admin/DashboardPage'
import InventarioPage from '../paginas/admin/InventarioPage'
import PedidosPage from '../paginas/admin/PedidosPage'
import UsuariosPage from '../paginas/admin/UsuariosPage'
import ReportesPage from '../paginas/admin/ReportesPage'

/** Atajo: envuelve una página que solo puede ver el administrador. */
function SoloAdmin({ children }: { children: ReactNode }) {
  return <RutaProtegida roles={['admin']}>{children}</RutaProtegida>
}

/** Atajo: página que requiere sesión iniciada (cualquier rol). */
function ConSesion({ children }: { children: ReactNode }) {
  return <RutaProtegida>{children}</RutaProtegida>
}

export function AppRoutes() {
  return (
    <Routes>
      {/* ---------- Tienda (público) ---------- */}
      <Route element={<PlantillaPublica />}>
        <Route path="/" element={<InicioPage />} />
        <Route path="/productos" element={<CatalogoPage />} />
        <Route path="/productos/:id" element={<DetalleProductoPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/categorias/:nombre" element={<CatalogoPage />} />
        <Route path="/ofertas" element={<CatalogoPage soloOfertas />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />

        {/* Requieren sesión */}
        <Route path="/checkout" element={<ConSesion><CheckoutPage /></ConSesion>} />
        <Route path="/pedido/:id" element={<ConSesion><ResultadoPedidoPage /></ConSesion>} />
        <Route path="/mis-pedidos" element={<ConSesion><MisPedidosPage /></ConSesion>} />

        <Route path="*" element={<NoEncontradoPage />} />
      </Route>

      {/* ---------- Panel de gestión (administrador y empleado) ----------
           Usuarios y reportes: solo administrador. */}
      <Route
        path="/admin"
        element={
          <RutaProtegida roles={['admin', 'empleado']}>
            <PlantillaAdmin />
          </RutaProtegida>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="inventario" element={<InventarioPage />} />
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="usuarios" element={<SoloAdmin><UsuariosPage /></SoloAdmin>} />
        <Route path="reportes" element={<SoloAdmin><ReportesPage /></SoloAdmin>} />
      </Route>
    </Routes>
  )
}
