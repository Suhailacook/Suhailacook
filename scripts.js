document.getElementById('reservation-form').onsubmit = function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Thank you for your reservation!');
            this.reset(); // Clear the form
        } else {
            return response.json().then(err => {
                throw new Error(err.message || 'Error occurred');
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was a problem with your reservation.');
    });
};


// Function to display messages
function displayMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    document.body.appendChild(messageDiv);

    // Optionally remove the message after a few seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
