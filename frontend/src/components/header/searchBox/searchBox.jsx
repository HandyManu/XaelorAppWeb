import React, { useState } from 'react';
import './searchBox.css';

function SearchBox({ className = '' }) {
    const [searchValue, setSearchValue] = useState('');
    
    const handleSearch = (e) => {
        e.preventDefault();
        // Implementar lógica de búsqueda aquí
        console.log('Buscando:', searchValue);
        // Puedes usar navigate para redirigir a una página de resultados
    };
    
    return (
        <form className={`searchBox ${className}`} onSubmit={handleSearch}>
            <input 
                className="searchInput" 
                type="text" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar" 
                aria-label="Buscar en el sitio"
            />
            <button 
                className="searchButton" 
                type="submit"
                aria-label="Iniciar búsqueda"
            >
                <i className="material-icons">
                    search
                </i>
            </button>
        </form>
    );
}

export default SearchBox;