# Informe de pruebas — Ferretería Los Maestros (EP2)

## 1. Herramientas

| Herramienta | Para qué se usa |
|---|---|
| **Vitest** | Ejecuta las pruebas (integrado con Vite; entiende TypeScript y JSX sin configuración extra) |
| **React Testing Library** | Dibuja los componentes y los busca como lo haría un usuario (por texto, rol o etiqueta) |
| **@testing-library/user-event** | Simula clics, escritura y selección en formularios |
| **@testing-library/jest-dom** | Comparaciones legibles: `toBeInTheDocument()`, `toBeDisabled()`, `toHaveClass()`… |
| **jsdom** | Navegador simulado dentro de Node (no hace falta abrir Chrome) |
| **@vitest/coverage-v8** | Mide la cobertura del código |

Configuración: `vite.config.ts` (bloque `test`) y `src/tests/setup.ts` (limpia el DOM y `localStorage` después de cada prueba, y simula `matchMedia` y `scrollTo`, que jsdom no trae).

```bash
npm run test:run   # ejecuta las 32 pruebas
npm run coverage   # pruebas + cobertura (abrir coverage/index.html)
```

## 2. Resultado

**32 pruebas ejecutadas · 32 exitosas · 0 fallidas.**

| Métrica | Cobertura |
|---|---|
| Sentencias | **86.92 %** |
| Ramas | **77.6 %** |
| Funciones | **87.01 %** |
| Líneas | **90.33 %** |

## 3. Organización

| Archivo | Qué prueba |
|---|---|
| `servicios.test.ts` | Lógica de negocio sin pantalla: CRUD de productos, filtros, precios y ofertas, validaciones, reglas del carrito, registro de pedidos con stock, cancelación y autenticación |
| `componentes.test.tsx` | Átomos, moléculas y organismos por separado: **render**, **props**, **estado** y **eventos** |
| `paginas.test.tsx` | Flujos completos montando la app con rutas: roles, búsqueda, carrito, checkout, registro, inventario |
| `admin.test.tsx` | Panel: pedidos, usuarios y reportes (gráficos y Excel reemplazados por *mocks*) |
| `utilidades.tsx` | Ayudante `montarApp(ruta, { correo, carrito })` para montar la app con sesión y carrito |

## 4. Casos de prueba

