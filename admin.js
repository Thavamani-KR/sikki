// Admin dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    updateStats();
});

function loadDashboardData() {
    loadRecentBookings();
    loadRecentInquiries();
}

function loadRecentBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const recentBookings = bookings.slice(-5).reverse();
    
    const container = document.getElementById('recentBookings');
    
    if (recentBookings.length === 0) {
        container.innerHTML = '<p>No bookings yet.</p>';
        return;
    }
    
    container.innerHTML = recentBookings.map(booking => `
        <div class="admin-item">
            <strong>${booking.name}</strong> - ${booking.type === 'guide' ? 'Guide Booking' : 'Package Request'}
            <br>
            <small>${new Date(booking.timestamp).toLocaleDateString()}</small>
        </div>
    `).join('');
}

function loadRecentInquiries() {
    const inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
    const recentInquiries = inquiries.slice(-5).reverse();
    
    const container = document.getElementById('recentInquiries');
    
    if (recentInquiries.length === 0) {
        container.innerHTML = '<p>No inquiries yet.</p>';
        return;
    }
    
    container.innerHTML = recentInquiries.map(inquiry => `
        <div class="admin-item">
            <strong>${inquiry.name}</strong> - ${inquiry.subject}
            <br>
            <small>${new Date(inquiry.timestamp).toLocaleDateString()}</small>
        </div>
    `).join('');
}

function updateStats() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
    const itineraries = JSON.parse(localStorage.getItem('currentItinerary')) ? 1 : 0;
    
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('totalInquiries').textContent = inquiries.length;
    document.getElementById('totalItineraries').textContent = itineraries;
}

function exportData() {
    const data = {
        bookings: JSON.parse(localStorage.getItem('bookings')) || [],
        inquiries: JSON.parse(localStorage.getItem('inquiries')) || [],
        itineraries: JSON.parse(localStorage.getItem('currentItinerary')) || null,
        destinations: JSON.parse(localStorage.getItem('selectedDestinations')) || [],
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sikkim-tourism-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Data exported successfully!');
}

function clearData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        localStorage.removeItem('bookings');
        localStorage.removeItem('inquiries');
        localStorage.removeItem('currentItinerary');
        localStorage.removeItem('selectedDestinations');
        
        loadDashboardData();
        updateStats();
        
        alert('All data cleared successfully!');
    }
}