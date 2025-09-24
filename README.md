# Aplicación Web de Gestión de Películas

## Descripción
Esta aplicación permite gestionar películas y series en modo administrador. Incluye módulos para gestionar géneros, directores, productoras, tipos y medios (películas y series).

## Tecnologías Utilizadas
- **Frontend**: ReactJS, React Router, Axios, Bootstrap
- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB

## Funcionalidades
- **Género**: Registrar, editar, eliminar y listar géneros.
- **Director**: Registrar, editar, eliminar y listar directores.
- **Productora**: Registrar, editar, eliminar y listar productoras.
- **Tipo**: Registrar, editar, eliminar y listar tipos.
- **Media**: Registrar, editar, eliminar y listar películas y series.

## Instalación
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar el archivo `.env` con las variables de entorno necesarias.
4. Iniciar el backend:
   ```bash
   npm run start
   ```
5. Iniciar el frontend:
   ```bash
   npm run dev
   ```

## Estructura del Proyecto
- **Backend**: Contiene las rutas, controladores y modelos para la API REST.
- **Frontend**: Contiene los componentes y servicios para la interfaz de usuario.

## Próximos Pasos
- Implementar autenticación y autorización.
- Mejorar el diseño de la interfaz de usuario.
- Desplegar la aplicación en un servidor en la nube.
