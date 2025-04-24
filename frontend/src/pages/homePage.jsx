import React from 'react';
import Historia from '../components/historia/historia.jsx';
import UltimosLanzamientos from '../components/ultimosLanzamientos/ultimosLanzamientos.jsx';

function showHomePage() {
    return (
        <div className="home-container">
            <Historia />
            <UltimosLanzamientos />
        </div>
    );
}

export default showHomePage;