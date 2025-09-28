import React, { useEffect, useState } from 'react';
import MediaService from '../../services/MediaService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Media = () => {
  const [media, setMedia] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [url, setUrl] = useState('');
  const [anioEstreno, setAnioEstreno] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarEjemplo = async () => {
    try {
      setLoading(true);
      await MediaService.createMedia({ nombre: 'Inception', sinopsis: 'Un ladrón que roba secretos a través de sueños.', url: 'https://ejemplo.com/inception', anioEstreno: 2010 });
      await MediaService.createMedia({ nombre: 'El Rey León', sinopsis: 'Un león joven debe reclamar su trono.', url: 'https://ejemplo.com/rey-leon', anioEstreno: 1994 });
      fetchMedia();
      Swal.fire('Datos de ejemplo cargados', '', 'success');
    } catch {
      Swal.fire('Error', 'No se pudieron cargar los datos de ejemplo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await MediaService.getMedia();
      setMedia(data);
    } catch (error) {
      console.error('Error fetching media:', error);
      
      let errorMessage = 'No se pudo cargar la media.';
      
      if (error.response && error.response.status === 500) {
        errorMessage = 'Error del servidor al cargar los datos. Verifica que el backend esté funcionando.';
      } else if (!error.response) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 3000.';
      }
      
      Swal.fire('Error de conexión', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!titulo || !url) {
      Swal.fire('Error', 'Por favor completa los campos obligatorios: Título y URL.', 'warning');
      return;
    }

    // Validación de URL
    if (!/^https?:\/\/.+/.test(url)) {
      Swal.fire('Error', 'Por favor ingresa una URL válida para la imagen.', 'warning');
      return;
    }

    // Verificar duplicados (solo al crear)
    if (!editId) {
      const existeNombre = media.find(m => m.nombre && m.nombre.toLowerCase() === titulo.toLowerCase());
      if (existeNombre) {
        Swal.fire('Error', 'Ya existe una película/serie con ese nombre. Por favor usa un título único.', 'warning');
        return;
      }

      const existeUrl = media.find(m => m.url === url);
      if (existeUrl) {
        Swal.fire('Error', 'Ya existe una película/serie con esa URL. Por favor usa una URL única.', 'warning');
        return;
      }
    }

    // Estructura exacta según el modelo del backend
    const mediaData = {
      nombre: titulo.trim(),
      url: url.trim(),
      sinopsis: sinopsis.trim() || 'Sin sinopsis',
      anioEstreno: parseInt(anioEstreno, 10) || new Date().getFullYear()
    };

    console.log('Datos que se envían al backend:', mediaData);

    try {
      setLoading(true);
      if (editId) {
        await MediaService.updateMedia(editId, mediaData);
        Swal.fire('Éxito', 'Media actualizada correctamente.', 'success');
      } else {
        await MediaService.createMedia(mediaData);
        Swal.fire('Éxito', 'Media creada correctamente.', 'success');
      }
      
      // Limpiar formulario y recargar datos
      fetchMedia();
      setTitulo('');
      setSinopsis('');
      setUrl('');
      setAnioEstreno('');
      setEditId(null);
    } catch (error) {
      console.error('Error al guardar la media:', error);
      
      let errorMessage = 'Hubo un error al guardar la media.';
      
      if (error.response) {
        if (error.response.status === 500) {
          if (error.response.data && error.response.data.msj) {
            errorMessage = `Error del servidor: ${error.response.data.msj}. Revisa los logs del backend para más detalles.`;
          } else if (error.response.data && error.response.data.message) {
            errorMessage = `Error del servidor: ${error.response.data.message}`;
          } else if (error.response.data && error.response.data.error) {
            if (error.response.data.error.includes('duplicate') || error.response.data.error.includes('E11000')) {
              errorMessage = 'Ya existe una película/serie con ese nombre o URL. Por favor usa valores únicos.';
            } else {
              errorMessage = `Error del servidor: ${error.response.data.error}`;
            }
          } else {
            errorMessage = 'Error interno del servidor. Verifica los logs del backend.';
          }
        } else if (error.response.status === 404) {
          errorMessage = 'Endpoint no encontrado. Verifica la configuración del servidor.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = `Error del servidor: ${error.response.data.message}`;
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 3000.';
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        footer: error.response ? `Código de error: ${error.response.status}` : 'Sin conexión al servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (m) => {
    setTitulo(m.nombre || m.titulo || '');
    setSinopsis(m.sinopsis || '');
    setUrl(m.url || '');
    setAnioEstreno(m.anioEstreno || '');
    setEditId(m._id);
  };

  const handleDelete = async (id) => {
    if (await Swal.fire({ 
      title: '¿Eliminar?', 
      text: 'No se puede deshacer', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonText: 'Sí, eliminar' 
    }).then(r => r.isConfirmed)) {
      try {
        setLoading(true);
        await MediaService.deleteMedia(id);
        Swal.fire('Eliminado', 'Media eliminada', 'success');
        fetchMedia();
      } catch {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Media (Películas y Series)</h2>
      {loading && <div className="alert alert-info text-center">Cargando...</div>}
      
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-3 justify-content-center">
          <div className="col-md-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Título *" 
              value={titulo} 
              onChange={e => setTitulo(e.target.value)} 
              required 
            />
          </div>
          <div className="col-md-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Sinopsis (opcional)" 
              value={sinopsis} 
              onChange={e => setSinopsis(e.target.value)} 
            />
          </div>
          <div className="col-md-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="URL * (https://...)" 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              required 
            />
          </div>
          <div className="col-md-2">
            <input 
              type="number" 
              className="form-control" 
              placeholder="Año (opcional)" 
              value={anioEstreno} 
              onChange={e => setAnioEstreno(e.target.value)} 
            />
          </div>
          <div className="col-md-2 text-center">
            <button className="btn btn-primary w-100" type="submit">
              {editId ? 'Actualizar' : 'Agregar'}
            </button>
            {editId && (
              <button 
                className="btn btn-secondary w-100 mt-2" 
                type="button" 
                onClick={() => { 
                  setEditId(null); 
                  setTitulo(''); 
                  setSinopsis(''); 
                  setUrl(''); 
                  setAnioEstreno(''); 
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>
      
      {media.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay media registrada.<br />
          <button className="btn btn-outline-primary mt-3" onClick={cargarEjemplo}>
            Cargar datos de ejemplo
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
          {media.map(m => (
            <div className="col" key={m._id}>
              <div className="card h-100 shadow-sm">
                <img 
                  src={m.url} 
                  className="card-img-top" 
                  alt={m.nombre || m.titulo} 
                  style={{ objectFit: 'cover', height: '200px' }} 
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{m.nombre || m.titulo}</h5>
                  <p className="card-text text-muted">{m.sinopsis}</p>
                  <p className="card-text">
                    <small className="text-muted">Año: {m.anioEstreno}</small>
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button 
                    className="btn btn-warning btn-sm" 
                    onClick={() => handleEdit(m)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDelete(m._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Media;