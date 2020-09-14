let blackjackGame = {
    'you': { 'scorespan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scorespan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isstand': false,
    'turnsover': false,

}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitsound = new Audio('static/sounds/swish.m4a');
const winsound = new Audio('static/sounds/cash.mp3');
const lostsound = new Audio('static/sounds/aww.mp3');

document.querySelector("#blackjack-hit-button").addEventListener('click', blackjackhit);

document.querySelector("#blackjack-stand-button").addEventListener('click', dealerLogic);

document.querySelector("#blackjack-deal-button").addEventListener('click', blackjackdeal);

// Random no. generator to pic card randomly
function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

// Show card in active players box
function showcard(card, activeplayer) {
    if (activeplayer['score'] <= 21) {
        let cardimg = document.createElement('img');
        cardimg.src = `static/images/${card}.png`;
        document.querySelector(activeplayer['div']).appendChild(cardimg);
        hitsound.play();
    }

}

// update score after hit the card (add score)
function updateScore(card, activeplayer) {


    // if card = 'A' then adding 11 keeps score <= 21 then add 11 or add 1
    if (card === 'A') {
        if (activeplayer['score'] + blackjackGame['cardMap'][card][1] <= 21) {
            activeplayer['score'] += blackjackGame['cardMap'][card][1];

        } else {
            activeplayer['score'] += blackjackGame['cardMap'][card][0];
        }
    } else {
        activeplayer['score'] += blackjackGame['cardMap'][card];

    }
}


function showScore(card, activeplayer) {
    updateScore(card, activeplayer);
    document.querySelector(activeplayer['scorespan']).textContent = activeplayer['score'];

    if (activeplayer['score'] > 21) {
        document.querySelector(activeplayer['scorespan']).textContent = 'BUST!';
        document.querySelector(activeplayer['scorespan']).style.color = 'red';
    } else {
        document.querySelector(activeplayer['scorespan']).textContent = activeplayer['score'];
    }

}



function blackjackhit() {
    if (blackjackGame['isstand'] === false) {
        let card = randomCard();
        showcard(card, YOU);
        showScore(card, YOU);
        console.log(card);
    }
}


function blackjackdeal() {
    if (blackjackGame['turnsover'] === true) {

        blackjackGame['isstand'] = false;

        // select all images from your box div
        let yourImages = document.querySelector(YOU['div']).querySelectorAll('img');

        // select all images from dealer's box div
        let dealerImages = document.querySelector(DEALER['div']).querySelectorAll('img');

        // Loop through each img and remove
        for (i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        for (i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        // Reset the score for each player to Zero
        YOU['score'] = 0;
        document.querySelector(YOU['scorespan']).textContent = 0;
        document.querySelector(YOU['scorespan']).style.color = 'white';

        DEALER['score'] = 0;
        document.querySelector(DEALER['scorespan']).textContent = 0;
        document.querySelector(DEALER['scorespan']).style.color = 'white';

        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsover'] = true;

    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function dealerLogic() {
    blackjackGame['isstand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isstand'] === true) {
        let card = randomCard();
        showcard(card, DEALER);
        showScore(card, DEALER);

        await sleep(1000);
    }

    blackjackGame['turnsover'] = true;
    let winner = computeWinner();
    showResult(winner);

}


// compute winner and update the wins, losses, draws 
function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        // condition: higher than dealer or when dealer busts but you're less than 21
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackGame['wins']++;
            console.log('You Won!');
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            console.log('You Lost!');
            winner = DEALER;

        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;
            console.log('You Drew!');
        }

        // condition: when user bust but dealer doesn't 
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        console.log('You Lost!');
        winner = DEALER;

        // condition: when you and the dealer bust 
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
        console.log('You Drew!');
    }

    console.log("Winner is", winner);
    return winner
}


function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsover'] === true) {

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winsound.play();

        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You Lost!';
            messageColor = 'red';
            lostsound.play();

        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You Drew!';
            messageColor = 'black';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }

}