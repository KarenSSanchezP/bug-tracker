// Traducción de los valores que manda la API (BAJA, ABIERTO...) a texto amigable.
export const PRIORIDADES = { BAJA: 'Baja', MEDIA: 'Media', ALTA: 'Alta', CRITICA: 'Crítica' }
export const SEVERIDADES = PRIORIDADES // mismos valores
export const ESTADOS = {
  ABIERTO: 'Abierto',
  EN_PROGRESO: 'En progreso',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
}

/** Formatea la fecha ISO del backend como en la guía TRIAGE, ej. "2026-10-17 20:41" (hora local). */
export function formatearFecha(iso) {
  const d = new Date(iso)
  const dos = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())} ${dos(d.getHours())}:${dos(d.getMinutes())}`
}
