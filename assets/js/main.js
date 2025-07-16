// Main JavaScript file for academic paper website
// This file will contain core functionality and interactions

document.addEventListener('DOMContentLoaded', function() {
    console.log('Academic paper website loaded');
    
    // Initialize core functionality
    initializeNavigation();
    initializeSmoothScroll();
    initializeScrollEffects();
    loadPaperData();
    initializeFooter();
    
    // Initialize performance-optimized results gallery
    // (This will be handled by the performance optimizer if available)
    if (!window.PerformanceOptimizer) {
        initializeResultsGallery();
    }
});

// Navigation functionality with enhanced mobile hamburger menu
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const body = document.body;
    
    // Create overlay element for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    body.appendChild(overlay);
    
    // Mobile hamburger menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Toggle mobile menu function
    function toggleMobileMenu() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        // Update aria-expanded attribute
        navToggle.setAttribute('aria-expanded', newState);
        
        // Toggle menu and overlay visibility
        navMenu.classList.toggle('active', newState);
        overlay.classList.toggle('active', newState);
        
        // Prevent body scroll when menu is open
        body.classList.toggle('nav-open', newState);
        
        // Focus management
        if (newState) {
            // Focus first menu item when opening
            const firstLink = navMenu.querySelector('a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    }
    
    // Close mobile menu function
    function closeMobileMenu() {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('nav-open');
    }
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking on overlay
    overlay.addEventListener('click', function() {
        closeMobileMenu();
        navToggle.focus(); // Return focus to toggle button
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
            navToggle.focus(); // Return focus to toggle button
        }
        
        // Tab trapping in mobile menu
        if (navMenu.classList.contains('active') && event.key === 'Tab') {
            const focusableElements = navMenu.querySelectorAll('a');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    // Handle window resize - close mobile menu on desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Smooth scroll functionality
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate offset to account for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveNavLink(targetId);
            }
        });
    });
}

// Initialize scroll effects (header background and active section highlighting)
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    // Throttle scroll events for better performance
    let ticking = false;
    
    function updateOnScroll() {
        const scrollY = window.scrollY;
        
        // Update header background on scroll
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active navigation link based on current section
        updateActiveSection(sections, navLinks);
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // Initial call to set correct active state
    updateActiveSection(sections, navLinks);
}

