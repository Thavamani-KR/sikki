// Booking functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('guideDate').setAttribute('min', today);
    document.getElementById('packageDate').setAttribute('min', today);

    // Guide booking form
    document.getElementById('guideBookingForm').addEventListener('submit', handleGuideBooking);
    
    // Package booking form
    document.getElementById('packageBookingForm').addEventListener('submit', handlePackageBooking);
});

function handleGuideBooking(e) {
    e.preventDefault();
    
    const formData = {
        type: 'guide',
        name: document.getElementById('guideName').value,
        email: document.getElementById('guideEmail').value,
        phone: document.getElementById('guidePhone').value,
        language: document.getElementById('guideLanguage').value,
        date: document.getElementById('guideDate').value,
        duration: document.getElementById('guideDuration').value,
        destinations: document.getElementById('guideDestinations').value,
        timestamp: new Date().toISOString()
    };
    
    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(formData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Show success message
    alert('Guide booking request submitted successfully! We will contact you within 24 hours.');
    
    // Reset form
    e.target.reset();
}

function handlePackageBooking(e) {
    e.preventDefault();
    
    const formData = {
        type: 'package',
        name: document.getElementById('packageName').value,
        email: document.getElementById('packageEmail').value,
        phone: document.getElementById('packagePhone').value,
        packageType: document.getElementById('packageType').value,
        date: document.getElementById('packageDate').value,
        guests: document.getElementById('packageGuests').value,
        requirements: document.getElementById('packageRequirements').value,
        timestamp: new Date().toISOString()
    };
    
    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(formData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Show success message
    alert('Package quote request submitted successfully! We will send you a detailed quote within 24 hours.');
    
    // Reset form
    e.target.reset();
}