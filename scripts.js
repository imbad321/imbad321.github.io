// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const splineViewer = document.querySelector('spline-viewer');
    const fallbackTimeout = setTimeout(() => removePreloader(), 1800);
    
    function removePreloader() {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.style.display = 'none', 500);
        clearTimeout(fallbackTimeout);
    }
    
    splineViewer.addEventListener('load', removePreloader);
    splineViewer.addEventListener('error', removePreloader);
});

// Create custom cursor
function initializeCustomCursor() {
    const cursor = document.createElement('div');
    const cursorTrailer = document.createElement('div');
    
    cursor.classList.add('custom-cursor');
    cursorTrailer.classList.add('custom-cursor-trailer');
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorTrailer);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let trailerX = 0;
    let trailerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Fast cursor follow (increased from 0.2 to 0.5)
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        
        // Faster trailer follow (increased from 0.1 to 0.3)
        trailerX += (mouseX - trailerX) * 0.3;
        trailerY += (mouseY - trailerY) * 0.3;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        cursorTrailer.style.left = `${trailerX}px`;
        cursorTrailer.style.top = `${trailerY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hide cursor when leaving window
    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
        cursorTrailer.style.opacity = '0';
    });
    
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '1';
        cursorTrailer.style.opacity = '1';
    });
    
    // Add hover effect for clickable elements
    const clickables = document.querySelectorAll('a, button, .card, .box');
    clickables.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorTrailer.style.transform = 'translate(-50%, -50%) scale(1.3)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorTrailer.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Add magnetic effect to cards
function initializeMagneticEffect() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.classList.add('card-magnetic');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate distance from center in %
            const percentX = (mouseX - centerX) / (rect.width / 2);
            const percentY = (mouseY - centerY) / (rect.height / 2);
            
            // Limit the tilt
            const tiltX = percentY * 10;
            const tiltY = -percentX * 10;
            
            // Apply the tilt
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
            
            // Move the hover glow to match cursor
            const glowElement = document.createElement('div');
            glowElement.classList.add('cursor-glow');
            glowElement.style.top = `${mouseY - rect.top}px`;
            glowElement.style.left = `${mouseX - rect.left}px`;
            
            // Remove any existing glows and add the new one
            const existingGlow = card.querySelector('.cursor-glow');
            if (existingGlow) {
                existingGlow.remove();
            }
            card.appendChild(glowElement);
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transform
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            
            // Remove glow effect
            const glow = card.querySelector('.cursor-glow');
            if (glow) {
                glow.remove();
            }
        });
    });
}

// Add light trails
function initializeLightTrails() {
    const interactiveArea = document.createElement('div');
    interactiveArea.classList.add('interactive-area');
    document.body.appendChild(interactiveArea);
    
    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    let trailTimer = null;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Calculate speed
        const deltaX = Math.abs(lastX - mouseX);
        const deltaY = Math.abs(lastY - mouseY);
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (speed > 5) {
            createTrail(mouseX, mouseY, speed);
        }
        
        lastX = mouseX;
        lastY = mouseY;
        
        // Clear previous timer
        if (trailTimer) {
            clearTimeout(trailTimer);
        }
        
        // Stop creating trails after 100ms of no movement
        trailTimer = setTimeout(() => {
            lastX = 0;
            lastY = 0;
        }, 100);
    });
    
    function createTrail(x, y, speed) {
        const trail = document.createElement('div');
        trail.classList.add('light-trail');
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        
        // Size based on speed
        const size = Math.min(10, 5 + speed / 10);
        trail.style.width = `${size}px`;
        trail.style.height = `${size}px`;
        
        interactiveArea.appendChild(trail);
        
        // Fade in
        setTimeout(() => {
            trail.style.opacity = '0.7';
        }, 10);
        
        // Fade out and remove
        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => {
                trail.remove();
            }, 300);
        }, 200);
    }
}

// Scroll to project functionality
function scrollToProject(projectId) {
    const section = document.getElementById(projectId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        section.classList.add('visible');
    }
}

// Intersection Observer for project sections
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-section').forEach(section => {
    observer.observe(section);
});

// Box/Card animations
function expandBox(event) {
    const element = event.currentTarget;
    
    // Handle both old boxes and new cards
    if (element.classList.contains('box')) {
        element.style.width = '350px';
        element.style.minHeight = '150px';
        element.querySelector('p').style.display = 'block';
    } else if (element.classList.contains('card')) {
        // Add glow effect for cards
        emitParticles(event);
        element.style.transform = 'translateY(-10px)';
        element.style.boxShadow = '0 0 20px rgba(255, 140, 66, 0.7), 0 0 30px rgba(255, 140, 66, 0.5)';
        
        // Show card button
        const cardButton = element.querySelector('.card-button');
        if (cardButton) {
            cardButton.style.opacity = '1';
            cardButton.style.transform = 'translateY(0)';
        }
    }
}

function collapseBox(event) {
    const element = event.currentTarget;
    
    // Handle both old boxes and new cards
    if (element.classList.contains('box') && !element.classList.contains('expanded')) {
        element.style.width = '200px';
        element.style.minHeight = '100px';
        element.querySelector('p').style.display = 'none';
    } else if (element.classList.contains('card')) {
        // Reset card styles on mouse leave
        element.style.transform = '';
        element.style.boxShadow = '';
        
        // Hide card button
        const cardButton = element.querySelector('.card-button');
        if (cardButton) {
            cardButton.style.opacity = '0';
            cardButton.style.transform = 'translateY(10px)';
        }
    }
}

// Mobile detection
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Initialize page load
function initializePageLoad() {
    if (isMobile()) {
        document.querySelector('spline-viewer').setAttribute('loading', 'eager');
        // Disable custom cursor on mobile
        document.body.style.cursor = 'auto';
    } else {
        // Initialize custom cursor
        initializeCustomCursor();
        
        // Initialize magnetic effect
        initializeMagneticEffect();
        
        // Initialize light trails
        initializeLightTrails();
    }
    
    // Apply sequential animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${(index + 1) * 0.2}s`;
    });
}

// Page transition
function handlePageTransition(url) {
    const transition = document.querySelector('.page-transition');
    transition.classList.add('active');
    
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Particle effect
function emitParticles(event) {
    const element = event.currentTarget;
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 100 + 20;
        particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 1 + 0.9}s`;
        particle.style.width = `${Math.random() * 2 + 0.5}px`;
        particle.style.height = particle.style.width;
        element.appendChild(particle);
        setTimeout(() => particle.remove(), 1500);
    }
}

// Reposition boxes
function repositionBoxes() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box, index) => {
        box.style.transform = `translateY(${index * 120}px)`;
    });
}

// Initialize page load
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const transition = document.querySelector('.page-transition');
    
    // Remove preloader
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
    
    // Remove transition overlay
    setTimeout(() => {
        transition.classList.remove('active');
    }, 100);
    
    // Add click handlers for navigation
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.hostname === window.location.hostname) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                handlePageTransition(link.href);
            });
        }
    });
    
    // Add mouse move parallax effect for hero section
    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer && !isMobile()) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            const moveX = (x - 0.5) * 20;
            const moveY = (y - 0.5) * 20;
            
            heroContainer.style.transform = `translateX(${moveX}px) translateY(calc(-50% + ${moveY}px))`;
        });
    }
});

// Intersection Observer for project cards
const projectObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, projectObserverOptions);

document.querySelectorAll('.project-card').forEach(card => {
    projectObserver.observe(card);
});