/**
 * Truth-Lens - Verified Travel Memories
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Navigation Mobile Menu
    initNavigation();

    // Initialize Search Functionality (Explore page)
    initSearch();
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

/**
 * Handles the search filtering on the Explore page
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const cards = document.querySelectorAll('.explore-card');

    if (!searchInput || !cards.length) return;

    // Filter function to match input text with card contents
    const filterCards = () => {
        const query = searchInput.value.toLowerCase().trim();

        cards.forEach(card => {
            const locationData = card.getAttribute('data-location') || '';
            const cardTitle = card.querySelector('.explore-card-title')?.textContent || '';
            const cardLocationText = card.querySelector('.explore-card-location')?.textContent || '';
            const cardText = card.querySelector('.explore-card-text')?.textContent || '';

            // Combine all available text elements inside the card for search
            const searchableText = `${locationData} ${cardTitle} ${cardLocationText} ${cardText}`.toLowerCase();

            // Toggle card display based on matching
            if (searchableText.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Filter dynamically as the user types (real-time filtering)
    searchInput.addEventListener('input', filterCards);

    // Also run filter when clicking the search button explicitly
    if (searchButton) {
        searchButton.addEventListener('click', filterCards);
    }
}
