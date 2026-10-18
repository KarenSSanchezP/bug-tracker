import { useState } from 'react'
import { crearBug } from '../api/bugsApi'
import { PRIORIDADES, SEVERIDADES } from '../etiquetas'

// Valores iniciales del formulario (vacío)
const FORM_VACIO = { titulo: '', descripcion: '', prioridad: '', severidad: '' }

/**
 * Formulario para reportar un bug.
 * Muestra debajo de cada campo el error que devuelve el backend (400).
 * Props: onCreado(bug) se llama cuando el bug se guarda con éxito.
 */
export default function BugForm({ onCreado }) {
  const [form, setForm] = useState(FORM_VACIO)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  // Actualiza el campo que cambió usando su atributo "name"
  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    setEnviando(true)
    setErrorGeneral('')
    try {
      // Mandamos null en vez de "" para que el backend diga "es obligatoria"
      const datos = {
        ...form,
        prioridad: form.prioridad || null,
        severidad: form.severidad || null,
      }
      const resultado = await crearBug(datos)
      if (resultado.ok) {
        setForm(FORM_VACIO)
        setErrores({})
        onCreado(resultado.bug)
      } else {
        setErrores(resultado.errores)
      }
    } catch (err) {
      setErrorGeneral(err.message || 'No se pudo conectar con el servidor')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="tarjeta" onSubmit={manejarEnvio} noValidate>
      <h2>Reportar un bug</h2>

      <label>
        Título
        <input name="titulo" value={form.titulo} onChange={manejarCambio} maxLength={150} />
      </label>
      {errores.titulo && <p className="error">{errores.titulo}</p>}

      <label>
        Descripción
        <textarea name="descripcion" value={form.descripcion} onChange={manejarCambio} rows={4} maxLength={2000} />
      </label>
      {errores.descripcion && <p className="error">{errores.descripcion}</p>}

      <div className="fila">
        <label>
          Prioridad
          <select name="prioridad" value={form.prioridad} onChange={manejarCambio}>
            <option value="">-- Selecciona --</option>
            {Object.entries(PRIORIDADES).map(([valor, texto]) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
          {errores.prioridad && <p className="error">{errores.prioridad}</p>}
        </label>

        <label>
          Severidad
          <select name="severidad" value={form.severidad} onChange={manejarCambio}>
            <option value="">-- Selecciona --</option>
            {Object.entries(SEVERIDADES).map(([valor, texto]) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
          {errores.severidad && <p className="error">{errores.severidad}</p>}
        </label>
      </div>

      {errores.body && <p className="error">{errores.body}</p>}
      {errorGeneral && <p className="error">{errorGeneral}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? 'Guardando...' : 'Crear bug'}
      </button>
    </form>
  )
}
