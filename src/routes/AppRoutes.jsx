import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Genero from '../components/Genero/genero';
import Directores from '../components/Directores/directores';
import Media from '../components/Media/media';
import Productora from '../components/Productora/productora';
import Tipo from '../components/Tipo/tipo';
import Dashboard from '../components/Dashboard';

const AppRoutes = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Películas iu digital</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/media">Media</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/genero">Género</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/directores">Directores</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/productora">Productora</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/tipo">Tipo</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/genero" element={<Genero />} />
          <Route path="/directores" element={<Directores />} />
          <Route path="/media" element={<Media />} />
          <Route path="/productora" element={<Productora />} />
          <Route path="/tipo" element={<Tipo />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;