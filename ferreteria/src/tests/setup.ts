/* Configuración común de las pruebas (Vitest + React Testing Library).
   - jest-dom agrega comparaciones como toBeInTheDocument() o toBeDisabled()
   - después de cada prueba se desmonta todo y se limpia localStorage,
     para que una prueba nunca dependa de lo que dejó otra. */
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

/* jsdom (el navegador simulado) no trae estas dos funciones:
   - matchMedia: la usa el Offcanvas del panel para saber el ancho de pantalla
     (se responde "true" = pantalla de computador)
   - scrollTo: la usa la plantilla pública al cambiar de página */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo

afterEach(() => {
  cleanup()
  localStorage.clear()
})
