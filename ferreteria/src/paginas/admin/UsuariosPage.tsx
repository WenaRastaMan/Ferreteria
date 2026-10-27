/* PÁGINA (contenedor) — Usuarios.  Ruta: /admin/usuarios (solo administrador)
   Cambiar rol, activar/desactivar cuentas y habilitar cuenta corriente. */
import { useState } from 'react'
import type { Rol, Usuario } from '../../types/usuario'
import { actualizarUsuario, listarUsuarios } from '../../services/usuariosService'
import { useAuth } from '../../context/AuthContext'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { TablaUsuarios } from '../../componentes/organismos/TablaUsuarios'

export default function UsuariosPage() {
  const { usuario: sesion } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => listarUsuarios())
  const [texto, setTexto] = useState('')
  const [rol, setRol] = useState<'' | Rol>('')

  const busqueda = texto.trim().toLowerCase()
  const visibles = usuarios.filter(
    (u) => (!busqueda || `${u.nombre} ${u.correo}`.toLowerCase().includes(busqueda)) && (!rol || u.rol === rol),
  )

  const cambiar = (u: Usuario, cambios: Partial<Usuario>) => {
    // Si deja de ser cliente, no puede tener cuenta corriente
    const ajuste = cambios.rol && cambios.rol !== 'cliente' ? { cuentaCorriente: false } : {}
    actualizarUsuario(u.id, { ...cambios, ...ajuste })
    setUsuarios(listarUsuarios())
  }

  return (
    <>
      <EncabezadoAdmin>Usuarios 👥</EncabezadoAdmin>
      <section className="admin-seccion">
        <div className="admin-filtros">
          <input type="search" aria-label="Buscar usuario" placeholder="Buscar por nombre o correo" value={texto} onChange={(e) => setTexto(e.target.value)} />
          <select aria-label="Filtrar por rol" value={rol} onChange={(e) => setRol(e.target.value as '' | Rol)}>
            <option value="">Todos los roles</option>
            <option value="cliente">Clientes</option>
            <option value="empleado">Empleados</option>
            <option value="admin">Administradores</option>
          </select>
          <span className="texto-suave">{visibles.length} usuarios</span>
        </div>
        <TablaUsuarios usuarios={visibles} idSesion={sesion?.id} onCambiar={cambiar} />
      </section>
    </>
  )
}
