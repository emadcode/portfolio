// Initialize Lenis smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Preloader fade out
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1000);
    });

    // Custom cursor
    const cursorFollower = document.getElementById('cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
        
        // Add active state when hovering over interactive elements
        const target = e.target;
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('project-card')) {
            cursorFollower.classList.add('active');
        } else {
            cursorFollower.classList.remove('active');
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate sections on scroll
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            duration: 1,
            y: 100,
            opacity: 0,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate skill bars on scroll
    gsap.utils.toArray('.progress-fill').forEach(bar => {
        gsap.from(bar, {
            width: 0,
            duration: 1.5,
            scrollTrigger: {
                trigger: bar,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate project cards on scroll
    gsap.utils.toArray('.project-card').forEach(card => {
        gsap.from(card, {
            duration: 0.8,
            y: 50,
            opacity: 0,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate work items on scroll
    gsap.utils.toArray('.work-item').forEach(item => {
        gsap.from(item, {
            duration: 0.8,
            x: -50,
            opacity: 0,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Show success message (in a real app, you'd send this to a server)
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Parallax effect for hero section
    document.addEventListener('mousemove', (e) => {
        const heroSection = document.querySelector('.hero-section');
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        if (heroSection) {
            heroSection.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
    });

    // Initialize scroll-triggered animations
    initScrollAnimations();
});

function initScrollAnimations() {
    // Stagger animations for skill tags
    gsap.from('.skill-tag', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%'
        }
    });

    // Stagger animations for social links
    gsap.from('.social-link', {
        duration: 0.5,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.social-links',
            start: 'top 80%'
        }
    });
}

// AI Assistant Functionality
const aiAssistant = {
    init() {
        this.toggle = document.querySelector('.ai-toggle');
        this.container = document.querySelector('.ai-assistant');
        this.chatContainer = document.querySelector('.ai-chat-container');
        this.messages = document.getElementById('ai-messages');
        this.input = document.getElementById('ai-input');
        this.sendButton = document.getElementById('ai-send');
        this.closeButton = document.querySelector('.ai-close');
        
        this.setupEventListeners();
        this.setupVoiceGreeting();
    },
    
    setupEventListeners() {
        // Toggle chat visibility
        this.toggle.addEventListener('click', () => {
            this.container.classList.toggle('active');
        });
        
        // Close chat
        this.closeButton.addEventListener('click', () => {
            this.container.classList.remove('active');
        });
        
        // Send message on button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message on Enter key
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && this.container.classList.contains('active')) {
                this.container.classList.remove('active');
            }
        });
    },
    
    setupVoiceGreeting() {
        // Check if user has already been greeted
        const hasBeenGreeted = localStorage.getItem('portfolio-greeted');
        
        if (!hasBeenGreeted) {
            // Auto-greet visitor after 1.5 seconds for smoother experience
            setTimeout(() => {
                if ('speechSynthesis' in window) {
                    const greeting = "Welcome to Emad's portfolio. I'm Aria, your AI assistant. I'm here to guide you through his innovative projects and answer any questions about his work.";
                    this.speak(greeting);
                    // Mark user as greeted
                    localStorage.setItem('portfolio-greeted', 'true');
                }
            }, 1500);
        }
    },
    
    speak(text) {
        // Ensure voices are loaded
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.onvoiceschanged = () => {
                this.speak(text); // Retry once voices are loaded
            };
            return;
        }
        
        const speech = new SpeechSynthesisUtterance(text);
        speech.volume = 0.9;
        speech.rate = 0.9;
        speech.pitch = 1.1;
        speech.lang = 'en-US';
        
        // Enhanced female voice selection with priority ordering
        const voices = speechSynthesis.getVoices();
        
        // Priority list of premium female voices
        const priorityVoices = [
            'Samantha',           // Safari - premium quality
            'Google UK English Female',  // Chrome - natural
            'Microsoft Zira Desktop',    // Windows - clear
            'Karen',              // Safari - professional
            'Moira',              // Safari - crisp
            'Tessa',              // Safari - modern
            'Google US English',  // Chrome fallback
            'Microsoft David Desktop'    // Windows fallback
        ];
        
        // First try exact name matches
        let selectedVoice = voices.find(voice => 
            priorityVoices.includes(voice.name)
        );
        
        // If no exact match, find female English voices
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => 
                voice.name.includes('Female') && 
                (voice.lang === 'en-US' || voice.lang === 'en-GB')
            );
        }
        
        // Final fallback to any English voice
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => 
                voice.lang.startsWith('en')
            );
        }
        
        if (selectedVoice) {
            speech.voice = selectedVoice;
        }
        
        speechSynthesis.speak(speech);
    },
    
    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.getAIResponse(message);
            this.addMessage(response, 'bot');
            
            // Speak the response
            if ('speechSynthesis' in window) {
                this.speak(response);
            }
        }, 1000);
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
        
        // Scroll to bottom
        this.messages.scrollTop = this.messages.scrollHeight;
    },
    
    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    
    getAIResponse(message) {
        const responses = {
            'hello': 'Hello there! I am here to help you explore Emad\'s portfolio. What would you like to know about his work?',
            'projects': 'Emad has worked on several exciting projects including a Mental Health Platform, interactive dashboards, and modern web applications. You can view his featured projects in the Projects section.',
            'skills': 'Emad specializes in JavaScript, Node.js, React, Three.js, and modern web technologies. He is particularly skilled in creating immersive 3D web experiences.',
            'contact': 'You can reach Emad through the contact form on this website, or connect with him on LinkedIn. He is always open to discussing new opportunities.',
            'experience': 'Emad has professional experience in full-stack development, 3D web technologies, and creating engaging user experiences. Check out his Work section for detailed project information.',
            'default': 'I would be happy to help you learn more about Emad\'s work. Feel free to ask about his projects, skills, experience, or how to get in touch with him.'
        };
        
        const lowerMessage = message.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (key === 'default') continue;
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }
};

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    aiAssistant.init();
    initHardwareSection();
});

