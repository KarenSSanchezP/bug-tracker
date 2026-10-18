# Guía de estilo — TRIAGE (Bug Tracker)

Sistema visual elegido: **TRIAGE**, estilo consola, ámbar sobre grafito. Dos temas con los mismos nombres de variable: `.dark` (por defecto) y `.light`.
Archivos: `tokens.css`, `hu1-crear-bug.html`, `hu2-listar-bugs.html` (tema por URL: `?tema=light` / `?tema=dark`).

## 1. Tokens

```css
:root {
  --font-ui: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --fs-xs: 12px; --fs-sm: 14px; --fs-base: 16px; --fs-lg: 20px; --fs-xl: 24px; --fs-2xl: 30px; --fs-3xl: 36px;
  --lh: 1.5;
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-5: 24px; --sp-6: 32px; --sp-7: 48px;
  --r-sm: 4px; --r-md: 6px; --r-lg: 10px; --r-pill: 999px;
}
.dark, :root {
  --primary: #F59E0B;
  --onprimary: #0F1115;
  --secondary: #22D3EE;
  --bg: #0F1115;
  --surface: #1A1D24;
  --text: #E5E7EB;
  --muted: #9CA3AF;
  --border: #374151;
  --success: #4ADE80;
  --warning: #FBBF24;
  --error: #F87171;
  --info: #60A5FA;
  --alta: #FB923C;
}
.light {
  --primary: #B45309;
  --onprimary: #FFFFFF;
  --secondary: #0E7490;
  --bg: #FAFAF7;
  --surface: #FFFFFF;
  --text: #1A1D24;
  --muted: #4B5563;
  --border: #D1D5DB;
  --success: #15803D;
  --warning: #A16207;
  --error: #B91C1C;
  --info: #1D4ED8;
  --alta: #C2410C;
}
```

- **Tipografía:** Space Grotesk (interfaz y títulos, 400/500/700) y JetBrains Mono (IDs, fechas, contadores, 400/600).
- **Escala tipográfica:** 12 / 14 / 16 / 20 / 24 / 30 / 36 px (`--fs-xs` … `--fs-3xl`), interlineado 1.5.
- **Espaciado** (base 4): 4, 8, 12, 16, 24, 32, 48. **Radios:** 4, 6, 10, pill.

## 2. Contraste (WCAG 2.1 AA, ≥ 4.5:1, calculado)

| Tema | Par | Hex | Ratio | Resultado |
|---|---|---|---|---|
| Oscuro | --text sobre --bg | #E5E7EB / #0F1115 | 15.26:1 | AA ✔ |
| Oscuro | --text sobre --surface | #E5E7EB / #1A1D24 | 13.62:1 | AA ✔ |
| Oscuro | --muted sobre --bg | #9CA3AF / #0F1115 | 7.44:1 | AA ✔ |
| Oscuro | --muted sobre --surface | #9CA3AF / #1A1D24 | 6.64:1 | AA ✔ |
| Oscuro | --primary sobre --bg | #F59E0B / #0F1115 | 8.80:1 | AA ✔ |
| Oscuro | --onprimary sobre --primary | #0F1115 / #F59E0B | 8.80:1 | AA ✔ |
| Oscuro | --secondary sobre --bg | #22D3EE / #0F1115 | 10.46:1 | AA ✔ |
| Oscuro | --secondary sobre --surface | #22D3EE / #1A1D24 | 9.33:1 | AA ✔ |
| Oscuro | --success sobre --bg | #4ADE80 / #0F1115 | 10.84:1 | AA ✔ |
| Oscuro | --success sobre --surface | #4ADE80 / #1A1D24 | 9.68:1 | AA ✔ |
| Oscuro | --warning sobre --bg | #FBBF24 / #0F1115 | 11.32:1 | AA ✔ |
| Oscuro | --warning sobre --surface | #FBBF24 / #1A1D24 | 10.10:1 | AA ✔ |
| Oscuro | --alta sobre --bg | #FB923C / #0F1115 | 8.35:1 | AA ✔ |
| Oscuro | --alta sobre --surface | #FB923C / #1A1D24 | 7.45:1 | AA ✔ |
| Oscuro | --error sobre --bg | #F87171 / #0F1115 | 6.83:1 | AA ✔ |
| Oscuro | --error sobre --surface | #F87171 / #1A1D24 | 6.10:1 | AA ✔ |
| Oscuro | --bg sobre --error | #0F1115 / #F87171 | 6.83:1 | AA ✔ |
| Oscuro | --info sobre --bg | #60A5FA / #0F1115 | 7.43:1 | AA ✔ |
| Oscuro | --info sobre --surface | #60A5FA / #1A1D24 | 6.63:1 | AA ✔ |
| Claro | --text sobre --bg | #1A1D24 / #FAFAF7 | 16.13:1 | AA ✔ |
| Claro | --text sobre --surface | #1A1D24 / #FFFFFF | 16.87:1 | AA ✔ |
| Claro | --muted sobre --bg | #4B5563 / #FAFAF7 | 7.23:1 | AA ✔ |
| Claro | --muted sobre --surface | #4B5563 / #FFFFFF | 7.56:1 | AA ✔ |
| Claro | --primary sobre --bg | #B45309 / #FAFAF7 | 4.80:1 | AA ✔ |
| Claro | --onprimary sobre --primary | #FFFFFF / #B45309 | 5.02:1 | AA ✔ |
| Claro | --secondary sobre --bg | #0E7490 / #FAFAF7 | 5.12:1 | AA ✔ |
| Claro | --secondary sobre --surface | #0E7490 / #FFFFFF | 5.36:1 | AA ✔ |
| Claro | --success sobre --bg | #15803D / #FAFAF7 | 4.80:1 | AA ✔ |
| Claro | --success sobre --surface | #15803D / #FFFFFF | 5.02:1 | AA ✔ |
| Claro | --warning sobre --bg | #A16207 / #FAFAF7 | 4.71:1 | AA ✔ |
| Claro | --warning sobre --surface | #A16207 / #FFFFFF | 4.92:1 | AA ✔ |
| Claro | --alta sobre --bg | #C2410C / #FAFAF7 | 4.95:1 | AA ✔ |
| Claro | --alta sobre --surface | #C2410C / #FFFFFF | 5.18:1 | AA ✔ |
| Claro | --error sobre --bg | #B91C1C / #FAFAF7 | 6.19:1 | AA ✔ |
| Claro | --error sobre --surface | #B91C1C / #FFFFFF | 6.47:1 | AA ✔ |
| Claro | --bg sobre --error | #FAFAF7 / #B91C1C | 6.19:1 | AA ✔ |
| Claro | --info sobre --bg | #1D4ED8 / #FAFAF7 | 6.41:1 | AA ✔ |
| Claro | --info sobre --surface | #1D4ED8 / #FFFFFF | 6.70:1 | AA ✔ |

