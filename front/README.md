# Documentación del Front

## Descripción general

Este front es una interfaz web ligera para consultar datos obtenidos por scraping desde el backend del proyecto. No usa frameworks como React, Vue o Angular; está construido con HTML, CSS y JavaScript puro.

Su función principal es permitir tres tipos de consulta:

- Cargar productos de hombres.
- Cargar productos de mujeres.
- Consultar el stock o disponibilidad de un producto a partir de una URL personalizada.

## Tecnologías utilizadas

- HTML5: estructura de la interfaz.
- CSS3: estilos visuales, diseño responsive y componentes de presentación.
- JavaScript: lógica de interacción, consumo de API y renderizado dinámico de resultados.
- Google Fonts: tipografías `Space Grotesk` e `IBM Plex Mono`.

## Estructura de archivos

- `index.html`: define la estructura visual principal del front.
- `styles.css`: contiene toda la capa de presentación.
- `app.js`: contiene la lógica funcional, conexión con la API y renderizado de datos.

## Estructura de la interfaz

La interfaz está organizada en cuatro bloques principales:

- Encabezado o hero: presenta el nombre de la aplicación y una breve descripción.
- Controles: botones para consultas rápidas y un campo para consultas personalizadas.
- Estado: muestra mensajes de progreso, error o confirmación.
- Resultados: renderiza las tarjetas de productos o el listado de stock devuelto por la API.

## Flujo de funcionamiento

1. El usuario pulsa uno de los botones o ingresa una URL personalizada.
2. JavaScript envía una petición `fetch` al backend en `http://127.0.0.1:8000`.
3. La respuesta JSON se valida y se transforma en elementos visuales.
4. El front actualiza el estado y muestra el contenido en la sección de resultados.

## Funciones importantes de `app.js`

### `fetchJson(endpoint)`
Realiza la petición HTTP al backend, valida la respuesta y devuelve el JSON. Es la base de toda la comunicación con la API.

### `cargarProductosHombres()`
Consulta el endpoint `/productoshombres` y renderiza el listado de productos masculinos.

### `cargarProductosMujer()`
Consulta el endpoint `/productosmujer` y renderiza el listado de productos femeninos.

### `consultarPersonalizado()`
Toma la URL escrita por el usuario, la envía al endpoint `/personalizado?url=...` y muestra el resultado de stock o disponibilidad.

### `renderProducts(title, products)`
Convierte una lista de productos en tarjetas visuales con nombre, precio y disponibilidad de más colores.

### `renderStock(stockObj)`
Convierte el objeto devuelto por la consulta personalizada en una lista ordenada de campos y valores.

### `setStatus(message, isError = false)`
Actualiza la barra de estado para informar si una consulta está en curso, completada o fallida.

### `saveUrlToHistory(url)` y `renderUrlHistorySelect()`
Administran el historial local de URLs consultadas anteriormente, permitiendo reutilizarlas desde un selector.

### `escapeHtml(text)`
Evita que el contenido inyectado en el DOM rompa el HTML o introduzca código no deseado.

## Elementos clave de `index.html`

- `#btn-hombres`: dispara la consulta de productos de hombres.
- `#btn-mujer`: dispara la consulta de productos de mujeres.
- `#url-input`: recibe una URL personalizada para consultar stock.
- `#url-history-select`: permite reutilizar URLs consultadas antes.
- `#status`: muestra mensajes de estado.
- `#results`: contenedor principal de resultados.

## Aspectos destacados de `styles.css`

- Usa variables CSS para mantener consistencia de colores y sombras.
- Aplica un diseño visual con gradientes, tarjeta central y fondo decorativo.
- Incluye un comportamiento responsive para pantallas pequeñas.
- Da estilo diferenciado a botones, tarjetas de producto, lista de stock y barra de estado.

## Dependencia del backend

El front depende de que el backend esté corriendo en `http://127.0.0.1:8000` y exponga los siguientes endpoints:

- `/productoshombres`
- `/productosmujer`
- `/personalizado?url=...`

Si el backend no está disponible, las consultas mostrarán error en la barra de estado.

## Resumen

Este front actúa como una capa de visualización y consulta. Su valor principal está en simplificar la interacción con los scrapers del backend, mostrando los datos de forma ordenada, clara y reutilizable sin necesidad de frameworks adicionales.