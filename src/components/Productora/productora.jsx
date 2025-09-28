  const cargarEjemplo = async () => {
    try {
      await ProductoraService.createProductora({ nombre: 'Warner Bros', estado: 'Activo', slogan: 'Lo mejor del cine', descripcion: 'Productora estadounidense' });
      await ProductoraService.createProductora({ nombre: 'Disney', estado: 'Activo', slogan: 'Donde los sueños se hacen realidad', descripcion: 'Productora de animación y películas familiares' });
      await ProductoraService.createProductora({ nombre: 'Paramount', estado: 'Inactivo', slogan: 'Un mundo de entretenimiento', descripcion: 'Productora histórica de Hollywood' });
      fetchProductoras();
      Swal.fire('Datos de ejemplo cargados', '', 'success');
    } catch {
      Swal.fire('Error', 'No se pudieron cargar los datos de ejemplo', 'error');
    }
  };

import React, { useEffect, useState } from 'react';
import ProductoraService from '../../services/ProductoraService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './productora.css';

const Productora = () => {
  const [productoras, setProductoras] = useState([]);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [slogan, setSlogan] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchProductoras = async () => {
    try {
      const data = await ProductoraService.getProductoras();
      // Ordenar las productoras alfabéticamente por nombre
      const productorasOrdenadas = [...data].sort((a, b) => 
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
      );
      setProductoras(productorasOrdenadas);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las productoras', 'error');
    }
  };

  useEffect(() => {
    fetchProductoras();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await ProductoraService.updateProductora(editId, { nombre, estado, slogan, descripcion });
        Swal.fire('Actualizado', 'Productora actualizada correctamente', 'success');
      } else {
        await ProductoraService.createProductora({ nombre, estado, slogan, descripcion });
        Swal.fire('Creado', 'Productora creada correctamente', 'success');
      }
      setNombre(''); setEstado('Activo'); setSlogan(''); setDescripcion(''); setEditId(null);
      // Recargar las productoras y ordenarlas
      fetchProductoras();
    } catch {
      Swal.fire('Error', 'No se pudo guardar la productora', 'error');
    }
  };

  const handleEdit = (prod) => {
    setNombre(prod.nombre);
    setEstado(prod.estado);
    setSlogan(prod.slogan);
    setDescripcion(prod.descripcion);
    setEditId(prod._id);
  };

  const handleDelete = async (id) => {
    if (await Swal.fire({ title: '¿Eliminar?', text: 'No se puede deshacer', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar' }).then(r => r.isConfirmed)) {
      try {
        await ProductoraService.deleteProductora(id);
        Swal.fire('Eliminado', 'Productora eliminada', 'success');
        fetchProductoras();
      } catch {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="productora-header text-center fade-in">
        <h1 className="display-5 fw-bold">Gestión de Productoras</h1>
        <p className="lead">Administra las compañías productoras de cine y televisión</p>
      </div>
      
      <div className="card productora-form fade-in">
        <div className="card-body">
          <h4 className="card-title mb-4">
            <i className="bi bi-building-fill me-2"></i>
            {editId ? 'Editar Productora' : 'Nueva Productora'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="nombreProductora" 
                    placeholder="Nombre de la productora" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required 
                  />
                  <label htmlFor="nombreProductora">Nombre de la productora</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-floating mb-3">
                  <select 
                    className="form-select" 
                    id="estadoProductora" 
                    value={estado} 
                    onChange={e => setEstado(e.target.value)}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                  <label htmlFor="estadoProductora">Estado</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="sloganProductora" 
                    placeholder="Slogan" 
                    value={slogan} 
                    onChange={e => setSlogan(e.target.value)} 
                  />
                  <label htmlFor="sloganProductora">Slogan</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="descripcionProductora" 
                    placeholder="Descripción" 
                    value={descripcion} 
                    onChange={e => setDescripcion(e.target.value)} 
                  />
                  <label htmlFor="descripcionProductora">Descripción</label>
                </div>
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              {editId && (
                <button 
                  className="btn btn-outline-secondary me-2 btn-icon" 
                  type="button" 
                  onClick={() => { setEditId(null); setNombre(''); setEstado('Activo'); setSlogan(''); setDescripcion(''); }}
                >
                  <i className="bi bi-x-circle"></i> Cancelar
                </button>
              )}
              <button className="btn btn-warning btn-icon" type="submit">
                <i className="bi bi-save"></i> {editId ? 'Actualizar Productora' : 'Guardar Productora'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {productoras.length === 0 ? (
        <div className="empty-state mt-4 fade-in">
          <i className="bi bi-building empty-state-icon"></i>
          <h3>No hay productoras registradas</h3>
          <p className="text-muted">Comienza creando una nueva productora o carga datos de ejemplo.</p>
          <button className="btn btn-warning btn-lg mt-2 btn-icon" onClick={cargarEjemplo}>
            <i className="bi bi-cloud-download"></i> Cargar datos de ejemplo
          </button>
        </div>
      ) : (
        <div className="card productora-table mt-4 fade-in">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i> 
              Lista de Productoras
            </h5>
            <span className="badge bg-warning">{productoras.length} productoras</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Slogan</th>
                  <th>Descripción</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productoras.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="productora-logo-placeholder me-2">
                          {p.nombre.charAt(0)}
                        </div>
                        <span className="fw-medium">{p.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`productora-badge badge ${p.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                        <i className={`bi bi-${p.estado === 'Activo' ? 'check-circle' : 'x-circle'} me-1`}></i>
                        {p.estado}
                      </span>
                    </td>
                    <td>{p.slogan || <span className="text-muted fst-italic">Sin slogan</span>}</td>
                    <td>{p.descripcion || <span className="text-muted fst-italic">Sin descripción</span>}</td>
                    <td>
                      <div className="productora-action-buttons justify-content-center">
                        <button className="btn btn-warning btn-sm btn-icon" onClick={() => handleEdit(p)}>
                          <i className="bi bi-pencil"></i> Editar
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(p._id)}>
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

export default Productora;