/**
 * Truth-Lens - Verified Travel Memories
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Navigation Mobile Menu
    initNavigation();

    // Initialize Search Functionality (Explore page)
    initSearch();
    
    // Initialize Check-In Functionality (Check-In page)
    initCheckIn();

    // Initialize Profile Functionality (Profile page)
    initProfile();
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

    if (!searchInput || cards.length === 0) return;

    // Filter function to match input text with card contents
    const filterCards = () => {
        const query = searchInput.value.toLowerCase().trim();

        cards.forEach(card => {
            const locationData = card.getAttribute('data-location') || '';
            
            const titleEl = card.querySelector('.explore-card-title');
            const locationEl = card.querySelector('.explore-card-location');
            const textEl = card.querySelector('.explore-card-text');
            
            const cardTitle = titleEl ? titleEl.textContent : '';
            const cardLocationText = locationEl ? locationEl.textContent : '';
            const cardText = textEl ? textEl.textContent : '';

            // Combine all available text elements inside the card for search
            const searchableText = (locationData + ' ' + cardTitle + ' ' + cardLocationText + ' ' + cardText).toLowerCase();

            // Toggle card display based on matching
            if (searchableText.indexOf(query) !== -1) {
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

/**
 * Handles the Check-In page mock functionality (GPS and File Upload)
 */
function initCheckIn() {
    const btnGetLocation = document.getElementById('btnGetLocation');
    const gpsStatus = document.getElementById('gpsStatus');
    const gpsLat = document.getElementById('gpsLat');
    const gpsLng = document.getElementById('gpsLng');
    const uploadBox = document.getElementById('uploadBox');
    
    // GPS Mock Fetching
    if (btnGetLocation && gpsStatus && gpsLat && gpsLng) {
        btnGetLocation.addEventListener('click', () => {
            // Check the city input to provide real coordinates if matched
            const cityInput = document.getElementById('checkinCity');
            const cityName = cityInput ? cityInput.value.toLowerCase().trim() : '';

            // Database of known city coordinates for realistic simulation
            const cityCoordinates = {
                'hyderabad': { lat: '17.3800', lng: '78.4917' },
                'mumbai': { lat: '19.0760', lng: '72.8777' },
                'chennai': { lat: '13.0827', lng: '80.2707' },
                'kyoto': { lat: '35.0116', lng: '135.7681' },
                'santorini': { lat: '36.4166', lng: '25.4324' },
                'oia': { lat: '36.4622', lng: '25.3756' },
                'reykjavik': { lat: '64.1466', lng: '-21.9426' },
                'rome': { lat: '41.9028', lng: '12.4964' },
                'grand canyon': { lat: '36.0544', lng: '-112.1401' },
                'sydney': { lat: '-33.8688', lng: '151.2093' }
            };

            // Update UI to show loading state
            const originalIcon = btnGetLocation.innerHTML;
            btnGetLocation.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching...';
            btnGetLocation.disabled = true;
            gpsStatus.textContent = '';
            
            // Simulate 1 second network delay
            setTimeout(() => {
                let lat, lng;
                
                if (cityCoordinates[cityName]) {
                    lat = cityCoordinates[cityName].lat;
                    lng = cityCoordinates[cityName].lng;
                } else {
                    // Generate random coordinates if the city is not in our database
                    lat = (Math.random() * 180 - 90).toFixed(4);
                    lng = (Math.random() * 360 - 180).toFixed(4);
                }
                
                // Populate inputs
                gpsLat.value = lat;
                gpsLng.value = lng;
                
                // Restore button and show success
                btnGetLocation.innerHTML = originalIcon;
                btnGetLocation.disabled = false;
                gpsStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Verified via Satellite';
            }, 1000);
        });
    }
    
    // Upload Box Mock Styling
    if (uploadBox) {
        uploadBox.addEventListener('click', () => {
            showCustomModal(
                'Image Selection',
                'Camera integration is locked to secure device paths. Selection of metadata-verified images is coming soon.',
                'info'
            );
        });
    }

    // Submit Check-In form validation
    const btnSubmitCheckin = document.getElementById('btnSubmitCheckin');
    if (btnSubmitCheckin) {
        btnSubmitCheckin.addEventListener('click', () => {
            const cityVal = document.getElementById('checkinCity') ? document.getElementById('checkinCity').value.trim() : '';
            const countryVal = document.getElementById('checkinCountry') ? document.getElementById('checkinCountry').value.trim() : '';
            const latVal = gpsLat.value;
            const notesVal = document.getElementById('checkinNotes') ? document.getElementById('checkinNotes').value.trim() : '';
            
            if (!cityVal || !countryVal || !notesVal) {
                showCustomModal(
                    'Incomplete Fields',
                    'Please fill out all required fields (City, Country, and Journal Notes) to document your journey.',
                    'warning'
                );
                return;
            }
            
            if (!latVal) {
                showCustomModal(
                    'GPS Verification Required',
                    'Please click "Get Current Location" to secure your satellite coordinates before publishing.',
                    'warning'
                );
                return;
            }
            
            // Show successful published modal
            showCustomModal(
                'Check-In Published!',
                `Your memory of ${cityVal}, ${countryVal} has been verified and successfully appended to your secure travel ledger.`,
                'success'
            );
            
            // Reset the form
            const form = document.getElementById('checkinForm');
            if (form) {
                form.reset();
            }
            gpsStatus.textContent = '';
        });
    }
}

/**
 * Handles Profile Page button click overlays
 */
function initProfile() {
    const btnEditProfile = document.querySelector('.btn-edit-profile');
    const btnSettings = document.querySelector('.btn-settings');
    
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', () => {
            showCustomModal(
                'Edit Profile',
                'Profile editing is currently locked in read-only mode for this verified explorer account.',
                'info'
            );
        });
    }
    
    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            showCustomModal(
                'Settings Locker',
                'Your cryptographic signature settings are managed via satellite sync. Sync holds are currently inactive.',
                'warning'
            );
        });
    }
}

/**
 * Creates and displays a premium custom animated modal dialog overlay
 * @param {string} title - The title of the modal
 * @param {string} message - The modal body description
 * @param {string} iconType - The type of icon: 'success' | 'info' | 'warning'
 */
function showCustomModal(title, message, iconType) {
    // 1. Create container
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Set icon code based on type
    let iconHTML = '';
    let iconClass = '';
    if (iconType === 'success') {
        iconHTML = '<i class="fa-solid fa-circle-check"></i>';
        iconClass = 'modal-icon-success';
    } else if (iconType === 'warning') {
        iconHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        iconClass = 'modal-icon-warning';
    } else {
        iconHTML = '<i class="fa-solid fa-circle-info"></i>';
        iconClass = 'modal-icon-info';
    }
    
    overlay.innerHTML = `
        <div class="modal-card">
            <div class="modal-icon-container ${iconClass}">
                ${iconHTML}
            </div>
            <h4 class="modal-title">${title}</h4>
            <p class="modal-message">${message}</p>
            <button class="btn btn-primary modal-close-btn">Acknowledge</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 2. Animate in after render (requires a tiny timeout)
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
    
    // 3. Setup close actions
    const closeModal = () => {
        overlay.classList.remove('active');
        // Wait for fade out animation before destroying element
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };
    
    // Close button
    const closeBtn = overlay.querySelector('.modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Click outside backdrop
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeModal();
        }
    });
}
}
