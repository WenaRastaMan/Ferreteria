/* MOLÉCULA — Campo de búsqueda + botón.
   Guarda lo escrito en su propio estado y avisa al padre con
   onBuscar(texto) al hacer clic o al apretar Enter (va dentro de un <form>). */
import { useState, type FormEvent } from 'react'

export interface BuscadorProps {
  onBuscar: (texto: string) => void
  placeholder?: string
}

export function Buscador({ onBuscar, placeholder = 'Buscar herramientas, materiales...' }: BuscadorProps) {
  const [texto, setTexto] = useState('')

  const enviar = (e: FormEvent) => {
    e.preventDefault() // evita que la página se recargue
    onBuscar(texto.trim())
  }

  return (
    <form className="buscador" role="search" onSubmit={enviar}>
      <input
        type="search"
        aria-label="Buscar productos"
        placeholder={placeholder}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  )
}