// Update active navigation link
function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href').substring(1);
        if (linkTarget === activeId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update active section based on scroll position
function updateActiveSection(sections, navLinks) {
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // If we're at the very top, highlight the first section
    if (scrollY < 100 && sections.length > 0) {
        currentSection = sections[0].getAttribute('id');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href').substring(1);
        if (linkTarget === currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Utility function to handle responsive navigation
function handleResize() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// Handle window resize
window.addEventListener('resize', handleResize);

// Load paper data from JSON file
async function loadPaperData() {
    try {
        const response = await fetch('data/paper-info.json');
        const paperData = await response.json();
        
        // Update navigation title
        const navTitle = document.querySelector('.nav-title');
        if (navTitle && paperData.title) {
            navTitle.textContent = paperData.title;
        }
        
        // Update hero section with paper data
        updateHeroSection(paperData);
        
        // Update abstract section with paper data
        updateAbstractSection(paperData);
        
        console.log('Paper data loaded successfully');
    } catch (error) {
        console.warn('Could not load paper data:', error);
        // Graceful fallback - keep placeholder content
    }
}

// Update hero section with paper data
function updateHeroSection(paperData) {
    // Update title
    const heroTitle = document.getElementById('paper-title');
    if (heroTitle && paperData.title) {
        heroTitle.textContent = paperData.title;
    }
    
    // Update subtitle
    const heroSubtitle = document.getElementById('paper-subtitle');
    if (heroSubtitle) {
        if (paperData.subtitle) {
            heroSubtitle.textContent = paperData.subtitle;
            heroSubtitle.style.display = 'block';
        } else {
            heroSubtitle.style.display = 'none';
        }
    }
    
    // Update authors
    const authorsList = document.getElementById('authors-list');
    const authorsAffiliations = document.getElementById('authors-affiliations');
    
    if (authorsList && authorsAffiliations && paperData.authors && paperData.authors.length > 0) {
        // Build authors list with proper comma separation
        const authorsHTML = paperData.authors.map((author, index) => {
            const isLast = index === paperData.authors.length - 1;
            const separator = isLast ? '' : ', ';
            
            if (author.website && author.website.trim() !== '') {
                return `<a href="${author.website}" class="author-name" target="_blank" rel="noopener noreferrer" aria-label="Visit ${author.name}'s website">${author.name}</a>${separator}`;
            } else {
                return `<span class="author-name">${author.name}</span>${separator}`;
            }
        }).join('');
        
        authorsList.innerHTML = authorsHTML;
        
        // Build affiliations list (unique affiliations only)
        const uniqueAffiliations = [...new Set(paperData.authors.map(author => author.affiliation).filter(Boolean))];
        const affiliationsHTML = uniqueAffiliations.map((affiliation, index) => {
            const isLast = index === uniqueAffiliations.length - 1;
            const separator = isLast ? '' : ' • ';
            return `<span class="affiliation">${affiliation}</span>${separator}`;
        }).join('');
        
        authorsAffiliations.innerHTML = affiliationsHTML;
    }
    
    // Update publication venue
    const publicationVenue = document.getElementById('publication-venue');
    if (publicationVenue && paperData.venue) {
        publicationVenue.textContent = paperData.venue;
    }
    
    // Update publication date
    const publicationDate = document.getElementById('publication-date');
    if (publicationDate && paperData.publicationDate) {
        const date = new Date(paperData.publicationDate);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        publicationDate.textContent = formattedDate;
        publicationDate.setAttribute('datetime', paperData.publicationDate);
    }
    
    // Update PDF link
    const pdfLink = document.getElementById('paper-pdf-link');
    if (pdfLink) {
        if (paperData.pdfUrl) {
            pdfLink.href = paperData.pdfUrl;
            pdfLink.style.display = 'inline-flex';
        } else {
            pdfLink.style.display = 'none';
        }
    }
    
    // Update code link
    const codeLink = document.getElementById('code-link');
    if (codeLink) {
        if (paperData.codeUrl) {
            codeLink.href = paperData.codeUrl;
            codeLink.style.display = 'inline-flex';
        } else {
            codeLink.style.display = 'none';
        }
    }
    
    // Update page title and meta tags
    updatePageMetadata(paperData);
}

// Update abstract section with paper data
function updateAbstractSection(paperData) {
    // Update abstract text
    const abstractText = document.getElementById('abstract-text');
    if (abstractText && paperData.abstract) {
        abstractText.textContent = paperData.abstract;
    }
    
    // Update key contributions
    const contributionsList = document.getElementById('contributions-list');
    if (contributionsList && paperData.keyContributions && paperData.keyContributions.length > 0) {
        // Clear existing placeholder content
        contributionsList.innerHTML = '';
        
        // Add each contribution as a list item
        paperData.keyContributions.forEach(contribution => {
            const listItem = document.createElement('li');
            listItem.className = 'contribution-item';
            listItem.textContent = contribution;
            contributionsList.appendChild(listItem);
        });
    }
}

// Update page metadata
function updatePageMetadata(paperData) {
    // Update page title
    if (paperData.title) {
        document.title = paperData.title;
    }
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && paperData.abstract) {
        const shortAbstract = paperData.abstract.length > 160 
            ? paperData.abstract.substring(0, 157) + '...' 
            : paperData.abstract;
        metaDescription.setAttribute('content', shortAbstract);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && paperData.title) {
        ogTitle.setAttribute('content', paperData.title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && paperData.abstract) {
        const shortAbstract = paperData.abstract.length > 200 
            ? paperData.abstract.substring(0, 197) + '...' 
            : paperData.abstract;
        ogDescription.setAttribute('content', shortAbstract);
    }
    
    // Update Twitter meta tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle && paperData.title) {
        twitterTitle.setAttribute('content', paperData.title);
    }
    
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription && paperData.abstract) {
        const shortAbstract = paperData.abstract.length > 200 
            ? paperData.abstract.substring(0, 197) + '...' 
            : paperData.abstract;
        twitterDescription.setAttribute('content', shortAbstract);
    }
}
//
// ==========================================================================
// RESULTS GALLERY FUNCTIONALITY
// ==========================================================================

// Initialize results gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeResultsGallery();
});

function initializeResultsGallery() {
    initializeLazyLoading();
    initializeLightbox();
    initializeTouchSupport();
    loadResultsData();
}

// ==========================================================================
// LAZY LOADING IMPLEMENTATION
// ==========================================================================

function initializeLazyLoading() {
    // Use Intersection Observer for efficient lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            // Load images when they're 100px away from viewport
            rootMargin: '100px 0px',
            threshold: 0.01
        });

        // Observe all lazy-load images
        const lazyImages = document.querySelectorAll('.lazy-load');
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without Intersection Observer
        const lazyImages = document.querySelectorAll('.lazy-load');
        lazyImages.forEach(img => loadImage(img));
    }
}

function loadImage(img) {
    const dataSrc = img.getAttribute('data-src');
    if (dataSrc) {
        // Create a new image to preload
        const newImg = new Image();
        
        newImg.onload = function() {
            // Image loaded successfully
            img.src = dataSrc;
            img.classList.add('loaded');
            img.classList.remove('lazy-load');
            
            // Dispatch custom event for successful load
            img.dispatchEvent(new CustomEvent('imageLoaded', {
                detail: { src: dataSrc }
            }));
        };
        
        newImg.onerror = function() {
            // Image failed to load, show placeholder
            img.classList.add('error');
            img.alt = 'Image failed to load';
            console.warn('Failed to load image:', dataSrc);
        };
        
        // Start loading the image
        newImg.src = dataSrc;
    }
}

// ==========================================================================
// LIGHTBOX FUNCTIONALITY
// ==========================================================================

let currentLightboxIndex = 0;
let lightboxImages = [];

