import { useEffect, useState } from 'react'
import BugForm from './components/BugForm'
import BugTable from './components/BugTable'
import { obtenerBugs } from './api/bugsApi'

/** Componente principal: formulario arriba y tabla de bugs abajo. */
export default function App() {
  const [bugs, setBugs] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <main className="contenedor">
      <h1>🐞 Bug Tracker</h1>
      {/* Al crear un bug recargamos la lista para respetar el orden del servidor */}
      <BugForm onCreado={cargarBugs} />
      <h2>Bugs reportados</h2>
      {cargando && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && <BugTable bugs={bugs} />}
    </main>
  )
}
