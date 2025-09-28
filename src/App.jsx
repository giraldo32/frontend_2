import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/peliculas')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        margin: '20px 0',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5em' }}>🎬 Bienvenido a la Plataforma de Películas IU DIGITAL 🎬</h1>
      </div>
      <div>ñ
        <h1>Películas</h1>
        {data ? (
          <ul>
            {data.map((pelicula) => (
              <li key={pelicula.id}>{pelicula.nombre}</li>
            ))}
          </ul>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </>
  );
}

export default App;
