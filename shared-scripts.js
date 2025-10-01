// Shared JavaScript for Qava Website Navigation

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
    
    // Prevent body scroll when mobile menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function toggleMobileDropdown() {
    const dropdown = document.getElementById('mobileDropdown');
    const toggle = document.querySelector('.mobile-dropdown-toggle');
    
    dropdown.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(event.target) && 
        !hamburgerMenu.contains(event.target)) {
        toggleMobileMenu();
    }
});

// Prevent scroll on mobile when menu is open
document.addEventListener('touchmove', function(e) {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });

// Handle responsive behavior
window.addEventListener('resize', function() {
    if (window.innerWidth > 1100) {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});
