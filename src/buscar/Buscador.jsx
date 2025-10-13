import React, { useState } from 'react';
import { buscarProductos } from './busquedaService';

export default function Buscador({ onResultadosBusqueda, token }) {
  const [termino, setTermino] = useState('');
  const [buscando, setBuscando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!termino.trim()) {
      alert('Por favor ingresa un término de búsqueda');
      return;
    }

    setBuscando(true);
    
    try {
      const resultados = await buscarProductos(termino, token);
      onResultadosBusqueda(resultados, termino);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      alert('Error al buscar productos');
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="buscador">
      <form onSubmit={handleSubmit} className="form-busqueda">
        <input
          type="text"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          placeholder="Buscar zapatos..."
          className="input-busqueda"
          disabled={buscando}
        />
        <button 
          type="submit" 
          className="btn-buscar"
          disabled={buscando || !termino.trim()}
        >
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
    </div>
  );
}