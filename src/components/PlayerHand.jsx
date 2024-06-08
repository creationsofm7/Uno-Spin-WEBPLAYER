const PlayerHand = ({ playerIndex, cards, currentPlayer, drawCard, playCard }) => {
  return (
    <div className={`player-hand ${currentPlayer === playerIndex ? 'current' : ''}`}>
      <h3>Player {playerIndex + 1}</h3>
      <div className="cards">
        {cards.map((card, index) => (
          <div key={index} className={`card ${card}`} onClick={() => playCard(index)}>
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
