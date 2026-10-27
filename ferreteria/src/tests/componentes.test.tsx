/* PRUEBAS — Componentes (átomos, moléculas y organismos).
   Cada prueba indica qué se verifica: RENDER, PROPS, ESTADO o EVENTO. */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Boton } from '../componentes/atomos/Boton'
import { EtiquetaStock } from '../componentes/atomos/EtiquetaStock'
import { Precio } from '../componentes/atomos/Precio'
import { CampoFormulario } from '../componentes/moleculas/CampoFormulario'
import { SelectorCantidad } from '../componentes/moleculas/SelectorCantidad'
import { TarjetaProducto } from '../componentes/moleculas/TarjetaProducto'
import { FormularioLogin } from '../componentes/organismos/FormularioLogin'
import { ModalConfirmacion } from '../componentes/organismos/ModalConfirmacion'
import { CATALOGO_INICIAL } from '../data/catalogoInicial'

const cemento = CATALOGO_INICIAL.find((p) => p.id === 1)!
const taladro = CATALOGO_INICIAL.find((p) => p.id === 30)!

describe('Átomos', () => {
  it('P11 Boton: PROPS de variante y EVENTO click (no responde deshabilitado)', async () => {
    const alHacerClic = vi.fn()
    render(
      <>
        <Boton variante="eliminar" onClick={alHacerClic}>Eliminar</Boton>
        <Boton disabled onClick={alHacerClic}>Bloqueado</Boton>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Eliminar' })).toHaveClass('boton-accion--eliminar')
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Bloqueado' }))
    expect(alHacerClic).toHaveBeenCalledTimes(1)
  })

  it('P12 EtiquetaStock y Precio: PROPS cambian lo que se muestra', () => {
    render(
      <>
        <EtiquetaStock stock={0} minimo={5} />
        <EtiquetaStock stock={3} minimo={5} />
        <Precio producto={taladro} />
        <Precio producto={cemento} />
      </>,
    )
    expect(screen.getByText('Sin stock')).toHaveClass('stock--agotado')
    expect(screen.getByText('Stock bajo: 3 unidades')).toHaveClass('stock--bajo')
    expect(screen.getByText('$79.990').tagName).toBe('DEL') // precio normal tachado
    expect(screen.getByText('-13%')).toBeInTheDocument()
    expect(screen.getByText('$5.990')).toBeInTheDocument()
  })
})

describe('Moléculas', () => {
  it('P13 CampoFormulario: RENDER con etiqueta, EVENTO onCambio y PROPS de error', async () => {
    const onCambio = vi.fn()
    render(<CampoFormulario id="correo" etiqueta="Correo" valor="" onCambio={onCambio} error="El correo es obligatorio." />)
    await userEvent.type(screen.getByLabelText('Correo'), 'a')
    expect(onCambio).toHaveBeenCalledWith('a')
    expect(screen.getByRole('alert')).toHaveTextContent('El correo es obligatorio.')
    expect(screen.getByLabelText('Correo')).toHaveAttribute('aria-invalid', 'true')
  })

  it('P14 SelectorCantidad: se deshabilita en los límites y avisa el nuevo valor', async () => {
    const onCambio = vi.fn()
    render(<SelectorCantidad etiqueta="Cantidad" valor={1} maximo={3} onCambio={onCambio} />)
    expect(screen.getByRole('button', { name: 'Restar uno' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'Sumar uno' }))
    expect(onCambio).toHaveBeenCalledWith(2)
  })

  it('P15 TarjetaProducto: RENDER enlaza al detalle y EVENTO agregar; sin stock queda bloqueada', async () => {
    const onAgregar = vi.fn()
    render(
      <MemoryRouter>
        <TarjetaProducto producto={cemento} onAgregar={onAgregar} />
        <TarjetaProducto producto={{ ...taladro, stock: 0 }} onAgregar={onAgregar} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Cemento Polpaico gris 25 kg' })).toHaveAttribute('href', '/productos/1')
    await userEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))
    expect(onAgregar).toHaveBeenCalledWith(cemento)
    expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled()
  })
})

describe('Organismos', () => {
  it('P16 FormularioLogin: ESTADO de errores al enviar vacío y muestra el error que devuelve el padre', async () => {
    const onSubmit = vi.fn().mockReturnValue({ campo: 'password', mensaje: 'Contraseña incorrecta.' })
    render(<FormularioLogin onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    await userEvent.type(screen.getByLabelText('Correo'), 'cliente@gmail.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'mala')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(onSubmit).toHaveBeenCalledWith({ correo: 'cliente@gmail.com', password: 'mala' })
    expect(screen.getByText('Contraseña incorrecta.')).toBeInTheDocument()
  })

  it('P17 ModalConfirmacion: no se dibuja cerrado; confirmar, cancelar y Escape avisan al padre', async () => {
    const onConfirmar = vi.fn()
    const onCancelar = vi.fn()
    const { rerender } = render(<ModalConfirmacion abierto={false} titulo="Eliminar producto" mensaje="¿Seguro?" onConfirmar={onConfirmar} onCancelar={onCancelar} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<ModalConfirmacion abierto titulo="Eliminar producto" mensaje="¿Seguro?" onConfirmar={onConfirmar} onCancelar={onCancelar} />)
    expect(screen.getByRole('dialog', { name: 'Eliminar producto' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    await userEvent.keyboard('{Escape}')
    expect(onConfirmar).toHaveBeenCalledTimes(1)
    expect(onCancelar).toHaveBeenCalledTimes(2)
  })
})
