document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const currentTurnDisplay = document.getElementById('current-turn');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeButton = document.querySelector('.close-button');
    
    // Profile elements
    const profileBtn = document.getElementById('profile-btn');
    const currentProfileName = document.getElementById('current-profile');
    const currentProfileDisplay = document.getElementById('current-profile-display');
    const profileModal = document.getElementById('profile-modal');
    const profileCloseBtn = document.querySelector('.profile-close');
    const profileWins = document.getElementById('profile-wins');
    const profileNameInput = document.getElementById('profile-name');
    const saveProfileBtn = document.getElementById('save-profile');
    const profileList = document.getElementById('profile-list');
    
    // Game state
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let isGameActive = true;
    let currentProfile = 'guest';

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Modified initProfiles function to track X and O wins
    function initProfiles() {
        // Initialize profiles if not exists
        if (!localStorage.getItem('tictactoe_profiles')) {
            const defaultProfiles = {
                'guest': { wins: 0, xWins: 0, oWins: 0 }
            };
            localStorage.setItem('tictactoe_profiles', JSON.stringify(defaultProfiles));
        } else {
            // Convert any existing profiles to include xWins and oWins if not present
            const profiles = JSON.parse(localStorage.getItem('tictactoe_profiles'));
            let updated = false;
            
            // Convert any existing "Guest" to "guest"
            if (profiles['Guest'] && !profiles['guest']) {
                profiles['guest'] = profiles['Guest'];
                delete profiles['Guest'];
                updated = true;
            }
            
            // Add xWins and oWins to any profiles that don't have them
            for (const name in profiles) {
                if (!profiles[name].hasOwnProperty('xWins')) {
                    profiles[name].xWins = 0;
                    updated = true;
                }
                if (!profiles[name].hasOwnProperty('oWins')) {
                    profiles[name].oWins = 0;
                    updated = true;
                }
            }
            
            if (updated) {
                localStorage.setItem('tictactoe_profiles', JSON.stringify(profiles));
            }
        }
        
        // Load current profile
        if (localStorage.getItem('tictactoe_currentProfile')) {
            currentProfile = localStorage.getItem('tictactoe_currentProfile').toLowerCase();
            // Update if it was capitalized
            if (currentProfile === 'guest' && localStorage.getItem('tictactoe_currentProfile') !== 'guest') {
                localStorage.setItem('tictactoe_currentProfile', 'guest');
            }
        } else {
            localStorage.setItem('tictactoe_currentProfile', 'guest');
        }
        
        // Update UI
        currentProfileName.textContent = currentProfile;
        currentProfileDisplay.textContent = currentProfile;
        
        updateProfileWins();
        updateProfileList();
    }
    
    function updateProfileWins() {
        const profiles = JSON.parse(localStorage.getItem('tictactoe_profiles'));
        const profile = profiles[currentProfile];
        
        // Get the stat displays
        const profileXWins = document.getElementById('profile-x-wins');
        const profileOWins = document.getElementById('profile-o-wins');
        const statsContainer = document.getElementById('profile-stats-container');
        
        // Don't show wins for guest profile
        if (currentProfile === 'guest') {
            statsContainer.style.display = 'none';
        } else {
            statsContainer.style.display = 'flex';
            profileXWins.textContent = profile.xWins;
            profileOWins.textContent = profile.oWins;
        }
    }
    
    function updateProfileList() {
        // Clear existing list
        profileList.innerHTML = '';
        
        // Get profiles from local storage
        const profiles = JSON.parse(localStorage.getItem('tictactoe_profiles'));
        
        // Create profile items
        for (const name in profiles) {
            const item = document.createElement('div');
            item.className = 'profile-item';
            
            // No longer highlighting current profile
            
            const nameSpan = document.createElement('span');
            
            // Don't show wins for guest profile
            if (name === 'guest') {
                nameSpan.textContent = name;
            } else {
                const totalWins = profiles[name].xWins + profiles[name].oWins;
                nameSpan.textContent = `${name} (${totalWins})`;
            }
            
            const selectButton = document.createElement('button');
            selectButton.className = 'profile-button';
            selectButton.textContent = 'select';
            selectButton.addEventListener('click', function() {
                selectProfile(name);
            });
            
            item.appendChild(nameSpan);
            item.appendChild(selectButton);
            profileList.appendChild(item);
        }
    }
    
    function saveNewProfile() {
        const name = profileNameInput.value.trim();
        if (name !== '') {
            // Get existing profiles
            const profiles = JSON.parse(localStorage.getItem('tictactoe_profiles'));
            
            // Check if profile already exists
            if (!profiles[name]) {
                // Add new profile with zero wins
                profiles[name] = { wins: 0, xWins: 0, oWins: 0 };
                localStorage.setItem('tictactoe_profiles', JSON.stringify(profiles));
                
                // Select the new profile
                selectProfile(name);
                
                // Clear input
                profileNameInput.value = '';
                
                // Update list
                updateProfileList();
            }
        }
    }
    
    function selectProfile(name) {
        currentProfile = name.toLowerCase();
        localStorage.setItem('tictactoe_currentProfile', currentProfile);
        
        // Update UI
        currentProfileName.textContent = name;
        currentProfileDisplay.textContent = name;
        
        updateProfileWins();
    }
    
    function incrementWins() {
        // Get profiles
        const profiles = JSON.parse(localStorage.getItem('tictactoe_profiles'));
        
        // Update wins for current profile
        profiles[currentProfile].wins += 1;
        
        // Update X or O wins based on current player
        if (currentPlayer === 'X') {
            profiles[currentProfile].xWins += 1;
        } else {
            profiles[currentProfile].oWins += 1;
        }
        
        // Save back to localStorage
        localStorage.setItem('tictactoe_profiles', JSON.stringify(profiles));
        
        // Update display
        updateProfileWins();
    }
    
    function openProfileModal() {
        updateProfileList();
        profileModal.style.display = 'block';
    }
    
    function closeProfileModal() {
        profileModal.style.display = 'none';
    }

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
            currentTurnDisplay.textContent = `next turn: ${currentPlayer}`;
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
                
                // Increment wins for current profile
                incrementWins();

                // Delay the message to allow the background color change to be visible
                setTimeout(() => {
                    showModal(`player ${currentPlayer} wins!`);
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
            showModal("it's a draw!");
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
        currentTurnDisplay.textContent = `next turn: ${currentPlayer}`;
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
    closeButton.addEventListener('click', closeModal);
    
    // Profile event listeners
    profileBtn.addEventListener('click', openProfileModal);
    profileCloseBtn.addEventListener('click', closeProfileModal);
    saveProfileBtn.addEventListener('click', saveNewProfile);
    
    // Close profile modal when clicking outside or pressing ESC
    window.addEventListener('click', function(event) {
        if (event.target === profileModal) {
            closeProfileModal();
        }
        if (event.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            if (profileModal.style.display === "block") {
                closeProfileModal();
            }
            if (modal.style.display === "block") {
                closeModal();
            }
        }
    });
    
    // Initialize
    initProfiles();
    currentTurnDisplay.textContent = `next turn: ${currentPlayer}`;
});