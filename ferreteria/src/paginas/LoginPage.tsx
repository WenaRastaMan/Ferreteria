/* PÁGINA (contenedor) — Inicio de sesión.  Ruta: /login
   El formulario solo valida y avisa; esta página decide qué hacer:
   autenticar con el contexto y redirigir según el rol. */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FormularioLogin, type DatosLogin, type ErrorLogin } from '../componentes/organismos/FormularioLogin'

export default function LoginPage() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const desde = (location.state as { desde?: string } | null)?.desde

  const manejarLogin = ({ correo, password }: DatosLogin): ErrorLogin | void => {
    const resultado = iniciarSesion(correo, password)
    if (!resultado.ok) return { campo: resultado.campo as ErrorLogin['campo'], mensaje: resultado.mensaje }
    // Personal de la ferretería va al panel; el cliente vuelve a donde estaba o al catálogo
    const esPersonal = resultado.dato.rol === 'admin' || resultado.dato.rol === 'empleado'
    navigate(esPersonal ? '/admin' : (desde ?? '/productos'), { replace: true })
  }

  return (
    <main className="contenedor seccion seccion--formulario">
      <FormularioLogin onSubmit={manejarLogin} />
      <p className="formulario-pie">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" state={{ desde }}>
          Regístrate aquí
        </Link>
      </p>
      <p className="formulario-pie texto-suave">
        Demo: admin@losmaestros.cl / Admin123 · empleado@losmaestros.cl / Empleado123 · cliente@gmail.com / Cliente123
      </p>
    </main>
  )
}
