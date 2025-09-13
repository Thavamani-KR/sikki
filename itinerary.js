// Itinerary planning functionality
let selectedDestinations = JSON.parse(localStorage.getItem('selectedDestinations')) || [];

// DOM elements
const availableDestinations = document.getElementById('availableDestinations');
const selectedDestinationsList = document.getElementById('selectedDestinationsList');
const selectedCount = document.getElementById('selectedCount');
const itineraryResult = document.getElementById('itineraryResult');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadAvailableDestinations();
    updateSelectedDestinations();
    loadSavedItinerary();
});

// Load available destinations
function loadAvailableDestinations() {
    if (typeof destinations === 'undefined' || !destinations) {
        availableDestinations.innerHTML = '<p>Unable to load destinations. Please visit the <a href="destinations.html">destinations page</a> first.</p>';
        return;
    }
    
    availableDestinations.innerHTML = destinations.map(destination => `
        <div class="destination-item">
            <div>
                <strong>${destination.name}</strong>
                <br>
                <small>${destination.location}</small>
            </div>
            <button class="btn btn-primary" onclick="addDestination(${destination.id})" 
                    ${isDestinationSelected(destination.id) ? 'disabled' : ''}>
                ${isDestinationSelected(destination.id) ? 'Added' : 'Add'}
            </button>
        </div>
    `).join('');
}

// Check if destination is selected
function isDestinationSelected(destinationId) {
    return selectedDestinations.some(dest => dest.id === destinationId);
}

// Add destination to selection
function addDestination(destinationId) {
    if (typeof destinations === 'undefined' || !destinations) return;
    const destination = destinations.find(d => d.id === destinationId);
    if (destination && !isDestinationSelected(destinationId)) {
        selectedDestinations.push(destination);
        localStorage.setItem('selectedDestinations', JSON.stringify(selectedDestinations));
        updateSelectedDestinations();
        loadAvailableDestinations();
    }
}

// Remove destination from selection
function removeDestination(destinationId) {
    selectedDestinations = selectedDestinations.filter(d => d.id !== destinationId);
    localStorage.setItem('selectedDestinations', JSON.stringify(selectedDestinations));
    updateSelectedDestinations();
    loadAvailableDestinations();
}

// Update selected destinations display
function updateSelectedDestinations() {
    selectedCount.textContent = `(${selectedDestinations.length})`;
    
    if (selectedDestinations.length === 0) {
        selectedDestinationsList.innerHTML = `
            <p class="no-selection">No destinations selected yet. Choose from the available destinations or visit our <a href="destinations.html">destinations page</a>.</p>
        `;
    } else {
        selectedDestinationsList.innerHTML = selectedDestinations.map(destination => `
            <div class="destination-item">
                <div>
                    <strong>${destination.name}</strong>
                    <br>
                    <small>${destination.location}</small>
                </div>
                <button class="remove-destination" onclick="removeDestination(${destination.id})">
                    Remove
                </button>
            </div>
        `).join('');
    }
}

