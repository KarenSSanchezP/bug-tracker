# Plan de pruebas – Sprint 1 (HU-1 Crear bug, HU-2 Listar bugs)

## Alcance
- Backend: `POST /api/bugs`, `GET /api/bugs`, servicio BugService.
- Frontend (manual en este sprint): formulario de creación y tabla.
- Fuera de alcance: login, roles, estados (sprints siguientes).

## Tipos de prueba y por qué
- **Unitarias (JUnit 5 + Mockito):** prueban la lógica del servicio sin base de datos; el repositorio se simula ("mock"). Son rápidas y señalan exactamente dónde falla.
- **API (Postman):** prueban el endpoint real: código HTTP, cuerpo JSON y mensajes de error.
- **Manuales de UI:** revisamos el formulario y la tabla a mano; la automatización con Selenium/Playwright llega después.

## Técnicas
- **Valores límite:** probar justo en el límite (150), uno menos (149) y uno más (151).
- **Partición de equivalencia:** un valor representativo por grupo (válido, vacío, nulo, fuera de la lista).

## Criterio de salida
Todos los casos de prioridad Alta pasan, sin bugs Críticos/Altos abiertos.

## Casos de prueba – HU-1 Crear bug (POST /api/bugs)
| ID | Caso | Datos | Resultado esperado | Prioridad |
|---|---|---|---|---|
| CP-01 | Crear bug válido | título "Error login", descripción válida, prioridad Alta, severidad Media | 201, estado "Abierto", fecha de creación asignada, id generado | Alta |
| CP-02 | Título vacío | título "" | 400, mensaje en campo `titulo` | Alta |
| CP-03 | Título nulo/ausente | sin `titulo` | 400, mensaje en `titulo` | Alta |
| CP-04 | Título solo espacios | "   " | 400 | Media |
| CP-05 | Título 149 caracteres | 149 | 201 | Media |
| CP-06 | Título 150 caracteres (límite) | 150 | 201 | Alta |
| CP-07 | Título 151 caracteres | 151 | 400, mensaje en `titulo` | Alta |
| CP-08 | Descripción vacía | "" | 400, mensaje en `descripcion` | Alta |
| CP-09 | Descripción 2000 caracteres | 2000 | 201 | Alta |
| CP-10 | Descripción 2001 caracteres | 2001 | 400 | Alta |
| CP-11 | Prioridad válida (cada una) | Baja, Media, Alta, Crítica | 201 | Media |
| CP-12 | Prioridad inválida | "Urgente" | 400, mensaje en `prioridad` | Alta |
| CP-13 | Prioridad ausente | sin `prioridad` | 400 | Media |
| CP-14 | Severidad inválida | "X" | 400, mensaje en `severidad` | Alta |
| CP-15 | Varios campos inválidos | título vacío + prioridad inválida | 400 con un mensaje por cada campo | Alta |
| CP-16 | Cliente intenta fijar estado | estado "Cerrado" en el body | se ignora: queda "Abierto" | Media |
| CP-17 | JSON mal formado | `{titulo:` | 400, error en `errores.body`, sin stack trace | Media |
| CP-18 | Caracteres especiales | tildes, ñ, emoji, `<script>` | 201 y se guarda tal cual (sin ejecutar HTML en la UI) | Media |

## Casos de prueba – HU-2 Listar bugs (GET /api/bugs)
| ID | Caso | Precondición | Resultado esperado | Prioridad |
|---|---|---|---|---|
| CP-19 | Lista vacía (API) | sin bugs | 200, `[]` | Alta |
| CP-20 | Lista vacía (UI) | sin bugs | la tabla muestra "No hay bugs" | Alta |
| CP-21 | Lista con datos | 3 bugs | 200, 3 elementos con id, título, estado, prioridad, fecha | Alta |
| CP-22 | Orden | bugs creados en distinto momento | el más reciente primero | Alta |
| CP-23 | Bug recién creado aparece | crear con CP-01 | aparece primero en la lista | Alta |
| CP-24 | Columnas de la tabla (UI) | 1 bug | se ven las 5 columnas | Media |

## Pruebas unitarias planeadas (BugServiceTest)
- `crearBug_datosValidos_guardaConEstadoAbiertoYFecha`
- `crearBug_llamaRepositorioSave_unaVez` (verify de Mockito)
- `listarBugs_sinDatos_devuelveListaVacia`
- `listarBugs_devuelveOrdenadosPorFechaDesc`
- Validaciones de DTO (Bean Validation) con `Validator`: título/descr. límites y enums.

## Formato de reporte de bugs
ID · Título · Pasos para reproducir · Resultado esperado · Resultado actual · Severidad · Prioridad · Entorno · Evidencia.
