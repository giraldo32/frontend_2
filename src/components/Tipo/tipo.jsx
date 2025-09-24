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
    if (await Swal.fire({ title: '¿Eliminar?', text: 'No se puede deshacer', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar' }).then(r => r.isConfirmed)) {
      try {
        await TipoService.deleteTipo(id);
        Swal.fire('Eliminado', 'Tipo eliminado', 'success');
        fetchTipos();
      } catch {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tipos</h2>
      <form className="mb-3" onSubmit={handleSubmit}>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <input type="text" className="form-control" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div className="col-auto">
            <input type="text" className="form-control" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
            {editId && <button className="btn btn-secondary ms-2" type="button" onClick={() => { setEditId(null); setNombre(''); setDescripcion(''); }}>Cancelar</button>}
          </div>
        </div>
      </form>
      {tipos.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay tipos registrados.<br />
          <button className="btn btn-outline-primary mt-2" onClick={cargarEjemplo}>Cargar datos de ejemplo</button>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map(t => (
              <tr key={t._id}>
                <td>{t.nombre}</td>
                <td>{t.descripcion}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(t)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tipo;