/* =========================================================
   Cuentas de ejemplo (una por rol).
   Las CUENTAS_FIJAS siempre existen aunque se borre el localStorage.
   ⚠ Solo para demostración: en un sistema real la contraseña
   viaja cifrada y se valida en el backend.
========================================================= */
import type { Usuario } from '../types/usuario'

const FECHA_BASE = '2026-01-15T12:00:00.000Z'

export const CUENTAS_FIJAS: Usuario[] = [
  {
    id: 'u-admin',
    nombre: 'Administrador Los Maestros',
    correo: 'admin@losmaestros.cl',
    password: 'Admin123',
    telefono: '+56 9 1111 1111',
    rol: 'admin',
    activo: true,
    cuentaCorriente: false,
    fechaRegistro: FECHA_BASE,
  },
  {
    id: 'u-empleado',
    nombre: 'Pedro Vendedor',
    correo: 'empleado@losmaestros.cl',
    password: 'Empleado123',
    telefono: '+56 9 2222 2222',
    rol: 'empleado',
    activo: true,
    cuentaCorriente: false,
    fechaRegistro: FECHA_BASE,
  },
]

export const CLIENTES_EJEMPLO: Usuario[] = [
  {
    id: 'u-cliente',
    nombre: 'Carlos Contratista',
    correo: 'cliente@gmail.com',
    password: 'Cliente123',
    telefono: '+56 9 3333 3333',
    rol: 'cliente',
    activo: true,
    cuentaCorriente: true,
    fechaRegistro: '2026-03-02T12:00:00.000Z',
  },
  {
    id: 'u-cliente-2',
    nombre: 'Ana Rojas',
    correo: 'ana.rojas@gmail.com',
    password: 'Ana12345',
    telefono: '',
    rol: 'cliente',
    activo: true,
    cuentaCorriente: false,
    fechaRegistro: '2026-05-20T12:00:00.000Z',
  },
]
