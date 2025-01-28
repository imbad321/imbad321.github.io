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

// Box animations
function expandBox(event) {
    const box = event.currentTarget;
    box.style.width = '350px';
    box.style.minHeight = '150px';
    box.querySelector('p').style.display = 'block';
}

function collapseBox(event) {
    const box = event.currentTarget;
    if (!box.classList.contains('expanded')) {
        box.style.width = '200px';
        box.style.minHeight = '100px';
        box.querySelector('p').style.display = 'none';
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
    }
}

// Page transition
function handlePageTransition(url) {
    document.querySelector('.page-transition').classList.add('active');
    setTimeout(() => window.location.href = url, 500);
}

// Particle effect
function emitParticles(event) {
    const box = event.currentTarget;
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
        box.appendChild(particle);
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