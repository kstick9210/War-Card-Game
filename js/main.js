/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

const masterDeck = buildMasterDeck();
// renderDeckInContainer(masterDeck, document.getElementById('master-deck-container')); //? don't think I need this


/*----- app's state (variables) -----*/
let shuffledDeck, winner;

const players = {
  one: {
      hand: [],
      inPlay: []
  },
  two: {
      hand: [],
      inPlay: []
  }
}

/*----- cached element references -----*/
// const shuffledContainer = document.getElementById('shuffled-deck-container'); //? don't think I need this

/*----- event listeners -----*/
// document.querySelector('button').addEventListener('click', renderShuffledDeck) //? don't think I need this
$("#start").on("click", deal)
$("#flip").on("click", flipCard)

/*----- functions -----*/
// TODO: functions needed: xinitx, xdealx, render (called first by deal), flipCard, war (to be called by flipCard), checkWinner
init();

function init() {
  buildMasterDeck();
  renderShuffledDeck();
  //TODO call render here?
  winner = null;
}

function renderShuffledDeck() {
    // Create a copy of the masterDeck (leave masterDeck untouched!)
    const tempDeck = [...masterDeck];
    shuffledDeck = [];
    while (tempDeck.length) {
      // Get a random index for a card still in the tempDeck
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
      shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    // renderDeckInContainer(shuffledDeck, shuffledContainer); //? don't think I need this
  }
  
//   function renderDeckInContainer(deck, container) { //? might be able to model render based on this
//     container.innerHTML = '';
//     // Let's build the cards as a string of HTML
//     // Use reduce when you want to 'reduce' the array into a single thing - in this case a string of HTML markup 
//     const cardsHtml = deck.reduce(function(html, card) {
//       return html + `<div class="card ${card.face}"></div>`;
//     }, '');
//     container.innerHTML = cardsHtml;
//   }
  
  function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' based on rank; Aces are high
          value: Number(rank) || (rank === 'J' ? 11 : rank === 'Q' ? 12 : rank === 'K' ? 13 : 14)
        });
      });
    });
    return deck;
  }

  
function deal() {
    players.one.hand = shuffledDeck.slice(0, 26);
    players.two.hand = shuffledDeck.slice(26);
    render();
}
function render() {
  // DOM manipulation
}
function flipCard() {
    if (winner) return;
    for (const player in players) {
      players[player]["inPlay"].push(players[player]["hand"][0]);
      players[player]["hand"].shift();
    }

    //TODO: where do I call render in this function?
    //TODO does this need to be multiple smaller functions??
    if (players.one.inPlay[players.one.inPlay.length - 1] === players.two.inPlay[players.two.inPlay.length - 1]) {
      war() }
    // else if () {
      // if players.one most recent card is higher rank than players.two most recent card, then 
      // push all cards inPlay to players.one.hand and clear inPlay }
     else {
      // if players.two most recent card is higher rank than players.one most recent card, then 
      // push all cards to players.two.hand and clear inPlay
    }
}

function war() {
  //* this needs to be a loop
  players.one.inPlay.push(players.one.hand[players.one.hand.length - 1]);
  players.one.hand.shift();
  players.one.inPlay.push(players.one.hand[players.one.hand.length - 1]);
  players.one.hand.shift();
  players.two.inPlay.push(players.two.hand[players.two.hand.length - 1]);
  players.two.hand.shift();
  players.two.inPlay.push(players.two.hand[players.two.hand.length - 1]);
  players.two.hand.shift();
  //TODO call render here?
}
function checkWinner() {
  // if player one or player two hand === 52, declare winner
  // else, render? return?
}