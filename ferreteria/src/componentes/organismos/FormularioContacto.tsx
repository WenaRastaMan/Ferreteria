/* ORGANISMO — Formulario de contacto.
   No hay backend todavía: al enviar valida y muestra un mensaje de confirmación. */
import { useState, type FormEvent } from 'react'
import type { ErroresFormulario } from '../../types/comun'
import { hayErrores, validarCorreo, validarRequerido } from '../../utils/validaciones'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { Boton } from '../atomos/Boton'
import { MensajeError } from '../atomos/MensajeError'

type Campo = 'nombre' | 'correo' | 'mensaje'

export function FormularioContacto() {
  const [datos, setDatos] = useState<Record<Campo, string>>({ nombre: '', correo: '', mensaje: '' })
  const [errores, setErrores] = useState<ErroresFormulario<Campo>>({})
  const [enviado, setEnviado] = useState(false)

  const cambiar = (campo: Campo) => (valor: string) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
    setErrores((prev) => ({ ...prev, [campo]: null }))
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevos = {
      nombre: validarRequerido(datos.nombre, 'El nombre', 60),
      correo: validarCorreo(datos.correo),
      mensaje: validarRequerido(datos.mensaje, 'El mensaje', 500),
    }
    setErrores(nuevos)
    if (hayErrores(nuevos)) return
    setEnviado(true)
    setDatos({ nombre: '', correo: '', mensaje: '' })
  }

  return (
    <form className="panel formulario formulario--ancho" onSubmit={enviar} noValidate aria-label="Contacto">
      <h2>Escríbenos</h2>
      {enviado && (
        <p className="aviso-exito" role="status">
          ¡Gracias! Te responderemos a la brevedad.
        </p>
      )}
      <CampoFormulario id="contacto-nombre" etiqueta="Nombre" valor={datos.nombre} onCambio={cambiar('nombre')} error={errores.nombre} />
      <CampoFormulario id="contacto-correo" etiqueta="Correo" tipo="email" valor={datos.correo} onCambio={cambiar('correo')} error={errores.correo} />
      <div className={`campo ${errores.mensaje ? 'campo--invalido' : ''}`.trim()}>
        <label htmlFor="contacto-mensaje">Mensaje</label>
        <textarea id="contacto-mensaje" rows={4} maxLength={500} value={datos.mensaje} onChange={(e) => cambiar('mensaje')(e.target.value)} />
        <MensajeError mensaje={errores.mensaje} />
      </div>
      <Boton type="submit">Enviar mensaje</Boton>
    </form>
  )
}
