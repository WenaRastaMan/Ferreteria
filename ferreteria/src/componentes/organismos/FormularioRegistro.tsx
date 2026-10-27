/* ORGANISMO — Formulario de registro de clientes.
   Valida cada campo con las funciones de utils/validaciones;
   si el servicio responde con un error (correo repetido), lo muestra en su campo. */
import { useState, type FormEvent } from 'react'
import type { ErroresFormulario } from '../../types/comun'
import { hayErrores, validarConfirmacion, validarCorreo, validarPassword, validarRequerido, validarTelefono } from '../../utils/validaciones'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { Boton } from '../atomos/Boton'

export interface DatosRegistro {
  nombre: string
  correo: string
  telefono: string
  password: string
  password2: string
}

type CampoRegistro = keyof DatosRegistro
export type ErrorRegistro = { campo: string; mensaje: string }

export interface FormularioRegistroProps {
  onSubmit: (datos: DatosRegistro) => ErrorRegistro | void
}

const VACIO: DatosRegistro = { nombre: '', correo: '', telefono: '', password: '', password2: '' }

export function FormularioRegistro({ onSubmit }: FormularioRegistroProps) {
  const [datos, setDatos] = useState<DatosRegistro>(VACIO)
  const [errores, setErrores] = useState<ErroresFormulario<CampoRegistro>>({})

  const cambiar = (campo: CampoRegistro) => (valor: string) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
    setErrores((prev) => ({ ...prev, [campo]: null }))
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevos: ErroresFormulario<CampoRegistro> = {
      nombre: validarRequerido(datos.nombre, 'El nombre', 60),
      correo: validarCorreo(datos.correo),
      telefono: validarTelefono(datos.telefono),
      password: validarPassword(datos.password),
      password2: validarConfirmacion(datos.password, datos.password2),
    }
    setErrores(nuevos)
    if (hayErrores(nuevos)) return
    const error = onSubmit(datos)
    if (error) setErrores({ [error.campo]: error.mensaje })
  }

  return (
    <form className="panel formulario" onSubmit={enviar} noValidate aria-label="Registro">
      <h1>Crear cuenta</h1>
      <p className="texto-suave">Regístrate para comprar y seguir tus pedidos.</p>
      <CampoFormulario id="nombre" etiqueta="Nombre completo" valor={datos.nombre} onCambio={cambiar('nombre')} error={errores.nombre} maxLength={60} />
      <CampoFormulario id="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onCambio={cambiar('correo')} error={errores.correo} />
      <CampoFormulario id="telefono" etiqueta="Teléfono (opcional)" valor={datos.telefono} onCambio={cambiar('telefono')} error={errores.telefono} placeholder="+56 9 1234 5678" />
      <CampoFormulario id="password" etiqueta="Contraseña" tipo="password" valor={datos.password} onCambio={cambiar('password')}
        error={errores.password} ayuda="Entre 8 y 20 caracteres, con letras y números." />
      <CampoFormulario id="password2" etiqueta="Repetir contraseña" tipo="password" valor={datos.password2} onCambio={cambiar('password2')} error={errores.password2} />
      <Boton type="submit" ancho>
        Registrarme
      </Boton>
    </form>
  )
}
