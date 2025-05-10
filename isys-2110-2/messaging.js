// Secure Messaging Functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const conversationItems = document.querySelectorAll('.conversation-item');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const messageInput = document.querySelector('.message-input');
    const sendBtn = document.querySelector('.send-btn');
    const messagesContainer = document.querySelector('.messages-container');
    const actionButtons = document.querySelectorAll('.action-btn');
    
    // Sidebar navigation
    const sidebarButtons = document.querySelectorAll('.nav-item');
    sidebarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent.trim();
            if (buttonText === 'MISSIONS') {
                window.location.href = 'dashboard.html';
            } else if (buttonText === 'TRACKING') {
                window.location.href = 'tracking.html';
            }
        });
    });
    
    // Conversation selection
    conversationItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            conversationItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Get contact name from the clicked item
            const contactName = item.querySelector('h4').textContent;
            
            // Update chat header title
            document.querySelector('.chat-title h3').textContent = contactName;
            
            // Update contact info panel
            document.querySelector('.info-details .value').textContent = contactName;
            
            // In a real app, you would load the conversation history here
            // For now, just scroll to the bottom of the messages
            scrollToBottom();
        });
    });
    
    // Search functionality
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') return;
        
        // Filter conversations based on search term
        conversationItems.forEach(item => {
            const contactName = item.querySelector('h4').textContent.toLowerCase();
            const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();
            
            if (contactName.includes(searchTerm) || lastMessage.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Reset search on input clear
    searchInput.addEventListener('input', () => {
        if (searchInput.value === '') {
            conversationItems.forEach(item => {
                item.style.display = 'flex';
            });
        }
    });
    
    // Send message functionality
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Action buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.querySelector('span').textContent;
            
            switch (action) {
                case 'Archive Chat':
                    confirmAction('Are you sure you want to archive this chat?');
                    break;
                case 'Delete Conversation':
                    confirmAction('Are you sure you want to delete this conversation? This cannot be undone.');
                    break;
                case 'Flag for Admin':
                    confirmAction('Flag this conversation for admin review?');
                    break;
            }
        });
    });
    
    // Helper function to send a message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (messageText === '') return;
        
        // Create a new message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message self';
        
        // Generate a timestamp code (TTM + random number for demonstration)
        const timestamp = `[TTM${Math.floor(Math.random() * 90) + 10}]`;
        
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${messageText}</p>
                <span class="timestamp">${timestamp}</span>
            </div>
        `;
        
        // Add the message to the container
        messagesContainer.appendChild(messageElement);
        
        // Clear the input
        messageInput.value = '';
        
        // Scroll to the bottom
        scrollToBottom();
        
        // In a real app, you would also send the message to the server here
    }
    
    // Helper function to confirm actions
    function confirmAction(message) {
        const confirmed = confirm(message);
        
        if (confirmed) {
            // In a real app, you would perform the action here
            alert('Action completed successfully');
        }
    } 
    document.querySelector('.sidebar-nav').addEventListener('click', function(e) {
        if (e.target.classList.contains('units-nav')) {
            window.location.href = 'units.html';
        } else if (e.target.classList.contains('tracking-nav')) {
            window.location.href = 'tracking.html';
        } else if (e.target.classList.contains('comms-nav')) {
            window.location.href = 'messaging.html';
        } else if (e.target.classList.contains('reports-nav')) {
            window.location.href = 'reports.html';
        } else if (e.target.classList.contains('settings-nav')) {
            window.location.href = 'settings.html';
        } else if (e.target.classList.contains('nav-item') && !e.target.classList.contains('active')) {
            // Default: Missions
            window.location.href = 'dashboard.html';
        }
    });
    
    // Helper function to scroll to the bottom of the messages
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Initial scroll to bottom
    scrollToBottom();
}); 