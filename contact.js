// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
});

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value,
        timestamp: new Date().toISOString()
    };
    
    // Save inquiry to localStorage
    const inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
    inquiries.push(formData);
    localStorage.setItem('inquiries', JSON.stringify(inquiries));
    
    // Show success message
    alert('Thank you for your message! We have received your inquiry and will respond within 24 hours.');
    
    // Reset form
    e.target.reset();
}