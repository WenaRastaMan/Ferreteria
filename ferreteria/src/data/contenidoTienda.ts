/* =========================================================
   Contenido fijo del sitio (textos, íconos y datos del negocio).
   Separarlo de los componentes permite cambiar textos sin tocar JSX.
========================================================= */

export const NEGOCIO = {
  nombre: 'Ferretería Los Maestros',
  ciudad: 'La Serena, Región de Coquimbo',
  anios: 22,
  correo: 'contacto@losmaestros.cl',
  telefono: '+56 51 222 3344',
  horario: 'Lunes a sábado · 08:30 - 19:00 hrs',
}

/** Ícono por categoría (si aparece una nueva, se usa 📦). */
export const ICONOS_CATEGORIA: Record<string, string> = {
  'Mat. Construcción': '🧱',
  Pinturas: '🎨',
  Herramientas: '🛠️',
  Gasfitería: '🚰',
  Electricidad: '💡',
  Tornillería: '🔩',
  Madera: '🪵',
  Seguridad: '🦺',
  Jardín: '🌱',
}

export interface Beneficio {
  icono: string
  titulo: string
  texto: string
}

export const BENEFICIOS: Beneficio[] = [
  { icono: '🚚', titulo: 'Retiro o despacho', texto: 'Elige cómo recibir tus productos.' },
  { icono: '📦', titulo: 'Stock en línea', texto: 'Revisa las unidades disponibles sin llamar.' },
  { icono: '🧾', titulo: 'Cuenta corriente', texto: 'Contratistas pueden pagar a fin de mes.' },
]

export const VALORES = [
  { icono: '🤝', titulo: 'Atención de confianza', texto: 'Conocemos a nuestros clientes y contratistas por su nombre.' },
  { icono: '🧰', titulo: 'Surtido para la obra', texto: 'Materiales, herramientas, gasfitería, electricidad y más.' },
  { icono: '📍', titulo: 'Negocio local', texto: 'Más de dos décadas acompañando las obras de La Serena.' },
]
