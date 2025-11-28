// Load shared navbar
document.addEventListener('DOMContentLoaded', function() {
    fetch('shared-navbar.html')
        .then(response => response.text())
        .then(data => {
            const navbarContainer = document.getElementById('navbar-placeholder');
            if (navbarContainer) {
                navbarContainer.innerHTML = data;
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
});



















