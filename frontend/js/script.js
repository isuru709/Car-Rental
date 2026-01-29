/*
    ═══════════════════════════════════════════════════════════════════════════════
    DRIVEX - Interactive JavaScript
    Premium Car Rental Landing Page
    ═══════════════════════════════════════════════════════════════════════════════
*/

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════════════════════════════════
    // PRELOADER
    // ═══════════════════════════════════════════════════════════════════════════════
    const preloader = document.getElementById('preloader');
    const body = document.body;

    function hidePreloader() {
        preloader.classList.add('hidden');
        body.classList.remove('loading');

        // Trigger scroll animations immediately after preloader
        setTimeout(() => {
            triggerInitialAnimations();
        }, 100);
    }

    // Wait for page load, minimum 2s for branding effect
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 2000);
    });

    // Fallback - hide preloader after 3.5s regardless
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            hidePreloader();
        }
    }, 3500);

    // ═══════════════════════════════════════════════════════════════════════════════
    // HERO BACKGROUND SLIDESHOW
    // ═══════════════════════════════════════════════════════════════════════════════
    const heroSlideshow = document.getElementById('heroSlideshow');
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    let slideInterval;

    function nextSlide() {
        if (heroSlides.length === 0) return;
        
        // Get current active slide
        const prevSlide = heroSlides[currentSlide];
        
        // Calculate next slide index (random for variety)
        let nextSlideIndex;
        do {
            nextSlideIndex = Math.floor(Math.random() * heroSlides.length);
        } while (nextSlideIndex === currentSlide && heroSlides.length > 1);
        
        const nextSlideEl = heroSlides[nextSlideIndex];
        
        // Remove all classes first
        heroSlides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Apply transition classes
        prevSlide.classList.add('prev');
        nextSlideEl.classList.add('active');
        
        // Update current slide index
        currentSlide = nextSlideIndex;
    }

    function startSlideshow() {
        if (heroSlides.length > 1) {
            slideInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
        }
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Start slideshow after preloader
    setTimeout(() => {
        startSlideshow();
    }, 2500);

    // ═══════════════════════════════════════════════════════════════════════════════
    // CUSTOM CURSOR
    // ═══════════════════════════════════════════════════════════════════════════════
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    // Only activate on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        // Update cursor position on mouse move
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Immediate update for dot cursor
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Animate follower with smooth lerp
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .magnetic, .car-card');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('active');
                if (el.classList.contains('car-card')) {
                    cursorFollower.classList.add('view-mode');
                }
            });

            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('active', 'view-mode');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // MAGNETIC BUTTON EFFECT
    // ═══════════════════════════════════════════════════════════════════════════════
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(el => {
        const strength = parseInt(el.getAttribute('data-strength')) || 25;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            const moveX = deltaX * (strength / 100);
            const moveY = deltaY * (strength / 100);

            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.transform = 'translate(0, 0)';
            setTimeout(() => { el.style.transition = ''; }, 400);
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // 3D TILT EFFECT FOR CAR CARDS
    // ═══════════════════════════════════════════════════════════════════════════════
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        const imageWrapper = card.querySelector('.car-image-wrapper');
        if (!imageWrapper) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateX = (0.5 - y) * 15;
            const rotateY = (x - 0.5) * 15;

            imageWrapper.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                scale3d(1.02, 1.02, 1.02)
            `;
        });

        card.addEventListener('mouseleave', () => {
            imageWrapper.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            imageWrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            setTimeout(() => { imageWrapper.style.transition = ''; }, 500);
        });

        card.addEventListener('mouseenter', () => {
            imageWrapper.style.transition = 'transform 0.2s ease-out';
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // SCROLL PROGRESS INDICATOR
    // ═══════════════════════════════════════════════════════════════════════════════
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        if (!scrollProgress) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollPercent = (window.scrollY / documentHeight) * 100;

        scrollProgress.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ═══════════════════════════════════════════════════════════════════════════════
    // SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
    // ═══════════════════════════════════════════════════════════════════════════════

    // All elements that should animate on scroll
    const animatedElements = document.querySelectorAll(
        '.reveal-element, .car-card, .service-card, .testimonial-card, .feature-item, .features-visual, .contact-form-wrapper, .cta-content'
    );

    // Create observer with generous thresholds
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
    });

    // Observe all animated elements
    animatedElements.forEach(el => observer.observe(el));

    // Trigger animations for elements already in view
    function triggerInitialAnimations() {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PARALLAX EFFECT
    // ═══════════════════════════════════════════════════════════════════════════════
    const parallaxElements = document.querySelectorAll('.parallax');

    function updateParallax() {
        const scrollY = window.scrollY;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.3;
            const yPos = scrollY * speed;
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ═══════════════════════════════════════════════════════════════════════════════
    // COUNTER ANIMATION FOR STATS
    // ═══════════════════════════════════════════════════════════════════════════════
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * easeProgress);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // NAVIGATION BEHAVIOR
    // ═══════════════════════════════════════════════════════════════════════════════
    const nav = document.getElementById('nav');
    const topBar = document.querySelector('.top-bar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
            if (topBar) topBar.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
            if (topBar) topBar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ═══════════════════════════════════════════════════════════════════════════════
    // MOBILE MENU
    // ═══════════════════════════════════════════════════════════════════════════════
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close menu when link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ═══════════════════════════════════════════════════════════════════════════════
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // ADVANCED FLEET FILTER FUNCTIONALITY
    // ═══════════════════════════════════════════════════════════════════════════════
    const filterPills = document.querySelectorAll('.filter-pill');
    const carCards = document.querySelectorAll('.car-card');
    const fleetGrid = document.getElementById('fleetGrid');
    const carCountEl = document.getElementById('carCount');
    const noResultsEl = document.getElementById('noResults');
    const sortSelect = document.getElementById('sortSelect');
    const viewButtons = document.querySelectorAll('.view-btn');
    const resetFiltersBtn = document.querySelector('.btn-reset-filters');

    let currentFilter = 'all';
    let currentSort = 'popular';
    
    // Pagination state (used across filter and pagination systems)
    let isExpanded = false;
    let currentPage = 1;
    let totalPages = 1;

    // Category Filter
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Update active state
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            currentFilter = pill.getAttribute('data-filter');
            filterAndSortCars();
        });
    });

    // Sort Select
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterAndSortCars();
        });
    }

    // View Toggle (Grid/List)
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.getAttribute('data-view');
            if (fleetGrid) {
                if (view === 'list') {
                    fleetGrid.classList.add('list-view');
                } else {
                    fleetGrid.classList.remove('list-view');
                }
            }
        });
    });

    // Reset Filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            currentFilter = 'all';
            currentSort = 'popular';
            
            filterPills.forEach(p => p.classList.remove('active'));
            document.querySelector('.filter-pill[data-filter="all"]')?.classList.add('active');
            
            if (sortSelect) sortSelect.value = 'popular';
            
            filterAndSortCars();
        });
    }

    function filterAndSortCars() {
        const cards = Array.from(carCards);
        let visibleCards = [];
        let hiddenCards = [];

        // Filter cards
        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (currentFilter === 'all' || category === currentFilter) {
                visibleCards.push(card);
            } else {
                hiddenCards.push(card);
            }
        });

        // Sort visible cards
        visibleCards.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price')) || 0;
            const priceB = parseInt(b.getAttribute('data-price')) || 0;
            const popularA = parseInt(a.getAttribute('data-popular')) || 0;
            const popularB = parseInt(b.getAttribute('data-popular')) || 0;

            switch (currentSort) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'newest':
                    return 0; // Keep original order for newest
                case 'popular':
                default:
                    return popularB - popularA;
            }
        });

        // Hide cards first
        hiddenCards.forEach(card => {
            card.classList.add('hiding');
            card.classList.remove('visible');
        });

        // Wait, then update DOM
        setTimeout(() => {
            hiddenCards.forEach(card => {
                card.style.display = 'none';
            });

            // Reorder and show visible cards
            visibleCards.forEach((card, index) => {
                card.style.display = '';
                fleetGrid?.appendChild(card);
                
                setTimeout(() => {
                    card.classList.remove('hiding');
                    card.classList.add('visible');
                }, index * 50);
            });

            // Update count
            if (carCountEl) {
                carCountEl.textContent = visibleCards.length;
            }

            // Show/hide no results
            if (noResultsEl) {
                noResultsEl.style.display = visibleCards.length === 0 ? 'block' : 'none';
            }
            if (fleetGrid) {
                fleetGrid.style.display = visibleCards.length === 0 ? 'none' : '';
            }

            // Reset pagination state and reinitialize
            isExpanded = false;
            currentPage = 1;
            setTimeout(() => {
                if (typeof initPagination === 'function') {
                    initPagination();
                }
            }, 100);
        }, 300);
    }

    // Favorite Button Toggle
    const favoriteButtons = document.querySelectorAll('.car-favorite');
    
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
            
            // Animate heart
            const svg = btn.querySelector('svg');
            if (svg) {
                svg.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    svg.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });

    // Initialize filter on load
    setTimeout(() => {
        filterAndSortCars();
    }, 100);

    // ═══════════════════════════════════════════════════════════════════════════════
    // FLEET PAGINATION SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════════
    const showMoreBtn = document.getElementById('showMoreBtn');
    const paginationNav = document.getElementById('paginationNav');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbersContainer = document.getElementById('pageNumbers');
    const paginationInfo = document.getElementById('paginationInfo');

    const CARDS_PER_ROW = 4;
    const INITIAL_ROWS = 1;
    const EXPANDED_ROWS = 4;
    const CARDS_PER_PAGE = CARDS_PER_ROW * EXPANDED_ROWS; // 16 cards per page

    function initPagination() {
        const allCards = Array.from(document.querySelectorAll('.car-card'));
        const filteredCards = allCards.filter(card => card.style.display !== 'none');
        totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
        
        console.log(`Init pagination: ${filteredCards.length} cards, ${totalPages} pages`);
        
        updateCardVisibility();
        updatePaginationUI();
    }

    function updateCardVisibility() {
        const allCards = Array.from(document.querySelectorAll('.car-card'));
        
        // Get cards that are not hidden by category filter
        // Cards hidden by filter have inline style display:none
        const filteredCards = allCards.filter(card => {
            return card.style.display !== 'none';
        });
        
        // Remove page-visible from ALL cards first
        allCards.forEach(card => card.classList.remove('page-visible'));
        
        // Calculate which cards should be visible on current page
        const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
        const endIndex = startIndex + CARDS_PER_PAGE;
        
        filteredCards.forEach((card, index) => {
            if (!isExpanded) {
                // Show only first row (4 cards)
                if (index < CARDS_PER_ROW * INITIAL_ROWS) {
                    card.classList.add('page-visible');
                }
            } else {
                // Show cards for current page (16 cards per page)
                if (index >= startIndex && index < endIndex) {
                    card.classList.add('page-visible');
                }
            }
        });

        // Update fleetGrid class for CSS display control
        if (fleetGrid) {
            // Always add paginated when expanded to ensure CSS rules work
            fleetGrid.classList.toggle('expanded', isExpanded);
            fleetGrid.classList.toggle('paginated', isExpanded);
        }
        
        // Debug log
        console.log(`Page ${currentPage}: showing cards ${startIndex} to ${endIndex - 1}, total filtered: ${filteredCards.length}`);
    }

    function updatePaginationUI() {
        const allCards = Array.from(document.querySelectorAll('.car-card'));
        const filteredCards = allCards.filter(card => card.style.display !== 'none');
        totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);

        // Show/hide buttons based on state
        if (showMoreBtn) {
            showMoreBtn.classList.toggle('hidden', isExpanded);
        }
        
        if (paginationNav) {
            paginationNav.classList.toggle('visible', isExpanded && totalPages > 1);
        }

        // Update prev/next buttons
        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage <= 1;
        }
        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage >= totalPages;
        }

        // Update page numbers
        if (pageNumbersContainer) {
            pageNumbersContainer.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = `page-num ${i === currentPage ? 'active' : ''}`;
                    pageBtn.textContent = i;
                    pageBtn.addEventListener('click', () => goToPage(i));
                    pageNumbersContainer.appendChild(pageBtn);
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                    const dots = document.createElement('span');
                    dots.className = 'page-dots';
                    dots.textContent = '...';
                    pageNumbersContainer.appendChild(dots);
                }
            }
        }

        // Update pagination info
        if (paginationInfo) {
            const startCard = (currentPage - 1) * CARDS_PER_PAGE + 1;
            const endCard = Math.min(currentPage * CARDS_PER_PAGE, filteredCards.length);
            paginationInfo.textContent = `Showing ${startCard}-${endCard} of ${filteredCards.length} vehicles`;
        }
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        updateCardVisibility();
        updatePaginationUI();
        
        // Scroll to fleet section
        const fleetSection = document.getElementById('fleet');
        if (fleetSection) {
            fleetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Show More button click
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            isExpanded = true;
            currentPage = 1;
            updateCardVisibility();
            updatePaginationUI();
        });
    }

    // Previous page button
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
    }

    // Next page button
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    }

    // Initialize pagination after filter
    setTimeout(() => {
        initPagination();
    }, 200);

    // ═══════════════════════════════════════════════════════════════════════════════
    // CONTACT FORM HANDLING
    // ═══════════════════════════════════════════════════════════════════════════════
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<span class="btn-text">Message Sent! ✓</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                // Reset form
                contactForm.reset();

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // NEWSLETTER FORM
    // ═══════════════════════════════════════════════════════════════════════════════
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const input = newsletterForm.querySelector('.newsletter-input');
            const btn = newsletterForm.querySelector('.newsletter-btn');
            
            if (input.value) {
                btn.innerHTML = '✓';
                btn.style.background = '#10b981';
                input.value = '';
                
                setTimeout(() => {
                    btn.innerHTML = '→';
                    btn.style.background = '';
                }, 2000);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // TEXT SPLIT ANIMATION (For section titles)
    // ═══════════════════════════════════════════════════════════════════════════════
    const splitTexts = document.querySelectorAll('.split-text');

    splitTexts.forEach(text => {
        const words = text.textContent.split(' ');
        text.innerHTML = words.map((word, i) => 
            `<span class="word" style="animation-delay: ${i * 0.1}s">${word}</span>`
        ).join(' ');
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // RIPPLE EFFECT FOR BUTTONS
    // ═══════════════════════════════════════════════════════════════════════════════
    const rippleButtons = document.querySelectorAll('.btn-primary, .btn-ghost, .car-book');

    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            
            ripple.className = 'ripple';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple styles dynamically
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ═══════════════════════════════════════════════════════════════════════════════
    // LAZY LOADING FOR IMAGES
    // ═══════════════════════════════════════════════════════════════════════════════
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ═══════════════════════════════════════════════════════════════════════════════
    // KEYBOARD NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    console.log('🚗 DriveX - Premium Car Rentals loaded successfully!');
});
