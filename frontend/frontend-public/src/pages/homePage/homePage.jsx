import React from 'react';
import Historia from './historiaHome/historia.jsx';
import UltimosLanzamientos from './ultimosLanzamientosHome/ultimosLanzamientos.jsx';

function showHomePage() {
    return (
        <div className="home-container">
            <Historia />
            <UltimosLanzamientos />
        </div>
    );
}

export default showHomePage;