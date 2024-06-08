import React from 'react';

const Deck = ({ deck }) => {
  return (
    <div className="deck">
      <h2>Deck</h2>
      <div>{deck.length} cards remaining</div>
    </div>
  );
};

export default Deck;
