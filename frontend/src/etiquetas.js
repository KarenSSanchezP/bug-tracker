// Traducción de los valores que manda la API (BAJA, ABIERTO...) a texto amigable.
export const PRIORIDADES = { BAJA: 'Baja', MEDIA: 'Media', ALTA: 'Alta', CRITICA: 'Crítica' }
export const SEVERIDADES = PRIORIDADES // mismos valores
export const ESTADOS = {
  ABIERTO: 'Abierto',
  EN_PROGRESO: 'En progreso',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
}

/** Formatea la fecha ISO del backend a algo legible, ej. "17/10/2026, 20:50". */
export function formatearFecha(iso) {
  return new Date(iso).toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' })
}