| ID | Archivo | Qué verifica | Resultado |
|---|---|---|---|
| P01 | `servicios.test.ts` | carga los 85 productos reales de la planilla Forma E | ✅ Pasa |
| P02 | `servicios.test.ts` | CRUD: crea, actualiza y elimina un producto; no acepta códigos repetidos | ✅ Pasa |
| P03 | `servicios.test.ts` | filtra por texto (nombre, código o marca), categoría y ofertas | ✅ Pasa |
| P04 | `servicios.test.ts` | cobra el precio de oferta y calcula el % de descuento | ✅ Pasa |
| P05 | `servicios.test.ts` | valida contraseña y precio de oferta | ✅ Pasa |
| P06 | `servicios.test.ts` | no permite agregar más unidades que el stock | ✅ Pasa |
| P07 | `servicios.test.ts` | calcula el total con ofertas y detecta stock insuficiente | ✅ Pasa |
| P08 | `servicios.test.ts` | una compra exitosa descuenta stock; un pago rechazado no | ✅ Pasa |
| P09 | `servicios.test.ts` | cancelar un pedido devuelve el stock y suma la cuenta corriente solo de pedidos válidos | ✅ Pasa |
| P10 | `servicios.test.ts` | autenticar: correo inexistente, contraseña mala, cuenta desactivada y sesión sin contraseña | ✅ Pasa |
| P11 | `componentes.test.tsx` | Boton: PROPS de variante y EVENTO click (no responde deshabilitado) | ✅ Pasa |
| P12 | `componentes.test.tsx` | EtiquetaStock y Precio: PROPS cambian lo que se muestra | ✅ Pasa |
| P13 | `componentes.test.tsx` | CampoFormulario: RENDER con etiqueta, EVENTO onCambio y PROPS de error | ✅ Pasa |
| P14 | `componentes.test.tsx` | SelectorCantidad: se deshabilita en los límites y avisa el nuevo valor | ✅ Pasa |
| P15 | `componentes.test.tsx` | TarjetaProducto: RENDER enlaza al detalle y EVENTO agregar; sin stock queda bloqueada | ✅ Pasa |
| P16 | `componentes.test.tsx` | FormularioLogin: ESTADO de errores al enviar vacío y muestra el error que devuelve el padre | ✅ Pasa |
| P17 | `componentes.test.tsx` | ModalConfirmacion: no se dibuja cerrado; confirmar, cancelar y Escape avisan al padre | ✅ Pasa |
| P18 | `paginas.test.tsx` | sin sesión, el checkout redirige al login; el cliente no entra al panel | ✅ Pasa |
| P19 | `paginas.test.tsx` | el administrador inicia sesión y llega al panel; el empleado no ve Usuarios ni Reportes | ✅ Pasa |
| P20 | `paginas.test.tsx` | el buscador del encabezado lleva al catálogo filtrado y los filtros cambian el resultado | ✅ Pasa |
| P21 | `paginas.test.tsx` | agregar desde el detalle actualiza el contador del carrito | ✅ Pasa |
| P22 | `paginas.test.tsx` | checkout: valida la dirección de despacho y al confirmar registra el pedido y descuenta stock | ✅ Pasa |
| P23 | `paginas.test.tsx` | crear un producto valida los campos y lo agrega al inventario | ✅ Pasa |
| P24 | `paginas.test.tsx` | eliminar pide confirmación y solo borra al confirmar | ✅ Pasa |
| P25 | `paginas.test.tsx` | registro: rechaza un correo ya usado y luego crea la cuenta con sesión iniciada | ✅ Pasa |
| P26 | `paginas.test.tsx` | carrito: cambia cantidades, recalcula el total y queda vacío al quitar | ✅ Pasa |
| P27 | `paginas.test.tsx` | mis pedidos muestra el historial propio y el saldo; un pedido ajeno no se puede ver | ✅ Pasa |
| P28 | `paginas.test.tsx` | contacto valida el formulario; nosotros y categorías muestran su contenido | ✅ Pasa |
| P29 | `admin.test.tsx` | cancelar un pedido devuelve el stock y ya no se puede cambiar su estado | ✅ Pasa |
| P30 | `admin.test.tsx` | usuarios: el admin no puede desactivarse a sí mismo y sí puede cambiar roles | ✅ Pasa |
| P31 | `admin.test.tsx` | reportes muestra ventas y saldos, y exporta un Excel con 3 hojas | ✅ Pasa |
| P32 | `admin.test.tsx` | cerrar sesión desde el menú lateral vuelve al login | ✅ Pasa |

## 5. Criterios del caso verificados

| Criterio | Prueba |
|---|---|
| No se puede pedir más que el stock disponible | P06, P07 |
| Una compra exitosa descuenta stock; un pago rechazado no | P08, P22 |
| Cancelar un pedido devuelve el stock | P09, P29 |
| La cuenta corriente solo suma pedidos válidos | P09, P27 |
| Sin sesión no se puede comprar | P18 |
| El empleado no gestiona usuarios ni ve reportes | P19 |
| El administrador no puede desactivarse a sí mismo | P30 |
| Eliminar un producto pide confirmación | P24 |

