/* ORGANISMO — Formulario de inicio de sesión.
   Formulario CONTROLADO: correo y contraseña viven en useState.
   Valida formato antes de llamar a onSubmit; si el padre responde
   con un error (ej. "Contraseña incorrecta"), lo muestra en su campo. */
import { useState, type FormEvent } from 'react'
import type { ErroresFormulario } from '../../types/comun'
import { validarCorreo, validarPasswordLogin } from '../../utils/validaciones'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { Boton } from '../atomos/Boton'

export interface DatosLogin {
  correo: string
  password: string
}

type CampoLogin = keyof DatosLogin
export type ErrorLogin = { campo: CampoLogin; mensaje: string }

export interface FormularioLoginProps {
  /** Devuelve un error si las credenciales no son válidas, o nada si todo salió bien. */
  onSubmit: (datos: DatosLogin) => ErrorLogin | void
}

export function FormularioLogin({ onSubmit }: FormularioLoginProps) {
  const [datos, setDatos] = useState<DatosLogin>({ correo: '', password: '' })
  const [errores, setErrores] = useState<ErroresFormulario<CampoLogin>>({})

  const cambiar = (campo: CampoLogin) => (valor: string) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
    setErrores((prev) => ({ ...prev, [campo]: null })) // al escribir se limpia el error del campo
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevos = { correo: validarCorreo(datos.correo), password: validarPasswordLogin(datos.password) }
    setErrores(nuevos)
    if (nuevos.correo || nuevos.password) return

    const error = onSubmit({ correo: datos.correo.trim(), password: datos.password })
    if (error) setErrores({ [error.campo]: error.mensaje })
  }

  return (
    <form className="panel formulario" onSubmit={enviar} noValidate aria-label="Inicio de sesión">
      <h1>Iniciar sesión</h1>
      <p className="texto-suave">Ingresa para comprar, ver tus pedidos y tu cuenta corriente.</p>
      <CampoFormulario id="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onCambio={cambiar('correo')}
        error={errores.correo} placeholder="tu-correo@gmail.com" autoComplete="email" />
      <CampoFormulario id="password" etiqueta="Contraseña" tipo="password" valor={datos.password} onCambio={cambiar('password')}
        error={errores.password} autoComplete="current-password" />
      <Boton type="submit" ancho>
        Ingresar
      </Boton>
    </form>
  )
}