function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const zoomButtons = document.querySelectorAll('.result-zoom-btn');
    
    if (!lightbox) return;
    
    // Collect all gallery images for lightbox navigation
    updateLightboxImages();
    
    // Add click handlers to zoom buttons
    zoomButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(index);
        });
    });
    
    // Add click handlers to result items (alternative way to open lightbox)
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
        
        // Make result items keyboard accessible
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View ${item.querySelector('.result-title')?.textContent || 'image'} in full size`);
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });
    
    // Close lightbox handlers
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    
    // Navigation handlers
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', handleLightboxKeyboard);
    
    // Touch/swipe support for mobile
    initializeLightboxTouch();
}

function updateLightboxImages() {
    const resultItems = document.querySelectorAll('.result-item');
    lightboxImages = Array.from(resultItems).map(item => {
        const img = item.querySelector('.result-image');
        const title = item.querySelector('.result-title')?.textContent || '';
        const description = item.querySelector('.result-description')?.textContent || '';
        
        return {
            src: img.getAttribute('data-src') || img.src,
            alt: img.alt,
            title: title,
            description: description
        };
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightboxImages[index]) return;
    
    currentLightboxIndex = index;
    const imageData = lightboxImages[index];
    
    // Update lightbox content
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    
    lightboxImage.src = imageData.src;
    lightboxImage.alt = imageData.alt;
    lightboxTitle.textContent = imageData.title;
    lightboxDescription.textContent = imageData.description;
    
    // Update navigation buttons
    updateLightboxNavigation();
    
    // Show lightbox
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const closeButton = document.querySelector('.lightbox-close');
    if (closeButton) {
        setTimeout(() => closeButton.focus(), 100);
    }
    
    // Announce to screen readers
    const announcement = `Viewing image ${index + 1} of ${lightboxImages.length}: ${imageData.title}`;
    announceToScreenReader(announcement);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to the trigger element
    const resultItems = document.querySelectorAll('.result-item');
    if (resultItems[currentLightboxIndex]) {
        resultItems[currentLightboxIndex].focus();
    }
}

function navigateLightbox(direction) {
    const newIndex = currentLightboxIndex + direction;
    
    if (newIndex >= 0 && newIndex < lightboxImages.length) {
        openLightbox(newIndex);
    }
}

function updateLightboxNavigation() {
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (prevBtn) {
        prevBtn.disabled = currentLightboxIndex === 0;
        prevBtn.style.opacity = currentLightboxIndex === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentLightboxIndex === lightboxImages.length - 1;
        nextBtn.style.opacity = currentLightboxIndex === lightboxImages.length - 1 ? '0.5' : '1';
    }
}

function handleLightboxKeyboard(e) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            navigateLightbox(-1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateLightbox(1);
            break;
        case 'Tab':
            // Trap focus within lightbox
            trapFocusInLightbox(e);
            break;
    }
}

function trapFocusInLightbox(e) {
    const lightbox = document.getElementById('lightbox');
    const focusableElements = lightbox.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
    }
}

// ==========================================================================
// TOUCH SUPPORT FOR MOBILE DEVICES
// ==========================================================================

function initializeTouchSupport() {
    // Add touch-friendly interactions for result items
    const resultItems = document.querySelectorAll('.result-item');
    
    resultItems.forEach((item, index) => {
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        
        item.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: true });
        
        item.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            // Only trigger if it's a quick tap (not a scroll)
            if (touchDuration < 300) {
                const touch = e.changedTouches[0];
                const touchEndX = touch.clientX;
                const touchEndY = touch.clientY;
                
                const deltaX = Math.abs(touchEndX - touchStartX);
                const deltaY = Math.abs(touchEndY - touchStartY);
                
                // Only trigger if the touch didn't move much (not a swipe)
                if (deltaX < 10 && deltaY < 10) {
                    openLightbox(index);
                }
            }
        }, { passive: true });
    });
}

function initializeLightboxTouch() {
    const lightboxContainer = document.querySelector('.lightbox-container');
    if (!lightboxContainer) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    lightboxContainer.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });
    
    lightboxContainer.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
    }, { passive: true });
    
    lightboxContainer.addEventListener('touchend', (e) => {
        handleLightboxSwipe();
    }, { passive: true });
    
    function handleLightboxSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 50;
        
        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - previous image
                navigateLightbox(-1);
            } else {
                // Swipe left - next image
                navigateLightbox(1);
            }
        }
    }
}

// ==========================================================================
// RESULTS DATA LOADING
// ==========================================================================

async function loadResultsData() {
    try {
        // Try to load results data from JSON file
        const response = await fetch('data/results-gallery.json');
        if (response.ok) {
            const resultsData = await response.json();
            updateResultsGallery(resultsData);
        }
    } catch (error) {
        console.log('No results data file found, using placeholder content');
        // Keep existing placeholder content
    }
}

function updateResultsGallery(resultsData) {
    const gallery = document.getElementById('results-gallery');
    if (!gallery || !resultsData.results) return;
    
    // Clear existing content
    gallery.innerHTML = '';
    
    // Create result items from data
    resultsData.results.forEach((result, index) => {
        const resultItem = createResultItem(result, index);
        gallery.appendChild(resultItem);
    });
    
    // Reinitialize gallery functionality
    initializeLazyLoading();
    initializeLightbox();
    initializeTouchSupport();
}

function createResultItem(result, index) {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.setAttribute('data-category', result.category || 'main');
    
    item.innerHTML = `
        <div class="result-media">
            <img src="${result.placeholder || 'assets/images/placeholder.jpg'}" 
                 alt="${result.alt || result.title}" 
                 class="result-image lazy-load"
                 data-src="${result.src}"
                 loading="lazy">
            <div class="result-overlay">
                <button class="result-zoom-btn" aria-label="View full size image">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                        <path d="M11 8v6"></path>
                        <path d="M8 11h6"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="result-content">
            <h3 class="result-title">${result.title}</h3>
            <p class="result-description">${result.description}</p>
        </div>
    `;
    
    return item;
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

function announceToScreenReader(message) {
    // Create a live region for screen reader announcements
    let liveRegion = document.getElementById('sr-live-region');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'sr-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = message;
}

// Image optimization utility
function optimizeImageLoading() {
    // Preload critical images
    const heroImages = document.querySelectorAll('.hero-visual img, .abstract img');
    heroImages.forEach(img => {
        if (img.dataset.src) {
            loadImage(img);
        }
    });
    
    // Add loading="lazy" to all gallery images
    const galleryImages = document.querySelectorAll('.results-gallery img');
    galleryImages.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

// Initialize image optimization
document.addEventListener('DOMContentLoaded', optimizeImageLoading);

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Update lightbox layout on resize
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        // Recalculate lightbox dimensions
        const lightboxImage = document.querySelector('.lightbox-image');
        if (lightboxImage) {
            lightboxImage.style.maxHeight = '70vh';
        }
    }
});

// Performance monitoring
function monitorGalleryPerformance() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.name.includes('result') || entry.name.includes('gallery')) {
                    console.log(`Gallery performance: ${entry.name} took ${entry.duration}ms`);
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
}

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    monitorGalleryPerformance();
}
// ====
// ======================================================================
// METHODOLOGY SECTION FUNCTIONALITY
// ==========================================================================

// Initialize methodology section when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMethodologySection();
});

function initializeMethodologySection() {
    initializeCollapsibleSections();
    loadMethodologyData();
}

// ==========================================================================
// COLLAPSIBLE SECTIONS IMPLEMENTATION
// ==========================================================================

function initializeCollapsibleSections() {
    const sectionToggles = document.querySelectorAll('.section-toggle');
    
    sectionToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const targetId = this.getAttribute('aria-controls');
            const targetContent = document.getElementById(targetId);
            
            if (targetContent) {
                toggleSection(this, targetContent, !isExpanded);
            }
        });
        
        // Add keyboard support
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Initialize all sections as collapsed
    const sectionContents = document.querySelectorAll('.section-content');
    sectionContents.forEach(content => {
        content.style.maxHeight = '0px';
        content.setAttribute('aria-hidden', 'true');
    });
}

function toggleSection(toggle, content, expand) {
    const isCurrentlyExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    // Update aria-expanded attribute
    toggle.setAttribute('aria-expanded', expand);
    
    // Update content visibility
    content.setAttribute('aria-hidden', !expand);
    
    if (expand) {
        // Expand the section
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Smooth scroll to section if it's not visible
        setTimeout(() => {
            const rect = toggle.getBoundingClientRect();
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            
            if (rect.top < headerHeight + 20) {
                const targetPosition = toggle.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 300);
        
        // Announce to screen readers
        const sectionTitle = toggle.querySelector('.section-title')?.textContent || 'Section';
        announceToScreenReader(`${sectionTitle} expanded`);
        
    } else {
        // Collapse the section
        content.style.maxHeight = '0px';
        
        // Announce to screen readers
        const sectionTitle = toggle.querySelector('.section-title')?.textContent || 'Section';
        announceToScreenReader(`${sectionTitle} collapsed`);
    }
    
    // Update the visual state of the toggle button
    updateToggleVisualState(toggle, expand);
}

function updateToggleVisualState(toggle, isExpanded) {
    const icon = toggle.querySelector('.section-icon svg');
    
    if (icon) {
        if (isExpanded) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// Utility function to expand all sections (useful for accessibility)
function expandAllSections() {
    const sectionToggles = document.querySelectorAll('.section-toggle');
    
    sectionToggles.forEach(toggle => {
        const targetId = toggle.getAttribute('aria-controls');
        const targetContent = document.getElementById(targetId);
        
        if (targetContent && toggle.getAttribute('aria-expanded') !== 'true') {
            toggleSection(toggle, targetContent, true);
        }
    });
}

// Utility function to collapse all sections
function collapseAllSections() {
    const sectionToggles = document.querySelectorAll('.section-toggle');
    
    sectionToggles.forEach(toggle => {
        const targetId = toggle.getAttribute('aria-controls');
        const targetContent = document.getElementById(targetId);
        
        if (targetContent && toggle.getAttribute('aria-expanded') === 'true') {
            toggleSection(toggle, targetContent, false);
        }
    });
}

// ==========================================================================
// METHODOLOGY DATA LOADING
// ==========================================================================

async function loadMethodologyData() {
    try {
        const response = await fetch('data/methodology.json');
        if (response.ok) {
            const methodologyData = await response.json();
            updateMethodologySection(methodologyData);
        }
    } catch (error) {
        console.log('No methodology data file found, using placeholder content');
        // Keep existing placeholder content
    }
}

function updateMethodologySection(data) {
    if (!data.methodology) return;
    
    // Update overview text
    const overviewText = document.getElementById('methodology-overview');
    if (overviewText && data.methodology.overview) {
        overviewText.textContent = data.methodology.overview;
    }
    
    // Update methodology sections
    if (data.methodology.sections && data.methodology.sections.length > 0) {
        updateMethodologySections(data.methodology.sections);
    }
    
    // Update related work
    if (data.methodology.relatedWork && data.methodology.relatedWork.length > 0) {
        updateRelatedWork(data.methodology.relatedWork);
    }
}

function updateMethodologySections(sections) {
    const sectionsContainer = document.getElementById('methodology-sections');
    if (!sectionsContainer) return;
    
    // Clear existing content
    sectionsContainer.innerHTML = '';
    
    // Create sections from data
    sections.forEach((section, index) => {
        const sectionElement = createMethodologySection(section, index);
        sectionsContainer.appendChild(sectionElement);
    });
    
    // Reinitialize collapsible functionality
    initializeCollapsibleSections();
}

function createMethodologySection(sectionData, index) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'methodology-section';
    sectionElement.setAttribute('data-section', sectionData.id);
    
    const contentId = `section-${sectionData.id}`;
    
    sectionElement.innerHTML = `
        <div class="section-header">
            <button class="section-toggle" aria-expanded="false" aria-controls="${contentId}">
                <div class="section-title-group">
                    <h3 class="section-title">${sectionData.title}</h3>
                    <p class="section-summary">${sectionData.summary}</p>
                </div>
                <div class="section-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </button>
        </div>
        <div class="section-content" id="${contentId}" aria-hidden="true">
            <div class="content-layout">
                <div class="content-text">
                    <p class="content-description">${sectionData.content}</p>
                    ${sectionData.details && sectionData.details.length > 0 ? `
                        <ul class="content-details">
                            ${sectionData.details.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
                <div class="content-diagram">
                    ${createDiagramPlaceholder(sectionData)}
                </div>
            </div>
        </div>
    `;
    
    return sectionElement;
}

