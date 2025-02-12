document.addEventListener('DOMContentLoaded', function() {
    const cells = document.querySelectorAll('.cell');
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let isGameActive = true;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
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
        if (currentPlayer === 'X') {
            cell.style.backgroundColor = 'lightcoral'; // Light red for X
        } else {
            cell.style.backgroundColor = 'lightblue'; // Light blue for O
        }
    
        // Inside your handleCellClick function, after updating the cell:
    const gameBoard = document.getElementById('game-board');
    gameBoard.classList.add('tiny-bounce');
    setTimeout(() => {
        gameBoard.classList.remove('tiny-bounce');
    }, 400); // Duration matches the CSS animation duration

        checkResult();
    
        // Update the current turn display
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('current-turn').textContent = `Next turn: ${currentPlayer}`;
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
                document.body.style.backgroundColor = 'lightgreen'; // Winning color

                // Delay the alert to allow the background color change to be visible
                setTimeout(() => {
                    alert(`Player ${currentPlayer} wins!`);
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
            alert("It's a draw!");
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
            cell.style.backgroundColor = ''; // Reset cell background color to default
        });
    }

    // Attach event listeners to cells and the reset button
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    document.getElementById('reset').addEventListener('click', resetGame);
});

function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message; // Set the message
    modal.style.display = "block"; // Show the modal
}

// Close the modal when the close button is clicked
document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('modal').style.display = "none";
});

document.addEventListener('DOMContentLoaded', function() {
    // Other code...

    // Attach event listeners to cells and the reset button
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    document.getElementById('reset').addEventListener('click', resetGame);
});