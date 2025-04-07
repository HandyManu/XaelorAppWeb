import React from 'react';
import './searchBox.css';

function showSearchBox() {
    return (
        <div className="searchBox">
            <input className="searchInput" type="text" name="" placeholder="Search" />
            <button className="searchButton" href="/login">
                <i className="material-icons">
                    search
                </i>
            </button>
        </div>
    );
}

export default showSearchBox;