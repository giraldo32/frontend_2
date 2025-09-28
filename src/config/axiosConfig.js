import axios from "axios";

export const axiosConfig = axios.create({
   // baseURL: '/api/'  // Esto usará el proxy definido en vite.config.js
  baseURL: "https://peliculas-back-y-front-tarea-2.onrender.com"

  })

// Interceptor para manejar errores
axiosConfig.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', error);

    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error del servidor:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });

      if (error.response.status === 500) {
        console.error('Error interno del servidor. Verifica los logs del backend para más detalles.');
      } else if (error.response.status === 404) {
        console.error('Recurso no encontrado. Verifica la URL y la ruta.');
      }
    } else if (error.request) {
      // La solicitud fue enviada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor. Verifica la conexión o el estado del servidor.');
    } else {
      // Algo pasó al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }

    return Promise.reject(error);
  }
);
