import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => (
  <div className="text-center mt-5">
    <h1 className="mb-4">Bienvenido a la Plataforma de Películas iu digital</h1>
    <p className="lead mb-4">Administra géneros, directores, productoras, tipos y media (películas y series) de forma sencilla.</p>
    <div className="d-flex justify-content-center gap-3 flex-wrap">
      <Link to="/media" className="btn btn-primary btn-lg">Media</Link>
      <Link to="/genero" className="btn btn-secondary btn-lg">Géneros</Link>
      <Link to="/directores" className="btn btn-success btn-lg">Directores</Link>
      <Link to="/productora" className="btn btn-warning btn-lg">Productoras</Link>
      <Link to="/tipo" className="btn btn-info btn-lg">Tipos</Link>
    </div>
    <div className="mt-5">
      <img src="/vite.svg" alt="Logo" style={{width: 120, opacity: 0.2}} />
    </div>
  </div>
);

export default Dashboard;
