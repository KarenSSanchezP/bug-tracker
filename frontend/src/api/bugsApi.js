// Funciones para hablar con la API del backend.
// La URL se puede cambiar con la variable VITE_API_URL (ver .env.example).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

/** Obtiene la lista de bugs (ya viene ordenada, más recientes primero). */
export async function obtenerBugs() {
  const respuesta = await fetch(`${API_URL}/api/bugs`)
  if (!respuesta.ok) throw new Error('No se pudo cargar la lista de bugs')
  return respuesta.json()
}

/**
 * Crea un bug.
 * - Si sale bien devuelve { ok: true, bug }.
 * - Si el backend responde 400 devuelve { ok: false, errores } con un mensaje por campo.
 */
export async function crearBug(datos) {
  const respuesta = await fetch(`${API_URL}/api/bugs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  if (respuesta.status === 400) {
    const cuerpo = await respuesta.json()
    return { ok: false, errores: cuerpo.errores ?? {} }
  }
  if (!respuesta.ok) throw new Error('Error inesperado al crear el bug')
  return { ok: true, bug: await respuesta.json() }
}
