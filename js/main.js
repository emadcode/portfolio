// AI Assistant Functionality (No Voice Version)

const aiAssistant = {
    init() {
        this.toggle = document.querySelector('.ai-toggle');
        this.container = document.querySelector('.ai-assistant');
        this.messages = document.getElementById('ai-messages');
        this.input = document.getElementById('ai-input');
        this.sendButton = document.getElementById('ai-send');
        this.closeButton = document.querySelector('.ai-close');

        if (!this.container) return;

        this.setupEventListeners();
    },

    setupEventListeners() {
        // Toggle chat visibility
        if (this.toggle) {
            this.toggle.addEventListener('click', () => {
                this.container.classList.toggle('active');
            });
        }

        // Close chat
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.container.classList.remove('active');
            });
        }

        // Send message on button click
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Send message on Enter key
        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (
                this.container &&
                !this.container.contains(e.target) &&
                this.container.classList.contains('active')
            ) {
                this.container.classList.remove('active');
            }
        });
    },

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.input.value = '';

        setTimeout(() => {
            const response = this.getAIResponse(message);
            this.addMessage(response, 'bot');
        }, 800);
    },

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('ai-message', `ai-message-${sender}`);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = content;

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        timeDiv.textContent = this.getCurrentTime();

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);

        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    },

    getCurrentTime() {
        return new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getAIResponse(message) {
        const responses = {
            hello:
                "Hello there! I am here to help you explore Emad's portfolio. What would you like to know?",
            projects:
                "Emad has worked on interactive dashboards, web apps, and innovative platforms. Check the Projects section to explore more.",
            skills:
                "Emad specializes in JavaScript, Node.js, React, and modern web technologies.",
            contact:
                "You can reach Emad using the contact form on this website or through LinkedIn.",
            experience:
                "Emad has experience in full-stack development and creating engaging user experiences.",
            default:
                "I would be happy to help you learn more about Emad's work. Ask me about projects, skills, or experience."
        };

        const lowerMessage = message.toLowerCase();

        for (const key in responses) {
            if (key !== 'default' && lowerMessage.includes(key)) {
                return responses[key];
            }
        }

        return responses.default;
    }
};

// Initialize AI Assistant
document.addEventListener('DOMContentLoaded', () => {
    aiAssistant.init();
});
