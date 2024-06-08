import React, { useState } from 'react';

const SpinWheel = ({ onSpinResult }) => {
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  const spinOptions = [
    'Draw 2 Cards',
    'Skip Turn',
    'Reverse',
    'Swap Hands',
    'Play Again',
    'Wild Card'
  ];

  const spin = () => {
    setSpinning(true);
    const result = spinOptions[Math.floor(Math.random() * spinOptions.length)];
    setTimeout(() => {
      setSpinning(false);
      setSpinResult(result);
    }, 2000); // 2 seconds spinning time
  };

  const confirmResult = () => {
    onSpinResult(spinResult);
    setSpinResult(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Spin the Wheel</h2>
      <div className="relative w-60 h-60 border-4 border-gray-800 rounded-full flex items-center justify-center">
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-red-400 rounded-full transform transition-transform ${
            spinning ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '2s' }}
        />
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">
            {spinning ? 'Spinning...' : 'Spin'}
          </span>
        </div>
      </div>
      {!spinning && (
        <button
          onClick={spin}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Spin
        </button>
      )}
      {spinResult && !spinning && (
        <div className="mt-4 text-center">
          <p className="text-xl">Result: {spinResult}</p>
          <button
            onClick={confirmResult}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