function createDiagramPlaceholder(sectionData) {
    const diagramIcons = {
        'architecture': `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <path d="M9 9h6v6H9z"></path>
                        <path d="M9 1v6M15 1v6M9 17v6M15 17v6M1 9h6M1 15h6M17 9h6M17 15h6"></path>`,
        'training': `<path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                     <path d="M2 17l10 5 10-5"></path>
                     <path d="M2 12l10 5 10-5"></path>`,
        'evaluation': `<path d="M3 3v18h18"></path>
                       <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>`,
        'implementation': `<polyline points="16 18 22 12 16 6"></polyline>
                          <polyline points="8 6 2 12 8 18"></polyline>`
    };
    
    const iconSvg = diagramIcons[sectionData.id] || diagramIcons['architecture'];
    const diagramLabel = getDiagramLabel(sectionData.id);
    
    return `
        <div class="diagram-placeholder">
            <svg class="diagram-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                ${iconSvg}
            </svg>
            <p class="diagram-label">${diagramLabel}</p>
        </div>
    `;
}

function getDiagramLabel(sectionId) {
    const labels = {
        'architecture': 'Architecture Diagram',
        'training': 'Training Pipeline',
        'evaluation': 'Evaluation Metrics',
        'implementation': 'Implementation Stack'
    };
    
    return labels[sectionId] || 'Technical Diagram';
}

