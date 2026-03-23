// Typing Animation
const typingText = document.getElementById('typingText');
const roles = [
    'Computer Engineering Student',
    'Full Stack Developer',
    'Problem Solver'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }
    
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeRole, typingSpeed);
}

// Start typing animation
typeRole();

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe sections and cards
const sections = document.querySelectorAll('section');
const cards = document.querySelectorAll('.glass, .skill-card, .project-card');

sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

cards.forEach(card => {
    card.classList.add('fade-in');
    observer.observe(card);
});

// GitHub API Integration
const projectsGrid = document.getElementById('projectsGrid');
const projectsLoading = document.getElementById('projectsLoading');

async function fetchGitHubProjects() {
    try {
        const username = 'SRMutkule';
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        displayProjects(repos);
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        displayFallbackProjects();
    }
}

async function displayProjects(repos) {
    projectsLoading.style.display = 'none';
    
    for (const repo of repos) {
        // Fetch all languages for this repo
        const langResponse = await fetch(repo.languages_url);
        const languagesData = await langResponse.json();
        const languages = Object.keys(languagesData); // array of language names
        
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card', 'glass', 'fade-in');
        
        // Get first letter for icon
        const firstLetter = repo.name.charAt(0).toUpperCase();
        
        // Use all languages, or 'Code' if empty
        const languagesTags = languages.length > 0 ? languages.map(lang => `<span class="tag">${lang}</span>`).join('') : '<span class="tag">Code</span>';
        
        projectCard.innerHTML = `
            <div class="project-icon">${firstLetter}</div>
            <h3>${repo.name}</h3>
            <p class="project-description">${repo.description || 'No description available'}</p>
            <div class="project-tags">
                ${languagesTags}
                ${repo.stargazers_count > 0 ? `<span class="tag">⭐ ${repo.stargazers_count}</span>` : ''}
                ${repo.forks_count > 0 ? `<span class="tag">🔀 ${repo.forks_count}</span>` : ''}
            </div>
            <a href="${repo.html_url}" target="_blank" class="project-link">
                View on GitHub
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </a>
        `;
        
        projectsGrid.appendChild(projectCard);
        observer.observe(projectCard);
    }
}

function displayFallbackProjects() {
    projectsLoading.style.display = 'none';
      
    fallbackProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card', 'glass', 'fade-in');
        
        projectCard.innerHTML = `
            <div class="project-icon">${project.icon}</div>
            <h3>${project.name}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="#" class="project-link">
                View Project
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </a>
        `;
        
        projectsGrid.appendChild(projectCard);
        observer.observe(projectCard);
    });
}

// Load projects on page load
fetchGitHubProjects();

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
    contactForm.reset();
});

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Animate skill bars when they come into view
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.style.getPropertyValue('--progress');
            entry.target.style.width = progress;
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    bar.style.width = '0';
    skillObserver.observe(bar);
});