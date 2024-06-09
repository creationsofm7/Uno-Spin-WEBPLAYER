import React, { useState } from "react";

const SpinWheel = ({ onSpinResult }) => {
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  const spinOptions = [
    "Draw 2 Cards",
    "Skip Turn",
    "Reverse",
    "Swap Hands",
    "Play Again",
    "Wild Card",
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

      <div className="rounded-full flex items-center justify-center overflow-hidden">
        {!spinResult && (
          <div
            className={`absolute inset-0 spinner w-full h-full rounded-full transform transition-transform ${
              spinning ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "6s", transform: spinning ? "rotate(3960deg)" : "rotate(0deg)" }}
          >
            {!spinning && !spinResult && (
              <button
                onClick={spin}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Spin the wheel
              </button>
            )}
          </div>
        )}

        {spinResult && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              <p className="text-2xl text-black">Result</p>
              <p className="text-8xl">{spinResult}</p>
              <button
                onClick={confirmResult}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-700"
              >
                Confirm
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinWheel;
