import { useState, useRef } from 'react'
import { crearBug } from '../api/bugsApi'
import { PRIORIDADES, SEVERIDADES } from '../etiquetas'

// Valores iniciales del formulario (vacío)
const FORM_VACIO = { titulo: '', descripcion: '', prioridad: '', severidad: '' }

// Límites de caracteres
const LIMITE_TITULO = 150
const LIMITE_DESCRIPCION = 2000

// Mensajes de error cuando se excede el límite (igual que backend)
const ERROR_TITULO_EXCEDIDO = 'El título no puede tener más de 150 caracteres'
const ERROR_DESCRIPCION_EXCEDIDA = 'La descripción no puede tener más de 2000 caracteres'

/**
 * Formulario para reportar un bug.
 * Muestra debajo de cada campo el error que devuelve el backend (400).
 * Incluye contador de caracteres y accesibilidad mejorada.
 * Props: onCreado(bug) se llama cuando el bug se guarda con éxito.
 */
export default function BugForm({ onCreado }) {
  const [form, setForm] = useState(FORM_VACIO)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  // Referencias a los campos para mover el foco en caso de error
  const tituloRef = useRef(null)
  const descripcionRef = useRef(null)
  const prioridadRef = useRef(null)
  const severidadRef = useRef(null)

  // Verifica si el título excede el límite
  const tituloExcedido = form.titulo.length > LIMITE_TITULO
  // Verifica si la descripción excede el límite
  const descripcionExcedida = form.descripcion.length > LIMITE_DESCRIPCION

  // Genera el error del contador si se excede el límite
  const errorTituloContador = tituloExcedido ? ERROR_TITULO_EXCEDIDO : null
  const errorDescripcionContador = descripcionExcedida ? ERROR_DESCRIPCION_EXCEDIDA : null

  // El error a mostrar es el del contador (cliente) o el del backend
  const errorTituloMostrar = errorTituloContador || errores.titulo
  const errorDescripcionMostrar = errorDescripcionContador || errores.descripcion

  // Actualiza el campo que cambió usando su atributo "name"
  // y limpia el error de ese campo al editar
  function manejarCambio(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // Limpiar error del backend cuando el usuario edita el campo
    if (errores[name]) {
      setErrores({ ...errores, [name]: undefined })
    }
  }

  // Mueve el foco al primer campo con error
  function enfocarPrimerError(erroresNuevos) {
    const refs = [
      { campo: 'titulo', ref: tituloRef },
      { campo: 'descripcion', ref: descripcionRef },
      { campo: 'prioridad', ref: prioridadRef },
      { campo: 'severidad', ref: severidadRef },
    ]
    for (const { campo, ref } of refs) {
      if (erroresNuevos[campo] && ref.current) {
        ref.current.focus()
        break
      }
    }
  }

  async function manejarEnvio(e) {
    e.preventDefault()

    // Validación del lado del cliente para límites de caracteres
    const erroresCliente = {}
    if (tituloExcedido) {
      erroresCliente.titulo = ERROR_TITULO_EXCEDIDO
    }
    if (descripcionExcedida) {
      erroresCliente.descripcion = ERROR_DESCRIPCION_EXCEDIDA
    }
    if (Object.keys(erroresCliente).length > 0) {
      setErrores(erroresCliente)
      enfocarPrimerError(erroresCliente)
      return
    }

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
        enfocarPrimerError(resultado.errores)
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

      <label htmlFor="titulo">Título</label>
      <input
        id="titulo"
        name="titulo"
        ref={tituloRef}
        value={form.titulo}
        onChange={manejarCambio}
        aria-invalid={errorTituloMostrar ? 'true' : undefined}
        aria-describedby={errorTituloMostrar ? 'error-titulo' : 'contador-titulo'}
      />
      <div
        id="contador-titulo"
        className={`contador ${tituloExcedido ? 'excedido' : ''}`}
        aria-live="polite"
      >
        {form.titulo.length}/{LIMITE_TITULO}
      </div>
      {errorTituloMostrar && (
        <p id="error-titulo" className="error" role="alert">
          {errorTituloMostrar}
        </p>
      )}

      <label htmlFor="descripcion">Descripción</label>
      <textarea
        id="descripcion"
        name="descripcion"
        ref={descripcionRef}
        value={form.descripcion}
        onChange={manejarCambio}
        rows={4}
        aria-invalid={errorDescripcionMostrar ? 'true' : undefined}
        aria-describedby={errorDescripcionMostrar ? 'error-descripcion' : 'contador-descripcion'}
      />
      <div
        id="contador-descripcion"
        className={`contador ${descripcionExcedida ? 'excedido' : ''}`}
        aria-live="polite"
      >
        {form.descripcion.length}/{LIMITE_DESCRIPCION}
      </div>
      {errorDescripcionMostrar && (
        <p id="error-descripcion" className="error" role="alert">
          {errorDescripcionMostrar}
        </p>
      )}

      <div className="fila">
        <div>
          <label htmlFor="prioridad">Prioridad</label>
          <select
            id="prioridad"
            name="prioridad"
            ref={prioridadRef}
            value={form.prioridad}
            onChange={manejarCambio}
            aria-invalid={errores.prioridad ? 'true' : undefined}
            aria-describedby={errores.prioridad ? 'error-prioridad' : undefined}
          >
            <option value="">-- Selecciona --</option>
            {Object.entries(PRIORIDADES).map(([valor, texto]) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
          {errores.prioridad && (
            <p id="error-prioridad" className="error" role="alert">
              {errores.prioridad}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="severidad">Severidad</label>
          <select
            id="severidad"
            name="severidad"
            ref={severidadRef}
            value={form.severidad}
            onChange={manejarCambio}
            aria-invalid={errores.severidad ? 'true' : undefined}
            aria-describedby={errores.severidad ? 'error-severidad' : undefined}
          >
            <option value="">-- Selecciona --</option>
            {Object.entries(SEVERIDADES).map(([valor, texto]) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
          {errores.severidad && (
            <p id="error-severidad" className="error" role="alert">
              {errores.severidad}
            </p>
          )}
        </div>
      </div>

      {errores.body && <p className="error" role="alert">{errores.body}</p>}
      {errorGeneral && <p className="error" role="alert">{errorGeneral}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? 'Guardando...' : 'Crear bug'}
      </button>
    </form>
  )
}
