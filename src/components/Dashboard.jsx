import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Dashboard.css';

const Dashboard = () => (
  <div className="container py-4">
    <div className="card shadow mb-5">
      <div className="card-body text-center" style={{
        background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
        borderRadius: '0.25rem',
        padding: '3rem 1.5rem'
      }}>
        <h1 className="display-4 fw-bold text-white mb-3">Bienvenido a la Plataforma de Películas IU Digital</h1>
        <p className="lead text-white mb-4">Administra géneros, directores, productoras, tipos y media (películas y series) de forma sencilla.</p>
      </div>
    </div>

    <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
      <div className="col">
        <div className="card h-100 shadow-sm hover-card">
          <div className="card-body text-center">
            <div className="mb-3 icon-container">
              <i className="bi bi-film" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
            </div>
            <h3 className="card-title">Media</h3>
            <p className="card-text text-muted">Gestiona películas y series con información detallada como título, sinopsis y año de estreno.</p>
            <Link to="/media" className="btn btn-primary">Gestionar Media</Link>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card h-100 shadow-sm hover-card">
          <div className="card-body text-center">
            <div className="mb-3 icon-container">
              <i className="bi bi-tags" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
            </div>
            <h3 className="card-title">Géneros</h3>
            <p className="card-text text-muted">Organiza tus películas por categorías como acción, comedia, drama, ciencia ficción y más.</p>
            <Link to="/genero" className="btn btn-primary">Gestionar Géneros</Link>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card h-100 shadow-sm hover-card">
          <div className="card-body text-center">
            <div className="mb-3 icon-container">
              <i className="bi bi-person-video3" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
            </div>
            <h3 className="card-title">Directores</h3>
            <p className="card-text text-muted">Administra información sobre directores y sus filmografías para un mejor catálogo.</p>
            <Link to="/directores" className="btn btn-primary">Gestionar Directores</Link>
          </div>
        </div>
      </div>
    </div>

    <div className="row row-cols-1 row-cols-md-2 g-4">
      <div className="col">
        <div className="card h-100 shadow-sm hover-card">
          <div className="card-body text-center">
            <div className="mb-3 icon-container">
              <i className="bi bi-building" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
            </div>
            <h3 className="card-title">Productoras</h3>
            <p className="card-text text-muted">Registra y gestiona las compañías productoras detrás de cada película y serie.</p>
            <Link to="/productora" className="btn btn-primary">Gestionar Productoras</Link>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card h-100 shadow-sm hover-card">
          <div className="card-body text-center">
            <div className="mb-3 icon-container">
              <i className="bi bi-collection" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
            </div>
            <h3 className="card-title">Tipos</h3>
            <p className="card-text text-muted">Clasifica tu contenido por tipos como películas, series, documentales y más.</p>
            <Link to="/tipo" className="btn btn-primary">Gestionar Tipos</Link>
          </div>
        </div>
      </div>
    </div>

    <div className="text-center mt-5">
      <img src="/vite.svg" alt="Logo" style={{width: 80, opacity: 0.3}} />
      <p className="text-muted mt-2"><small>Versión 2.0</small></p>
    </div>
  </div>
);

export default Dashboard;
