import { useEffect, useRef, useState } from 'react'

/**
 * Contador "n/max" debajo de un campo de texto.
 * - Color: gris por debajo del 90 %, ámbar (--warning) del 90 % al 100 %, rojo (--error) al exceder.
 * - Lector de pantalla (detalle QA #1): solo anuncia al cruzar el 90 % y al pasar el límite,
 *   no en cada tecla. Por eso el texto visible NO es una región aria-live; usamos una aparte.
 */
export default function ContadorCaracteres({ id, actual, max }) {
  const umbral = Math.ceil(max * 0.9) // 135 de 150, 1800 de 2000
  const nivel = actual > max ? 'excede' : actual >= umbral ? 'cerca' : 'normal'
  const [anuncio, setAnuncio] = useState('')
  const nivelAnterior = useRef(nivel)

  // Solo anunciamos cuando cambia de nivel hacia "cerca" o "excede"
  useEffect(() => {
    if (nivel !== nivelAnterior.current) {
      if (nivel === 'cerca') setAnuncio(`${actual} de ${max} caracteres`)
      else if (nivel === 'excede') setAnuncio(`Superaste el límite de ${max} caracteres`)
      else setAnuncio('')
      nivelAnterior.current = nivel
    }
  }, [nivel, actual, max])

  return (
    <>
      <span id={id} className={`contador ${nivel === 'normal' ? '' : nivel}`}>{actual}/{max}</span>
      <span className="sr" aria-live="polite">{anuncio}</span>
    </>
  )
}