// Initialize hardware section animations
function initHardwareSection() {
    // Trigger component animations when section comes into view
    const hardwareSection = document.getElementById('hardware');
    
    if (hardwareSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get all components for the assembly sequence
                    const components = hardwareSection.querySelectorAll('[data-stage]');
                    
                    // Sort components by stage
                    const sortedComponents = Array.from(components).sort((a, b) => {
                        return parseInt(a.getAttribute('data-stage')) - parseInt(b.getAttribute('data-stage'));
                    });
                    
                    // Execute cinematic assembly sequence
                    sortedComponents.forEach((comp, index) => {
                        const stage = parseInt(comp.getAttribute('data-stage'));
                        const delay = stage * 1.2; // 1.2s delay per stage for cinematic timing
                        
                        // Apply the animation with cinematic timing
                        setTimeout(() => {
                            // Calculate final position based on component type
                            let finalTransform = comp.style.transform || '';
                            
                            // Remove any existing animation classes
                            comp.classList.remove('assembled');
                            
                            // Add animation class
                            comp.style.animation = `componentFloat 2s ${delay}s forwards`;
                            
                            // Add connection effect when component reaches its position
                            setTimeout(() => {
                                // Create connection effect
                                createConnectionEffect(comp);
                                
                                // Add assembled class for hover effects
                                comp.classList.add('assembled');
                                
                                // Add interactive effects after assembly
                                comp.style.transition = 'transform 0.5s ease';
                                comp.addEventListener('mouseenter', handleComponentHover);
                                comp.addEventListener('mouseleave', handleComponentLeave);
                            }, 2000 + (stage * 100));
                            
                        }, 500); // Initial delay
                    });
                    
                    // Add overall lighting effects
                    setTimeout(() => {
                        addLightingEffects(hardwareSection);
                    }, 500);
                    
                    observer.unobserve(hardwareSection);
                }
            });
        }, {
            threshold: 0.2
        });
        
        observer.observe(hardwareSection);
    }
}

// Helper function to create connection effects
function createConnectionEffect(component) {
    const effect = document.createElement('div');
    effect.className = 'connection-effect';
    effect.style.position = 'absolute';
    effect.style.width = '2px';
    effect.style.height = '2px';
    effect.style.background = '#00f0ff';
    effect.style.borderRadius = '50%';
    effect.style.boxShadow = '0 0 10px #00f0ff, 0 0 20px #00f0ff';
    effect.style.pointerEvents = 'none';
    
    // Position effect near the component
    const rect = component.getBoundingClientRect();
    const sceneRect = document.querySelector('.assembly-stage').getBoundingClientRect();
    
    effect.style.left = `${rect.left - sceneRect.left + rect.width/2}px`;
    effect.style.top = `${rect.top - sceneRect.top + rect.height/2}px`;
    
    document.querySelector('.connection-effects').appendChild(effect);
    
    // Animate the effect
    setTimeout(() => {
        effect.style.transition = 'all 0.5s ease';
        effect.style.opacity = '0';
        effect.style.transform = 'scale(3)';
        
        setTimeout(() => {
            effect.remove();
        }, 500);
    }, 100);
}

// Helper function for component hover effect
function handleComponentHover(e) {
    const comp = e.currentTarget;
    const currentTransform = comp.style.transform || '';
    comp.style.transform = `${currentTransform} translateZ(20px) scale(1.1)`;
}

// Helper function for component leave effect
function handleComponentLeave(e) {
    const comp = e.currentTarget;
    const currentTransform = comp.style.transform.replace(/\s*translateZ\(20px\)\s*/g, '').replace(/\s*scale\(1\.1\)\s*/g, '');
    comp.style.transform = currentTransform;
}

// Add lighting effects
function addLightingEffects(section) {
    // Add random energy particles
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'energy-particle';
            particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
            particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
            
            const container = section.querySelector('.connection-effects');
            if (container) {
                container.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 3000);
            }
        }, i * 600);
    }
}

// Optional: Reset greeting for testing (remove in production)
// window.resetPortfolioGreeting = () => {
//     localStorage.removeItem('portfolio-greeted');
//     console.log('Greeting reset - refresh page to hear welcome again');
// };

// Export functions for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initScrollAnimations, aiAssistant };
}