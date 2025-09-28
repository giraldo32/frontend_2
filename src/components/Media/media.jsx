import React, { useEffect, useState } from 'react';
import MediaService from '../../services/MediaService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './media.css';

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
<<<<<<< HEAD
      Swal.fire('Error', 'No se pudo cargar la media', 'error');
=======
      console.error('Error fetching media:', error);
      
      let errorMessage = 'No se pudo cargar la media.';
      
      if (error.response && error.response.status === 500) {
        errorMessage = 'Error del servidor al cargar los datos. Verifica que el backend esté funcionando.';
      } else if (!error.response) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 3000.';
      }
      
      Swal.fire('Error de conexión', errorMessage, 'error');
>>>>>>> 451f9078b616761c56bb81f878e21150606a05d4
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    try {
      setLoading(true);
      if (editId) {
        await MediaService.updateMedia(editId, { titulo, sinopsis, url, anioEstreno });
        Swal.fire('Actualizado', 'Media actualizada correctamente', 'success');
      } else {
        await MediaService.createMedia({ titulo, sinopsis, url, anioEstreno });
        Swal.fire('Creado', 'Media creada correctamente', 'success');
      }
      setTitulo(''); setSinopsis(''); setUrl(''); setAnioEstreno(''); setEditId(null);
      fetchMedia();
    } catch {
      Swal.fire('Error', 'No se pudo guardar la media', 'error');
=======

    // Validar TODOS los campos obligatorios según el backend REAL
    if (!titulo || !url) {
      Swal.fire('Error', 'Por favor completa los campos obligatorios: Título y URL.', 'warning');
      return;
    }
    
    // Los campos sinopsis y anioEstreno son obligatorios pero tendrán valores por defecto si están vacíos

    // Validación de URL más flexible - acepta URLs válidas o vacías
    if (url && !/^https?:\/\/.+/i.test(url)) {
      Swal.fire('Error', 'Por favor ingresa una URL válida (debe comenzar con http:// o https://).', 'warning');
      return;
    }

    // Verificar si ya existe una película con el mismo nombre (solo al crear, no al editar)
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

    // Estructura exacta según el modelo REAL del backend
    const mediaData = {
      nombre: titulo.trim(),                              // ✅ OBLIGATORIO 
      url: url.trim(),                                   // ✅ OBLIGATORIO
      sinopsis: sinopsis.trim() || 'Sin sinopsis',      // ✅ OBLIGATORIO (con valor por defecto)
      anioEstreno: parseInt(anioEstreno, 10) || new Date().getFullYear() // ✅ OBLIGATORIO (con valor por defecto)
    };


    try {
      setLoading(true);
      if (editId) {
        await MediaService.updateMedia(editId, mediaData);
        Swal.fire('Éxito', 'Media actualizada correctamente.', 'success');
      } else {
        await MediaService.createMedia(mediaData);
        Swal.fire('Éxito', 'Media creada correctamente.', 'success');
      }
      // Refrescar la lista y limpiar el formulario
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
        // El servidor respondió con un código de error
        if (error.response.status === 500) {
          // Manejar diferentes tipos de errores del servidor
          const serverData = error.response.data;
          
          if (serverData && serverData.msj) {
            // El servidor responde con {msj: 'Error en el servidor'}
            errorMessage = `Error del servidor: ${serverData.msj}. Revisa los logs del backend para más detalles.`;
          } else if (serverData && serverData.message) {
            errorMessage = `Error del servidor: ${serverData.message}`;
          } else if (serverData && serverData.error) {
            // Podría ser un error de duplicado de MongoDB
            if (serverData.error.includes('duplicate') || serverData.error.includes('E11000')) {
              errorMessage = 'Ya existe una película/serie con ese nombre o URL. Por favor usa valores únicos.';
            } else {
              errorMessage = `Error del servidor: ${serverData.error}`;
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
        // La petición fue enviada pero no se recibió respuesta
        errorMessage = 'No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 3000.';
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        footer: error.response ? `Código de error: ${error.response.status}` : 'Sin conexión al servidor'
      });
>>>>>>> 451f9078b616761c56bb81f878e21150606a05d4
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (m) => {
<<<<<<< HEAD
    setTitulo(m.titulo);
=======
    setTitulo(m.nombre || m.titulo || ''); // Maneja tanto 'nombre' como 'titulo' por compatibilidad
>>>>>>> 451f9078b616761c56bb81f878e21150606a05d4
    setSinopsis(m.sinopsis || '');
    setUrl(m.url || '');
    setAnioEstreno(m.anioEstreno || '');
    setEditId(m._id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (await Swal.fire({ title: '¿Eliminar?', text: 'No se puede deshacer', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar' }).then(r => r.isConfirmed)) {
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
<<<<<<< HEAD
    <div className="container py-4">
      <div className="media-header text-center fade-in">
        <h1 className="display-5 fw-bold">Gestión de Media</h1>
        <p className="lead">Administra películas y series con toda su información</p>
      </div>
      
      <div className="card media-form fade-in">
        <div className="card-body">
          <h4 className="card-title mb-4">
            <i className="bi bi-film me-2"></i>
            {editId ? 'Editar Media' : 'Nueva Media'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="tituloMedia" 
                    placeholder="Título" 
                    value={titulo} 
                    onChange={e => setTitulo(e.target.value)} 
                    required 
                  />
                  <label htmlFor="tituloMedia">Título</label>
=======
    <div className="container mt-4">
      <h2 className="text-center mb-4">Media (Películas y Series)</h2>
      {loading && <div className="alert alert-info text-center">Cargando...</div>}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-3 justify-content-center">
          {/* Inputs for movie details */}
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Título *" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Sinopsis (opcional)" value={sinopsis} onChange={e => setSinopsis(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="URL * (https://...)" value={url} onChange={e => setUrl(e.target.value)} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Año (opcional)" value={anioEstreno} onChange={e => setAnioEstreno(e.target.value)} />
          </div>
          <div className="col-md-2 text-center">
            <button className="btn btn-primary w-100" type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
            {editId && <button className="btn btn-secondary w-100 mt-2" type="button" onClick={() => { setEditId(null); setTitulo(''); setSinopsis(''); setUrl(''); setAnioEstreno(''); }}>Cancelar</button>}
          </div>
        </div>
      </form>
      {media.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay media registrada.<br />
          <button className="btn btn-outline-primary mt-3" onClick={cargarEjemplo}>Cargar datos de ejemplo</button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
          {media.map(m => (
            <div className="col" key={m._id}>
              <div className="card h-100 shadow-sm">
                {m.url ? (
                  <img 
                    src={m.url} 
                    className="card-img-top" 
                    alt={m.nombre || m.titulo} 
                    style={{ objectFit: 'cover', height: '200px' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                    }}
                  />
                ) : (
                  <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '200px' }}>
                    <span className="text-muted">🎬 Sin imagen</span>
                  </div>
                )}
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{m.nombre || m.titulo}</h5>
                  <p className="card-text text-muted">{m.sinopsis}</p>
                  <p className="card-text"><small className="text-muted">Año: {m.anioEstreno}</small></p>
>>>>>>> 451f9078b616761c56bb81f878e21150606a05d4
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    id="anioEstrenoMedia" 
                    placeholder="Año de estreno" 
                    value={anioEstreno} 
                    onChange={e => setAnioEstreno(e.target.value)} 
                    min="1900" 
                    max={new Date().getFullYear()} 
                  />
                  <label htmlFor="anioEstrenoMedia">Año de estreno</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="sinopsisMedia" 
                    placeholder="Sinopsis" 
                    value={sinopsis} 
                    onChange={e => setSinopsis(e.target.value)} 
                  />
                  <label htmlFor="sinopsisMedia">Sinopsis</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input 
                    type="url" 
                    className="form-control" 
                    id="urlMedia" 
                    placeholder="URL de la imagen" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                  />
                  <label htmlFor="urlMedia">URL de la imagen</label>
                </div>
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              {editId && (
                <button 
                  className="btn btn-outline-secondary me-2 btn-icon" 
                  type="button" 
                  onClick={() => { setEditId(null); setTitulo(''); setSinopsis(''); setUrl(''); setAnioEstreno(''); }}
                >
                  <i className="bi bi-x-circle"></i> Cancelar
                </button>
              )}
              <button className="btn btn-primary btn-icon" type="submit">
                <i className="bi bi-save"></i> {editId ? 'Actualizar Media' : 'Guardar Media'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {media.length === 0 ? (
        <div className="empty-state mt-4 fade-in">
          <i className="bi bi-film empty-state-icon"></i>
          <h3>No hay media registrada</h3>
          <p className="text-muted">Comienza creando una nueva película o serie, o carga datos de ejemplo.</p>
          <button className="btn btn-primary btn-lg mt-2 btn-icon" onClick={cargarEjemplo}>
            <i className="bi bi-cloud-download"></i> Cargar datos de ejemplo
          </button>
        </div>
      ) : (
        <div className="mt-4 fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              <i className="bi bi-collection-play me-2"></i>
              Catálogo de Media
            </h4>
            <span className="badge bg-primary">{media.length} elementos</span>
          </div>
          
          <div className="media-grid">
            {media.map(m => (
              <div key={m._id} className="card media-card">
                {m.url ? (
                  <div className="position-relative">
                    <img 
                      src={m.url} 
                      className="card-img-top" 
                      alt={m.titulo} 
                      style={{ objectFit: 'cover', height: '200px' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                      }}
                    />
                    <div className="card-img-overlay">
                      <div className="d-flex justify-content-end mt-auto mb-2">
                        <button 
                          className="btn btn-primary btn-sm me-2 action-button" 
                          onClick={() => handleEdit(m)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button 
                          className="btn btn-danger btn-sm action-button" 
                          onClick={() => handleDelete(m._id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '200px' }}>
                    <span className="text-muted"><i className="bi bi-camera-video fs-1"></i></span>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title fw-bold">{m.titulo}</h5>
                  <p className="card-text text-muted small">{m.sinopsis || <span className="fst-italic">Sin sinopsis</span>}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-secondary">{m.anioEstreno}</span>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-1" onClick={() => handleEdit(m)}>
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(m._id)}>
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
<<<<<<< HEAD
=======
// FIN DEL CÓDIGO
>>>>>>> 451f9078b616761c56bb81f878e21150606a05d4