function updateRelatedWork(relatedWorkData) {
    const relatedWorkGrid = document.querySelector('.related-work-grid');
    if (!relatedWorkGrid) return;
    
    // Clear existing content
    relatedWorkGrid.innerHTML = '';
    
    // Create related work items from data
    relatedWorkData.forEach(work => {
        const workElement = document.createElement('div');
        workElement.className = 'related-work-item';
        
        workElement.innerHTML = `
            <h4 class="work-title">${work.title}</h4>
            <p class="work-authors">${work.authors} (${work.year})</p>
            <p class="work-relevance">${work.relevance}</p>
        `;
        
        relatedWorkGrid.appendChild(workElement);
    });
}

// ==========================================================================
// METHODOLOGY SECTION UTILITIES
// ==========================================================================

// Handle window resize for methodology sections
function handleMethodologyResize() {
    const expandedSections = document.querySelectorAll('.section-content[aria-hidden="false"]');
    
    expandedSections.forEach(section => {
        // Recalculate max-height for expanded sections
        section.style.maxHeight = section.scrollHeight + 'px';
    });
}

// Add resize listener for methodology sections
window.addEventListener('resize', handleMethodologyResize);

// Keyboard shortcuts for methodology section
document.addEventListener('keydown', function(e) {
    // Alt + E: Expand all methodology sections
    if (e.altKey && e.key === 'e') {
        e.preventDefault();
        expandAllSections();
        announceToScreenReader('All methodology sections expanded');
    }
    
    // Alt + C: Collapse all methodology sections
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        collapseAllSections();
        announceToScreenReader('All methodology sections collapsed');
    }
});

// Utility function for screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove the announcement after a short delay
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Auto-expand first section on page load (optional)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const firstToggle = document.querySelector('.section-toggle');
        if (firstToggle) {
            const targetId = firstToggle.getAttribute('aria-controls');
            const targetContent = document.getElementById(targetId);
            
            if (targetContent) {
                // Uncomment the line below to auto-expand the first section
                // toggleSection(firstToggle, targetContent, true);
            }
        }
    }, 500);
});

