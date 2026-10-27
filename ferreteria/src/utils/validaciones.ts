/* =========================================================
   Validaciones de formularios.
   Todas siguen el mismo contrato:
     - devuelven null si el valor es válido
     - devuelven un string con el mensaje de error si no lo es
   Son funciones puras (no tocan el DOM), por eso se pueden
   reutilizar en cualquier formulario y probar fácilmente.
========================================================= */

export function validarCorreo(correo: string): string | null {
  const valor = correo.trim()
  if (!valor) return 'El correo es obligatorio.'
  if (valor.length > 100) return 'El correo no puede superar los 100 caracteres.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'Ingresa un correo válido.'
  return null
}

/** Login: solo que no venga vacía (la regla de largo se aplica al registrarse). */
export function validarPasswordLogin(password: string): string | null {
  return password ? null : 'La contraseña es obligatoria.'
}

export function validarPassword(password: string): string | null {
  if (!password) return 'La contraseña es obligatoria.'
  if (password.length < 8 || password.length > 20) return 'La contraseña debe tener entre 8 y 20 caracteres.'
  if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) return 'La contraseña debe combinar letras y números.'
  return null
}

/** Valida que la confirmación sea igual a la contraseña. */
export function validarConfirmacion(password: string, confirmacion: string): string | null {
  return password !== confirmacion ? 'Las contraseñas no coinciden.' : null
}

/**
 * Validador genérico de campos obligatorios.
 * @param nombreCampo texto que se usa en el mensaje, ej: "El nombre"
 */
export function validarRequerido(valor: string, nombreCampo: string, maxLength?: number): string | null {
  const femenino = /^La /.test(nombreCampo)
  if (!valor || valor.trim().length === 0) return `${nombreCampo} es obligatori${femenino ? 'a' : 'o'}.`
  if (maxLength && valor.length > maxLength) return `${nombreCampo} no puede superar los ${maxLength} caracteres.`
  return null
}

/** Teléfono opcional: si viene, solo dígitos, espacios o "+" (8 a 15 caracteres). */
export function validarTelefono(telefono: string): string | null {
  const valor = telefono.trim()
  if (!valor) return null
  if (!/^\+?[\d\s]{8,15}$/.test(valor)) return 'Ingresa un teléfono válido (solo números, 8 a 15 dígitos).'
  return null
}

/** Número entero mayor o igual a "minimo". Recibe el texto del input. */
export function validarEntero(valor: string, nombreCampo: string, minimo = 0): string | null {
  if (valor.trim() === '') return `${nombreCampo} es obligatorio.`
  const n = Number(valor)
  if (!Number.isInteger(n)) return `${nombreCampo} debe ser un número entero.`
  if (n < minimo) return `${nombreCampo} debe ser mayor o igual a ${minimo}.`
  return null
}

/** Precio de oferta opcional: si viene, debe ser menor al precio normal. */
export function validarOferta(oferta: string, precio: number): string | null {
  if (!oferta.trim()) return null
  const n = Number(oferta)
  if (!Number.isInteger(n) || n <= 0) return 'La oferta debe ser un número entero mayor a 0.'
  if (n >= precio) return 'La oferta debe ser menor al precio normal.'
  return null
}

/** true si el objeto de errores tiene al menos un mensaje. */
export function hayErrores(errores: Record<string, string | null | undefined>): boolean {
  return Object.values(errores).some((e) => e)
}
