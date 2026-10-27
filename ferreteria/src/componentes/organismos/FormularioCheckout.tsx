/* ORGANISMO — Datos de entrega y pago del checkout.
   - La dirección solo aparece (y es obligatoria) si se elige despacho.
   - "Cuenta corriente" solo aparece para clientes habilitados.
   - "Simular pago rechazado" existe solo para probar el flujo de error. */
import { useState, type FormEvent } from 'react'
import type { ErroresFormulario } from '../../types/comun'
import type { DatosCheckout, MetodoPago, ModalidadEntrega } from '../../types/pedido'
import { validarRequerido } from '../../utils/validaciones'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { CampoSelector } from '../moleculas/CampoSelector'
import { Boton } from '../atomos/Boton'
import { MensajeError } from '../atomos/MensajeError'

export type ErrorCheckout = { campo: string; mensaje: string }

export interface FormularioCheckoutProps {
  nombreInicial: string
  permiteCuentaCorriente: boolean
  onSubmit: (datos: DatosCheckout) => ErrorCheckout | void
}

export function FormularioCheckout({ nombreInicial, permiteCuentaCorriente, onSubmit }: FormularioCheckoutProps) {
  const [datos, setDatos] = useState<DatosCheckout>({
    nombre: nombreInicial,
    entrega: 'retiro',
    direccion: '',
    metodoPago: 'simulado',
    simularRechazo: false,
  })
  const [errores, setErrores] = useState<ErroresFormulario<string>>({})

  const cambiar = <K extends keyof DatosCheckout>(campo: K, valor: DatosCheckout[K]) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
    setErrores((prev) => ({ ...prev, [campo]: null }))
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevos = {
      nombre: validarRequerido(datos.nombre, 'El nombre'),
      direccion: datos.entrega === 'despacho' ? validarRequerido(datos.direccion, 'La dirección') : null,
    }
    setErrores(nuevos)
    if (nuevos.nombre || nuevos.direccion) return
    const error = onSubmit(datos)
    if (error) setErrores({ [error.campo]: error.mensaje })
  }

  const metodos = [
    { valor: 'simulado', texto: 'Pago simulado (débito / crédito)' },
    ...(permiteCuentaCorriente ? [{ valor: 'cuenta-corriente', texto: 'Cuenta corriente (pago a fin de mes)' }] : []),
  ]

  return (
    <form className="panel formulario formulario--ancho" onSubmit={enviar} noValidate aria-label="Datos de entrega">
      <h2>Información de entrega</h2>
      <CampoFormulario id="nombre" etiqueta="Nombre de quien recibe" valor={datos.nombre} onCambio={(v) => cambiar('nombre', v)} error={errores.nombre} />
      <CampoSelector
        id="entrega"
        etiqueta="Modalidad"
        valor={datos.entrega}
        onCambio={(v) => cambiar('entrega', v as ModalidadEntrega)}
        opciones={[
          { valor: 'retiro', texto: 'Retiro en tienda' },
          { valor: 'despacho', texto: 'Despacho a domicilio' },
        ]}
      />
      {datos.entrega === 'despacho' && (
        <CampoFormulario id="direccion" etiqueta="Dirección de despacho" valor={datos.direccion} onCambio={(v) => cambiar('direccion', v)}
          error={errores.direccion} placeholder="Calle, número, comuna" />
      )}
      <CampoSelector id="metodoPago" etiqueta="Forma de pago" valor={datos.metodoPago} onCambio={(v) => cambiar('metodoPago', v as MetodoPago)}
        opciones={metodos} error={errores.metodoPago} />
      <label className="casilla">
        <input type="checkbox" checked={datos.simularRechazo} onChange={(e) => cambiar('simularRechazo', e.target.checked)} />
        Simular pago rechazado (para pruebas)
      </label>
      <MensajeError mensaje={errores.carrito} />
      <Boton type="submit" ancho>
        Confirmar pedido
      </Boton>
    </form>
  )
}
