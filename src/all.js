import React, { useState, useEffect } from "react";
import Deck from "./components/Deck";
import SpinWheel from "./components/SpinWheel";
import { shuffleDeck, initialDeck } from "./gamelogic";
import "./App.css";

const App = () => {
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([[], [], [], []]);
  const [currentCard, setCurrentCard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [phase, setPhase] = useState("playing");
  const [direction, setDirection] = useState(1);
  const [chosenColor, setChosenColor] = useState(null);
  

  useEffect(() => {
    startNewGame();
  }, []);

  const saveGameState = () => {
    const gameState = {
      deck,
      players,
      currentCard,
      currentPlayer,
      direction,
    };
    localStorage.setItem("unoGameState", JSON.stringify(gameState));
  };

  const loadGameState = () => {
    const savedState = JSON.parse(localStorage.getItem("unoGameState"));
    if (savedState) {
      setDeck(savedState.deck);
      setPlayers(savedState.players);
      setCurrentCard(savedState.currentCard);
      setCurrentPlayer(savedState.currentPlayer);
      setDirection(savedState.direction);
    }
  };

  const endTurn = () => {
    setCurrentPlayer((currentPlayer + 1) % players.length);
  };

  const startNewGame = () => {
    const shuffledDeck = shuffleDeck(initialDeck);
    const newPlayers = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      newPlayers[i] = shuffledDeck.splice(0, 7);
    }
    setDeck(shuffledDeck);
    setPlayers(newPlayers);
    setCurrentCard(shuffledDeck.pop());
    setCurrentPlayer(0);
    setPhase("playing");
    setDirection(1);
    saveGameState();
  };

  const drawCard = (playerIndex) => {
    if (deck.length === 0) return;
    const newDeck = [...deck];
    const drawnCard = newDeck.pop();
    const newPlayers = [...players];
    newPlayers[playerIndex].push(drawnCard);
    setDeck(newDeck);
    setPlayers(newPlayers);
    saveGameState();
  };

  const playCard = (playerIndex, cardIndex) => {
    if (playerIndex !== currentPlayer || phase !== "playing") return;

    const newPlayers = [...players];
    const playedCard = newPlayers[playerIndex].splice(cardIndex, 1)[0];

    // Check if the card is a valid play
    if (!isValidPlay(playedCard)) {
      newPlayers[playerIndex].splice(cardIndex, 0, playedCard);
      return;
    }

    setPlayers(newPlayers);
    setCurrentCard(playedCard);
    handleCardEffect(playedCard);
    checkForWin(playerIndex);

    saveGameState();
  };

  const isValidPlay = (card) => {
    const cardColor = card[0];
    const cardValue = card.slice(1);
    const currentCardColor = currentCard[0];
    const currentCardValue = currentCard.slice(1);

    return (
      cardColor === currentCardColor ||
      cardValue === currentCardValue ||
      card[0] === "W" ||
      cardColor === chosenColor
    );
  };

  const handleCardEffect = (card) => {
    const cardValue = card.slice(1);

    switch (cardValue) {
      case "S":
        setCurrentPlayer((currentPlayer + 2 * direction + 4) % 4);
        break;
      case "R":
        setDirection(direction * -1);
        setCurrentPlayer((currentPlayer + direction + 4) % 4);
        break;
      case "D":
        drawCard((currentPlayer + direction + 4) % 4);
        drawCard((currentPlayer + direction + 4) % 4);
        setCurrentPlayer((currentPlayer + direction + 4) % 4);
        break;
      case "W":
        // Wild card logic
        const chosenColor = prompt("Choose a color: R, G, B, Y");
        setChosenColor(chosenColor);
        setCurrentPlayer((currentPlayer + direction + 4) % 4);
        break;
      case "SP":
        setPhase("spinning");
        break;
      default:
        setCurrentPlayer((currentPlayer + direction + 4) % 4);
    }
  };

  const checkForWin = (playerIndex) => {
    if (players[playerIndex].length === 0) {
      alert(`Player ${playerIndex + 1} wins!`);
      // Optionally reset the game
    }
  };

  const handleSpinResult = (result) => {
    switch (result) {
      case "Draw 2 Cards":
        drawCard(currentPlayer);
        drawCard(currentPlayer);
        break;
      case "Skip Turn":
        setCurrentPlayer((currentPlayer + direction + 4) % 4);
        break;
      case "Reverse":
        setDirection(direction * -1);
        break;
      case "Swap Hands":
        // Implement swap hands logic
        const nextPlayer = (currentPlayer + direction + 4) % 4;
        const tempHand = players[currentPlayer];
        const newPlayers = [...players];
        newPlayers[currentPlayer] = newPlayers[nextPlayer];
        newPlayers[nextPlayer] = tempHand;
        setPlayers(newPlayers);
        break;
      case "Play Again":
        // Implement play again logic
        break;
      case "Wild Card":
        const chosenColor = prompt("Choose a color: R, G, B, Y");
        setChosenColor(chosenColor);
        break;
      default:
        break;
    }
    setPhase("playing");
    saveGameState();
  };

  return (
    <div className="container">
      <div className="App flex flex-col">
        <div className="container mx-auto p-20 m-2">
          {phase !== "spinning" && (
            <>
              <Deck deck={deck} />
              <div className="current-card">
                <h2 className="text-2xl font-bold">Current Card</h2>
                <div className={`central ${currentCard}`}>{currentCard}</div>
              </div>
              <h2 className="text-xl font-bold mb-2">Current Active Player</h2>
              <div className="text-3xl font-bold active-player">
                {currentPlayer + 1}
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={endTurn}
              >
                End Turn
              </button>
              <button
                className="bg-black ml-2 hover:bg-gray-200 text-blue-500 font-bold py-2 px-4 rounded"
                onClick={startNewGame}
              >
                Start New Game
              </button>
            </>
          )}
          {phase === "spinning" ? (
            <SpinWheel onSpinResult={handleSpinResult} />
          ) : (
            <div className="players">
              <div className="absolute inset-x-0 top-0 flex items-center justify-center">
                <PlayerHand
                  playerIndex={0}
                  cards={players[0]}
                  currentPlayer={currentPlayer}
                  drawCard={() => drawCard(0)}
                  playCard={(cardIndex) => playCard(0, cardIndex)}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-center">
                <PlayerHand
                  playerIndex={1}
                  cards={players[1]}
                  currentPlayer={currentPlayer}
                  drawCard={() => drawCard(1)}
                  playCard={(cardIndex) => playCard(1, cardIndex)}
                />
              </div>
              <div className="absolute inset-y-0 left-0 flex items-center justify-center transform rotate-90">
                <PlayerHand
                  playerIndex={2}
                  cards={players[2]}
                  currentPlayer={currentPlayer}
                  drawCard={() => drawCard(2)}
                  playCard={(cardIndex) => playCard(2, cardIndex)}
                />
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center justify-center transform -rotate-90">
                <PlayerHand
                  playerIndex={3}
                  cards={players[3]}
                  currentPlayer={currentPlayer}
                  drawCard={() => drawCard(3)}
                  playCard={(cardIndex) => playCard(3, cardIndex)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

const PlayerHand = ({
  playerIndex,
  cards,
  currentPlayer,
  drawCard,
  playCard,
}) => {
  return (
    <div
      className={`player-hand ${currentPlayer === playerIndex ? "active" : ""}`}
    >
      <h3>Player {playerIndex + 1}</h3>
      <div className="cards">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${card}`}
            onClick={() => playCard(index)}
          >
            {card}
          </div>
        ))}
      </div>
      {currentPlayer === playerIndex && (
        <button onClick={drawCard}>Draw Card</button>
      )}
    </div>
  );
};



const Deck = ({ deck }) => {
  return (
    <div className="deck">
      <h2>Deck</h2>
      <div>{deck.length} cards remaining</div>
    </div>
  );
};




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




export const initialDeck = [
    'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R0', 'RS', 'RD', 'RW', 'RSP',
    'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G0', 'GS', 'GD', 'GW', 'GSP',
    'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B0', 'BS', 'BD', 'BW', 'BSP',
    'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7', 'Y8', 'Y9', 'Y0', 'YS', 'YD', 'YW', 'YSP'
  ];
  
  
  export const shuffleDeck = (deck) => {
    let shuffledDeck = [...deck];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
  };
  