// Generate optimized itinerary
function generateItinerary() {
    if (selectedDestinations.length === 0) {
        alert('Please select at least one destination to generate an itinerary.');
        return;
    }
    
    const tripDuration = parseInt(document.getElementById('tripDuration').value);
    const travelStyle = document.getElementById('travelStyle').value;
    const groupSize = parseInt(document.getElementById('groupSize').value);
    const interests = document.getElementById('interests').value;
    
    // Generate optimized route
    const optimizedRoute = optimizeRoute(selectedDestinations);
    const itinerary = createDetailedItinerary(optimizedRoute, tripDuration, travelStyle, interests);
    
    // Display results
    displayItinerary(itinerary);
    
    // Save itinerary
    const itineraryData = {
        destinations: selectedDestinations,
        preferences: { tripDuration, travelStyle, groupSize, interests },
        itinerary: itinerary,
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('currentItinerary', JSON.stringify(itineraryData));
}

// Optimize route based on geographical location
function optimizeRoute(destinations) {
    // Simple optimization: group by regions
    const regions = {
        'East Sikkim': [],
        'West Sikkim': [],
        'North Sikkim': [],
        'South Sikkim': []
    };
    
    destinations.forEach(dest => {
        const region = getRegionFromLocation(dest.location);
        if (regions[region]) {
            regions[region].push(dest);
        } else {
            regions['East Sikkim'].push(dest); // Default to East Sikkim
        }
    });
    
    // Create optimized route starting from Gangtok (East Sikkim)
    const optimizedRoute = [];
    const regionOrder = ['East Sikkim', 'North Sikkim', 'West Sikkim', 'South Sikkim'];
    
    regionOrder.forEach(region => {
        optimizedRoute.push(...regions[region]);
    });
    
    return optimizedRoute;
}

// Get region from location string
function getRegionFromLocation(location) {
    if (location.includes('East Sikkim') || location.includes('Gangtok')) return 'East Sikkim';
    if (location.includes('West Sikkim')) return 'West Sikkim';
    if (location.includes('North Sikkim')) return 'North Sikkim';
    if (location.includes('South Sikkim')) return 'South Sikkim';
    return 'East Sikkim'; // Default
}

// Create detailed itinerary
function createDetailedItinerary(route, duration, style, interests) {
    const daysPerDestination = Math.max(1, Math.floor(duration / route.length));
    const itinerary = [];
    let currentDay = 1;
    
    route.forEach((destination, index) => {
        const days = index === route.length - 1 ? 
            duration - currentDay + 1 : daysPerDestination;
        
        itinerary.push({
            destination: destination,
            startDay: currentDay,
            endDay: currentDay + days - 1,
            days: days,
            activities: generateActivities(destination, days, interests),
            accommodation: getAccommodationSuggestion(style),
            transport: index === 0 ? 'Arrival in Gangtok' : `Travel from ${route[index-1].name}`
        });
        
        currentDay += days;
    });
    
    return itinerary;
}

// Generate activities for destination
function generateActivities(destination, days, interests) {
    const activities = [];
    
    // Day-wise activities based on destination
    for (let i = 1; i <= days; i++) {
        if (i === 1) {
            activities.push(`Arrival and check-in`);
            activities.push(`Explore ${destination.name} local area`);
        }
        
        // Interest-based activities
        switch (interests) {
            case 'cultural':
                activities.push(`Visit local monasteries and cultural sites`);
                activities.push(`Experience local cuisine and markets`);
                break;
            case 'adventure':
                activities.push(`Trekking and outdoor activities`);
                activities.push(`Photography and sightseeing`);
                break;
            case 'eco':
                activities.push(`Nature walks and wildlife spotting`);
                activities.push(`Visit botanical gardens and eco-parks`);
                break;
            case 'religious':
                activities.push(`Visit sacred sites and monasteries`);
                activities.push(`Participate in prayer ceremonies`);
                break;
            default:
                activities.push(`Sightseeing and local exploration`);
        }
        
        if (i === days && days > 1) {
            activities.push(`Leisure time and departure preparation`);
        }
    }
    
    return activities.slice(0, days * 2); // Limit activities per day
}

// Get accommodation suggestion based on travel style
function getAccommodationSuggestion(style) {
    switch (style) {
        case 'budget':
            return 'Budget guesthouses and homestays';
        case 'luxury':
            return 'Luxury resorts and heritage hotels';
        default:
            return 'Comfortable mid-range hotels';
    }
}

// Display generated itinerary
function displayItinerary(itinerary) {
    const totalDays = itinerary[itinerary.length - 1].endDay;
    const totalDestinations = itinerary.length;
    
    let html = `
        <h3><i class="fas fa-route"></i> Your Optimized Sikkim Itinerary</h3>
        <div class="route-info">
            <h4>Trip Overview</h4>
            <p><strong>Total Duration:</strong> ${totalDays} Days / ${totalDays - 1} Nights</p>
            <p><strong>Destinations:</strong> ${totalDestinations} places</p>
            <p><strong>Route:</strong> ${itinerary.map(item => item.destination.name).join(' → ')}</p>
        </div>
        
        <div class="daily-itinerary">
            <h4>Day-wise Itinerary</h4>
    `;
    
    itinerary.forEach((item, index) => {
        html += `
            <div class="day-item">
                <h5>Day ${item.startDay}${item.days > 1 ? ` - ${item.endDay}` : ''}: ${item.destination.name}</h5>
                <p><strong>Location:</strong> ${item.destination.location}</p>
                <p><strong>Accommodation:</strong> ${item.accommodation}</p>
                <p><strong>Transport:</strong> ${item.transport}</p>
                <div class="activities">
                    <strong>Activities:</strong>
                    <ul>
                        ${item.activities.map(activity => `<li>${activity}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        <div class="itinerary-actions">
            <button class="btn btn-primary" onclick="downloadItinerary()">
                <i class="fas fa-download"></i> Download Itinerary
            </button>
            <button class="btn btn-secondary" onclick="shareItinerary()">
                <i class="fas fa-share"></i> Share Itinerary
            </button>
            <a href="booking.html" class="btn btn-primary">
                <i class="fas fa-calendar-check"></i> Book This Trip
            </a>
        </div>
    `;
    
    itineraryResult.innerHTML = html;
    itineraryResult.style.display = 'block';
    
    // Scroll to results
    itineraryResult.scrollIntoView({ behavior: 'smooth' });
}

// Download itinerary as text
function downloadItinerary() {
    const itineraryData = JSON.parse(localStorage.getItem('currentItinerary'));
    if (!itineraryData) return;
    
    let content = "SIKKIM TOURISM - YOUR TRAVEL ITINERARY\\n";
    content += "=====================================\\n\\n";
    
    const itinerary = itineraryData.itinerary;
    const totalDays = itinerary[itinerary.length - 1].endDay;
    
    content += `Trip Duration: ${totalDays} Days\\n`;
    content += `Destinations: ${itinerary.map(item => item.destination.name).join(', ')}\\n`;
    content += `Generated on: ${new Date(itineraryData.createdAt).toLocaleDateString()}\\n\\n`;
    
    itinerary.forEach(item => {
        content += `DAY ${item.startDay}${item.days > 1 ? ` - ${item.endDay}` : ''}: ${item.destination.name.toUpperCase()}\\n`;
        content += `Location: ${item.destination.location}\\n`;
        content += `Accommodation: ${item.accommodation}\\n`;
        content += `Transport: ${item.transport}\\n`;
        content += `Activities:\\n`;
        item.activities.forEach(activity => {
            content += `  - ${activity}\\n`;
        });
        content += "\\n";
    });
    
    content += "\\n---\\nGenerated by Sikkim Tourism Portal\\n";
    content += "For bookings and assistance: support@sikkimtourism.gov.in";
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sikkim-itinerary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Share itinerary
function shareItinerary() {
    const itineraryData = JSON.parse(localStorage.getItem('currentItinerary'));
    if (!itineraryData) return;
    
    const shareText = `Check out my Sikkim travel itinerary! ${itineraryData.itinerary.length} destinations in ${itineraryData.preferences.tripDuration} days: ${itineraryData.itinerary.map(item => item.destination.name).join(', ')}. Plan your trip at Sikkim Tourism Portal!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Sikkim Travel Itinerary',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Itinerary details copied to clipboard!');
        });
    }
}

// Load saved itinerary if exists
function loadSavedItinerary() {
    const savedItinerary = localStorage.getItem('currentItinerary');
    if (savedItinerary) {
        const data = JSON.parse(savedItinerary);
        // Auto-fill preferences
        document.getElementById('tripDuration').value = data.preferences.tripDuration;
        document.getElementById('travelStyle').value = data.preferences.travelStyle;
        document.getElementById('groupSize').value = data.preferences.groupSize;
        document.getElementById('interests').value = data.preferences.interests;
        
        // Display saved itinerary
        if (data.itinerary) {
            displayItinerary(data.itinerary);
        }
    }
}