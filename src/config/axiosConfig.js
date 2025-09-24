import axios from "axios";

export const axiosConfig = axios.create({
    baseURL: 'http://localhost:3000/'
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
