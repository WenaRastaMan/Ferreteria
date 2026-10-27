/* ORGANISMO — Confirmación antes de una acción destructiva.
   Reemplaza el confirm() del navegador (que no se puede estilizar
   ni probar bien) por un modal propio. */
import { Boton } from '../atomos/Boton'
import { Modal } from './Modal'

export interface ModalConfirmacionProps {
  abierto: boolean
  titulo: string
  mensaje: string
  textoConfirmar?: string
  onConfirmar: () => void
  onCancelar: () => void
}

export function ModalConfirmacion({ abierto, titulo, mensaje, textoConfirmar = 'Eliminar', onConfirmar, onCancelar }: ModalConfirmacionProps) {
  return (
    <Modal abierto={abierto} titulo={titulo} onCerrar={onCancelar}>
      <p className="modal-mensaje">{mensaje}</p>
      <div className="modal-botones">
        <Boton variante="limpiar" onClick={onCancelar}>
          Cancelar
        </Boton>
        <Boton variante="eliminar" onClick={onConfirmar}>
          {textoConfirmar}
        </Boton>
      </div>
    </Modal>
  )
}
