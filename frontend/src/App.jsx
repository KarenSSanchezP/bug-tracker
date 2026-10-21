import { useEffect, useState } from 'react'
import BugForm from './components/BugForm'
import BugTable from './components/BugTable'
import Logo from './components/Logo'
import { obtenerBugs } from './api/bugsApi'

/** Lee el tema actual de la clase de <html> (index.html ya aplicó el guardado). */
function temaInicial() {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

/** Componente principal: encabezado TRIAGE, formulario (HU-1) y tabla de bugs (HU-2). */
export default function App() {
  const [bugs, setBugs] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [tema, setTema] = useState(temaInicial)

  // Cambia la clase .dark/.light en <html> y la recuerda en localStorage
  useEffect(() => {
    document.documentElement.className = tema
    localStorage.setItem('tema', tema)
  }, [tema])

  // Carga la lista desde el backend
  async function cargarBugs() {
    try {
      setError('')
      setBugs(await obtenerBugs())
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  // Al abrir la página, carga los bugs una sola vez
  useEffect(() => {
    cargarBugs()
  }, [])

  const esOscuro = tema === 'dark'

  return (
    <>
      <header className="encabezado">
        <Logo />
        <span className="marca">TRIAGE</span>
        <nav aria-label="Principal">
          <a href="#lista">Bugs</a>
          <a href="#reportar">Reportar bug</a>
          <button
            type="button"
            className="btn btn-secundario btn-tema"
            onClick={() => setTema(esOscuro ? 'light' : 'dark')}
            aria-pressed={!esOscuro}
            aria-label={esOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            {esOscuro ? '☀ Claro' : '☾ Oscuro'}
          </button>
        </nav>
      </header>
      <main className="contenedor">
        {/* Al crear un bug recargamos la lista para respetar el orden del servidor */}
        <BugForm onCreado={cargarBugs} />
        <section className="tarjeta" id="lista" aria-labelledby="titulo-lista">
          <h2 id="titulo-lista">Bugs reportados</h2>
          <BugTable bugs={bugs} cargando={cargando} error={error} onReintentar={cargarBugs} />
        </section>
      </main>
    </>
  )
}
