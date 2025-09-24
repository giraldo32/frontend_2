import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';

// Configurar un interceptor global para mostrar errores de red
import axios from 'axios';
import Swal from 'sweetalert2';

// Agregar interceptores para mostrar mensajes de error comunes
axios.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      Swal.fire({
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Asegúrese de que la API está ejecutándose.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
