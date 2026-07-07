/**
 * Truth-Lens - Verified Travel Memories
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Navigation Mobile Menu
    initNavigation();
});

/**
 * Handles the mobile navigation menu toggle behavior
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (event) => {
            // Stop click propagation to prevent immediate closing on document click
            event.stopPropagation();
            
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking outside of it
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);

            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('open')) {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });

        // Close menu when a navigation link is clicked (useful for mobile responsiveness)
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }
}
