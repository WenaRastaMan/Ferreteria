/* PÁGINA (contenedor) — Registro de clientes.  Ruta: /registro
   Crea la cuenta con el servicio y deja la sesión iniciada. */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { crearUsuario } from '../services/usuariosService'
import { FormularioRegistro, type DatosRegistro, type ErrorRegistro } from '../componentes/organismos/FormularioRegistro'

export default function RegistroPage() {
  const { conectar } = useAuth()
  const navigate = useNavigate()
  const desde = (useLocation().state as { desde?: string } | null)?.desde

  const registrar = (datos: DatosRegistro): ErrorRegistro | void => {
    const resultado = crearUsuario({
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono.trim(),
      password: datos.password,
      rol: 'cliente',
      activo: true,
      cuentaCorriente: false,
    })
    if (!resultado.ok) return { campo: resultado.campo, mensaje: resultado.mensaje }
    conectar(resultado.dato)
    navigate(desde ?? '/productos', { replace: true })
  }

  return (
    <main className="contenedor seccion seccion--formulario">
      <FormularioRegistro onSubmit={registrar} />
      <p className="formulario-pie">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </main>
  )
}
