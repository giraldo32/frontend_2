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
    if (error.response && error.response.status === 500) {
      console.error('Error del servidor:', error.response.data);
    }
    return Promise.reject(error);
  }
);
