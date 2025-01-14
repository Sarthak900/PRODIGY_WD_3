
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isVsComputer = false;
let difficulty = 'easy';
let timeLimit = 30;
let countdown;
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart-btn');
const vsPlayerRadio = document.getElementById('vs-player');
const vsComputerRadio = document.getElementById('vs-computer');
const difficultySelect = document.getElementById('difficulty');
const timerDisplay = document.getElementById('timer');
const body = document.body;
const themeToggleButton = document.querySelector('.theme-toggle-button');

const toggleTheme = () => {
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeToggleButton.textContent = "Switch to Light Mode";
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeToggleButton.textContent = "Switch to Dark Mode";
    }
};

const resetTimer = () => {
    clearInterval(countdown);
    timeLimit = 30;
    timerDisplay.textContent = `Time left: ${timeLimit}s`;

    countdown = setInterval(() => {
        timeLimit--;
        timerDisplay.textContent = `Time left: ${timeLimit}s`;

        if (timeLimit <= 0) {
            if (currentPlayer === 'X') {
                alert('Player X ran out of time!');
                switchPlayer();
            } else {
                alert('Player O ran out of time!');
                switchPlayer();
            }
        }
    }, 1000);
};

const switchPlayer = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O' && isVsComputer && gameActive) {
        setTimeout(computerMove, 1000);
    }
};

const checkWin = () => {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }

    return false;
};

const handleCellClick = (e) => {
    const cellIndex = e.target.dataset.index;

    if (gameBoard[cellIndex] || !gameActive) {
        return;
    }

    gameBoard[cellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (currentPlayer === 'X') {
        e.target.classList.add('x');
    } else {
        e.target.classList.add('o');
    }

    if (checkWin()) {
        gameActive = false;
        setTimeout(() => alert(`${currentPlayer} wins! 🎉`), 100);
    } else if (gameBoard.every(cell => cell !== '')) {
        gameActive = false;
        setTimeout(() => alert("It's a draw!"), 100);
    } else {
        switchPlayer();
        resetTimer();
    }
};

const minimax = (board, depth, isMaximizing) => {
    const scores = { 'X': -1, 'O': 1, 'draw': 0 };
    const winner = checkWin();
    if (winner) {
        return scores[currentPlayer];
    }

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = isMaximizing ? 'O' : 'X';
            const score = minimax(board, depth + 1, !isMaximizing);
            board[i] = '';
            bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
    }
    return bestScore;
};

const computerMove = () => {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    gameBoard[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    cells[bestMove].classList.add('o');

    if (checkWin()) {
        gameActive = false;
        setTimeout(() => alert('Computer wins! 🎉'), 100);
    } else if (gameBoard.every(cell => cell !== '')) {
        gameActive = false;
        setTimeout(() => alert("It's a draw!"), 100);
    } else {
        switchPlayer();
        resetTimer();
    }
};

const restartGame = () => {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    resetTimer();
};

vsPlayerRadio.addEventListener('change', () => {
    isVsComputer = false;
    difficultySelect.disabled = true;
});

vsComputerRadio.addEventListener('change', () => {
    isVsComputer = true;
    difficultySelect.disabled = false;
});

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', restartGame);

resetTimer();
