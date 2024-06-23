import './SingleCard.css'

export default function SingleCard({ card, handleChoice, flipped, disabled }) {

    const handleClick = () => {
        if (!disabled) { // if card is clickable
            handleChoice(card) // call handleChoice which was defined in App and passed as a prop to this component
        }
        
    }
    return (
        <div className="card">
            <div className={flipped ? "flipped" : ""}>
                <img className="front" src={card.src} alt="card front" />
                <img 
                    className="back" src={`${process.env.PUBLIC_URL}/img/cover.png`} 
                    onClick={handleClick} // onClick is on back of card because only the back should be clickable
                    alt="card back" 
                />
            </div>
        </div>
    )
}