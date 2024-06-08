import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

const UnoDeck = [
  { color: "red", number: 0, type: "number" },
  { color: "red", number: 1, type: "number" },
  { color: "red", number: 2, type: "number" },
  { color: "red", number: 3, type: "number" },
  { color: "red", number: 4, type: "number" },
  { color: "red", number: 5, type: "number" },
  { color: "red", number: 6, type: "number" },
  { color: "red", number: 7, type: "number" },
  { color: "red", number: 8, type: "number" },
  { color: "red", number: 9, type: "number" },

  { color: "yellow", number: 0, type: "number" },
  { color: "yellow", number: 1, type: "number" },
  { color: "yellow", number: 2, type: "number" },
  { color: "yellow", number: 3, type: "number" },
  { color: "yellow", number: 4, type: "number" },
  { color: "yellow", number: 5, type: "number" },
  { color: "yellow", number: 6, type: "number" },
  { color: "yellow", number: 7, type: "number" },
  { color: "yellow", number: 8, type: "number" },
  { color: "yellow", number: 9, type: "number" },

  { color: "green", number: 0, type: "number" },
  { color: "green", number: 1, type: "number" },
  { color: "green", number: 2, type: "number" },
  { color: "green", number: 3, type: "number" },
  { color: "green", number: 4, type: "number" },
  { color: "green", number: 5, type: "number" },
  { color: "green", number: 6, type: "number" },
  { color: "green", number: 7, type: "number" },
  { color: "green", number: 8, type: "number" },
  { color: "green", number: 9, type: "number" },

  { color: "blue", number: 0, type: "number" },
  { color: "blue", number: 1, type: "number" },
  { color: "blue", number: 2, type: "number" },
  { color: "blue", number: 3, type: "number" },
  { color: "blue", number: 4, type: "number" },
  { color: "blue", number: 5, type: "number" },
  { color: "blue", number: 6, type: "number" },
  { color: "blue", number: 7, type: "number" },
  { color: "blue", number: 8, type: "number" },
  { color: "blue", number: 9, type: "number" },

  { color: "red", type: "skip" },
  { color: "yellow", type: "skip" },
  { color: "green", type: "skip" },
  { color: "blue", type: "skip" },

  { color: "red", type: "reverse" },
  { color: "yellow", type: "reverse" },
  { color: "green", type: "reverse" },
  { color: "blue", type: "reverse" },

  { color: "red", type: "draw_two" },
  { color: "yellow", type: "draw_two" },
  { color: "green", type: "draw_two" },
  { color: "blue", type: "draw_two" },

  { color: "wild", type: "wild" },
  { color: "wild", type: "wild_draw_four" },

  { color: "spin", type: "spin" },
  { color: "red", type: "spin" },
  { color: "yellow", type: "spin" },
  { color: "green", type: "spin" },
  { color: "blue", type: "spin" },
];

const centerDeck = [];

const Playeronecards = [];

const Playertwocards = [];

const Playerthreecards = [];

const Playerfourcards = [];

function App() {
  return (
    <>
      <div className="w-full h-full">
        <div className="absolute inset-x-0 top-0 flex items-center justify-center">
          <Player1deck />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <Player2deck />
        </div>
        <div className="absolute inset-y-0 left-0 flex items-center justify-center transform rotate-90">
          <Player3deck />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center justify-center transform -rotate-90">
          <Player4deck />
        </div>
      </div>
    </>
  );
}

export default App;

const colorMap = {
  red: "bg-red-400",
  blue: "bg-blue-400",
  green: "bg-green-400",
  yellow: "bg-yellow-400",
  // Add more colors as needed
};

const UnoCard = ({ color, number, type }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-40 w-20 rounded-sm m-1 shadow-lg ${colorMap[color]}`}
    >
      <span className="text-white text-2xl font-bold select-none">
        {number}
      </span>
      <span className="text-white text-lg select-none">{type}</span>
    </div>
  );
};

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function Player1deck() {
  const playerOneCards = shuffleArray(UnoDeck).slice(0, 7); // Pick 7 random cards from shuffled UnoDeck

  // Function to shuffle an array

  return (
    <div className="flex">
      {playerOneCards.map((card, index) => (
        <UnoCard
          key={index}
          color={card.color}
          number={card.number}
          type={card.type}
        />
      ))}
    </div>
  );
}

function Player2deck() {
  const playertwoCards = shuffleArray(UnoDeck).slice(0, 7); // Pick 7 random cards from UnoDeck
  return (
    <div className="flex">
      {playertwoCards.map((card, index) => (
        <UnoCard
          key={index}
          color={card.color}
          number={card.number}
          type={card.type}
        />
      ))}
    </div>
  );
}

function Player3deck() {
  const playerthreeCards = shuffleArray(UnoDeck).slice(0, 7); // Pick 7 random cards from UnoDeck
  return (
    <div className="flex">
      {playerthreeCards.map((card, index) => (
        <UnoCard
          key={index}
          color={card.color}
          number={card.number}
          type={card.type}
        />
      ))}
    </div>
  );
}

function Player4deck() {
  const playerfourCards = shuffleArray(UnoDeck).slice(0, 7); // Pick 7 random cards from UnoDeck
  return (
    <div className="flex">
      {playerfourCards.map((card, index) => (
        <UnoCard
          key={index}
          color={card.color}
          number={card.number}
          type={card.type}
        />
      ))}
    </div>
  );
}
