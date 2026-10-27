/* =========================================================
   Catálogo inicial: los 85 productos REALES de la planilla
   "DSY1104 - Forma E - Catalogo Ferreteria Los Maestros.xlsx"
   (guardados tal cual en catalogo.json).
========================================================= */
import type { Producto } from '../types/producto'
import catalogo from './catalogo.json'

/**
 * La planilla no trae ofertas. Para poder mostrar la sección "Ofertas"
 * se marcan estos precios rebajados DEMOSTRATIVOS (id → precio oferta).
 * El administrador puede cambiarlos o quitarlos desde Inventario.
 */
export const OFERTAS_DEMO: Record<number, number> = {
  11: 8490, // Pintura látex interior 1 galón
  30: 69990, // Taladro percutor 650W
  32: 47990, // Amoladora angular 4.5"
  58: 2990, // Ampolleta LED 9W
  76: 5490, // Casco de seguridad
  81: 18990, // Manguera de riego 25 m
}

export const CATALOGO_INICIAL: Producto[] = (catalogo as Producto[]).map((p) =>
  OFERTAS_DEMO[p.id] ? { ...p, oferta: OFERTAS_DEMO[p.id] } : p,
)
