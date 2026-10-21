# Cómo ejecutar Bug Tracker (TRIAGE) en Windows, desde cero

Esta guía te lleva paso a paso desde una computadora con Windows sin nada instalado hasta tener el backend, el frontend y las pruebas funcionando.

> Usa **PowerShell** para los comandos. Después de instalar cada programa, **cierra y vuelve a abrir PowerShell** para que reconozca el nuevo `Path`.

---

## 1. Instalar las herramientas

### 1.1 Git
1. Descarga el instalador de <https://git-scm.com/download/win> y sigue las opciones por defecto.
2. Verifica:
   ```powershell
   git --version
   ```

### 1.2 JDK 17 (Eclipse Temurin)
1. Entra a <https://adoptium.net/temurin/releases/?version=17>, elige **Windows x64, JDK, .msi**.
2. En el instalador marca **"Set JAVA_HOME variable"** y **"Add to PATH"**.
3. Verifica:
   ```powershell
   java -version     # debe decir 17.x
   echo $env:JAVA_HOME
   ```

### 1.3 Maven 3.9 (zip + Path)
El proyecto **no** trae `mvnw`, así que necesitas Maven instalado.
1. Descarga el **Binary zip archive** (`apache-maven-3.9.x-bin.zip`) de <https://maven.apache.org/download.cgi>.
2. Descomprímelo, por ejemplo en `C:\herramientas\apache-maven-3.9.x`.
3. Agrega la carpeta `bin` al Path:
   - Inicio → "Editar las variables de entorno del sistema" → **Variables de entorno**.
   - En *Variables de usuario*, selecciona **Path** → **Editar** → **Nuevo** → `C:\herramientas\apache-maven-3.9.x\bin`.
4. Abre una PowerShell nueva y verifica:
   ```powershell
   mvn -v     # debe mostrar Maven 3.9.x y Java 17
   ```

### 1.4 PostgreSQL (con psql y pgAdmin)
1. Descarga el instalador de <https://www.postgresql.org/download/windows/> (EDB).
2. Deja marcados **PostgreSQL Server**, **pgAdmin 4** y **Command Line Tools** (`psql`).
3. Anota la contraseña del usuario `postgres` y deja el puerto **5432**.

### 1.5 Node.js 18 o superior
1. Descarga la versión **LTS** de <https://nodejs.org/>.
2. Verifica:
   ```powershell
   node -v    # v18 o mayor
   npm -v
   ```

---

## 2. Crear la base de datos

Abre **SQL Shell (psql)** desde el menú Inicio (o pgAdmin → Query Tool), entra como `postgres` y ejecuta:

```sql
CREATE USER bugtracker WITH PASSWORD 'bugtracker';
CREATE DATABASE bugtracker OWNER bugtracker;
```

No hace falta crear tablas: el backend las crea solo al arrancar (`ddl-auto=update`).

---

## 3. Clonar el repositorio

```powershell
cd $HOME\Documents
git clone https://github.com/KarenSSanchezP/bug-tracker.git
cd bug-tracker
```

Mientras el PR #2 no esté fusionado, el código está en la rama de la funcionalidad:

```powershell
git checkout cursor/feature/hu1-hu2-crear-listar-bugs-e311
```

(Cuando se haga el merge, basta con quedarse en `main`).

---

## 4. Ejecutar el backend (Spring Boot)

```powershell
cd backend
mvn spring-boot:run
```

- La primera vez descarga dependencias (tarda unos minutos).
- Queda escuchando en <http://localhost:8080>. Prueba: <http://localhost:8080/api/bugs> debe devolver `[]`.
- Deja esta ventana abierta.

---

## 5. Ejecutar el frontend (React + Vite)

En **otra** ventana de PowerShell:

```powershell
cd bug-tracker\frontend
npm install
npm run dev
```

Abre <http://localhost:5173>. Verás la pantalla TRIAGE con el formulario (HU-1) y la lista de bugs (HU-2). El botón **☀ Claro / ☾ Oscuro** del encabezado cambia el tema y se recuerda.

---

## 6. Ejecutar las pruebas del backend

```powershell
cd backend
mvn test
```

Deben pasar **27 pruebas** (`Tests run: 27, Failures: 0`). Las pruebas usan una base **H2 en memoria**, así que no necesitan PostgreSQL encendido.

---

## 7. Solución de problemas

| Problema | Solución |
|---|---|
| `mvn` o `java` "no se reconoce como comando" | Revisa el `Path` (paso 1.2/1.3) y **abre una PowerShell nueva**. |
| `mvn -v` muestra otra versión de Java | Ajusta `JAVA_HOME` a la carpeta del JDK 17 de Temurin. |
| `Port 8080 was already in use` | Arranca en otro puerto: `$env:PORT="8081"; mvn spring-boot:run` |
| El frontend dice "No se pudo cargar la lista de bugs" | Verifica que el backend esté corriendo. Si usas otro puerto, en `frontend` crea un archivo `.env.local` con `VITE_API_URL=http://localhost:8081` y reinicia `npm run dev`. |
| `password authentication failed for user "bugtracker"` | Repite el paso 2. Si usas otros datos, define `$env:DB_USER`, `$env:DB_PASSWORD` o `$env:DB_URL` antes de `mvn spring-boot:run`. |
| `Connection refused` a PostgreSQL | Abre "Servicios" de Windows y verifica que `postgresql-x64-…` esté **En ejecución**. |
| Error de CORS en la consola del navegador | Abre el frontend en `http://localhost:5173` (no en `127.0.0.1`), o define `$env:CORS_ORIGIN` con tu URL. |
| `npm install` falla | Confirma `node -v` ≥ 18; borra `node_modules` y vuelve a intentar. |
