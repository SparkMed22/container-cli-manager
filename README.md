# Container CLI Manager

Una herramienta de línea de comandos (CLI) interactiva y moderna para gestionar contenedores mediante un archivo JSON. Construida con **Node.js**, **ES Modules** y **@clack/prompts** para ofrecer una experiencia de usuario fluida y visualmente atractiva.

## 🚀 Características

-   **Interfaz Interactiva**: Menús dinámicos y validación de entradas en tiempo real.
-   **CRUD Completo**: Crear, Leer, Actualizar y Borrar registros de contenedores.
-   **Identificación Flexible**: Búsqueda y borrado utilizando solo los últimos 5 dígitos del ID.
-   **Persistencia en JSON**: Los datos se guardan localmente en un archivo configurable.
-   **Modularidad**: Código organizado en archivos separados (Config, Utils, Actions) para fácil mantenimiento.
-   **Configuración Dinámica**: Soporte para variables de entorno mediante `.env`.

## 📁 Estructura del Proyecto

```text
.
├── actions.js        # Lógica de negocio (Agregar, Ver, Actualizar, Borrar)
├── config.js         # Constantes, temas y opciones de menú
├── fileUtils.js      # Utilidades para lectura/escritura de archivos JSON
├── main.js           # Punto de entrada y ciclo principal del CLI
├── .env.example      # Plantilla de variables de entorno
├── package.json      # Dependencias y scripts
└── README.md         # Documentación del proyecto
```

> *Nota: El archivo de datos (`file.json` o el configurado) se genera automáticamente al primer uso.*

## 🛠️ Requisitos

-   Node.js (versión 18 o superior recomendada para soporte nativo de ES Modules).
-   npm o yarn.

## ⚙️ Instalación

1.  **Clona el repositorio** o descarga los archivos:
    ```bash
    git clone git@github.com:SparkMed22/container-cli-manager.git
    cd container-cli-manager
    ```

2.  **Instala las dependencias**:
    ```bash
    npm install
    ```

3.  **Configura el archivo de entorno**:
    Copia el ejemplo y define la ruta de tu archivo JSON:
    ```bash
    cp .env.example .env
    ```
    
    Edita `.env` y define la ruta deseada:
    ```env
    JSON_FILE_PATH=./data/containers.json
    ```
    *(Asegúrate de que la carpeta `data` exista o el script la creará automáticamente).*

## 📖 Uso

Ejecuta la aplicación con el siguiente comando:

```bash
npm start
```

O directamente:
```bash
node main.js
```

### Menú de Acciones

Al iniciar, verás el siguiente menú interactivo:

```text
┌  Bienvenido al CLI Personalizado
│
◆  Elige una acción:
│  ● Agregar (Nuevo contenedor)
│  ○ Actualizar (Editar datos)
│  ○ Ver (Mostrar lista)
│  ○ Borrar (Eliminar registro)
│  ○ Salir (Terminar programa)
│  ↑/↓ to navigate • Enter: confirm
└
```

#### Funcionalidades:

1.  **Agregar**:
    -   Ingresa nombre, descripción y puerto.
    -   Valida que el puerto esté en el rango 1-65535.
    -   Genera un ID único automáticamente.

2.  **Ver**:
    -   Muestra una tabla formateada con todos los contenedores.
    -   Muestra ID (últimos 6 dígitos), nombre, descripción, puerto y fecha de creación.

3.  **Actualizar**:
    -   Ingresa los **últimos 5 dígitos** del ID del contenedor a editar.
    -   Selecciona qué campo modificar (Nombre, Descripción o Puerto).
    -   Actualiza el registro preservando el resto de la información.

4.  **Borrar**:
    -   Ingresa los **últimos 5 dígitos** del ID.
    -   Confirma la eliminación mostrando el nombre del contenedor para evitar errores.
    -   Elimina el registro permanentemente del JSON.

## 🧩 Tecnologías Utilizadas

-   **Node.js**: Entorno de ejecución.
-   **@clack/prompts**: Librería para crear prompts de terminal interactivos y estéticos.
-   **dotenv**: Gestión de variables de entorno.
-   **fs/promises**: Sistema de archivos asíncrono nativo.
-   **ES Modules**: Importación/Exportación moderna de módulos.

## 📝 Formato de Datos (JSON)

Los datos se almacenan en el archivo especificado en `.env`:

```json
{
  "containers": [
    {
      "id": 1784259543326,
      "nombre": "Servidor SQL",
      "descripcion": "Servidor Fijo para SQL_SERVER",
      "puerto": 2026,
      "creadoEn": "2026-07-17T03:39:03.326Z"
    }
  ]
}
```
