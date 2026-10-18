import { ESTADOS, PRIORIDADES, formatearFecha } from '../etiquetas'

/**
 * Tabla de bugs. Recibe la lista ya ordenada (más recientes primero).
 * Si está vacía muestra "No hay bugs".
 */
export default function BugTable({ bugs }) {
  if (bugs.length === 0) {
    return <p className="tarjeta vacio">No hay bugs</p>
  }

  return (
    <table className="tarjeta">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Estado</th>
          <th>Prioridad</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {bugs.map((bug) => (
          <tr key={bug.id}>
            <td>{bug.id}</td>
            <td>{bug.titulo}</td>
            <td>{ESTADOS[bug.estado] ?? bug.estado}</td>
            <td>{PRIORIDADES[bug.prioridad] ?? bug.prioridad}</td>
            <td>{formatearFecha(bug.fechaCreacion)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
