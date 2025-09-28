  const cargarEjemplo = async () => {
    try {
      await creaGenero({ nombre: 'Acción', descripcion: 'Películas de acción', estado: 'Activo' });
      await creaGenero({ nombre: 'Aventura', descripcion: 'Películas de aventura', estado: 'Activo' });
      await creaGenero({ nombre: 'Ciencia Ficción', descripcion: 'Películas de ciencia ficción', estado: 'Activo' });
      await creaGenero({ nombre: 'Drama', descripcion: 'Películas dramáticas', estado: 'Activo' });
      await creaGenero({ nombre: 'Terror', descripcion: 'Películas de terror', estado: 'Activo' });
      fetchGeneros();
      Swal.fire('Datos de ejemplo cargados', '', 'success');
    } catch {
      Swal.fire('Error', 'No se pudieron cargar los datos de ejemplo', 'error');
    }
  };

import React, { useEffect, useState } from 'react';
import { obtenerGeneros, creaGenero, editarGenero, eliminarGenero } from '../../services/GeneroService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './genero.css';

const Genero = () => {
  const [generos, setGeneros] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [editId, setEditId] = useState(null);

  const fetchGeneros = async () => {
    try {
      const { data } = await obtenerGeneros();
      setGeneros(data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los géneros', 'error');
    }
  };

  useEffect(() => {
    fetchGeneros();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await editarGenero(editId, { nombre, descripcion, estado });
        Swal.fire('Actualizado', 'Género actualizado correctamente', 'success');
      } else {
        await creaGenero({ nombre, descripcion, estado });
        Swal.fire('Creado', 'Género creado correctamente', 'success');
      }
      setNombre(''); setDescripcion(''); setEstado('Activo'); setEditId(null);
      fetchGeneros();
    } catch {
      Swal.fire('Error', 'No se pudo guardar el género', 'error');
    }
  };

  const handleEdit = (genero) => {
    setNombre(genero.nombre);
    setDescripcion(genero.descripcion);
    setEstado(genero.estado);
    setEditId(genero._id);
  };

  const handleDelete = async (id) => {
    if (await Swal.fire({ title: '¿Eliminar?', text: 'No se puede deshacer', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar' }).then(r => r.isConfirmed)) {
      try {
        await eliminarGenero(id);
        Swal.fire('Eliminado', 'Género eliminado', 'success');
        fetchGeneros();
      } catch {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="genero-header text-center fade-in">
        <h1 className="display-5 fw-bold">Gestión de Géneros</h1>
        <p className="lead">Organiza y clasifica las películas y series por categorías</p>
      </div>
      
      <div className="card genero-form fade-in">
        <div className="card-body">
          <h4 className="card-title mb-4">
            <i className="bi bi-tag-fill me-2"></i>
            {editId ? 'Editar Género' : 'Nuevo Género'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="nombreGenero" 
                    placeholder="Nombre del género" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required 
                  />
                  <label htmlFor="nombreGenero">Nombre del género</label>
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="descripcionGenero" 
                    placeholder="Descripción" 
                    value={descripcion} 
                    onChange={e => setDescripcion(e.target.value)} 
                  />
                  <label htmlFor="descripcionGenero">Descripción</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-floating">
                  <select 
                    className="form-select" 
                    id="estadoGenero" 
                    value={estado} 
                    onChange={e => setEstado(e.target.value)}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                  <label htmlFor="estadoGenero">Estado</label>
                </div>
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              {editId && (
                <button 
                  className="btn btn-outline-secondary me-2 btn-icon" 
                  type="button" 
                  onClick={() => { setEditId(null); setNombre(''); setDescripcion(''); setEstado('Activo'); }}
                >
                  <i className="bi bi-x-circle"></i> Cancelar
                </button>
              )}
              <button className="btn btn-primary btn-icon" type="submit">
                <i className="bi bi-save"></i> {editId ? 'Actualizar Género' : 'Guardar Género'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {generos.length === 0 ? (
        <div className="empty-state mt-4 fade-in">
          <i className="bi bi-tags empty-state-icon"></i>
          <h3>No hay géneros registrados</h3>
          <p className="text-muted">Comienza creando un nuevo género o carga datos de ejemplo.</p>
          <button className="btn btn-primary btn-lg mt-2 btn-icon" onClick={cargarEjemplo}>
            <i className="bi bi-cloud-download"></i> Cargar datos de ejemplo
          </button>
        </div>
      ) : (
        <div className="card genero-table mt-4 fade-in">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i> 
              Lista de Géneros
            </h5>
            <span className="badge bg-primary">{generos.length} géneros</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {generos.map(g => (
                  <tr key={g._id}>
                    <td className="fw-medium">{g.nombre}</td>
                    <td>{g.descripcion || <span className="text-muted fst-italic">Sin descripción</span>}</td>
                    <td className="text-center">
                      <span className={`genero-badge badge ${g.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                        <i className={`bi bi-${g.estado === 'Activo' ? 'check-circle' : 'x-circle'} me-1`}></i>
                        {g.estado}
                      </span>
                    </td>
                    <td>
                      <div className="genero-action-buttons justify-content-center">
                        <button className="btn btn-outline-primary btn-sm btn-icon" onClick={() => handleEdit(g)}>
                          <i className="bi bi-pencil"></i> Editar
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(g._id)}>
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Genero;
