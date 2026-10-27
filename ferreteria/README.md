# Ferretería Los Maestros — EP2 (React + Vite + TypeScript)

Sistema web de **Ferretería Los Maestros** (La Serena), caso **Forma E**: catálogo con stock en línea, carrito, compra con retiro o despacho, cuenta corriente para contratistas y panel de gestión por rol.
Curso DSY1104 - Desarrollo Fullstack II

## Cómo ejecutar

Requisitos: **Node.js 18 o superior** (recomendado 20+).

```bash
npm install          # instala dependencias (solo la primera vez)
npm run dev          # levanta el sitio en http://localhost:5173
npm test             # pruebas en modo "watch" (se repiten al guardar)
npm run test:run     # ejecuta todas las pruebas una vez
npm run coverage     # pruebas + reporte de cobertura (carpeta coverage/)
npm run build        # compila para producción (carpeta dist/)
```

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@losmaestros.cl` | `Admin123` |
| Empleado | `empleado@losmaestros.cl` | `Empleado123` |
| Cliente (con cuenta corriente) | `cliente@gmail.com` | `Cliente123` |

## Tecnologías

| Requisito de la pauta | Cómo se cumple |
|---|---|
| React + Vite + TypeScript | Proyecto `react-ts` de Vite, tipado completo en `src/types` |
| Atomic Design | `src/componentes/atomos`, `moleculas`, `organismos`, `plantillas` + `src/paginas` |
| Estado y formularios controlados | `useState` en formularios y páginas; inputs con `value` + `onChange`; Context para sesión y carrito |
| Fuente de datos simulada con CRUD | `src/services/productosService.ts` (inventario) sobre localStorage, más usuarios y pedidos |
| Navegación | React Router 7 (`src/routes/AppRoutes.tsx`), parámetros `/productos/:id`, `/categorias/:nombre`, `/pedido/:id` |
| Responsividad | Bootstrap 5 + react-bootstrap (Navbar colapsable, Offcanvas, grilla, `table-responsive`) |
| Pruebas | Vitest + React Testing Library + jsdom (32 pruebas en `src/tests`, documentadas en `docs/INFORME_PRUEBAS.md`) |

## Estructura

```
src/
├── componentes/
│   ├── atomos/       Piezas mínimas: Boton, EnlaceBoton, Etiqueta, Insignia, MensajeError, EtiquetaStock, Precio
│   ├── moleculas/    Combinan átomos: CampoFormulario, CampoSelector, Buscador, TarjetaProducto, SelectorCantidad…
│   ├── organismos/   Secciones completas: Encabezado, FiltrosCatalogo, TablaCarrito, FormularioCheckout, Modal…
│   └── plantillas/   Esqueletos de página: PlantillaPublica, PlantillaAdmin
├── paginas/          Páginas (contenedores): Inicio, Catálogo, Detalle, Carrito, Checkout, admin/*
├── services/         Fuente de datos: productosService (CRUD), carritoService, pedidosService, usuariosService, sesionService
├── context/          AuthContext (sesión) y CarritoContext (carrito compartido)
├── routes/           Mapa de rutas y guardia de rutas protegidas
├── data/             Datos fijos: catálogo Forma E (85 productos), usuarios de ejemplo, textos del sitio
├── types/            Tipos TypeScript (Producto, Usuario, Pedido…)
├── utils/            Funciones puras: validaciones, precios, formato, estadísticas, exportar a Excel
├── styles/           CSS de la ferretería (paleta verde/amarillo) + ajustes para Bootstrap
└── tests/            32 pruebas unitarias (P01–P32)
public/img/           Imágenes (se usan como /img/archivo.png)
```

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio | público |
| `/productos`, `/productos/:id` | Catálogo (con búsqueda `?q=`) / Detalle de producto | público |
| `/categorias`, `/categorias/:nombre` | Categorías / Catálogo filtrado | público |
| `/ofertas` | Productos en oferta | público |
| `/carrito` | Carrito | público |
| `/login`, `/registro` | Inicio de sesión / Registro | público |
| `/nosotros`, `/contacto` | Información del negocio / Formulario de contacto | público |
| `/checkout` | Datos de entrega y pago | con sesión |
| `/pedido/:id` | Resultado de la compra (exitosa o rechazada) | con sesión |
| `/mis-pedidos` | Historial y saldo de cuenta corriente | con sesión |
| `/admin` | Resumen (KPIs y alertas de stock) | admin y empleado |
| `/admin/inventario` | CRUD de productos | admin y empleado |
| `/admin/pedidos` | Estados de pedidos | admin y empleado |
| `/admin/usuarios` | Roles, activación y cuenta corriente | admin |
| `/admin/reportes` | Reportes con gráficos y exportación a Excel | admin |

## Catálogo

Se usan los **85 productos reales** de la planilla Forma E (`src/data/catalogo.json`). La planilla no trae ofertas, así que 6 productos tienen un precio de oferta **demostrativo** (`OFERTAS_DEMO` en `src/data/catalogoInicial.ts`), editable desde Inventario.

## Pendiente para la etapa de backend

Spring Boot (API REST), base de datos MySQL, autenticación JWT, mapa de cobertura (Leaflet), Docker y AWS. La capa `src/services` está pensada para reemplazar localStorage por llamadas a la API sin tocar los componentes.

Más detalles en [`docs/`](docs): ERS e informe de pruebas.
