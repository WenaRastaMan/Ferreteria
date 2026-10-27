# Especificación de Requisitos de Software (ERS)
## Ferretería Los Maestros — DSY1104 Desarrollo Fullstack II — Evaluación Parcial 2 (Forma E)

### 1. Propósito y contexto

Ferretería Los Maestros es un negocio familiar de La Serena (Región de Coquimbo) con 22 años de trayectoria. Hoy el inventario se lleva en Excel y las ventas se anotan a mano. Eso provoca:

- llamadas telefónicas constantes para consultar stock,
- información de inventario desactualizada,
- pedidos sin forma de reservar ni de hacerles seguimiento,
- y cuentas corrientes de contratistas llevadas en papel.

Esta versión implementa el **frontend** como una SPA en React con datos persistidos en el navegador (`localStorage`). La integración con backend corresponde a la siguiente etapa.

### 2. Alcance de la EP2

- Interfaz en **React + Vite + TypeScript** con Bootstrap 5 y react-bootstrap.
- Componentes organizados con **Atomic Design** (átomos, moléculas, organismos, plantillas y páginas).
- **React Router** con rutas públicas, rutas con sesión y rutas protegidas por rol.
- **Fuente de datos simulada** (`src/services`) con CRUD sobre `localStorage`.
- **Pruebas unitarias** con Vitest y React Testing Library.
- Catálogo con los **85 productos reales** de la planilla Forma E.

### 3. Actores y permisos

| Actor | Puede |
|---|---|
| **Visitante** | Ver catálogo, categorías, ofertas, detalle y stock; armar carrito; registrarse; escribir por contacto. |
| **Cliente / contratista** | Todo lo anterior + comprar, ver *sus* pedidos y su saldo de cuenta corriente (si está habilitado). |
| **Empleado** | Panel: resumen, inventario (CRUD) y estados de pedidos. **No** gestiona usuarios ni ve reportes. |
| **Administrador** | Todo lo del empleado + usuarios (rol, activación, cuenta corriente) y reportes. |

### 4. Requisitos funcionales

| ID | Requisito | Estado |
|---|---|---|
| RF01 | Registrar clientes con validación de datos e iniciar/cerrar sesión. | ✅ |
| RF02 | Mostrar catálogo, categorías, ofertas y detalle de producto con disponibilidad. | ✅ |
| RF03 | Buscar por nombre, código o marca; filtrar por categoría y stock; ordenar por precio o nombre. | ✅ |
| RF04 | Gestionar el carrito sin superar el stock disponible. | ✅ |
| RF05 | Confirmar pedidos con retiro en tienda o despacho (dirección obligatoria en despacho). | ✅ |
| RF06 | Mostrar compra exitosa o pago rechazado; si se rechaza, no se descuenta stock. | ✅ |
| RF07 | Historial de pedidos propio por cliente. | ✅ |
| RF08 | Pago a cuenta corriente solo para clientes habilitados, con saldo visible. | ✅ |
| RF09 | CRUD de productos con stock mínimo y precio de oferta, con confirmación al eliminar. | ✅ |
| RF10 | Actualizar el estado de los pedidos; al cancelar, devolver el stock. | ✅ |
| RF11 | Administrar roles, activación de cuentas y cuenta corriente (solo administrador). | ✅ |
| RF12 | Reportes de ventas con gráficos y exportación a Excel. | ✅ |
| RF13 | Alertas de inventario cuando el stock llega al mínimo. | ✅ |
| RF14 | Mapa de ubicación y cobertura de despacho. | ⏳ El caso no entrega dirección ni radio de cobertura. |

### 5. Requisitos no funcionales

| ID | Requisito | Estado EP2 |
|---|---|---|
| RNF01 | SPA en React + TypeScript con componentes reutilizables (Atomic Design). | ✅ |
| RNF02 | Interfaz usable en 360 px, 768 px y 1280 px (menú colapsable y panel con Offcanvas). | ✅ |
| RNF03 | Pruebas unitarias de render, props, estado y eventos. | ✅ 32 pruebas, 87 % de sentencias |
| RNF04 | Accesibilidad básica: etiquetas en campos, `aria-label` en botones sin texto, `lang="es"`. | ✅ |
| RNF05 | Backend Spring Boot con API REST JSON. | ⏳ Siguiente etapa |
| RNF06 | Autenticación JWT y contraseñas cifradas. | ⏳ Siguiente etapa |
| RNF07 | Base de datos relacional en 3FN (MySQL). | ⏳ Siguiente etapa |
| RNF08 | Despliegue con Docker en AWS. | ⏳ Siguiente etapa |

### 6. Arquitectura del frontend

```
src/
├── componentes/  atomos · moleculas · organismos · plantillas
├── paginas/      páginas de la tienda y paginas/admin del panel
├── services/     productosService · carritoService · pedidosService · usuariosService · sesionService · almacenamiento
├── context/      AuthContext (sesión) · CarritoContext (carrito)
├── routes/       AppRoutes · RutaProtegida
├── data/         catálogo Forma E, usuarios de ejemplo, textos del sitio
├── types/        Producto, Usuario, Pedido…
├── utils/        validaciones, precios, formato, estadísticas, exportar a Excel
└── styles/       estilos de la ferretería
```

Decisiones principales:
- Las páginas **nunca** leen `localStorage` directamente: todo pasa por `services/`. Al conectar el backend solo cambian los servicios.
- Los componentes de presentación reciben datos por *props* y avisan con callbacks. Las páginas son los contenedores que deciden qué hacer.
- Las rutas protegidas solo controlan la interfaz. La seguridad real la debe aplicar el backend.

### 7. Rutas

| Ruta | Acceso |
|---|---|
| `/`, `/productos`, `/productos/:id`, `/categorias`, `/categorias/:nombre`, `/ofertas`, `/carrito`, `/login`, `/registro`, `/nosotros`, `/contacto` | Público |
| `/checkout`, `/pedido/:id`, `/mis-pedidos` | Con sesión |
| `/admin`, `/admin/inventario`, `/admin/pedidos` | Administrador y empleado |
| `/admin/usuarios`, `/admin/reportes` | Solo administrador |

### 8. Modelo de datos propuesto para el backend

- Usuario(id, nombre, correo, password_hash, telefono, rol, activo, cuenta_corriente, fecha_registro)
- Categoria(id, nombre)
- Producto(id, codigo, nombre, marca, unidad, categoria_id, subcategoria, precio, precio_oferta, stock, stock_minimo)
- Pedido(id, usuario_id, fecha, estado, modalidad, direccion, total, metodo_pago)
- PedidoDetalle(id, pedido_id, producto_id, cantidad, precio_unitario)

### 9. Criterios de aceptación (verificados con pruebas automáticas)

| Criterio | Prueba |
|---|---|
| Se rechazan cantidades superiores al stock. | P06, P07 |
| Una compra válida descuenta stock y registra el pedido. | P08, P22 |
| Un pago rechazado no descuenta stock. | P08 |
| Cancelar un pedido devuelve el stock. | P09, P29 |
| El empleado no accede a usuarios ni reportes. | P19 |
| El administrador no puede desactivarse a sí mismo. | P30 |

### 10. Limitaciones conocidas

- Los datos viven en `localStorage`, es decir, en un solo navegador. No hay stock compartido en tiempo real.
- Las cuentas de demostración están en el código y las contraseñas no se cifran (solo uso académico).
- Los pagos son simulados.
- Las ofertas son **demostrativas**: la planilla Forma E no trae precios de oferta.
