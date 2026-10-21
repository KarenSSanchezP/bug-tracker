/** Logo TRIAGE: un prompt de consola ">_" en ámbar y cian. Es decorativo (aria-hidden). */
export default function Logo({ tamano = 30, apagado = false }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 34 34" aria-hidden="true">
      <rect width="34" height="34" rx="7" fill="var(--bg)" stroke="var(--border)" />
      <path d="M9 11l6 6-6 6" stroke={apagado ? 'var(--muted)' : 'var(--primary)'} strokeWidth="3" fill="none" strokeLinecap="round" />
      {!apagado && <rect x="17" y="21" width="9" height="3" rx="1.5" fill="var(--secondary)" />}
    </svg>
  )
}
