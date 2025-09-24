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
      setProductoras(data);
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
    <div className="container mt-4">
      <h2>Productoras</h2>
      <form className="mb-3" onSubmit={handleSubmit}>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <input type="text" className="form-control" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div className="col-auto">
            <select className="form-select" value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="col-auto">
            <input type="text" className="form-control" placeholder="Slogan" value={slogan} onChange={e => setSlogan(e.target.value)} />
          </div>
          <div className="col-auto">
            <input type="text" className="form-control" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
            {editId && <button className="btn btn-secondary ms-2" type="button" onClick={() => { setEditId(null); setNombre(''); setEstado('Activo'); setSlogan(''); setDescripcion(''); }}>Cancelar</button>}
          </div>
        </div>
      </form>
      {productoras.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay productoras registradas.<br />
          <button className="btn btn-outline-primary mt-2" onClick={cargarEjemplo}>Cargar datos de ejemplo</button>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Slogan</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productoras.map(p => (
              <tr key={p._id}>
                <td>{p.nombre}</td>
                <td>{p.estado}</td>
                <td>{p.slogan}</td>
                <td>{p.descripcion}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Productora;