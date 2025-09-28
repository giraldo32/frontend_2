import React, { useEffect, useState } from 'react';
import DirectoresService from '../../services/DirectoresService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './directores.css';

const Directores = () => {
  const [directores, setDirectores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [editId, setEditId] = useState(null);

  const fetchDirectores = async () => {
    try {
      const data = await DirectoresService.getDirectors();
      setDirectores(data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los directores', 'error');
    }
  };

  useEffect(() => {
    fetchDirectores();
  }, []);

  const cargarEjemplo = async () => {
    try {
      await DirectoresService.createDirector({ nombres: 'Steven Spielberg', estado: 'Activo' });
      await DirectoresService.createDirector({ nombres: 'Christopher Nolan', estado: 'Activo' });
      await DirectoresService.createDirector({ nombres: 'Sofia Coppola', estado: 'Inactivo' });
      fetchDirectores();
      Swal.fire('Datos de ejemplo cargados', '', 'success');
    } catch {
      Swal.fire('Error', 'No se pudieron cargar los datos de ejemplo', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await DirectoresService.updateDirector(editId, { nombres: nombre, estado });
        Swal.fire('Actualizado', 'Director actualizado correctamente', 'success');
      } else {
        await DirectoresService.createDirector({ nombres: nombre, estado });
        Swal.fire('Creado', 'Director creado correctamente', 'success');
      }
      setNombre('');
      setEstado('Activo');
      setEditId(null);
      fetchDirectores();
    } catch {
      Swal.fire('Error', 'No se pudo guardar el director', 'error');
    }
  };

  const handleEdit = (director) => {
    setNombre(director.nombres);
    setEstado(director.estado);
    setEditId(director._id);
  };

  const handleDelete = async (id) => {
    if (await Swal.fire({ title: '¿Eliminar?', text: 'No se puede deshacer', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar' }).then(r => r.isConfirmed)) {
      try {
        await DirectoresService.deleteDirector(id);
        Swal.fire('Eliminado', 'Director eliminado', 'success');
        fetchDirectores();
      } catch {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="directores-header text-center fade-in">
        <h1 className="display-5 fw-bold">Directores de Cine</h1>
        <p className="lead">Gestiona información sobre los directores de tus películas favoritas</p>
        <span className="director-count">{directores.length} directores registrados</span>
      </div>
      
      <div className="card director-form fade-in">
        <div className="card-body">
          <h4 className="card-title mb-4">
            <i className="bi bi-person-video3 me-2"></i>
            {editId ? 'Editar Director' : 'Nuevo Director'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-md-7">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="nombreDirector" 
                    placeholder="Nombre completo" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required 
                  />
                  <label htmlFor="nombreDirector">Nombre completo</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-floating">
                  <select 
                    className="form-select" 
                    id="estadoDirector" 
                    value={estado} 
                    onChange={e => setEstado(e.target.value)}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                  <label htmlFor="estadoDirector">Estado</label>
                </div>
              </div>
              <div className="col-md-2">
                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-icon" type="submit">
                    <i className="bi bi-check-circle"></i> {editId ? 'Actualizar' : 'Guardar'}
                  </button>
                  {editId && (
                    <button 
                      className="btn btn-outline-secondary btn-icon" 
                      type="button" 
                      onClick={() => { setEditId(null); setNombre(''); setEstado('Activo'); }}
                    >
                      <i className="bi bi-x-circle"></i> Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {directores.length === 0 ? (
        <div className="empty-state mt-4 fade-in">
          <i className="bi bi-person-video3 empty-state-icon"></i>
          <h3>No hay directores registrados</h3>
          <p className="text-muted">Agrega directores para organizar mejor tu catálogo de películas</p>
          <button className="btn btn-primary btn-lg mt-3 btn-icon" onClick={cargarEjemplo}>
            <i className="bi bi-cloud-download"></i> Cargar datos de ejemplo
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
          {directores.map(director => (
            <div className="col fade-in" key={director._id}>
              <div className="card h-100 director-card">
                <div className="card-body text-center">
                  <div className="director-avatar">
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <h4 className="director-name">{director.nombres}</h4>
                  <p className="mb-3">
                    <span className={`director-status ${director.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                      <i className={`bi bi-${director.estado === 'Activo' ? 'check-circle-fill' : 'x-circle-fill'}`}></i>
                      {director.estado}
                    </span>
                  </p>
                  <div className="director-action-buttons">
                    <button 
                      className="btn btn-outline-primary btn-sm btn-icon flex-grow-1" 
                      onClick={() => handleEdit(director)}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm btn-icon flex-grow-1" 
                      onClick={() => handleDelete(director._id)}
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Directores;