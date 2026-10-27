/* =========================================================
   CarritoContext — estado global del carrito.
   El contador del encabezado, las tarjetas de producto, el detalle,
   el carrito y el checkout comparten los mismos ítems.
   Cada cambio se guarda en localStorage (useEffect) para que el
   carrito no se pierda al recargar la página.
========================================================= */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ItemCarrito } from '../types/pedido'
import type { Producto } from '../types/producto'
import * as carritoService from '../services/carritoService'

interface CarritoContextValor {
  items: ItemCarrito[]
  unidades: number
  /** Devuelve false si ya no quedan unidades disponibles. */
  agregar: (producto: Producto, cantidad?: number) => boolean
  cambiarCantidad: (producto: Producto, cantidad: number) => void
  quitar: (idProducto: number) => void
  vaciar: () => void
  /** Mensaje corto que muestra el AvisoFlotante ("agregado al carrito"). */
  aviso: string | null
  cerrarAviso: () => void
}

const CarritoContext = createContext<CarritoContextValor | null>(null)

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>(() => carritoService.leerCarrito())
  const [aviso, setAviso] = useState<string | null>(null)

  // Guardado automático en localStorage
  useEffect(() => carritoService.guardarCarrito(items), [items])

  const agregar: CarritoContextValor['agregar'] = (producto, cantidad = 1) => {
    const nuevo = carritoService.agregarItem(items, producto, cantidad)
    if (!nuevo) {
      setAviso(`No hay más unidades disponibles de ${producto.nombre}.`)
      return false
    }
    setItems(nuevo)
    setAviso(`${producto.nombre} agregado al carrito.`)
    return true
  }

  return (
    <CarritoContext.Provider
      value={{
        items,
        unidades: carritoService.contarUnidades(items),
        agregar,
        cambiarCantidad: (producto, cantidad) => setItems(carritoService.cambiarCantidad(items, producto, cantidad)),
        quitar: (id) => setItems(carritoService.quitarItem(items, id)),
        vaciar: () => setItems([]),
        aviso,
        cerrarAviso: () => setAviso(null),
      }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCarrito(): CarritoContextValor {
  const contexto = useContext(CarritoContext)
  if (!contexto) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>')
  return contexto
}
