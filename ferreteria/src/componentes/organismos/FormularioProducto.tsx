/* ORGANISMO — Formulario para crear o editar un producto (va dentro de un Modal).
   Los números se manejan como texto mientras se escriben (para permitir
   el campo vacío) y se convierten al enviar. La oferta es opcional. */
import { useState, type FormEvent } from 'react'
import type { ErroresFormulario } from '../../types/comun'
import type { NuevoProducto, Producto } from '../../types/producto'
import { hayErrores, validarEntero, validarOferta, validarRequerido } from '../../utils/validaciones'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { CampoSelector } from '../moleculas/CampoSelector'
import { Boton } from '../atomos/Boton'

type Campo = 'codigo' | 'nombre' | 'marca' | 'categoria' | 'subcategoria' | 'unidad' | 'precio' | 'oferta' | 'stock' | 'minimo' | 'emoji'
type Valores = Record<Campo, string>
export type ErrorProducto = { campo: string; mensaje: string }

export interface FormularioProductoProps {
  categorias: string[]
  valoresIniciales?: Producto
  onSubmit: (datos: NuevoProducto) => ErrorProducto | void
  onCancelar: () => void
}

function aValores(p: Producto | undefined, categoria: string): Valores {
  return {
    codigo: p?.codigo ?? '',
    nombre: p?.nombre ?? '',
    marca: p?.marca ?? '',
    categoria: p?.categoria ?? categoria,
    subcategoria: p?.subcategoria ?? '',
    unidad: p?.unidad ?? 'Unidad',
    precio: p ? String(p.precio) : '',
    oferta: p?.oferta ? String(p.oferta) : '',
    stock: p ? String(p.stock) : '0',
    minimo: p ? String(p.minimo) : '5',
    emoji: p?.emoji ?? '🧰',
  }
}

export function FormularioProducto({ categorias, valoresIniciales, onSubmit, onCancelar }: FormularioProductoProps) {
  const [v, setV] = useState<Valores>(() => aValores(valoresIniciales, categorias[0] ?? ''))
  const [errores, setErrores] = useState<ErroresFormulario<Campo>>({})

  const cambiar = (campo: Campo) => (valor: string) => {
    setV((prev) => ({ ...prev, [campo]: valor }))
    setErrores((prev) => ({ ...prev, [campo]: null }))
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const errorPrecio = validarEntero(v.precio, 'El precio', 1)
    const nuevos: ErroresFormulario<Campo> = {
      codigo: validarRequerido(v.codigo, 'El código', 10),
      nombre: validarRequerido(v.nombre, 'El nombre', 80),
      precio: errorPrecio,
      oferta: errorPrecio ? null : validarOferta(v.oferta, Number(v.precio)),
      stock: validarEntero(v.stock, 'El stock'),
      minimo: validarEntero(v.minimo, 'El stock mínimo'),
    }
    setErrores(nuevos)
    if (hayErrores(nuevos)) return

    const error = onSubmit({
      codigo: v.codigo.trim().toUpperCase(),
      nombre: v.nombre.trim(),
      marca: v.marca.trim(),
      categoria: v.categoria,
      subcategoria: v.subcategoria.trim(),
      unidad: v.unidad.trim() || 'Unidad',
      precio: Number(v.precio),
      oferta: v.oferta.trim() ? Number(v.oferta) : undefined,
      stock: Number(v.stock),
      minimo: Number(v.minimo),
      emoji: v.emoji.trim() || '🧰',
    })
    if (error) setErrores({ [error.campo]: error.mensaje })
  }

  return (
    <form onSubmit={enviar} noValidate aria-label="Datos del producto" className="formulario-grilla">
      <CampoFormulario id="codigo" etiqueta="Código" valor={v.codigo} onCambio={cambiar('codigo')} error={errores.codigo} maxLength={10} />
      <CampoFormulario id="nombre" etiqueta="Nombre" valor={v.nombre} onCambio={cambiar('nombre')} error={errores.nombre} maxLength={80} />
      <CampoSelector id="categoria" etiqueta="Categoría" valor={v.categoria} onCambio={cambiar('categoria')} opciones={categorias.map((c) => ({ valor: c, texto: c }))} />
      <CampoFormulario id="subcategoria" etiqueta="Subcategoría" valor={v.subcategoria} onCambio={cambiar('subcategoria')} />
      <CampoFormulario id="marca" etiqueta="Marca" valor={v.marca} onCambio={cambiar('marca')} />
      <CampoFormulario id="unidad" etiqueta="Unidad de venta" valor={v.unidad} onCambio={cambiar('unidad')} />
      <CampoFormulario id="precio" etiqueta="Precio" tipo="number" min={1} valor={v.precio} onCambio={cambiar('precio')} error={errores.precio} />
      <CampoFormulario id="oferta" etiqueta="Precio oferta (opcional)" tipo="number" min={1} valor={v.oferta} onCambio={cambiar('oferta')} error={errores.oferta} />
      <CampoFormulario id="stock" etiqueta="Stock" tipo="number" min={0} valor={v.stock} onCambio={cambiar('stock')} error={errores.stock} />
      <CampoFormulario id="minimo" etiqueta="Stock mínimo" tipo="number" min={0} valor={v.minimo} onCambio={cambiar('minimo')} error={errores.minimo} />
      <CampoFormulario id="emoji" etiqueta="Ícono" valor={v.emoji} onCambio={cambiar('emoji')} maxLength={4} />
      <div className="modal-botones formulario-grilla__botones">
        <Boton variante="limpiar" onClick={onCancelar}>
          Cancelar
        </Boton>
        <Boton type="submit">Guardar producto</Boton>
      </div>
    </form>
  )
}
