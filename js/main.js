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
const landingEls = {
  $rules: $("#rules"),
  $start: $("#start"),
  $cardBack: $("#landing-card-back")
}
const gameBoardEls = {
  $playerOne: $("#player1"),
  $playerOneDeck: $("#card-back1"),
  // $playerOneInPlay: $("#in-play1"),
  $playerTwo: $("#player2"),
  $playerTwoDeck: $("#card-back2"),
  // $playerTwoInPlay: $("#in-play2")
}

/*----- event listeners -----*/
// document.querySelector('button').addEventListener('click', renderShuffledDeck) //? don't think I need this
$("#start").on("click", renderStart)
$("#flip").on("click", flipCard)
$("#rules").on("click", showRules)

/*----- functions -----*/
// TODO: functions needed: renderFlip, flipCard, war (to be called by flipCard), checkWinner, reset
// functions finished: init, deal, renderStart

init();

function init() {
  buildMasterDeck();
  renderShuffledDeck();
  $("#game-board").hide();
  $("div > p").hide();
  landingEls.$rules.html("Rules");
  landingEls.$start.html("Start");
  landingEls.$cardBack.attr("src", "css/card-deck-css/images/backs/blue.svg");
  winner = null;
}
function renderStart() {
  $("#landing-page").hide();
  $("#game-board").show();
  gameBoardEls.$playerOne.html("Player 1");
  gameBoardEls.$playerOneDeck.attr("src", "css/card-deck-css/images/backs/blue.svg");
  gameBoardEls.$playerTwo.html("Player 2");
  gameBoardEls.$playerTwoDeck.attr("src", "css/card-deck-css/images/backs/blue.svg");
  deal();
}
function renderFlip() {
    players.one.inPlay.forEach(function(card) {
      const $playerOneInPlay = $("#in-play1");
      $playerOneInPlay.addClass(`card ${card.face}`);
    })
    players.two.inPlay.forEach(function(card) {
      const $playerTwoInPlay = $("#in-play2");
      $playerTwoInPlay.addClass(`card ${card.face}`);
    })
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
    console.log("made it to deal function");
}
function flipCard() {
  console.log("start of flipCard")
    if (winner) return; // prevent users from fliping cards if game is over
    console.log("checked winner");
    if (!players.one.inPlay || !players.two.inPlay) return // prevent users from flipping cards until current turn is resolved (empty arrays are truthy)
    console.log("checked if cards are in play");
    for (const player in players) {
      players[player]["inPlay"].unshift(players[player]["hand"][0]);
      players[player]["hand"].shift();
    }
    console.log("cards have been assigned to arrays");
    renderFlip();
    //TODO checkWinner here? what happens if this is the last card for a player?
    //TODO does this need to be multiple smaller functions??
    //TODO need to delay these if statements so palyers have a chance to see the cards; create a new button/event listner maybe?
}
function someOtherFunction() {
  if (players.one.inPlay[0] === players.two.inPlay[0]) war();
  if (players.one.inPlay[0].value > players.two.inPlay[0].value) {
    Array.prototype.push.apply(players.one.hand, players.one.inPlay) // take player one's current cards and put them at the "bottom" of player one's hand
    Array.prototype.push.apply(players.one.hand, players.two.inPlay) // take player two's current cards and put them at the "bottom" of player one's hand
    players.one.inPlay = []; // reset inPlay arrays
    players.two.inPlay = [];
    // if players.one most recent card is higher rank than players.two most recent card, then 
    // push all cards inPlay to players.one.hand and clear inPlay 
  } else {
    Array.prototype.push.apply(players.two.hand, players.one.inPlay) // take player one's current cards and put them at the "bottom" of player one's hand
    Array.prototype.push.apply(players.two.hand, players.two.inPlay) // take player two's current cards and put them at the "bottom" of player one's hand
    players.one.inPlay = [];
    players.two.inPlay = [];
    // if players.two most recent card is higher rank than players.one most recent card, then 
    // push all cards to players.two.hand and clear inPlay
  }
}

function war() {
  //* this needs to be a loop
  //TODO checkWinner here? how to resolve game if last card flip is a tie
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
function showRules() {
  $("#landing-page").hide();
  $("div > p").show();
}