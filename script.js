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
    
    // AI controls
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    const aiControls = document.querySelector('.ai-controls');
    const easyBtn = document.getElementById('easy-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const hardBtn = document.getElementById('hard-btn');
    const currentDifficultyIndicator = document.getElementById('current-difficulty');
    const aiResetIcon = document.getElementById('ai-reset');
    const gameBoard = document.getElementById('game-board');
    const aiSettingsMessage = document.getElementById('ai-settings-message');
    
    // Game state
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let isGameActive = true;
    let currentProfile = 'guest';
    
    // AI state
    let aiEnabled = false;
    let aiDifficulty = 'medium'; // 'easy', 'medium', 'hard'
    let aiPlayer = 'O';  // AI is always O, human is X
    let aiButtonSelected = false; // Track if AI button is selected but no difficulty chosen yet

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
    
    // Function to open the profile modal
    function openProfileModal() {
        // Update profile list first
        updateProfileList();
        
        // Get the modal content element
        const profileContent = document.querySelector('.profile-content');
        
        // Reset and restart animation
        profileContent.style.animation = '';
        
        // Show the modal first
        profileModal.style.display = 'block';
        
        // Force reflow then set animation
        void profileContent.offsetWidth;
        profileContent.style.animation = 'modal-appear 0.3s ease-out forwards';
        
        // Apply UI effects
        gameBoard.classList.add('waiting-for-settings');
        aiSettingsMessage.classList.remove('visible');
        
        // Clean any existing listeners
        removeModalEventListeners();
        
        // Set up event listeners
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
            document.addEventListener('keydown', handleEscKey);
        }, 10);
    }
    
    // Function to start the modal closing animation
    function animateProfileModalClose() {
        // Get the modal content element
        const profileContent = document.querySelector('.profile-content');
        
        // Only proceed if the modal is actually visible
        if (window.getComputedStyle(profileModal).display !== 'block') {
            return;
        }
        
        // Remove event listeners before animation
        removeModalEventListeners();
        
        // Set up the closing animation
        profileContent.style.animation = '';
        void profileContent.offsetWidth;
        profileContent.style.animation = 'modal-disappear 0.3s ease-out forwards';
        
        // Close after animation completes
        setTimeout(() => {
            completeProfileModalClose();
        }, 280);
    }
    
    // Function to actually close the profile modal (after animation)
    function completeProfileModalClose() {
        // Hide the modal
        profileModal.style.display = 'none';
        
        // Reset animation
        const profileContent = document.querySelector('.profile-content');
        profileContent.style.animation = '';
        
        // Update UI
        if (!aiButtonSelected) {
            gameBoard.classList.remove('waiting-for-settings');
        } else {
            aiSettingsMessage.classList.add('visible');
        }
    }
    
    // Utility function to close the modal immediately without animation
    function closeProfileModal() {
        // Remove event listeners
        removeModalEventListeners();
        
        // Hide immediately
        profileModal.style.display = 'none';
        
        // Reset animation
        const profileContent = document.querySelector('.profile-content');
        profileContent.style.animation = '';
        
        // Update UI
        if (!aiButtonSelected) {
            gameBoard.classList.remove('waiting-for-settings');
        } else {
            aiSettingsMessage.classList.add('visible');
        }
    }
    
    // Helper to remove modal event listeners
    function removeModalEventListeners() {
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleEscKey);
    }
    
    // Handler for clicks outside the modal
    function handleOutsideClick(event) {
        const modalContent = document.querySelector('.profile-content');
        
        // Check if click is outside modal and not on profile button
        if (!modalContent.contains(event.target) && 
            event.target !== profileBtn && 
            !profileBtn.contains(event.target)) {
            
            // Start closing animation
            animateProfileModalClose();
        }
    }
    
    // Handler for ESC key
    function handleEscKey(event) {
        if (event.key === 'Escape') {
            // Start closing animation
            animateProfileModalClose();
        }
    }
    
    function handleCellClick(event) {
        const cell = event.target;
        const index = cell.getAttribute('data-index');
    
        if (board[index] !== '' || !isGameActive) {
            return;
        }
    
        // Process player move
        makeMove(index);
        
        // If AI is enabled and it's the AI's turn, make an AI move
        if (isGameActive && aiEnabled && currentPlayer === aiPlayer) {
            setTimeout(() => {
                makeAiMove();
            }, 500); // Delay for better UX
        }
    }    

    function makeMove(index) {
        board[index] = currentPlayer;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
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
    
    function makeAiMove() {
        if (!isGameActive) return;
        
        let index;
        
        switch(aiDifficulty) {
            case 'easy':
                index = makeRandomMove();
                break;
            case 'medium':
                // 50% chance to make a strategic move, 50% chance to make a random move
                index = Math.random() > 0.5 ? findBestMove(1) : makeRandomMove();
                break;
            case 'hard':
                index = findBestMove(2);
                break;
            default:
                index = makeRandomMove();
        }
        
        if (index !== null) {
            makeMove(index);
        }
    }
    
    function makeRandomMove() {
        // Get all empty cells
        const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
        
        if (emptyCells.length === 0) return null;
        
        // Select a random empty cell
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }
    
    function findBestMove(depth) {
        // Try to win
        const winMove = findWinningMove(aiPlayer);
        if (winMove !== null) return winMove;
        
        // Block opponent from winning
        const blockMove = findWinningMove(aiPlayer === 'X' ? 'O' : 'X');
        if (blockMove !== null) return blockMove;
        
        // If depth >= 2, use more strategy
        if (depth >= 2) {
            // Take center if available
            if (board[4] === '') return 4;
            
            // Take corners if available
            const corners = [0, 2, 6, 8].filter(i => board[i] === '');
            if (corners.length > 0) {
                return corners[Math.floor(Math.random() * corners.length)];
            }
        }
        
        // Otherwise make a random move
        return makeRandomMove();
    }
    
    function findWinningMove(player) {
        // Check each possible move to see if it results in a win
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                // Try this move
                board[i] = player;
                
                // Check if this move wins
                let isWinningMove = false;
                for (let j = 0; j < winningConditions.length; j++) {
                    const [a, b, c] = winningConditions[j];
                    if (board[a] === player && board[b] === player && board[c] === player) {
                        isWinningMove = true;
                        break;
                    }
                }
                
                // Undo the move
                board[i] = '';
                
                if (isWinningMove) {
                    return i;
                }
            }
        }
        
        return null;
    }
    
    // Function to toggle just the AI menu visibility
    function toggleAIMenu(event) {
        event.stopPropagation(); // Prevent the document click handler from immediately closing the menu
        
        // Toggle based on current visibility
        if (isAIMenuVisible()) {
            animateAIMenuClose();
        } else {
            // Set button to selected state if not already enabled
            if (!aiEnabled) {
                aiButtonSelected = true;
                updateAiDisplay();
            }
            
            // If AI is already enabled, also disable it when toggling the menu
            if (aiEnabled) {
                aiEnabled = false;
                aiButtonSelected = false;
                updateAiDisplay();
                resetGame();
            }
            
            openAIMenu();
        }
    }
    
    // Function to check if AI menu is visible
    function isAIMenuVisible() {
        return aiControls.style.display === 'flex' || 
               window.getComputedStyle(aiControls).display === 'flex';
    }
    
    // Function to open the AI menu with animation
    function openAIMenu() {
        // Reset animation first
        aiControls.style.animation = '';
        
        // Show the menu first
        aiControls.style.display = 'flex';
        
        // Force reflow to ensure animation restart
        void aiControls.offsetWidth;
        
        // Re-enable animation with the AI-specific animation
        aiControls.style.animation = 'ai-menu-appear 0.3s ease-out forwards';
        
        // Ensure full visibility
        aiControls.style.opacity = '1';
        aiControls.style.visibility = 'visible';
        
        // Add a one-time event listener for ESC key
        document.addEventListener('keydown', handleAIMenuEscKey);
    }
    
    // Handler for ESC key specifically for AI menu
    function handleAIMenuEscKey(event) {
        if (event.key === 'Escape' && isAIMenuVisible()) {
            // Remove the event listener to prevent duplicates
            document.removeEventListener('keydown', handleAIMenuEscKey);
            
            // Start closing animation
            animateAIMenuClose();
        }
    }
    
    // Function to animate the AI menu closing
    function animateAIMenuClose() {
        // Only proceed if the menu is visible
        if (!isAIMenuVisible()) {
            return;
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', handleAIMenuEscKey);
        
        // Reset animation
        aiControls.style.animation = '';
        void aiControls.offsetWidth;
        
        // Apply closing animation
        aiControls.style.animation = 'ai-menu-disappear 0.3s ease-out forwards';
        
        // If menu is being closed and no difficulty was selected, reset selection state
        if (aiButtonSelected && !aiEnabled) {
            aiButtonSelected = false;
            updateAiDisplay();
        }
        
        // Wait for animation to complete, then hide
        setTimeout(() => {
            completeAIMenuClose();
        }, 280);
    }
    
    // Function to remove AI menu event listeners
    function removeAIMenuEventListeners() {
        document.removeEventListener('keydown', handleAIMenuEscKey);
    }
    
    // Function to finish the AI menu closing after animation
    function completeAIMenuClose() {
        // Remove any event listeners
        removeAIMenuEventListeners();
        
        // Hide the AI menu
        aiControls.style.display = 'none';
        aiControls.style.animation = '';
    }
    
    // Function to close AI menu without animation
    function closeAIMenu() {
        // Remove any event listeners
        removeAIMenuEventListeners();
        
        // Hide immediately
        aiControls.style.display = 'none';
        aiControls.style.animation = '';
        
        // Reset selection state if needed
        if (aiButtonSelected && !aiEnabled) {
            aiButtonSelected = false;
            updateAiDisplay();
        }
    }
    
    // Function to change AI difficulty and enable AI
    function changeAIDifficulty(difficulty) {
        aiDifficulty = difficulty;
        aiEnabled = true; // Enable AI when selecting difficulty
        aiButtonSelected = false; // Clear the selected state
        updateAiDisplay();
        resetGame();
        
        // Hide the AI controls after selection with animation
        animateAIMenuClose();
    }
    
    // Function to update display of AI status
    function updateAiDisplay() {
        // Update the AI toggle button text
        const defaultTextSpan = aiToggleBtn.querySelector('.default-text');
        const hoverTextSpan = aiToggleBtn.querySelector('.hover-text');
        
        if (aiEnabled) {
            defaultTextSpan.textContent = 'vs ai';
            hoverTextSpan.textContent = ''; // Remove the hover text when AI is enabled
            aiToggleBtn.classList.add('active');
            aiToggleBtn.classList.remove('selected');
            
            // Remove blur and hide message when AI is fully enabled
            gameBoard.classList.remove('waiting-for-settings');
            aiSettingsMessage.classList.remove('visible');
        } else if (aiButtonSelected) {
            defaultTextSpan.textContent = 'vs ai';
            hoverTextSpan.textContent = 'cancel'; // When hovering in selected mode, show "cancel"
            aiToggleBtn.classList.add('selected');
            aiToggleBtn.classList.remove('active');
            
            // Apply blur and show message when waiting for difficulty selection
            gameBoard.classList.add('waiting-for-settings');
            aiSettingsMessage.classList.add('visible');
        } else {
            defaultTextSpan.textContent = 'vs human';
            hoverTextSpan.textContent = 'vs ai'; // When hovering in human mode, show "vs ai"
            aiToggleBtn.classList.remove('active');
            aiToggleBtn.classList.remove('selected');
            
            // Remove blur and hide message in human mode
            gameBoard.classList.remove('waiting-for-settings');
            aiSettingsMessage.classList.remove('visible');
        }
        
        // Update the selected difficulty button
        [easyBtn, mediumBtn, hardBtn].forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add the appropriate difficulty class for the selected difficulty button
        switch(aiDifficulty) {
            case 'easy':
                easyBtn.classList.add('selected');
                break;
            case 'medium':
                mediumBtn.classList.add('selected');
                break;
            case 'hard':
                hardBtn.classList.add('selected');
                break;
        }
        
        // Update difficulty indicator
        currentDifficultyIndicator.textContent = aiDifficulty;
        
        // Remove all difficulty classes first
        currentDifficultyIndicator.classList.remove('easy', 'medium', 'hard');
        
        // Add the appropriate class for styling
        currentDifficultyIndicator.classList.add(aiDifficulty);
        
        // Show/hide difficulty indicator based on AI state
        if (aiEnabled) {
            currentDifficultyIndicator.style.display = 'block';
        } else {
            currentDifficultyIndicator.style.display = 'none';
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
        // Clear the board state
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        isGameActive = true;
        
        // Clear the visual board
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winning-cell');
            // Also reset inline background color styles
            cell.style.backgroundColor = '';
        });
        
        // Reset current turn display
        currentTurnDisplay.textContent = `next turn: ${currentPlayer}`;
        
        // If the game was reset due to AI being disabled, make sure to remove any blur/message
        if (aiButtonSelected === false && aiEnabled === false) {
            gameBoard.classList.remove('waiting-for-settings');
            aiSettingsMessage.classList.remove('visible');
        }
        
        // If AI is enabled and it's AI's turn, make a move
        if (aiEnabled && currentPlayer === aiPlayer) {
            setTimeout(() => {
                makeAiMove();
            }, 500);
        }
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
    resetButton.addEventListener('click', function() {
        // Add the shake animation to the game board
        gameBoard.classList.add('shake');
        
        // Remove the shake class after the animation completes
        setTimeout(() => {
            gameBoard.classList.remove('shake');
        }, 500); // Duration of the shake animation
        
        // Reset the game
        resetGame();
    });
    closeButton.addEventListener('click', closeModal);
    
    // Profile event listeners
    profileBtn.addEventListener('click', function() {
        // Toggle based on current visibility
        if (window.getComputedStyle(profileModal).display === 'block') {
            animateProfileModalClose();
        } else {
            openProfileModal();
        }
    });
    profileCloseBtn.addEventListener('click', animateProfileModalClose);
    saveProfileBtn.addEventListener('click', saveNewProfile);
    
    // AI button event listeners
    aiToggleBtn.addEventListener('click', toggleAIMenu);
    easyBtn.addEventListener('click', () => changeAIDifficulty('easy'));
    mediumBtn.addEventListener('click', () => changeAIDifficulty('medium'));
    hardBtn.addEventListener('click', () => changeAIDifficulty('hard'));
    
    // AI reset icon event listener
    aiResetIcon.addEventListener('click', function(event) {
        // Prevent the click from triggering the parent button's click handler
        event.stopPropagation();
        
        // Disable AI mode and clear selected state
        if (aiEnabled || aiButtonSelected) {
            aiEnabled = false;
            aiButtonSelected = false;
            updateAiDisplay();
            resetGame();
            
            // Hide the AI controls if they're visible with animation
            if (isAIMenuVisible()) {
                animateAIMenuClose();
            }
        }
    });
    
    // Close AI menu when clicking outside
    document.addEventListener('click', function(event) {
        // Check if the click is outside of the AI menu and toggle button
        if (isAIMenuVisible() && !aiControls.contains(event.target) && event.target !== aiToggleBtn) {
            animateAIMenuClose();
        }
    });
    
    // Close profile modal when clicking outside or pressing ESC
    window.addEventListener('click', function(event) {
        if (event.target === profileModal) {
            animateProfileModalClose();
        }
        if (event.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            // We now have specific handlers for each component's ESC key functionality,
            // so this global handler is just a fallback
            
            // For the regular game modal
            if (modal.style.display === "block") {
                closeModal();
            }
        }
    });
    
    // Initialize
    initProfiles();
    updateAiDisplay();
    currentTurnDisplay.textContent = `next turn: ${currentPlayer}`;
});