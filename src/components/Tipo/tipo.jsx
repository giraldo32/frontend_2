  const cargarEjemplo = async () => {
    try {
      await TipoService.createTipo({ nombre: 'Película', descripcion: 'Largometraje' });
      await TipoService.createTipo({ nombre: 'Serie', descripcion: 'Serie de TV' });
      fetchTipos();
      Swal.fire('Datos de ejemplo cargados', '', 'success');
    } catch {
      Swal.fire('Error', 'No se pudieron cargar los datos de ejemplo', 'error');
    }
  };

import React, { useEffect, useState } from 'react';
import TipoService from '../../services/TipoService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './tipo.css';

const Tipo = () => {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchTipos = async () => {
    try {
      const data = await TipoService.getTipos();
      setTipos(data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los tipos', 'error');
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await TipoService.updateTipo(editId, { nombre, descripcion });
        Swal.fire('Actualizado', 'Tipo actualizado correctamente', 'success');
      } else {
        await TipoService.createTipo({ nombre, descripcion });
        Swal.fire('Creado', 'Tipo creado correctamente', 'success');
      }
      setNombre(''); setDescripcion(''); setEditId(null);
      fetchTipos();
    } catch {
      Swal.fire('Error', 'No se pudo guardar el tipo', 'error');
    }
  };

  const handleEdit = (tipo) => {
    setNombre(tipo.nombre);
    setDescripcion(tipo.descripcion);
    setEditId(tipo._id);
  };

  const handleDelete = async (id) => {
    try {
      const tipoAEliminar = tipos.find(t => t._id === id);
      
      // Intentar obtener medias que usan este tipo
      const { data: mediasRelacionadas } = await TipoService.checkTipoUsage(id);
      
      if (mediasRelacionadas && mediasRelacionadas.length > 0) {
        // Obtener la lista de otros tipos disponibles para reasignar
        const tiposDisponibles = tipos.filter(t => t._id !== id);
        
        // Construir opciones para el selector
        const tipoOptions = tiposDisponibles.map(t => 
          `<option value="${t._id}">${t.nombre}</option>`
        ).join('');
        
        // Mostrar diálogo con opciones para eliminar
        const result = await Swal.fire({
          title: 'Tipo en uso',
          html: `
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              El tipo <b>${tipoAEliminar.nombre}</b> está siendo utilizado por ${mediasRelacionadas.length} registro(s) de media
            </div>
            <p>¿Qué acción deseas realizar?</p>
            <div class="form-check mb-3">
              <input class="form-check-input" type="radio" name="deleteOption" id="reasignarOption" value="reasignar" checked>
              <label class="form-check-label text-start" for="reasignarOption">
                Reasignar las medias a otro tipo:
              </label>
              <select id="tipoReemplazo" class="form-select mt-2">
                ${tipoOptions}
              </select>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="deleteOption" id="forzarOption" value="forzar">
              <label class="form-check-label text-start" for="forzarOption">
                <span class="text-danger">Eliminar de todas formas</span> <span class="text-muted small">(No recomendado)</span>
              </label>
            </div>
          `,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#0d6efd',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const option = document.querySelector('input[name="deleteOption"]:checked').value;
            const tipoReemplazoId = document.getElementById('tipoReemplazo').value;
            return { option, tipoReemplazoId };
          }
        });
        
        if (result.isConfirmed) {
          const { option, tipoReemplazoId } = result.value;
          
          if (option === 'reasignar') {
            // Reasignar medias al tipo seleccionado y luego eliminar
            await TipoService.reasignarYEliminarTipo(id, tipoReemplazoId, mediasRelacionadas);
            Swal.fire('Completado', `El tipo ha sido eliminado y las medias han sido reasignadas correctamente.`, 'success');
          } else if (option === 'forzar') {
            // Confirmar eliminación forzada
            const confirmacion = await Swal.fire({
              title: '¿Estás seguro?',
              text: `Esto eliminará el tipo "${tipoAEliminar.nombre}" y podría causar problemas en los registros de media asociados.`,
              icon: 'error',
              showCancelButton: true,
              confirmButtonText: 'Sí, eliminar de todas formas',
              confirmButtonColor: '#dc3545',
              cancelButtonText: 'Cancelar'
            });
            
            if (confirmacion.isConfirmed) {
              await TipoService.deleteTipoForzado(id);
              Swal.fire('Eliminado', 'El tipo ha sido eliminado forzosamente.', 'success');
            }
          }
          // Actualizar la lista de tipos
          fetchTipos();
        }
        
        return;
      }
      
      // Si no hay medias relacionadas, procedemos con la eliminación normal
      const confirmacion = await Swal.fire({ 
        title: '¿Eliminar?', 
        text: `¿Estás seguro de eliminar el tipo "${tipoAEliminar.nombre}"?`, 
        icon: 'warning', 
        showCancelButton: true, 
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      
      if (confirmacion.isConfirmed) {
        await TipoService.deleteTipo(id);
        Swal.fire('Eliminado', 'El tipo ha sido eliminado correctamente', 'success');
        fetchTipos();
      }
    } catch (error) {
      console.error('Error al eliminar tipo:', error);
      const mensaje = error.response?.data?.message || 'No se pudo eliminar el tipo. Intente nuevamente más tarde.';
      Swal.fire('Error', mensaje, 'error');
    }
  };

  return (
    <div className="container py-4">
      <div className="tipo-header text-center fade-in">
        <h1 className="display-5 fw-bold">Gestión de Tipos</h1>
        <p className="lead">Clasifica y organiza tus películas y series según su formato</p>
      </div>
      
      <div className="card tipo-form fade-in">
        <div className="card-body">
          <h4 className="card-title mb-4">
            <i className="bi bi-collection-fill me-2"></i>
            {editId ? 'Editar Tipo' : 'Nuevo Tipo'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-5">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="nombreTipo" 
                    placeholder="Nombre del tipo" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required 
                  />
                  <label htmlFor="nombreTipo">Nombre del tipo</label>
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="descripcionTipo" 
                    placeholder="Descripción" 
                    value={descripcion} 
                    onChange={e => setDescripcion(e.target.value)} 
                  />
                  <label htmlFor="descripcionTipo">Descripción</label>
                </div>
              </div>
              <div className="col-md-2 d-flex align-items-center">
                <div className="w-100">
                  <button className="btn btn-info btn-icon w-100" type="submit">
                    <i className="bi bi-save"></i> {editId ? 'Actualizar' : 'Guardar'}
                  </button>
                  {editId && (
                    <button 
                      className="btn btn-outline-secondary btn-icon w-100 mt-2" 
                      type="button" 
                      onClick={() => { setEditId(null); setNombre(''); setDescripcion(''); }}
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
      {tipos.length === 0 ? (
        <div className="empty-state mt-4 fade-in">
          <i className="bi bi-collection empty-state-icon"></i>
          <h3>No hay tipos registrados</h3>
          <p className="text-muted">Comienza creando un nuevo tipo o carga datos de ejemplo.</p>
          <button className="btn btn-info btn-lg mt-2 btn-icon" onClick={cargarEjemplo}>
            <i className="bi bi-cloud-download"></i> Cargar datos de ejemplo
          </button>
        </div>
      ) : (
        <div className="card tipo-table mt-4 fade-in">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i> 
              Lista de Tipos
            </h5>
            <span className="badge bg-info">{tipos.length} tipos</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tipos.map(t => (
                  <tr key={t._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="tipo-icon">
                          <i className="bi bi-collection"></i>
                        </div>
                        <span className="fw-medium">{t.nombre}</span>
                      </div>
                    </td>
                    <td>{t.descripcion || <span className="text-muted fst-italic">Sin descripción</span>}</td>
                    <td>
                      <div className="tipo-action-buttons justify-content-center">
                        <button className="btn btn-info btn-sm btn-icon" onClick={() => handleEdit(t)}>
                          <i className="bi bi-pencil"></i> Editar
                        </button>
                        <button 
                          className="btn btn-danger btn-sm btn-icon" 
                          onClick={() => handleDelete(t._id)}
                          title={`Eliminar ${t.nombre}`}
                        >
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

export default Tipo;