// Intersection Observer for methodology sections (optional animation)
if ('IntersectionObserver' in window) {
    const methodologyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe methodology sections when they're created
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            const methodologySections = document.querySelectorAll('.methodology-section');
            methodologySections.forEach(section => {
                methodologyObserver.observe(section);
            });
        }, 100);
    });
}
// ===
// =======================================================================
// CITATION COMPONENT FUNCTIONALITY
// ==========================================================================

// Initialize citation functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCitationComponent();
});

function initializeCitationComponent() {
    initializeCopyFunctionality();
    loadCitationData();
}

// ==========================================================================
// COPY TO CLIPBOARD FUNCTIONALITY
// ==========================================================================

function initializeCopyFunctionality() {
    // Copy BibTeX citation
    const copyBibtexBtn = document.querySelector('.copy-bibtex-btn');
    if (copyBibtexBtn) {
        copyBibtexBtn.addEventListener('click', function() {
            const bibtexCode = document.querySelector('#bibtex-code code');
            if (bibtexCode) {
                copyToClipboard(bibtexCode.textContent, 'BibTeX citation copied!');
            }
        });
    }
    
    // Copy identifier buttons (DOI, arXiv, etc.)
    const copyIdentifierBtns = document.querySelectorAll('.copy-identifier-btn');
    copyIdentifierBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-copy-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const text = targetElement.textContent;
                const type = targetId.includes('doi') ? 'DOI' : 'arXiv ID';
                copyToClipboard(text, `${type} copied!`);
            }
        });
    });
}

// Enhanced copy to clipboard function with better error handling and feedback
async function copyToClipboard(text, successMessage = 'Copied!') {
    const feedback = document.getElementById('copy-feedback');
    
    try {
        // Modern clipboard API (preferred method)
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            showCopyFeedback(successMessage, 'success');
        } else {
            // Fallback for older browsers or non-secure contexts
            const success = fallbackCopyToClipboard(text);
            if (success) {
                showCopyFeedback(successMessage, 'success');
            } else {
                throw new Error('Fallback copy failed');
            }
        }
        
        // Announce to screen readers
        announceToScreenReader(successMessage);
        
    } catch (error) {
        console.warn('Copy to clipboard failed:', error);
        showCopyFeedback('Copy failed. Please select and copy manually.', 'error');
        
        // Select the text as a fallback
        selectText(text);
    }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text) {
    try {
        // Create a temporary textarea element
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        // Select and copy the text
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        
        // Clean up
        document.body.removeChild(textArea);
        
        return successful;
    } catch (error) {
        console.warn('Fallback copy failed:', error);
        return false;
    }
}

// Select text for manual copying
function selectText(text) {
    try {
        // Try to find and select the text in the document
        const bibtexCode = document.querySelector('#bibtex-code code');
        if (bibtexCode && bibtexCode.textContent === text) {
            const range = document.createRange();
            range.selectNodeContents(bibtexCode);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    } catch (error) {
        console.warn('Text selection failed:', error);
    }
}

// Show copy feedback with animation
function showCopyFeedback(message, type = 'success') {
    const feedback = document.getElementById('copy-feedback');
    if (!feedback) return;
    
    // Clear any existing timeout
    if (feedback.timeoutId) {
        clearTimeout(feedback.timeoutId);
    }
    
    // Set message and type
    feedback.textContent = message;
    feedback.className = `copy-feedback ${type} show`;
    
    // Hide after 3 seconds
    feedback.timeoutId = setTimeout(() => {
        feedback.classList.remove('show');
        
        // Clear text after animation completes
        setTimeout(() => {
            if (!feedback.classList.contains('show')) {
                feedback.textContent = '';
                feedback.className = 'copy-feedback';
            }
        }, 300);
    }, 3000);
}

// ==========================================================================
// CITATION DATA LOADING
// ==========================================================================

function loadCitationData() {
    // Load citation data from the existing paper-info.json
    loadPaperDataForCitation();
}

async function loadPaperDataForCitation() {
    try {
        const response = await fetch('data/paper-info.json');
        const paperData = await response.json();
        
        updateCitationSection(paperData);
        
        console.log('Citation data loaded successfully');
    } catch (error) {
        console.warn('Could not load citation data:', error);
        // Keep placeholder content if data loading fails
    }
}

function updateCitationSection(paperData) {
    // Update BibTeX citation
    updateBibtexCitation(paperData);
    
    // Update DOI information
    updateDOISection(paperData);
    
    // Update arXiv information
    updateArxivSection(paperData);
}

function updateBibtexCitation(paperData) {
    const bibtexCode = document.querySelector('#bibtex-code code');
    if (bibtexCode && paperData.bibtex) {
        bibtexCode.textContent = paperData.bibtex;
    }
}

function updateDOISection(paperData) {
    const doiContainer = document.getElementById('doi-container');
    const doiText = document.getElementById('doi-text');
    const doiLink = document.getElementById('doi-link');
    
    if (paperData.doi && doiContainer && doiText && doiLink) {
        // Show DOI container
        doiContainer.style.display = 'block';
        
        // Update DOI text
        doiText.textContent = paperData.doi;
        
        // Update DOI link
        const doiUrl = paperData.doi.startsWith('http') 
            ? paperData.doi 
            : `https://doi.org/${paperData.doi}`;
        doiLink.href = doiUrl;
        doiLink.setAttribute('aria-label', `Open DOI ${paperData.doi} in new tab`);
    } else if (doiContainer) {
        // Hide DOI container if no DOI available
        doiContainer.style.display = 'none';
    }
}

function updateArxivSection(paperData) {
    const arxivContainer = document.getElementById('arxiv-container');
    const arxivText = document.getElementById('arxiv-text');
    const arxivLink = document.getElementById('arxiv-link');
    
    if (paperData.arxivId && arxivContainer && arxivText && arxivLink) {
        // Show arXiv container
        arxivContainer.style.display = 'block';
        
        // Update arXiv text
        arxivText.textContent = paperData.arxivId;
        
        // Update arXiv link
        const arxivUrl = paperData.arxivId.startsWith('http') 
            ? paperData.arxivId 
            : `https://arxiv.org/abs/${paperData.arxivId}`;
        arxivLink.href = arxivUrl;
        arxivLink.setAttribute('aria-label', `Open arXiv ${paperData.arxivId} in new tab`);
    } else if (arxivContainer) {
        // Hide arXiv container if no arXiv ID available
        arxivContainer.style.display = 'none';
    }
}

// ==========================================================================
// ACCESSIBILITY UTILITIES
// ==========================================================================

// Announce messages to screen readers
function announceToScreenReader(message) {
    // Create or update an aria-live region for announcements
    let announcer = document.getElementById('sr-announcer');
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'sr-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
    }
    
    // Clear and set the message
    announcer.textContent = '';
    setTimeout(() => {
        announcer.textContent = message;
    }, 100);
    
    // Clear the message after a delay
    setTimeout(() => {
        announcer.textContent = '';
    }, 3000);
}

