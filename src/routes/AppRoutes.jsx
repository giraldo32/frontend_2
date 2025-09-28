import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import viteLogo from '/vite.svg';

import Genero from '../components/Genero/genero';
import Directores from '../components/Directores/directores';
import Media from '../components/Media/media';
import Productora from '../components/Productora/productora';
import Tipo from '../components/Tipo/tipo';
import Dashboard from '../components/Dashboard';

const AppRoutes = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const closeNavbar = () => {
    if (expanded) setExpanded(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
        <div className="container">
          <Link className="navbar-brand" to="/" onClick={closeNavbar}>
            <img src={viteLogo} className="logo me-2" alt="Logo" />
            Películas IU Digital
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setExpanded(!expanded)}
            aria-controls="navbarNav" 
            aria-expanded={expanded} 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/" onClick={closeNavbar}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/media' ? 'active' : ''}`} to="/media" onClick={closeNavbar}>Media</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/genero' ? 'active' : ''}`} to="/genero" onClick={closeNavbar}>Género</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/directores' ? 'active' : ''}`} to="/directores" onClick={closeNavbar}>Directores</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/productora' ? 'active' : ''}`} to="/productora" onClick={closeNavbar}>Productora</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/tipo' ? 'active' : ''}`} to="/tipo" onClick={closeNavbar}>Tipo</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="app-container">
        <div className="container py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/genero" element={<Genero />} />
            <Route path="/directores" element={<Directores />} />
            <Route path="/media" element={<Media />} />
            <Route path="/productora" element={<Productora />} />
            <Route path="/tipo" element={<Tipo />} />
          </Routes>
        </div>
        <footer className="bg-light text-center text-muted py-4 mt-5">
          <div className="container">
            <p>© 2023 Películas IU Digital - Plataforma de Gestión</p>
            <p><small>Desarrollado con React y Bootstrap</small></p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AppRoutes;