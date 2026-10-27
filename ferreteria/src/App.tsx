/* Componente raíz: provee la sesión (AuthProvider), el carrito (CarritoProvider) y el enrutador. */
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CarritoProvider } from './context/CarritoContext'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <AppRoutes />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