// ==========================================================================
// KEYBOARD NAVIGATION ENHANCEMENTS
// ==========================================================================

// Add keyboard support for citation interactions
document.addEventListener('keydown', function(event) {
    // Handle keyboard shortcuts for citation section
    if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
            case 'c':
                // Ctrl/Cmd + C when focused on citation section
                const activeElement = document.activeElement;
                if (activeElement && activeElement.closest('.citation')) {
                    // Check if we're in the BibTeX area
                    const bibtexContainer = activeElement.closest('.bibtex-container');
                    if (bibtexContainer) {
                        event.preventDefault();
                        const bibtexCode = bibtexContainer.querySelector('#bibtex-code code');
                        if (bibtexCode) {
                            copyToClipboard(bibtexCode.textContent, 'BibTeX citation copied via keyboard!');
                        }
                    }
                }
                break;
        }
    }
});

// ==========================================================================
// CITATION COMPONENT UTILITIES
// ==========================================================================

// Format citation text for different styles (future enhancement)
function formatCitation(paperData, style = 'bibtex') {
    switch (style.toLowerCase()) {
        case 'bibtex':
            return paperData.bibtex || generateBibtex(paperData);
        case 'apa':
            return generateAPACitation(paperData);
        case 'mla':
            return generateMLACitation(paperData);
        default:
            return paperData.bibtex || generateBibtex(paperData);
    }
}

// Generate BibTeX from paper data (fallback)
function generateBibtex(paperData) {
    if (!paperData.title || !paperData.authors) return '';
    
    const firstAuthor = paperData.authors[0];
    const key = firstAuthor ? 
        `${firstAuthor.name.split(' ').pop().toLowerCase()}${new Date(paperData.publicationDate || '2024').getFullYear()}` :
        'paper2024';
    
    const authors = paperData.authors.map(author => author.name).join(' and ');
    const year = new Date(paperData.publicationDate || '2024').getFullYear();
    
    return `@article{${key},
  title={${paperData.title}},
  author={${authors}},
  journal={${paperData.venue || 'Conference Proceedings'}},
  year={${year}}${paperData.doi ? `,\n  doi={${paperData.doi}}` : ''}
}`;
}

// Generate APA citation (future enhancement)
function generateAPACitation(paperData) {
    if (!paperData.authors || !paperData.title) return '';
    
    const authors = paperData.authors.map(author => {
        const nameParts = author.name.split(' ');
        const lastName = nameParts.pop();
        const initials = nameParts.map(name => name.charAt(0).toUpperCase()).join('. ');
        return `${lastName}, ${initials}`;
    }).join(', ');
    
    const year = new Date(paperData.publicationDate || '2024').getFullYear();
    
    return `${authors} (${year}). ${paperData.title}. ${paperData.venue || 'Conference Proceedings'}.`;
}

// Generate MLA citation (future enhancement)
function generateMLACitation(paperData) {
    if (!paperData.authors || !paperData.title) return '';
    
    const firstAuthor = paperData.authors[0];
    const authorName = `${firstAuthor.name.split(' ').pop()}, ${firstAuthor.name.split(' ').slice(0, -1).join(' ')}`;
    const year = new Date(paperData.publicationDate || '2024').getFullYear();
    
    return `${authorName}. "${paperData.title}." ${paperData.venue || 'Conference Proceedings'}, ${year}.`;
}