## 6. Cobertura por archivo

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   86.92 |     77.6 |   87.01 |   90.33 |                   
 src               |       0 |      100 |       0 |       0 |                   
  App.tsx          |       0 |      100 |       0 |       0 | 8                 
 ...ntes/moleculas |      96 |    89.47 |   94.44 |      96 |                   
  AccesoRapido.tsx |     100 |       50 |     100 |     100 | 28                
  ...oSelector.tsx |     100 |       50 |     100 |     100 | 21                
  ...rCantidad.tsx |   66.66 |      100 |   66.66 |   66.66 | 14                
  ...Categoria.tsx |     100 |       75 |     100 |     100 | 14                
  TarjetaKpi.tsx   |     100 |    85.71 |     100 |     100 | 14                
 ...tes/organismos |   92.47 |       85 |   91.48 |    95.3 |                   
  Encabezado.tsx   |    87.5 |      100 |      75 |     100 |                   
  ...sCatalogo.tsx |   66.66 |      100 |    62.5 |   66.66 | 21,45,55          
  ...oCheckout.tsx |   86.95 |    83.33 |      80 |   89.47 | 57,75             
  ...oProducto.tsx |   95.45 |       75 |     100 |     100 | 31-34,40,68-75    
  ...oRegistro.tsx |   94.73 |       75 |     100 |     100 | 46                
  ...Productos.tsx |      75 |    66.66 |     100 |     100 | 14                
  Modal.tsx        |     100 |     90.9 |     100 |     100 | 25                
  TablaCarrito.tsx |     100 |       50 |     100 |     100 | 43                
  ...nventario.tsx |   66.66 |       75 |      75 |      80 | 43                
  TablaPedidos.tsx |   88.88 |     87.5 |     100 |     100 | 17,46             
  ...aUsuarios.tsx |    87.5 |      100 |   83.33 |    87.5 | 55                
 ...tes/plantillas |   77.77 |    66.66 |    62.5 |   77.77 |                   
  ...illaAdmin.tsx |      75 |       50 |      50 |      75 | 19,26             
  ...laPublica.tsx |      80 |       75 |      75 |      80 | 31-32             
 src/context       |    87.8 |    63.63 |   93.33 |   91.17 |                   
  AuthContext.tsx  |   94.44 |    66.66 |     100 |     100 | 30,60             
  ...toContext.tsx |    82.6 |       60 |   88.88 |      85 | 38-39,56          
 src/paginas       |   87.37 |    68.91 |   82.35 |   92.39 |                   
  CarritoPage.tsx  |   85.71 |      100 |   66.66 |   85.71 | 38                
  CatalogoPage.tsx |   83.33 |    76.92 |      50 |   83.33 | 56-61             
  CheckoutPage.tsx |      85 |       60 |     100 |     100 | 27-33             
  ...ductoPage.tsx |   85.71 |       75 |   83.33 |    92.3 | 79                
  InicioPage.tsx   |   85.71 |      100 |      75 |   83.33 | 29                
  LoginPage.tsx    |    90.9 |     37.5 |     100 |     100 | 16-19             
  ...didosPage.tsx |      80 |       75 |     100 |     100 | 11                
  ...tradoPage.tsx |       0 |        0 |       0 |       0 | 10                
  ...edidoPage.tsx |    87.5 |       70 |     100 |    87.5 | 18                
 src/paginas/admin |   78.15 |    65.21 |   66.66 |   80.19 |                   
  ...boardPage.tsx |   72.72 |    83.33 |      40 |      80 | 29,51             
  ...tarioPage.tsx |    62.5 |    61.11 |      45 |   65.85 | ...98-105,111-122 
  PedidosPage.tsx  |      80 |     62.5 |    62.5 |   83.33 | 29-36             
  ReportesPage.tsx |     100 |       50 |     100 |     100 | 33-61             
  UsuariosPage.tsx |   86.66 |       75 |   66.66 |   85.71 | 33-34             
 src/routes        |      90 |    83.33 |     100 |     100 |                   
  ...Protegida.tsx |   85.71 |    83.33 |     100 |     100 | 25                
 src/services      |   86.93 |    74.52 |   92.47 |    89.4 |                   
  ...cenamiento.ts |   81.81 |    83.33 |     100 |   81.81 | 26,39             
  ...itoService.ts |     100 |       80 |     100 |     100 | 25-43             
  ...dosService.ts |      88 |    73.33 |   95.65 |   88.88 | 31,41,44,50       
  ...tosService.ts |   85.71 |    71.87 |   85.18 |   90.47 | 60,100-102        
  sesionService.ts |   93.33 |    83.33 |     100 |     100 | 39                
  ...iosService.ts |   78.57 |    66.66 |   85.71 |   81.81 | 62-66,87          
 src/utils         |   83.13 |    77.33 |   96.42 |   92.85 |                   
  estadisticas.ts  |      90 |       75 |   83.33 |     100 | 19                
  estadoPedido.ts  |   71.42 |       75 |     100 |      75 | 9                 
  exportarExcel.ts |     100 |    66.66 |     100 |     100 | 19-45             
  validaciones.ts  |   76.59 |    75.51 |     100 |      90 | 50-51,69          
-------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 86.92% ( 698/803 )
Branches     : 77.6% ( 388/500 )
Functions    : 87.01% ( 315/362 )
Lines        : 90.33% ( 589/652 )
================================================================================
```

## 7. Lo que no cubren estas pruebas

- Seguridad real (JWT), base de datos y concurrencia de stock entre usuarios: dependen del backend (siguiente etapa).
- Apariencia visual: revisada manualmente en 360 px, 768 px y 1280 px.
