import React from 'react';
import SporturaSpaceWatch from './sportura/sporturaSpaceWatch.jsx';
import SporturaDeepSeaWatch from './sporturaDeepSeawatch/sporturaDeepSeawatch.jsx';
import SporturaMechanismWatch from './sporturaMechanism/sporturaMechanism.jsx';
import './LatestLaunches.css';

function LatestLaunches() {
  return (
    <div className="latest-launches-container">
      <SporturaSpaceWatch />
      <SporturaDeepSeaWatch />
      <SporturaMechanismWatch />
    </div>
  );
}

export default LatestLaunches;