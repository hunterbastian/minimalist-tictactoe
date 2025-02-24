document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const currentTurnDisplay = document.getElementById('current-turn');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeButton = document.querySelector('.close-button');
    
    // Game state
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let isGameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    function handleCellClick(event) {
        const cell = event.target;
        const index = cell.getAttribute('data-index');
    
        if (board[index] !== '' || !isGameActive) {
            return;
        }
    
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
    
        // Change cell color based on current player
        cell.style.backgroundColor = currentPlayer === 'X' ? 'lightcoral' : 'lightblue';
    
        checkResult();
    
        // Update the current turn display if game is still active
        if (isGameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            currentTurnDisplay.textContent = `Next turn: ${currentPlayer}`;
        }
    }    

    function checkResult() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] === '' || board[b] === '' || board[c] === '') {
                continue;
            }
            if (board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;

                // Change background color on win
                document.body.style.backgroundColor = 'lightgreen'; 

                // Delay the message to allow the background color change to be visible
                setTimeout(() => {
                    showModal(`Player ${currentPlayer} wins!`);
                    document.body.style.backgroundColor = ''; // Reset color
                }, 500);
                break;
            }
        }

        if (roundWon) {
            isGameActive = false;
            return;
        }

        if (!board.includes('')) {
            showModal("It's a draw!");
            isGameActive = false;
        }
    }

    function resetGame() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.classList.add('shake');

        setTimeout(() => {
            gameBoard.classList.remove('shake');
        }, 500);

        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        currentPlayer = 'X';
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.backgroundColor = ''; // Reset cell background color
        });
        
        // Reset current turn display
        currentTurnDisplay.textContent = `Next turn: ${currentPlayer}`;
    }
    
    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = "block";
    }
    
    function closeModal() {
        modal.style.display = "none";
    }

    // Attach event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Initialize current turn display
    if (currentTurnDisplay) {
        currentTurnDisplay.textContent = `Next turn: ${currentPlayer}`;
    }
});