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
  const [screenState, setScreenState] = useState([
    "home",
    "playerjoin",
    "instructions",
    "game",
  ]);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    saveGameState();
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
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
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
    <>
      {screenState[0] === "home" && (
        <div className="container h-full">
          <div className="App flex flex-col">
            <div className="container mx-auto m-2">
              <div
                className="logo"
                style={{ animation: "spinGrow 1s ease-in-out forwards" }}
              ></div>
            </div>
            <button
              className="m-2 text-red-500 text-2xl bangers-regular py-2 px-4 rounded"
              onClick={() => setScreenState(["instructions"])}
            >
              Start Game
            </button>
          </div>
        </div>
      )}
      {screenState[0] === "playerjoin" && (
        <PlayerJoin setScreenState={setScreenState} />
      )}
      {screenState[0] === "instructions" && (
        <div className="container h-full">
          <div className="App flex flex-col">
            <div className="inst-warp overflow-y-auto m-2">
              <h1 className="m-2 text-red-500 text-4xl bangers-regular py-2 px-4 " >Instructions</h1>
              <div className="image-grid">
                <div className="image-item1" data-aos="fade-zoom-in">
                  1
                </div>
                <div className="image-item2">
                  2
                </div>
                <div className="image-item3">
                  3
                </div>
                
              </div>

              <button
                className="m-2 text-red-500 text-2xl bangers-regular py-2 px-4 rounded"
                onClick={() => setScreenState(["playerjoin"])}
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}
      {screenState[0] === "game" && (
        <div className="container h-full">
          <div className="App flex flex-col">
            <div className="container mx-auto  m-2">
              {phase !== "spinning" && (
                <>
                  <div className="current-card flex">
                    <div className={`central ${currentCard}`}></div>
                    <button
                      className="m-2  text-red-500 hover:bg-black text-2xl  bangers-regular py-2 px-4 rounded"
                      onClick={startNewGame}
                    >
                      New Game
                    </button>
                    <button
                      className="m-2  text-red-500 hover:bg-black text-2xl  bangers-regular  py-2 px-4 rounded"
                      onClick={endTurn}
                    >
                      End Turn
                    </button>
                    <button className="instructions hover:bg-black  text-red-500 text-2xl  bangers-regular  py-2 px-4 rounded">
                      ?
                    </button>
                  </div>
                </>
              )}

              {phase === "spinning" ? (
                <SpinWheel onSpinResult={handleSpinResult} />
              ) : (
                <div className="players">
                  {players.map((playerCards, index) =>
                    index === currentPlayer ? (
                      <PlayerHand
                        key={index}
                        playerIndex={index}
                        cards={playerCards}
                        currentPlayer={currentPlayer}
                        drawCard={() => drawCard(index)}
                        playCard={(cardIndex) => playCard(index, cardIndex)}
                      />
                    ) : null
                  )}
                </div>
              )}
              {phase !== "spinning" && (
                <>
                  <div className="hidden-deck3">
                    <h1></h1>
                  </div>
                  <div className="hidden-deck2">
                    <h1></h1>
                  </div>
                  <div className="hidden-deck1">
                    <h1></h1>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
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
    <>
      <div
        className={`player-hand ${
          currentPlayer === playerIndex ? "active" : ""
        } absolute inset-x-0 bottom-0 `}
      >
        <h3 className=" text-white text-2xl  bangers-regular ">
          Player {playerIndex + 1}
        </h3>
        <div className="cards ">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card ${card}`}
              onClick={() => playCard(index)}
            ></div>
          ))}
        </div>
        {currentPlayer === playerIndex && (
          <button
            className=" text-red-500 text-2xl  bangers-regular "
            onClick={drawCard}
          >
            Draw Card
          </button>
        )}
      </div>
    </>
  );
};

function PlayerJoin({ setScreenState }) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const handleInputChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (playerName.trim() !== "" && roomCode.trim() !== "") {
      setIsFormSubmitted(true);
      setScreenState(["game"]);
    }
  };

  const handleCreateRoom = () => {
    setIsCreatingRoom(true);
    
    setRoomCode("ASDQ532"); 
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 App ">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {!isFormSubmitted ? (
          <>
            <h1 className="text-3xl font-bold mb-4">Player Join</h1>
            <form onSubmit={handleFormSubmit} className="flex flex-col">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={handleInputChange}
                className="mb-4 p-2 border rounded-lg text-lg"
              />
              {isCreatingRoom ? (
                <div className="mb-4">
                  <p className="text-lg mb-2">Room Code: {roomCode}</p>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={handleRoomCodeChange}
                  className="mb-4 p-2 border rounded-lg text-lg"
                />
              )}
              <button
                type="submit"
                className="mb-2 bg-red-500 text-white text-2xl py-2 px-4 rounded-lg"
              >
                Join Game
              </button>
            </form>
            <button
              onClick={handleCreateRoom}
              className="bg-green-500 text-white text-2xl py-2 px-4 rounded-lg"
            >
              Create Room
            </button>
          </>
        ) : (
          <h2 className="text-2xl">
            Welcome, {playerName}! Loading the game...
          </h2>
        )}
      </div>
    </div>
  );
}
