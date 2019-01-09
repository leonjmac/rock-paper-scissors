/// Javascript implementation of rock, paper, scissors

// Variables used to keep track of the overall score	
let playerScore = 0;
let computerScore = 0;
let targetScore = 0;

// Constants used for comparisons
let rock = 0;
let paper = 1;
let scissors = 2;

let player = 0;
let computer = 1;

// Creates a random integer between 0 and the (max)imum number specified
// Returns INTERGER
function generateRandomInteger(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Resets scores ready for the next game
// Returns NOTHING
function resetScores() {
    playerScore = 0;
    computerScore = 0;
    document.querySelector('#player_score').textContent = `${playerScore}`;
    document.querySelector('#computer_score').textContent = `${computerScore}`;
}

// Presents screen based upon argument supplied
// Refactor to accept a constant
function displayScreen(screenName) {
    let screens = Array.from(document.querySelector('.container').children);
    for (let i = 0; i < screens.length; i++) { 
        screens[i].classList.add('is_hidden');
        if (screens[i].classList.contains(screenName)) {
            screens[i].classList.remove('is_hidden');
        }
    }
}

// Updates UI in game_selection to respond to calls.
function registerInputHandlers(selector, callback) {
    let buttons = Array.from(document.querySelectorAll(selector));
    buttons.forEach(btn => btn.addEventListener('click', callback));
    buttons.forEach(btn => btn.addEventListener('touchend', callback));
}

// Counterpart to registerInputHandlers - deregisters to prevent erroneous calls
function deregisterInputHandlers(selector, callback) {
    let buttons = Array.from(document.querySelectorAll(selector));
    buttons.forEach(btn => btn.removeEventListener('click', callback));
    buttons.forEach(btn => btn.removeEventListener('touchend', callback));
}

function validateGameSelection(selection) {
    if (selection.target.hasAttribute('data-key')) {
        deregisterInputHandlers('.game_selection>button', validateGameSelection);
        startNewGame(Number(selection.target.getAttribute('data-key')));
    }
}

function validateMove(selection) {
    if (selection.target.hasAttribute('data-key')) {
        deregisterInputHandlers('.move_selection>button', validateMove);
        playRound(Number(selection.target.getAttribute('data-key')));
    }
}

function loadGame() {
    displayScreen("new_game_screen");
    registerInputHandlers('.game_selection>button', validateGameSelection);
}

function startNewGame(target) {
    resetScores();
    targetScore = target;
    promptPlayerMove();
}

function promptPlayerMove() {
    displayScreen('player_move_screen');
    registerInputHandlers('.move_selection>button', validateMove);
}

async function playRound(playerMove) {
    let computerMove = generateRandomInteger(3);
    play(playerMove, computerMove);
    displayScreen('round_outcome_screen');
    setTimeout(roundOutcome, 3000);
}

function play(playerMove, computerMove) {
    let msg = "";
    if (playerMove == computerMove) {
        msg = "DRAW";
        updateOutcome(100, msg);
    } else {
        // Scenarios for player victory
        if ((playerMove == rock && computerMove == scissors) || (playerMove == scissors && computerMove == paper) || (playerMove == paper && computerMove == rock)) {
            msg = "YOU WIN";
            updateOutcome(playerMove, msg);
            updateScore(player);
        } else {
            msg = "YOU LOSE";
            updateOutcome(computerMove, msg);
            updateScore(computer);
        }
    }
}

function updateOutcome(move, title) {
    if (move > 3) {
        move = 100;
    }
    let outcomeTitle = document.querySelector('.round_outcome_screen>h2');
    outcomeTitle.textContent = title;
    
    let imgSrc = `media/move_${move}.png`;
    let img = document.querySelector('.winning_move>img');
    img.setAttribute('src', imgSrc);
}

function updateScore(scorer) {
    if (scorer == player) {
        playerScore++;
    } else {
        computerScore++;
    }
    // Update UI to show who scored point
    document.querySelector('#player_score').textContent = `${playerScore}`;
    document.querySelector('#computer_score').textContent = `${computerScore}`;
}

function roundOutcome() {
    if (isGameOver()) { 
        displayResults();
    } else {
        promptPlayerMove();
    }
}
    
function isGameOver() {
    return (playerScore == targetScore || computerScore == targetScore)
}

function displayResults() {
    let msg = "Man mastered machine today!";
    if (computerScore == targetScore) {
        msg = "Beware the rise of the robots!";
    }
    document.querySelector('#game_outcome_text').textContent = msg;
    let outcomeScreen = document.querySelector('game_outcome_screen');    
    let resetButton = document.querySelector('#reset_button');
    resetButton.addEventListener('click', loadGame);
    resetButton.addEventListener('touchend', loadGame);
    
    displayScreen('game_outcome_screen');    
}

// Present interface when page loads
document.addEventListener("DOMContentLoaded", loadGame);