Todos los pares cumplen AA.

## 3. Botones
- **Primario** (`.btn.btn-primario`): fondo `--primary`, texto `--onprimary`, peso 700, radio `--r-md`. Uno por vista ("Reportar bug").
- **Secundario** (`.btn.btn-secundario`): transparente, texto `--text`, borde `--border` ("Limpiar", "Reintentar").
- **Deshabilitado**: atributo `disabled`, opacidad 0.5 y `cursor:not-allowed`. No usarlo para bloquear el envío: se valida al enviar.
- **Foco**: `:focus-visible` con `outline: 3px solid var(--secondary); outline-offset: 2px`.

## 4. Campos (input / textarea / select)
- **Normal**: fondo `--bg`, borde 1px `--border`, `label for` visible con `*` en los obligatorios.
- **Foco**: `outline: 3px solid var(--secondary); outline-offset: 2px`.
- **Error**: borde 2px `--error` cuando `aria-invalid="true"`. El selector cubre `input`, `textarea` y `select[aria-invalid="true"]`. Mensaje debajo, en `--error`, con `id="error-<campo>"`.
- **`aria-describedby`**: el id del contador y luego el del error, p. ej. `aria-describedby="contador-titulo error-titulo"`. Sin error queda solo `contador-titulo`. Un select con error usa `error-prioridad`.
- **Layout**: Prioridad y Severidad van en la misma fila: `.fila { display:flex; gap:16px } .fila > div { flex: 1 }`.

### Contador de caracteres
- Siempre visible, abajo a la derecha, en mono: `n/150` (título) y `n/2000` (descripción).
- Color: gris `--muted` por debajo del 90 %. Ámbar `--warning` del 90 % al 100 % (≥135/150, ≥1800/2000). Rojo `--error` al pasar el límite.
- Lector de pantalla: región `aria-live="polite"` que anuncia **solo** al cruzar el 90 % ("135 de 150 caracteres") y al pasar el límite ("Superaste el límite de 150 caracteres"). No anuncia cada tecla.

### Validación (mensajes idénticos al backend)
| Campo | Regla | Mensaje |
|---|---|---|
| título | vacío | El título es obligatorio |
| título | > 150 | El título no puede tener más de 150 caracteres |
| descripción | vacía | La descripción es obligatoria |
| descripción | > 2000 | La descripción no puede tener más de 2000 caracteres |
| prioridad | sin valor | La prioridad es obligatoria |
| severidad | sin valor | La severidad es obligatoria |

- Al enviar con errores, el **foco va al primer campo inválido** y aparece una alerta resumen (`role="alert"`).
- El error de un campo **se quita en cuanto se corrige** (al escribir o al cambiar el select): se borra `aria-invalid`, se elimina el mensaje y `aria-describedby` vuelve a apuntar solo al contador.

## 5. Badges
La API usa valores en MAYÚSCULAS y la interfaz los muestra en formato título:

| API | Se muestra | Clase | Color |
|---|---|---|---|
| BAJA | Baja | `.badge.b-BAJA` | `--success` (contorno) |
| MEDIA | Media | `.badge.b-MEDIA` | `--warning` (contorno) |
| ALTA | Alta | `.badge.b-ALTA` | `--alta` naranja (contorno) |
| CRITICA | Crítica | `.badge.b-CRITICA.solido` | `--error` sólido, texto `--bg` |
| ABIERTO (estado) | Abierto | `.badge.b-ABIERTO` | `--info` (contorno) |

El color nunca es la única señal: el badge siempre lleva texto.

## 6. Tabla (HU2)
Columnas: ID (mono, `#42`), Título, Estado, Prioridad y Fecha (mono, `<time datetime>`). Orden por fecha, **más reciente primero**. `th scope="col"`, `caption` con el total, separadores de 1px `--border`.
- **Cargando**: `aria-busy="true"` y filas skeleton (`--border`, animación de pulso).
- **Vacío**: ilustración del logo, título **"No hay bugs"**, texto de apoyo y botón primario "Reportar bug".
- **Error de carga**: alerta `.alerta.mal` y botón "Reintentar".

## 7. Mensajes
- **Éxito** (`.alerta.ok`, `role="status"`): borde y texto `--success`. P. ej. "Bug #43 reportado correctamente." con enlace a la lista.
- **Error** (`.alerta.mal`, `role="alert"`): borde y texto `--error`.
