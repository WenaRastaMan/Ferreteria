/* Punto de entrada: carga estilos, prepara los datos y monta la app. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 1) Bootstrap primero, 2) estilos de la ferretería encima, 3) ajustes para componentes React
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/styles.css'
import './styles/estilo-tienda.css'
import './styles/estilo-admin.css'
import './styles/ajustes-react.css'

import App from './App'
import { asegurarDatosInicialesProductos } from './services/productosService'
import { asegurarDatosInicialesUsuarios } from './services/usuariosService'

asegurarDatosInicialesProductos() // carga los 85 productos de la planilla si no hay datos
asegurarDatosInicialesUsuarios() // cuentas de ejemplo + cuentas fijas (admin y empleado)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
