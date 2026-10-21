import { ESTADOS, PRIORIDADES, formatearFecha } from '../etiquetas'
import Logo from './Logo'

/**
 * Tabla HU-2. Recibe la lista ya ordenada (más recientes primero).
 * Estados: cargando (skeleton), error (alerta + Reintentar), vacío y con datos.
 */
export default function BugTable({ bugs, cargando, error, onReintentar }) {
  const encabezado = (
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Título</th>
        <th scope="col">Estado</th>
        <th scope="col">Prioridad</th>
        <th scope="col">Fecha ↓</th>
      </tr>
    </thead>
  )

  if (cargando) {
    return (
      <table aria-busy="true">
        <caption>Cargando bugs…</caption>
        {encabezado}
        <tbody>
          {[1, 2, 3].map((n) => (
            <tr key={n}>
              {['40%', '90%', '60%', '60%', '80%'].map((ancho, i) => (
                <td key={i}><span className="sk" style={{ width: ancho }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (error) {
    return (
      <>
        <div className="alerta mal" role="alert">{error} <span>Intenta de nuevo.</span></div>
        <button className="btn btn-secundario" onClick={onReintentar}>Reintentar</button>
      </>
    )
  }

  if (bugs.length === 0) {
    return (
      <div className="vacio">
        <Logo tamano={56} apagado />
        <h3>No hay bugs</h3>
        <p>Cuando se reporte un bug aparecerá aquí.</p>
        <a className="btn btn-primario" href="#reportar" style={{ textDecoration: 'none', display: 'inline-block' }}>Reportar bug</a>
      </div>
    )
  }

  return (
    <table>
      <caption>{bugs.length} {bugs.length === 1 ? 'bug' : 'bugs'} · más recientes primero</caption>
      {encabezado}
      <tbody>
        {bugs.map((bug) => (
          <tr key={bug.id}>
            <td className="mono">#{bug.id}</td>
            <td>{bug.titulo}</td>
            <td><span className={`badge b-${bug.estado}`}>{ESTADOS[bug.estado] ?? bug.estado}</span></td>
            {/* Crítica va en sólido para destacar; las demás con contorno */}
            <td>
              <span className={`badge b-${bug.prioridad}${bug.prioridad === 'CRITICA' ? ' solido' : ''}`}>
                {PRIORIDADES[bug.prioridad] ?? bug.prioridad}
              </span>
            </td>
            <td className="mono"><time dateTime={bug.fechaCreacion}>{formatearFecha(bug.fechaCreacion)}</time></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
