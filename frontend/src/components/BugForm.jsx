import { useRef, useState } from 'react'
import { crearBug } from '../api/bugsApi'
import { PRIORIDADES, SEVERIDADES } from '../etiquetas'
import ContadorCaracteres from './ContadorCaracteres'

// Valores iniciales del formulario (vacío)
const FORM_VACIO = { titulo: '', descripcion: '', prioridad: '', severidad: '' }
// Límites iguales a los del backend
const MAX = { titulo: 150, descripcion: 2000 }
// Orden de los campos: sirve para poner el foco en el PRIMER campo inválido
const ORDEN = ['titulo', 'descripcion', 'prioridad', 'severidad']

/** Validación en el navegador con los mismos mensajes que devuelve el backend. */
function validar(form) {
  const e = {}
  if (!form.titulo.trim()) e.titulo = 'El título es obligatorio'
  else if (form.titulo.length > MAX.titulo) e.titulo = 'El título no puede tener más de 150 caracteres'
  if (!form.descripcion.trim()) e.descripcion = 'La descripción es obligatoria'
  else if (form.descripcion.length > MAX.descripcion) e.descripcion = 'La descripción no puede tener más de 2000 caracteres'
  if (!form.prioridad) e.prioridad = 'La prioridad es obligatoria'
  if (!form.severidad) e.severidad = 'La severidad es obligatoria'
  return e
}

/**
 * Formulario HU-1: reportar un bug.
 * Props: onCreado(bug) se llama cuando el bug se guarda con éxito.
 */
export default function BugForm({ onCreado }) {
  const [form, setForm] = useState(FORM_VACIO)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')
  const [exito, setExito] = useState(null)
  // Referencias a cada campo para mover el foco
  const refs = { titulo: useRef(), descripcion: useRef(), prioridad: useRef(), severidad: useRef() }

  // Actualiza el campo y quita su error en cuanto se corrige
  function manejarCambio(e) {
    const { name, value } = e.target
    const nuevo = { ...form, [name]: value }
    setForm(nuevo)
    if (errores[name] && !validar(nuevo)[name]) {
      const { [name]: _quitado, ...resto } = errores
      setErrores(resto)
    }
  }

  function enfocarPrimerError(errs) {
    const primero = ORDEN.find((campo) => errs[campo])
    if (primero) refs[primero].current?.focus()
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    setErrorGeneral('')
    setExito(null)
    const errs = validar(form)
    if (Object.keys(errs).length > 0) {
      setErrores(errs)
      enfocarPrimerError(errs)
      return
    }
    setEnviando(true)
    try {
      const resultado = await crearBug(form)
      if (resultado.ok) {
        setForm(FORM_VACIO)
        setErrores({})
        setExito(resultado.bug)
        onCreado(resultado.bug)
      } else {
        // Errores 400 del backend: se muestran igual que los del navegador
        setErrores(resultado.errores)
        enfocarPrimerError(resultado.errores)
      }
    } catch (err) {
      setErrorGeneral(err.message || 'No se pudo conectar con el servidor')
    } finally {
      setEnviando(false)
    }
  }

  function limpiar() {
    setForm(FORM_VACIO)
    setErrores({})
    setErrorGeneral('')
    setExito(null)
  }

  // Detalle QA #2: aria-describedby apunta al contador y, si hay error, también al mensaje
  function describedBy(campo, conContador) {
    const ids = []
    if (conContador) ids.push(`contador-${campo}`)
    if (errores[campo]) ids.push(`error-${campo}`)
    return ids.length ? ids.join(' ') : undefined
  }

  const cantidadErrores = ORDEN.filter((c) => errores[c]).length

  // Campo de texto con contador (título o descripción)
  function campoTexto(campo, etiqueta, Componente, extra = {}) {
    return (
      <div className="campo">
        <label htmlFor={campo}>{etiqueta} *</label>
        <Componente
          id={campo}
          name={campo}
          ref={refs[campo]}
          value={form[campo]}
          onChange={manejarCambio}
          aria-invalid={errores[campo] ? 'true' : undefined}
          aria-describedby={describedBy(campo, true)}
          {...extra}
        />
        <div className="pie">
          {errores[campo] && <span className="error" id={`error-${campo}`}>{errores[campo]}</span>}
          <ContadorCaracteres id={`contador-${campo}`} actual={form[campo].length} max={MAX[campo]} />
        </div>
      </div>
    )
  }

  // Select de prioridad o severidad
  function campoSelect(campo, etiqueta, opciones) {
    return (
      <div className="campo">
        <label htmlFor={campo}>{etiqueta} *</label>
        <select
          id={campo}
          name={campo}
          ref={refs[campo]}
          value={form[campo]}
          onChange={manejarCambio}
          aria-invalid={errores[campo] ? 'true' : undefined}
          aria-describedby={describedBy(campo, false)}
        >
          <option value="">Selecciona…</option>
          {Object.entries(opciones).map(([valor, texto]) => (
            <option key={valor} value={valor}>{texto}</option>
          ))}
        </select>
        {errores[campo] && (
          <div className="pie"><span className="error" id={`error-${campo}`}>{errores[campo]}</span></div>
        )}
      </div>
    )
  }

  return (
    <form className="tarjeta" onSubmit={manejarEnvio} noValidate id="reportar">
      <h2>Reportar un bug</h2>

      {exito && (
        <div className="alerta ok" role="status">
          Bug #{exito.id} reportado correctamente. <a href="#lista">Ver lista de bugs</a>
        </div>
      )}
      {cantidadErrores > 0 && (
        <div className="alerta mal" role="alert">
          Revisa los campos marcados. <span>{cantidadErrores} {cantidadErrores === 1 ? 'error' : 'errores'}.</span>
        </div>
      )}
      {(errorGeneral || errores.body) && (
        <div className="alerta mal" role="alert">{errorGeneral || errores.body}</div>
      )}

      {/* Sin maxLength: dejamos pasar del límite para que el contador se ponga rojo y se vea el error */}
      {campoTexto('titulo', 'Título', 'input', { type: 'text' })}
      {campoTexto('descripcion', 'Descripción', 'textarea', { rows: 4 })}

      <div className="fila">
        {campoSelect('prioridad', 'Prioridad', PRIORIDADES)}
        {campoSelect('severidad', 'Severidad', SEVERIDADES)}
      </div>

      <div className="acciones">
        <button className="btn btn-primario" type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Reportar bug'}
        </button>
        <button className="btn btn-secundario" type="button" onClick={limpiar}>Limpiar</button>
      </div>
    </form>
  )
}
