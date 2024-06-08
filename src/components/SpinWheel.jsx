// components/SpinWheel.js
import React, { useState } from 'react';

const SpinWheel = ({ onSpinResult }) => {
  const spinResults = ['Draw 2 Cards', 'Skip Turn', 'Reverse', 'Swap Hands', 'Play Again', 'Wild Card'];
  const [result, setResult] = useState('');

  const spinWheel = () => {
    const randomResult = spinResults[Math.floor(Math.random() * spinResults.length)];
    setResult(randomResult);
    onSpinResult(randomResult);
  };

  return (
    <div className="spin-wheel">
      <button onClick={spinWheel}>Spin the Wheel</button>
      {result && <p>Result: {result}</p>}
    </div>
  );
};

export default SpinWheel;
