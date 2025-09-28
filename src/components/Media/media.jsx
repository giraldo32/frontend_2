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
      await MediaService.createMedia({ titulo: 'Inception', sinopsis: 'Un ladrón que roba secretos a través de sueños.', url: 'https://ejemplo.com/inception', anioEstreno: 2010 });
      await MediaService.createMedia({ titulo: 'El Rey León', sinopsis: 'Un león joven debe reclamar su trono.', url: 'https://ejemplo.com/rey-leon', anioEstreno: 1994 });
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
      Swal.fire('Error', 'No se pudo cargar la media. Verifica la consola para más detalles.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !url || !anioEstreno) {
      Swal.fire('Error', 'Por favor completa todos los campos obligatorios.', 'warning');
      return;
    }

    // Validación de URL más flexible - acepta URLs válidas o vacías
    if (url && !/^https?:\/\/.+/i.test(url)) {
      Swal.fire('Error', 'Por favor ingresa una URL válida (debe comenzar con http:// o https://).', 'warning');
      return;
    }

    const newMedia = {
      titulo,
      sinopsis,
      url,
      anioEstreno: parseInt(anioEstreno, 10),
    };

    try {
      setLoading(true);
      if (editId) {
        await MediaService.updateMedia(editId, newMedia);
        Swal.fire('Éxito', 'Media actualizada correctamente.', 'success');
      } else {
        await MediaService.createMedia(newMedia);
        Swal.fire('Éxito', 'Media creada correctamente.', 'success');
      }
      setTitulo('');
      setSinopsis('');
      setUrl('');
      setAnioEstreno('');
      setEditId(null);
      fetchMedia();
    } catch (error) {
      console.error('Error al guardar la media:', error);
      Swal.fire('Error', 'Hubo un error al guardar la media. Por favor, intenta nuevamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (m) => {
    setTitulo(m.titulo || '');
    setSinopsis(m.sinopsis || '');
    setUrl(m.url || '');
    setAnioEstreno(m.anioEstreno || '');
    setEditId(m._id);
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
    <div className="container mt-4">
      <h2 className="text-center mb-4">Media (Películas y Series)</h2>
      {loading && <div className="alert alert-info text-center">Cargando...</div>}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-3 justify-content-center">
          {/* Inputs for movie details */}
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Sinopsis" value={sinopsis} onChange={e => setSinopsis(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input type="url" className="form-control" placeholder="URL de imagen (opcional)" value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Año Estreno" value={anioEstreno} onChange={e => setAnioEstreno(e.target.value)} />
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
                    alt={m.titulo} 
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
                  <h5 className="card-title text-primary">{m.titulo}</h5>
                  <p className="card-text text-muted">{m.sinopsis}</p>
                  <p className="card-text"><small className="text-muted">Año: {m.anioEstreno}</small></p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button className="btn btn-warning btn-sm" onClick={() => handleEdit(m)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}>Eliminar</button>
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