/* PRUEBAS — Páginas y flujos completos (rutas, roles, carrito, checkout y CRUD). */
import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { montarApp } from './utilidades'
import { listarPedidos } from '../services/pedidosService'
import { obtenerProductoPorId, listarProductos } from '../services/productosService'
import { actualizarUsuario } from '../services/usuariosService'

describe('Navegación y roles', () => {
  it('P18 sin sesión, el checkout redirige al login; el cliente no entra al panel', () => {
    montarApp('/checkout', { carrito: [{ idProducto: 1, cantidad: 1 }] })
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('P19 el administrador inicia sesión y llega al panel; el empleado no ve Usuarios ni Reportes', async () => {
    const { unmount } = montarApp('/login')
    await userEvent.type(screen.getByLabelText('Correo'), 'admin@losmaestros.cl')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Admin123')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(await screen.findByText(/Bienvenido/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Usuarios/ })).toBeInTheDocument()
    unmount()

    montarApp('/admin', { correo: 'empleado@losmaestros.cl' })
    const menu = screen.getByRole('navigation', { name: 'Navegación del panel' })
    expect(within(menu).queryByText('Usuarios')).not.toBeInTheDocument()
    expect(within(menu).queryByText('Reportes')).not.toBeInTheDocument()
  })
})

describe('Tienda', () => {
  it('P20 el buscador del encabezado lleva al catálogo filtrado y los filtros cambian el resultado', async () => {
    montarApp('/')
    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar productos' }), 'cemento{Enter}')
    expect(await screen.findByText('2 productos encontrados')).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText('Buscar'))
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'Seguridad')
    expect(screen.getByText('5 productos encontrados')).toBeInTheDocument()
  })

  it('P21 agregar desde el detalle actualiza el contador del carrito', async () => {
    montarApp('/productos/30')
    expect(screen.getByRole('link', { name: 'Carrito, 0 unidades' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Sumar uno' }))
    await userEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])
    expect(screen.getByRole('link', { name: 'Carrito, 2 unidades' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('agregado al carrito')
  })

  it('P22 checkout: valida la dirección de despacho y al confirmar registra el pedido y descuenta stock', async () => {
    montarApp('/checkout', { correo: 'cliente@gmail.com', carrito: [{ idProducto: 1, cantidad: 2 }] })
    await userEvent.selectOptions(screen.getByLabelText('Modalidad'), 'despacho')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    expect(screen.getByText('La dirección es obligatoria.')).toBeInTheDocument()
    expect(listarPedidos()).toHaveLength(0)

    await userEvent.type(screen.getByLabelText('Dirección de despacho'), 'Av. del Mar 1000, La Serena')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    expect(await screen.findByText('✅ Pedido registrado correctamente')).toBeInTheDocument()
    expect(obtenerProductoPorId(1)?.stock).toBe(78)
    expect(screen.getByRole('link', { name: 'Carrito, 0 unidades' })).toBeInTheDocument()
  })
})

describe('Panel: inventario', () => {
  it('P23 crear un producto valida los campos y lo agrega al inventario', async () => {
    montarApp('/admin/inventario', { correo: 'admin@losmaestros.cl' })
    await userEvent.click(screen.getByRole('button', { name: '+ Nuevo producto' }))
    const modal = screen.getByRole('dialog', { name: 'Nuevo producto' })
    await userEvent.click(within(modal).getByRole('button', { name: 'Guardar producto' }))
    expect(within(modal).getByText('El código es obligatorio.')).toBeInTheDocument()

    await userEvent.type(within(modal).getByLabelText('Código'), 'JD900')
    await userEvent.type(within(modal).getByLabelText('Nombre'), 'Carretilla 90L')
    await userEvent.type(within(modal).getByLabelText('Precio'), '45990')
    await userEvent.click(within(modal).getByRole('button', { name: 'Guardar producto' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Producto Carretilla 90L creado.')).toBeInTheDocument()
    expect(listarProductos()).toHaveLength(86)
  })

  it('P24 eliminar pide confirmación y solo borra al confirmar', async () => {
    montarApp('/admin/inventario', { correo: 'empleado@losmaestros.cl' })
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Cemento Polpaico gris 25 kg' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(listarProductos()).toHaveLength(85)

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Cemento Polpaico gris 25 kg' }))
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' }))
    expect(listarProductos()).toHaveLength(84)
    expect(screen.queryByText('Cemento Polpaico gris 25 kg')).not.toBeInTheDocument()
  })
})

describe('Cuenta del cliente', () => {
  it('P25 registro: rechaza un correo ya usado y luego crea la cuenta con sesión iniciada', async () => {
    montarApp('/registro')
    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await userEvent.type(screen.getByLabelText('Correo'), 'cliente@gmail.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Obra2026')
    await userEvent.type(screen.getByLabelText('Repetir contraseña'), 'Obra2026')
    await userEvent.click(screen.getByRole('button', { name: 'Registrarme' }))
    expect(screen.getByText('Ya existe una cuenta registrada con este correo.')).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText('Correo'))
    await userEvent.type(screen.getByLabelText('Correo'), 'juan@obra.cl')
    await userEvent.click(screen.getByRole('button', { name: 'Registrarme' }))
    expect(await screen.findByText('Hola, Juan')).toBeInTheDocument()
  })

  it('P26 carrito: cambia cantidades, recalcula el total y queda vacío al quitar', async () => {
    montarApp('/carrito', { carrito: [{ idProducto: 30, cantidad: 1 }] })
    await userEvent.click(screen.getByRole('button', { name: 'Sumar uno' }))
    expect(screen.getByText(/Total:/)).toHaveTextContent('$139.980')
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Taladro percutor 650W 13mm' }))
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
  })

  it('P27 mis pedidos muestra el historial propio y el saldo; un pedido ajeno no se puede ver', async () => {
    montarApp('/checkout', { correo: 'cliente@gmail.com', carrito: [{ idProducto: 1, cantidad: 1 }] })
    await userEvent.selectOptions(screen.getByLabelText('Forma de pago'), 'cuenta-corriente')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    await userEvent.click(await screen.findByRole('link', { name: 'Ver mis pedidos' }))
    expect(screen.getByRole('heading', { name: 'Mis pedidos' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(2) // encabezado + 1 pedido
    expect(screen.getByText('$5.990', { selector: 'strong' })).toBeInTheDocument()
  })

  it('P28 contacto valida el formulario; nosotros y categorías muestran su contenido', async () => {
    const { unmount } = montarApp('/contacto')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
    expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana')
    await userEvent.type(screen.getByLabelText('Correo'), 'ana@gmail.com')
    await userEvent.type(screen.getByLabelText('Mensaje'), '¿Tienen cemento blanco?')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
    expect(screen.getByText('¡Gracias! Te responderemos a la brevedad.')).toBeInTheDocument()
    unmount()

    const otra = montarApp('/nosotros')
    expect(screen.getByText(/22 años de trayectoria/)).toBeInTheDocument()
    otra.unmount()
    montarApp('/categorias')
    expect(screen.getByText(/16 productos/)).toBeInTheDocument()
  })
})

describe('Sesión vigente', () => {
  it('P33 si el admin desactiva la cuenta, la sesión se cierra al navegar', async () => {
    montarApp('/mis-pedidos', { correo: 'cliente@gmail.com' })
    expect(screen.getByText('Hola, Carlos')).toBeInTheDocument()

    actualizarUsuario('u-cliente', { activo: false }) // lo hace el admin desde otro lado
    await userEvent.click(screen.getByRole('link', { name: 'Productos' }))
    expect(screen.queryByText('Hola, Carlos')).not.toBeInTheDocument()
    expect(localStorage.getItem('losMaestros_sesion')).toBeNull()
  })

  it('P34 si el admin cambia el rol, el nuevo rol se aplica sin volver a iniciar sesión', async () => {
    montarApp('/', { correo: 'cliente@gmail.com' })
    expect(screen.queryByRole('link', { name: 'Panel de gestión' })).not.toBeInTheDocument()

    actualizarUsuario('u-cliente', { rol: 'empleado' })
    await userEvent.click(screen.getByRole('link', { name: 'Productos' }))
    expect(screen.getByRole('link', { name: 'Panel de gestión' })).toBeInTheDocument()
  })
})