import axios from "axios";

export const axiosConfig = axios.create({
    baseURL: '/api/',  // Esto usará el proxy definido en vite.config.js
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Interceptor para ver qué se está enviando
axiosConfig.interceptors.request.use(
  config => {
    console.log('🚀 REQUEST CONFIG:', config);
    console.log('🚀 REQUEST URL:', config.url);
    console.log('🚀 REQUEST METHOD:', config.method);
    console.log('🚀 REQUEST HEADERS:', config.headers);
    console.log('🚀 REQUEST DATA:', config.data);
    return config;
  },
  error => Promise.reject(error)
);

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
