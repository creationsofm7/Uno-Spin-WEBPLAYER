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
      card[0] === "W"
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
        // Implement wild card logic (e.g., change color)
        handleWildCard = (color) => {
          setCurrentCard(color + currentCard.slice(1));
          setCurrentPlayer((currentPlayer + direction + 4) % 4);
        };
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
        break;
      case "Play Again":
        // Implement play again logic
        break;
      case "Wild Card":
        // Implement wild card logic
        break;
      default:
        break;
    }
    setPhase("playing");
    saveGameState();
  };

  return (
    <div className="App">
      <h1 className="text-4xl font-bold mb-4">UNO Spin Game</h1>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={startNewGame}
      >
        Start New Game
      </button>
      {phase === "spinning" && <SpinWheel onSpinResult={handleSpinResult} />}
      <Deck deck={deck} />
      <div className="current-card">
        <h2 className="text-2xl font-bold mb-2">Current Card</h2>
        <div className="card">{currentCard}</div>
      </div>
      <h2 className="text-xl font-bold mb-2">Current Active Player</h2>
      <div className="text-3xl font-bold active-player">
        {currentPlayer + 1}
      </div>
      <div className="players">
        {players.map((playerHand, index) => (
          <PlayerHand
            key={index}
            playerIndex={index}
            cards={playerHand}
            currentPlayer={currentPlayer}
            drawCard={() => drawCard(index)}
            playCard={(cardIndex) => playCard(index, cardIndex)}
          />
        ))}
      </div>
      <button onClick={endTurn}>End Turn</button>
      
    
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
