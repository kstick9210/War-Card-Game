/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();

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
const landingEls = {
  $rules: $("#rules"),
  $start: $("#start"),
  $cardBack: $("#landing-card-back")
}
const gameBoardEls = {
  $playerOne: $("#player1"),
  $playerOneCount: $("#count1"),
  $playerOneDeck: $("#card-back1"),
  $playerTwo: $("#player2"),
  $playerTwoCount: $("#count2"),
  $playerTwoDeck: $("#card-back2"),
  $gameMsg: $("#msg")
}

/*----- event listeners -----*/
$("#start").on("click", renderStart)
$("#rules").on("click", showRules)
$("#flip").on("click", flipCard)
$("#take").on("click", takeCards)
$("#return, #reset").on("click", init)

/*----- functions -----*/

init();

function init() {
  buildMasterDeck();
  renderShuffledDeck();
  $("#game-board").hide();
  $("#rules-expand").hide();
  $("#landing-page").show(); // ensures landing page is displayed when reset button is clicked
  takeCardsRender(); // removes any inPlay cards from the DOM when reset is clicked
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
  gameBoardEls.$playerOneCount.html(`Card count: ${players.one.hand.length}`);
  gameBoardEls.$playerTwoCount.html(`Card count: ${players.two.hand.length}`);
}
function renderFlip() {
    gameBoardEls.$gameMsg.empty(); // remove any game messages present on board
    const $playerOneInPlay = $("#in-play1");
    const recentCard1 = players.one.inPlay[0].face;
    $playerOneInPlay.append(`<div class="card ${recentCard1}"></div>`);
    const $playerTwoInPlay = $("#in-play2");
    const recentCard2 = players.two.inPlay[0].face;
    $playerTwoInPlay.append(`<div class="card ${recentCard2}"></div>`);
}
function takeCardsRender() {
    const $playerOneInPlay = $("#in-play1");
    $playerOneInPlay.empty();
    const $playerTwoInPlay = $("#in-play2");
    $playerTwoInPlay.empty();
    gameBoardEls.$playerOneCount.html(`Card count: ${players.one.hand.length}`);
    gameBoardEls.$playerTwoCount.html(`Card count: ${players.two.hand.length}`);
}
function renderWar() {
  checkWinner();
  if (winner) return;
  gameBoardEls.$gameMsg.html(`This means WAR! Flip another card.`)
}
function renderWinner() {
  gameBoardEls.$gameMsg.html(`${winner} wins!`);
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
  }
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
}
function flipCard() {
    if (winner) return; // prevent users from fliping cards if game is over
    // if (players.one.inPlay.length > 0 || players.two.inPlay.length > 0) return // prevent users from flipping cards until current turn is resolved
    if (players.one.inPlay.length > 0 && players.one.inPlay[0].value !== players.two.inPlay[0].value) return // prevent users from flipping cards if cards are in play and it is not war
    for (const player in players) {
      players[player]["inPlay"].unshift(players[player]["hand"][0]);
      players[player]["hand"].shift();
    }
    renderFlip();
    if (players.one.inPlay[0].value === players.two.inPlay[0].value) { renderWar() };
}
function takeCards() {
  if (players.one.inPlay.length === 0) return // function will return if there are no cards in play; inPlay arrays should always be the same length, so only need to check one array
  if (players.one.inPlay[0].value === players.two.inPlay[0].value) return // if war, prevent users from taking cards until war is resolved
  if (players.one.inPlay[0].value > players.two.inPlay[0].value) {
    Array.prototype.push.apply(players.one.hand, players.one.inPlay) // take player one's current cards and put them at the "bottom" of player one's hand
    Array.prototype.push.apply(players.one.hand, players.two.inPlay) // take player two's current cards and put them at the "bottom" of player one's hand
    players.one.inPlay = []; // reset inPlay arrays once winner of th round has taken cards
    players.two.inPlay = [];
    takeCardsRender();
  } else {
    Array.prototype.push.apply(players.two.hand, players.one.inPlay) // take player one's current cards and put them at the "bottom" of player one's hand
    Array.prototype.push.apply(players.two.hand, players.two.inPlay) // take player two's current cards and put them at the "bottom" of player one's hand
    players.one.inPlay = [];
    players.two.inPlay = [];
    takeCardsRender();
  }
  checkWinner();
}
function checkWinner() {
  if (players.one.hand.length === 52) {
    winner = "Player 1";
    renderWinner();
  } else if (players.two.hand.length === 52) {
    winner = "Player 2";
    renderWinner();
  }
  return winner;
}
function showRules() {
  $("#landing-page").hide();
  $("#rules-expand").show();
}