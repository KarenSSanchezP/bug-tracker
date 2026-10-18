# Colección de Postman – Bug Tracker Sprint 1

Este directorio contiene la colección de Postman para las pruebas de API del Sprint 1.

## Cómo importar la colección

1. Abre Postman.
2. Haz clic en **Import** (esquina superior izquierda).
3. Arrastra el archivo `BugTracker-Sprint1.postman_collection.json` o usa **Upload Files** para seleccionarlo.
4. La colección aparecerá en el panel izquierdo con el nombre "Bug Tracker - Sprint 1".

## Configurar `baseUrl`

La colección usa la variable `{{baseUrl}}` para la URL del servidor. Por defecto es `http://localhost:8080`.

Para cambiarla:
1. Selecciona la colección en el panel izquierdo.
2. Ve a la pestaña **Variables**.
3. Modifica el valor de `baseUrl` según tu entorno.

## Ejecutar con Collection Runner

1. Haz clic derecho en la colección y selecciona **Run collection**.
2. Verifica que todas las peticiones estén seleccionadas.
3. Haz clic en **Run Bug Tracker - Sprint 1**.
4. Revisa los resultados: cada petición muestra sus assertions (tests) y si pasaron o fallaron.

## Nota importante: CP-19 (lista vacía)

El caso de prueba **CP-19** valida que `GET /api/bugs` devuelve una lista vacía. Para que pase correctamente, debe ejecutarse con la base de datos vacía (sin bugs creados). Ejecútalo por separado antes de correr el resto de la colección, o limpia la base de datos antes de esa prueba.
