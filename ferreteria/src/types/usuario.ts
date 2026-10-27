/* =========================================================
   Tipos del módulo de usuarios.
   Centralizar los tipos aquí permite que servicios, páginas
   y componentes hablen "el mismo idioma" y que TypeScript
   avise si falta un campo o se usa uno que no existe.
========================================================= */

/**
 * Roles del sistema (según el caso Forma E):
 * - admin: gestiona todo, incluidos usuarios y reportes
 * - empleado: vendedor; gestiona inventario y pedidos, NO usuarios
 * - cliente: cliente o contratista que compra en la tienda
 */
export type Rol = 'admin' | 'empleado' | 'cliente'

/** Texto para mostrar cada rol en pantalla. */
export const NOMBRE_ROL: Record<Rol, string> = {
  admin: 'Administrador',
  empleado: 'Empleado',
  cliente: 'Cliente',
}

/** Usuario tal como se guarda en la fuente de datos (localStorage). */
export interface Usuario {
  id: string
  nombre: string
  correo: string
  password: string
  telefono: string
  rol: Rol
  activo: boolean
  /** Contratista habilitado para comprar a cuenta corriente (pago a fin de mes). */
  cuentaCorriente: boolean
  fechaRegistro: string // ISO
}

/** Datos necesarios para crear un usuario (el servicio genera id y fecha). */
export type NuevoUsuario = Omit<Usuario, 'id' | 'fechaRegistro'>

/** Campos que se pueden modificar de un usuario existente. */
export type CambiosUsuario = Partial<Omit<Usuario, 'id' | 'fechaRegistro'>>

/** Usuario en sesión: igual que Usuario pero SIN la contraseña. */
export type UsuarioSesion = Omit<Usuario, 'password'>