// Validate citation data
function validateCitationData(paperData) {
    const errors = [];
    
    if (!paperData.title) errors.push('Missing paper title');
    if (!paperData.authors || paperData.authors.length === 0) errors.push('Missing authors');
    if (!paperData.venue) errors.push('Missing publication venue');
    if (!paperData.publicationDate) errors.push('Missing publication date');
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ==========================================================================
// FOOTER FUNCTIONALITY
// ==========================================================================

// Initialize footer functionality
function initializeFooter() {
    initializeFooterData();
    initializeBackToTop();
    updateCopyrightYear();
}

// Initialize footer with paper data
async function initializeFooterData() {
    try {
        const response = await fetch('data/paper-info.json');
        const paperData = await response.json();
        
        // Update footer with paper data
        updateFooterContent(paperData);
        
        console.log('Footer data loaded successfully');
    } catch (error) {
        console.warn('Could not load footer data:', error);
        // Keep placeholder content
    }
}

// Update footer content with paper data
function updateFooterContent(paperData) {
    // Update author contact information
    updateAuthorContacts(paperData.authors);
    
    // Update copyright information
    updateCopyrightInfo(paperData.authors);
    
    // Update resource links if available
    updateResourceLinks(paperData);
}

// Update author contact information
function updateAuthorContacts(authors) {
    const authorsContact = document.getElementById('authors-contact');
    if (!authorsContact || !authors || authors.length === 0) return;
    
    // Clear placeholder content
    authorsContact.innerHTML = '';
    
    // Create contact cards for each author
    authors.forEach(author => {
        const contactCard = document.createElement('div');
        contactCard.className = 'author-contact';
        
        // Author name
        const nameElement = document.createElement('h4');
        nameElement.className = 'contact-name';
        nameElement.textContent = author.name;
        contactCard.appendChild(nameElement);
        
        // Author affiliation
        if (author.affiliation) {
            const affiliationElement = document.createElement('p');
            affiliationElement.className = 'contact-affiliation';
            affiliationElement.textContent = author.affiliation;
            contactCard.appendChild(affiliationElement);
        }
        
        // Contact links
        const linksContainer = document.createElement('div');
        linksContainer.className = 'contact-links';
        
        // Website link
        if (author.website && author.website.trim() !== '') {
            const websiteLink = document.createElement('a');
            websiteLink.href = author.website;
            websiteLink.className = 'contact-link';
            websiteLink.target = '_blank';
            websiteLink.rel = 'noopener noreferrer';
            websiteLink.setAttribute('aria-label', `Visit ${author.name}'s website`);
            
            websiteLink.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                Website
            `;
            linksContainer.appendChild(websiteLink);
        }
        
        // Email link
        if (author.email && author.email.trim() !== '') {
            const emailLink = document.createElement('a');
            emailLink.href = `mailto:${author.email}`;
            emailLink.className = 'contact-link';
            emailLink.setAttribute('aria-label', `Send email to ${author.name}`);
            
            emailLink.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email
            `;
            linksContainer.appendChild(emailLink);
        }
        
        if (linksContainer.children.length > 0) {
            contactCard.appendChild(linksContainer);
        }
        
        authorsContact.appendChild(contactCard);
    });
}

// Update copyright information
function updateCopyrightInfo(authors) {
    const copyrightAuthors = document.getElementById('copyright-authors');
    if (!copyrightAuthors || !authors || authors.length === 0) return;
    
    // Create author names string for copyright
    const authorNames = authors.map(author => author.name).join(', ');
    copyrightAuthors.textContent = authorNames;
}

// Update resource links
function updateResourceLinks(paperData) {
    // Update dataset link
    const datasetLink = document.getElementById('dataset-link');
    if (datasetLink && paperData.datasetUrl) {
        datasetLink.href = paperData.datasetUrl;
        datasetLink.style.display = 'flex';
    } else if (datasetLink) {
        datasetLink.style.display = 'none';
    }
    
    // Update supplementary materials link
    const supplementaryLink = document.getElementById('supplementary-link');
    if (supplementaryLink && paperData.supplementaryUrl) {
        supplementaryLink.href = paperData.supplementaryUrl;
        supplementaryLink.style.display = 'flex';
    } else if (supplementaryLink) {
        supplementaryLink.style.display = 'none';
    }
    
    // Update slides link
    const slidesLink = document.getElementById('slides-link');
    if (slidesLink && paperData.slidesUrl) {
        slidesLink.href = paperData.slidesUrl;
        slidesLink.style.display = 'flex';
    } else if (slidesLink) {
        slidesLink.style.display = 'none';
    }
}

// Initialize back to top functionality
function initializeBackToTop() {
    const backToTopLink = document.querySelector('.footer-link[href="#hero"]');
    if (!backToTopLink) return;
    
    backToTopLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Focus the hero section for accessibility
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.setAttribute('tabindex', '-1');
            heroSection.focus();
            
            // Remove tabindex after focus
            setTimeout(() => {
                heroSection.removeAttribute('tabindex');
            }, 100);
        }
    });
}

// Update copyright year
function updateCopyrightYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        const currentYear = new Date().getFullYear();
        currentYearElement.textContent = currentYear;
    }
}

// Utility function for screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove the announcement after a short delay
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}