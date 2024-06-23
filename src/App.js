import { useEffect, useState } from 'react'
import './App.css'
import SingleCard from './components/SingleCard'

const cardImages = [
  { "src": "/img/easter-bunny.png", matched: false },
  { "src": "/img/turtle.png", matched: false },
  { "src": "/img/clown-fish.png", matched: false },
  { "src": "/img/bird.png", matched: false },
  { "src": "/img/black-cat.png", matched: false },
  { "src": "/img/dog.png", matched: false },
  { "src": "/img/whale.png", matched: false },
  { "src": "/img/elephant.png", matched: false },
  { "src": "/img/panda.png", matched: false },
  { "src": "/img/lion.png", matched: false },
]

function App() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [misses, setMisses] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false) 
  const [matches, setMatches] = useState(0); 
  const [startTime, setStartTime] = useState(null); 
  const [timer, setTimer] = useState(0);

  // format timer as minutes:seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // seconds < 10 ? '0' : '' checks if there should be a 0 such as 3:08 as opposed to 3:10
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // shuffle cards
  const shuffleCards = (level) => {
    let shuffledCards = [] 
    if (level === "easy") {
      shuffledCards = [...cardImages.slice(0, 6), ...cardImages.slice(0, 6)] // creating 2 copies because 2 of each card is needed
    }
    else if (level === "medium") {
      shuffledCards = [...cardImages.slice(0, 8), ...cardImages.slice(0, 8)]
    }
    else {
      shuffledCards = [...cardImages.slice(0, 10), ...cardImages.slice(0, 10)]
    }
    shuffledCards = shuffledCards
      .sort(() => Math.random() - 0.5) // shuffles the cards 
      .map((card) => ({ ...card, id: Math.random() })) // creating card object with random id

    // reseting the game (if there was a previous game)
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
    setMisses(0)
    setMatches(0)
    setStartTime(Date.now()); 
    setTimer(0); 
  }

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card) // set choiceOne if null, else set choiceTwo 
    /* Note: the two selected cards cannot be compared here because the states have not updated at this point
    instead define a useEffect */
  } 

  // compare two selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true) // makes other cards unclickable while we evaluate the two chosen cards
      if (choiceOne.src === choiceTwo.src && choiceOne.id !== choiceTwo.id ) { // if both card images match and its not the same card (double clicking same card)
        setCards(prevCards => { // map an updated array to indicate the two cards are now matched
          return prevCards.map(card => {
            if (card.src === choiceOne.src) { // finding the two cards 
              return {...card, matched: true} // update the card so that match property is true
            } else {
              return card // if it's not the one of the two cards just return the card
            }
          })
        })
        setMatches(prevMatches => prevMatches + 2) 
        resetTurn()
      } else {
        setMisses(prevMisses => prevMisses + 1)
        /* when two cards do not match, it immediately resets them and the flipped class is removed,
        however, we want to display the cards for a brief moment for the user to see */
        setTimeout(() => resetTurn(), 1000) // delays by 1 second
      }
    }
  }, [choiceOne, choiceTwo]) // this useEffect runs whenever choiceOne or choiceTwo is updated

  // reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  // stop timer on game win
  useEffect(() => {
    if (matches === cards.length && startTime !== null) { // startTime !== null ensures that the game has started
      setStartTime(null);
    }
  }, [matches, cards.length, startTime]);
  
  // update timer every second
  useEffect(() => {
    let interval;
    if (startTime !== null) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimer(elapsed);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="App">
      <h1>Memory Match</h1>
      {cards.length === 0 && ( // display when user lands on page 
        <div className="game-select-level">
          <h2 className="">SELECT LEVEL</h2>
        </div>
      )}
      <div className="game-level-buttons">
        <button onClick={() => shuffleCards("easy")}>Easy</button>
        <button onClick={() => shuffleCards("medium")}>Medium</button>
        <button onClick={() => shuffleCards("hard")}>Hard</button>
      </div>
  
      {cards.length > 0 && ( // display card grid once level is selected
        <>
        <div className={(matches === cards.length) ? "card-grid-win" : "card-grid"}> 
        {cards.map(card => ( // maps each card to create its own card component
          <SingleCard 
            key={card.id} 
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched} // three cases if flipped is true: if card is choiceOne, choiceTwo, or is matched
            disabled={disabled}
          /> 
        ))}
        </div>

        <div className="game-info">
          <p>Time: {formatTime(timer)}</p>
          <p>Turns: {turns}</p>
          <p>Misses: {misses}</p>
        </div>
        </>
      )}
    </div>
  );
}

export default App