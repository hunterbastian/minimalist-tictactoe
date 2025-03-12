document.addEventListener('DOMContentLoaded', function() {
    // Changelog functionality
    const changelogBtn = document.getElementById('changelog-btn');
    const changelogModal = document.getElementById('changelog-modal');
    const changelogCloseBtn = document.querySelector('.changelog-close');
    const changelogContent = document.getElementById('changelog-content');
    
    // Fetch and display changelog content
    fetch('CHANGELOG.md')
        .then(response => response.text())
        .then(data => {
            // Convert markdown to simple HTML
            let html = data
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*)\*/g, '<em>$1</em>')
                .replace(/- (.*)/g, '<li>$1</li>')
                .replace(/\n\n/g, '</ul><br><ul>');
            
            // Wrap lists in ul tags
            html = html.replace(/<li>(.*?)<\/li>/g, function(match) {
                return '<ul>' + match + '</ul>';
            });
            
            // Remove duplicate ul tags
            html = html.replace(/<\/ul><ul>/g, '');
            
            // Set the content
            changelogContent.innerHTML = html;
        })
        .catch(error => {
            changelogContent.innerHTML = `<p>Error loading changelog: ${error.message}</p>`;
        });
    
    // Toggle changelog modal
    changelogBtn.addEventListener('click', function() {
        changelogModal.style.display = 'block';
        
        // Apply animation
        const modalContent = changelogModal.querySelector('.modal-content');
        modalContent.style.animation = '';
        void modalContent.offsetWidth;
        modalContent.style.animation = 'modal-appear 0.3s ease-out forwards';
    });
    
    // Close changelog modal
    changelogCloseBtn.addEventListener('click', function() {
        // Set up the closing animation
        const modalContent = changelogModal.querySelector('.modal-content');
        modalContent.style.animation = '';
        void modalContent.offsetWidth;
        modalContent.style.animation = 'modal-disappear 0.3s ease-out forwards';
        
        // Hide modal after animation completes
        setTimeout(() => {
            changelogModal.style.display = 'none';
        }, 280);
    });
    
    // Close changelog modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === changelogModal) {
            // Set up the closing animation
            const modalContent = changelogModal.querySelector('.modal-content');
            modalContent.style.animation = '';
            void modalContent.offsetWidth;
            modalContent.style.animation = 'modal-disappear 0.3s ease-out forwards';
            
            // Hide modal after animation completes
            setTimeout(() => {
                changelogModal.style.display = 'none';
            }, 280);
        }
    });
    
    // Add ESC key handling for changelog modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && window.getComputedStyle(changelogModal).display === 'block') {
            // Set up the closing animation
            const modalContent = changelogModal.querySelector('.modal-content');
            modalContent.style.animation = '';
            void modalContent.offsetWidth;
            modalContent.style.animation = 'modal-disappear 0.3s ease-out forwards';
            
            // Hide modal after animation completes
            setTimeout(() => {
                changelogModal.style.display = 'none';
            }, 280);
        }
    });
}); 