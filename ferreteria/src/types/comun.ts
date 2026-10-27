/* =========================================================
   Tipos compartidos por todos los módulos.
========================================================= */

/**
 * Resultado de una operación de un servicio. Si falla, indica qué campo
 * causó el problema para mostrar el mensaje junto a ese campo.
 */
export type ResultadoOperacion<T> =
  | { ok: true; dato: T }
  | { ok: false; campo: string; mensaje: string }

/** Mapa campo → mensaje de error (null = sin error). */
export type ErroresFormulario<C extends string> = Partial<Record<C, string | null>>
