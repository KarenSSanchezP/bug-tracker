# 🐞 Bug Tracker

Sistema web para reportar y dar seguimiento a bugs. Proyecto de portafolio de **Karen Sánchez**.

**Sprint 1:** esqueleto del proyecto + crear y listar bugs (HU-1 y HU-2).

| Capa | Tecnología |
|------|-----------|
| Backend | Java 17, Spring Boot 3 (Maven) |
| Base de datos | PostgreSQL |
| Frontend | React + Vite |

## Estructura

```
bug-tracker/
├── backend/   → API REST (Spring Boot)
│   └── src/main/java/com/karensanchez/bugtracker/
│       ├── controller/  → recibe las peticiones HTTP
│       ├── service/     → lógica de negocio
│       ├── repository/  → acceso a la base de datos
│       ├── model/       → entidad Bug y enums
│       ├── dto/         → objetos de entrada/salida de la API
│       ├── exception/   → manejo global de errores (400)
│       └── config/      → configuración de CORS
└── frontend/  → interfaz en React (formulario + tabla)
```

## Requisitos

- JDK 17, Maven 3.9+
- PostgreSQL 14+
- Node.js 18+ y npm

## 1. Crear la base de datos

```sql
CREATE USER bugtracker WITH PASSWORD 'bugtracker';
CREATE DATABASE bugtracker OWNER bugtracker;
```

Las tablas se crean solas al arrancar el backend (`ddl-auto=update`).

## 2. Levantar el backend

```bash
cd backend
mvn spring-boot:run
```

Queda en `http://localhost:8080`. Las credenciales se pueden cambiar con variables de entorno:

| Variable | Valor por defecto |
|----------|-------------------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/bugtracker` |
| `DB_USER` | `bugtracker` |
| `DB_PASSWORD` | `bugtracker` |
| `CORS_ORIGIN` | `http://localhost:5173` |
| `PORT` | `8080` |

Prueba básica: `mvn test` (usa H2 en memoria, no necesita PostgreSQL).

## 3. Levantar el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Si el backend está en otra URL, copia `.env.example` a `.env` y cambia `VITE_API_URL`.

## API

### `POST /api/bugs` – crear un bug

```json
{
  "titulo": "El login no responde",
  "descripcion": "Al presionar Entrar no pasa nada",
  "prioridad": "ALTA",
  "severidad": "CRITICA"
}
```

- `titulo`: obligatorio, máximo 150 caracteres.
- `descripcion`: obligatoria, máximo 2000 caracteres.
- `prioridad` y `severidad`: obligatorias, uno de `BAJA`, `MEDIA`, `ALTA`, `CRITICA`.
- `id`, `estado` (`ABIERTO`) y `fechaCreacion` los pone el servidor; si el cliente los manda, se ignoran.

Respuesta **201** con el bug creado. Si algo falla, **400**:

```json
{ "status": 400, "errores": { "titulo": "El título es obligatorio" } }
```

El mismo formato se usa para un JSON mal formado (`"body"`) o un valor de enum inválido.

### `GET /api/bugs` – listar bugs

Devuelve la lista ordenada por fecha de creación, los más recientes primero.

## Ejemplo con curl

```bash
curl -X POST http://localhost:8080/api/bugs \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Login falla","descripcion":"No responde","prioridad":"ALTA","severidad":"CRITICA"}'

curl http://localhost:8080/api/bugs
```
