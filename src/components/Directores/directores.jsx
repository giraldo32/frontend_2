import React, { useEffect, useState } from 'react';
import DirectoresService from '../../services/DirectoresService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container mt-4">
      <h2 className="text-center mb-4">Directores</h2>
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-3 justify-content-center">
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="col-md-2 text-center">
            <button className="btn btn-primary w-100" type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
            {editId && <button className="btn btn-secondary w-100 mt-2" type="button" onClick={() => { setEditId(null); setNombre(''); setEstado('Activo'); }}>Cancelar</button>}
          </div>
        </div>
      </form>
      {directores.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay directores registrados.<br />
          <button className="btn btn-outline-primary mt-3" onClick={cargarEjemplo}>Cargar datos de ejemplo</button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
          {directores.map(director => (
            <div className="col" key={director._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{director.nombre}</h5>
                  <p className="card-text"><small className="text-muted">Estado: {director.estado}</small></p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button className="btn btn-warning btn-sm" onClick={() => handleEdit(director)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(director._id)}>Eliminar</button>
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