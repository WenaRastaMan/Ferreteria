/* ORGANISMO — Tabla de usuarios del panel (solo administrador).
   Permite cambiar rol, activar/desactivar y habilitar cuenta corriente.
   El admin conectado no puede cambiarse el rol ni desactivarse a sí mismo. */
import { NOMBRE_ROL, type Rol, type Usuario } from '../../types/usuario'
import { formatearFecha } from '../../utils/formato'
import { Insignia } from '../atomos/Insignia'

export interface TablaUsuariosProps {
  usuarios: Usuario[]
  idSesion?: string
  onCambiar: (usuario: Usuario, cambios: Partial<Usuario>) => void
}

const ROLES: Rol[] = ['cliente', 'empleado', 'admin']

export function TablaUsuarios({ usuarios, idSesion, onCambiar }: TablaUsuariosProps) {
  return (
    <div className="table-responsive">
      <table className="tabla tabla--admin">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Registro</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Cuenta corriente</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => {
            const soyYo = u.id === idSesion
            return (
              <tr key={u.id}>
                <td>
                  {u.nombre} {soyYo && <Insignia texto="tú" tono="oscuro" />}
                </td>
                <td>{u.correo}</td>
                <td>{formatearFecha(u.fechaRegistro)}</td>
                <td>
                  <select aria-label={`Rol de ${u.correo}`} value={u.rol} disabled={soyYo} onChange={(e) => onCambiar(u, { rol: e.target.value as Rol })}>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {NOMBRE_ROL[r]}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input type="checkbox" aria-label={`Cuenta activa de ${u.correo}`} checked={u.activo} disabled={soyYo}
                    onChange={(e) => onCambiar(u, { activo: e.target.checked })} />
                </td>
                <td>
                  <input type="checkbox" aria-label={`Cuenta corriente de ${u.correo}`} checked={u.cuentaCorriente} disabled={u.rol !== 'cliente'}
                    onChange={(e) => onCambiar(u, { cuentaCorriente: e.target.checked })} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
