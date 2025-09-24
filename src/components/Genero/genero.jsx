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
    <div className="container mt-4">
      <h2>Géneros</h2>
      <form className="mb-3" onSubmit={handleSubmit}>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <input type="text" className="form-control" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div className="col-auto">
            <input type="text" className="form-control" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>
          <div className="col-auto">
            <select className="form-select" value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
            {editId && <button className="btn btn-secondary ms-2" type="button" onClick={() => { setEditId(null); setNombre(''); setDescripcion(''); setEstado('Activo'); }}>Cancelar</button>}
          </div>
        </div>
      </form>
      {generos.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay géneros registrados.<br />
          <button className="btn btn-outline-primary mt-2" onClick={cargarEjemplo}>Cargar datos de ejemplo</button>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {generos.map(g => (
              <tr key={g._id}>
                <td>{g.nombre}</td>
                <td>{g.descripcion}</td>
                <td>{g.estado}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(g)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Genero;
