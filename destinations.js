// Destinations data based on the content provided
const destinations = [
    {
        id: 1,
        name: "Gangtok",
        location: "East Sikkim",
        description: "The vibrant capital city known for its monasteries, cable car rides, and bustling MG Marg.",
        bestTime: "March to June, September to November",
        types: ["cultural", "heritage"],
        category: "Cultural Tourism"
    },
    {
        id: 2,
        name: "Tsomgo Lake",
        location: "40 km from Gangtok",
        description: "A glacial lake at an altitude of 3,753m, surrounded by snow and blooming rhododendrons.",
        bestTime: "April to May, November to January",
        types: ["adventure", "eco"],
        category: "Adventure Tourism"
    },
    {
        id: 3,
        name: "Yumthang Valley",
        location: "North Sikkim",
        description: "Also called the Valley of Flowers, Yumthang is a stunning high-altitude valley with hot springs and yak pastures.",
        bestTime: "April to June",
        types: ["eco", "adventure"],
        category: "Eco-Tourism"
    },
    {
        id: 4,
        name: "Rumtek Monastery",
        location: "24 km from Gangtok",
        description: "One of the largest monasteries in Sikkim, known for its golden stupa and religious significance.",
        bestTime: "March to June, October to December",
        types: ["religious", "cultural"],
        category: "Religious Sites"
    },
    {
        id: 5,
        name: "Nathula Pass",
        location: "East Sikkim",
        description: "A mountain pass on the Indo-China border at 14,140 feet, offering breathtaking views.",
        bestTime: "May to October",
        types: ["adventure", "heritage"],
        category: "Adventure Tourism"
    },
    {
        id: 6,
        name: "Pelling",
        location: "West Sikkim",
        description: "A hill station offering panoramic views of Kanchenjunga and historic monasteries.",
        bestTime: "October to June",
        types: ["cultural", "eco"],
        category: "Cultural Tourism"
    },
    {
        id: 7,
        name: "Gurudongmar Lake",
        location: "North Sikkim",
        description: "One of the highest lakes in the world at 17,800 feet, considered sacred by Buddhists and Sikhs.",
        bestTime: "May to September",
        types: ["religious", "adventure"],
        category: "Religious Sites"
    },
    {
        id: 8,
        name: "Lachung",
        location: "North Sikkim",
        description: "A mountain village known for its alpine scenery and as a gateway to Yumthang Valley.",
        bestTime: "March to June, September to November",
        types: ["eco", "cultural"],
        category: "Eco-Tourism"
    },
    {
        id: 9,
        name: "Yuksom",
        location: "West Sikkim",
        description: "The first capital of Sikkim, rich in history and starting point for Kanchenjunga treks.",
        bestTime: "March to May, October to December",
        types: ["heritage", "adventure"],
        category: "Heritage Locations"
    },
    {
        id: 10,
        name: "Namchi",
        location: "South Sikkim",
        description: "Home to the world's largest statue of Guru Padmasambhava and stunning valley views.",
        bestTime: "October to June",
        types: ["religious", "cultural"],
        category: "Religious Sites"
    }
];

// Global variables
let filteredDestinations = [...destinations];
let selectedDestinations = JSON.parse(localStorage.getItem('selectedDestinations')) || [];

// DOM elements
const destinationsGrid = document.getElementById('destinationsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const noResults = document.getElementById('noResults');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderDestinations();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Filter functionality
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    filteredDestinations = destinations.filter(destination => 
        destination.name.toLowerCase().includes(searchTerm) ||
        destination.location.toLowerCase().includes(searchTerm) ||
        destination.description.toLowerCase().includes(searchTerm)
    );
    
    renderDestinations();
}

// Handle filter
function handleFilter(e) {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    e.target.classList.add('active');
    
    const filterType = e.target.getAttribute('data-filter');
    
    if (filterType === 'all') {
        filteredDestinations = [...destinations];
    } else {
        filteredDestinations = destinations.filter(destination => 
            destination.types.includes(filterType)
        );
    }
    
    // Apply search filter if there's a search term
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredDestinations = filteredDestinations.filter(destination => 
            destination.name.toLowerCase().includes(searchTerm) ||
            destination.location.toLowerCase().includes(searchTerm) ||
            destination.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderDestinations();
}

// Render destinations
function renderDestinations() {
    if (filteredDestinations.length === 0) {
        destinationsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    destinationsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    destinationsGrid.innerHTML = filteredDestinations.map(destination => `
        <div class="destination-detail-card" data-id="${destination.id}">
            <div class="destination-header">
                <div class="destination-image"></div>
            </div>
            <div class="destination-info">
                <h3>${destination.name}</h3>
                <div class="destination-meta">
                    <div class="destination-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${destination.location}
                    </div>
                    <div class="best-time">
                        Best: ${destination.bestTime}
                    </div>
                </div>
                <p class="destination-description">${destination.description}</p>
                <div class="destination-tags">
                    ${destination.types.map(type => `<span class="tag">${formatTag(type)}</span>`).join('')}
                </div>
                <div class="destination-actions">
                    <div class="destination-tags">
                        <span class="tag">${destination.category}</span>
                    </div>
                    <button class="add-to-itinerary ${isInItinerary(destination.id) ? 'added' : ''}" 
                            onclick="toggleItinerary(${destination.id})">
                        ${isInItinerary(destination.id) ? 'Added ✓' : 'Add to Trip'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Format tag names
function formatTag(tag) {
    const tagMap = {
        'cultural': 'Cultural',
        'adventure': 'Adventure',
        'eco': 'Eco-Tourism',
        'religious': 'Religious',
        'heritage': 'Heritage'
    };
    return tagMap[tag] || tag;
}

// Check if destination is in itinerary
function isInItinerary(destinationId) {
    return selectedDestinations.some(dest => dest.id === destinationId);
}

// Toggle destination in itinerary
function toggleItinerary(destinationId) {
    const destination = destinations.find(d => d.id === destinationId);
    const isAlreadySelected = isInItinerary(destinationId);
    
    if (isAlreadySelected) {
        selectedDestinations = selectedDestinations.filter(d => d.id !== destinationId);
    } else {
        selectedDestinations.push(destination);
    }
    
    // Save to localStorage
    localStorage.setItem('selectedDestinations', JSON.stringify(selectedDestinations));
    
    // Update button
    const button = event.target;
    if (isAlreadySelected) {
        button.textContent = 'Add to Trip';
        button.classList.remove('added');
    } else {
        button.textContent = 'Added ✓';
        button.classList.add('added');
    }
    
    // Show feedback
    showNotification(isAlreadySelected ? 'Removed from your trip!' : 'Added to your trip!');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2c5f2d;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}