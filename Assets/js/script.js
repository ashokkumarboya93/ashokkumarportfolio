// Portfolio - Deploy-Ready JS
// (Lucide Icons, Scroll Reveal, Nav, Center-Focus Carousel, Rain, Sprinkles)
document.addEventListener('DOMContentLoaded', () => {

    /* ====== Lucide Icons ====== */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ====== Scroll Reveal ====== */
    document.querySelectorAll('.section').forEach(s => {
        s.querySelectorAll(
            '.section-header,.edu-card,.skill-category,.carousel-card,.exp-tree-item,.cert-card,.extra-card,.info-card,.contact-form'
        ).forEach(el => el.classList.add('reveal'));
    });

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('revealed');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ====== Hero Stat Count-Up Animation ====== */
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    let statsCounted = false;

    function animateCountUp(el) {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isDecimal = String(el.dataset.count).includes('.');
        const duration = 1600; // ms
        const steps = 50;
        const stepTime = duration / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            // ease-out quad
            const progress = step / steps;
            const eased = 1 - (1 - progress) * (1 - progress);
            current = target * eased;

            if (step >= steps) {
                el.textContent = (isDecimal ? target.toFixed(1) : Math.round(target)) + suffix;
                clearInterval(timer);
            } else {
                el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
            }
        }, stepTime);
    }

    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !statsCounted) {
                statsCounted = true;
                statValues.forEach(el => animateCountUp(el));
            }
        });
    }, { threshold: 0.3 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    /* ====== Navbar Scroll & Active Link ====== */
    const nav = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateNav() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
        let currentId = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) currentId = s.id;
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + currentId);
        });
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    /* ====== Smooth Scroll + Mobile Menu ====== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navLinks');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu
            if (mobileToggle) mobileToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            if (navMenu) navMenu.classList.toggle('active');
        });
    }

    /* ====== Skills Rain Effect ====== */
    const rainContainer = document.getElementById('skillsRain');
    if (rainContainer) {
        for (let i = 0; i < 40; i++) {
            const drop = document.createElement('div');
            drop.classList.add('rain-drop');
            drop.style.left = Math.random() * 100 + '%';
            drop.style.height = (Math.random() * 30 + 15) + 'px';
            drop.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            drop.style.animationDelay = (Math.random() * 4) + 's';
            drop.style.opacity = Math.random() * 0.4 + 0.1;
            rainContainer.appendChild(drop);
        }
    }

    /* ============================================================
       CENTER-FOCUS CAROUSEL
       ============================================================ */
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselCards = carouselTrack
        ? Array.from(carouselTrack.querySelectorAll('.carousel-card'))
        : [];
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    let currentIndex = 0;

    function scrollToCard(index) {
        if (!carouselTrack || carouselCards.length === 0) return;
        index = Math.max(0, Math.min(index, carouselCards.length - 1));
        currentIndex = index;

        const card = carouselCards[index];
        const trackWidth = carouselTrack.clientWidth;
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const scrollTarget = cardLeft - (trackWidth / 2) + (cardWidth / 2);

        carouselTrack.scrollTo({ left: scrollTarget, behavior: 'smooth' });
        setActiveCard(index);
    }

    function setActiveCard(idx) {
        carouselCards.forEach((card, i) => {
            card.classList.toggle('active', i === idx);
        });
        carouselDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
        currentIndex = idx;
    }

    // On scroll, detect nearest-to-center card
    let scrollRaf = null;
    function onTrackScroll() {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
            scrollRaf = null;
            if (!carouselTrack || carouselCards.length === 0) return;
            const trackRect = carouselTrack.getBoundingClientRect();
            const centerX = trackRect.left + trackRect.width / 2;
            let closestIdx = 0;
            let closestDist = Infinity;

            carouselCards.forEach((card, i) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const dist = Math.abs(cardCenter - centerX);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIdx = i;
                }
            });

            setActiveCard(closestIdx);
        });
    }

    if (carouselTrack) {
        carouselTrack.addEventListener('scroll', onTrackScroll, { passive: true });
    }

    // Prev / Next buttons
    if (carouselPrev) {
        carouselPrev.addEventListener('click', () => {
            scrollToCard(currentIndex - 1);
        });
    }
    if (carouselNext) {
        carouselNext.addEventListener('click', () => {
            scrollToCard(currentIndex + 1);
        });
    }

    // Dot clicks
    carouselDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.dot, 10);
            if (!isNaN(idx)) scrollToCard(idx);
        });
    });

    // Horizontal mouse-wheel scroll (only with Shift key to avoid blocking normal page scroll)
    if (carouselTrack) {
        carouselTrack.addEventListener('wheel', e => {
            // Only hijack scroll when Shift is held, otherwise let page scroll normally
            if (e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                carouselTrack.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }

    // Keyboard arrows
    document.addEventListener('keydown', e => {
        // Only respond when projects section is in view
        const projectsSection = document.getElementById('projects');
        if (!projectsSection) return;
        const rect = projectsSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === 'ArrowLeft') scrollToCard(currentIndex - 1);
        if (e.key === 'ArrowRight') scrollToCard(currentIndex + 1);
    });

    // Initialize: center on first card after layout settles
    if (carouselCards.length > 0) {
        setTimeout(() => scrollToCard(0), 200);
    }

    /* ============================================================
       Click Sprinkle / Confetti Effect
       ============================================================ */
    const sprinkleContainer = document.getElementById('sprinkleContainer');
    const sprinkleColors = [
        '#4ade80', '#2dd4bf', '#a78bfa', '#fbbf24',
        '#fb7185', '#60a5fa', '#22c55e', '#f59e0b',
        '#e879f9', '#38bdf8'
    ];

    document.addEventListener('click', e => {
        if (!sprinkleContainer) return;
        createSprinkles(e.clientX, e.clientY);
    });

    function createSprinkles(x, y) {
        const count = 12;
        for (let i = 0; i < count; i++) {
            const span = document.createElement('span');
            span.className = 'sprinkle';

            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
            const distance = 35 + Math.random() * 70;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance - 15;
            const size = 4 + Math.random() * 7;
            const color = sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)];
            const rot = Math.random() * 720 - 360;
            const dur = 0.45 + Math.random() * 0.35;
            const isRound = Math.random() > 0.4;

            span.style.left = x + 'px';
            span.style.top = y + 'px';
            span.style.setProperty('--sprinkle-x', dx + 'px');
            span.style.setProperty('--sprinkle-y', dy + 'px');
            span.style.setProperty('--sprinkle-size', size + 'px');
            span.style.setProperty('--sprinkle-color', color);
            span.style.setProperty('--sprinkle-rot', rot + 'deg');
            span.style.setProperty('--sprinkle-duration', dur + 's');
            span.style.setProperty('--sprinkle-radius', isRound ? '50%' : '2px');

            sprinkleContainer.appendChild(span);
            span.addEventListener('animationend', () => span.remove());
        }
    }

    /* ============================================================
       Skill Orb Ring Animation
       ============================================================ */
    const skillOrbs = document.querySelectorAll('.skill-orb');
    const circumference = 2 * Math.PI * 54; // r=54

    skillOrbs.forEach(orb => {
        const percent = parseInt(orb.dataset.percent) || 0;
        const color = orb.dataset.color || '#4ade80';
        const offset = circumference - (percent / 100) * circumference;
        const fill = orb.querySelector('.orb-fill');
        if (fill) {
            fill.style.setProperty('--orb-color', color);
            fill.style.stroke = color;
        }
        orb.style.setProperty('--orb-color', color);
        orb.style.setProperty('--orb-glow', color + '33');
        orb.style.setProperty('--orb-offset', offset);
    });

    const orbObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('animated');
                orbObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });

    skillOrbs.forEach(orb => orbObserver.observe(orb));

    /* ====== Contact Form Handler ====== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<span>Sending... ⏳</span>';
                btn.disabled = true;
                btn.style.opacity = '0.7';

                const formData = new FormData(contactForm);
                
                try {
                    const response = await fetch("https://formspree.io/f/mkoyqkwa", {
                        method: "POST",
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        btn.innerHTML = '<span>Message Sent! ✨</span>';
                        contactForm.reset();
                    } else {
                        btn.innerHTML = '<span>Error! Try again.</span>';
                    }
                } catch (error) {
                    btn.innerHTML = '<span>Error! Try again.</span>';
                }

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }, 3500);
            }
        });
    }
});

// Theme Picker Dropdown Logic
document.addEventListener('DOMContentLoaded', () => {
    const themePickerBtn = document.getElementById('themePickerBtn');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    const allThemes = ['', 'theme-sky-blue', 'theme-goldish-yellow', 'theme-pale-pink', 'theme-red', 'theme-purple'];

    if(themePickerBtn && themeDropdown) {
        themePickerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = themeDropdown.style.opacity === '1';
            if (isActive) {
                themeDropdown.style.opacity = '0';
                themeDropdown.style.visibility = 'hidden';
                themeDropdown.style.transform = 'translateY(-10px)';
            } else {
                themeDropdown.style.opacity = '1';
                themeDropdown.style.visibility = 'visible';
                themeDropdown.style.transform = 'translateY(0)';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!themePickerBtn.contains(e.target) && !themeDropdown.contains(e.target)) {
                themeDropdown.style.opacity = '0';
                themeDropdown.style.visibility = 'hidden';
                themeDropdown.style.transform = 'translateY(-10px)';
            }
        });

        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedTheme = option.getAttribute('data-theme');
                
                // Remove all themes
                allThemes.forEach(t => {
                    if (t) document.body.classList.remove(t);
                });
                
                // Add selected theme
                if (selectedTheme) {
                    document.body.classList.add(selectedTheme);
                }
                
                // Close dropdown
                themeDropdown.style.opacity = '0';
                themeDropdown.style.visibility = 'hidden';
                themeDropdown.style.transform = 'translateY(-10px)';
            });
        });
    }
});



// Typing Animation Logic
document.addEventListener('DOMContentLoaded', () => {
    const roles = ["FULL STACK DEVELOPER", "AI/ML ENGINEER", "JAVA DEVELOPER", "AI DEVELOPER"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newRoleDelay = 2000;
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const elements = [
        document.getElementById('heroTypingText'),
        document.getElementById('aboutTypingText')
    ].filter(el => el !== null);

    function type() {
        if (elements.length === 0) return;
        
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            elements.forEach(el => el.textContent = currentRole.substring(0, charIndex - 1));
            charIndex--;
        } else {
            elements.forEach(el => el.textContent = currentRole.substring(0, charIndex + 1));
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? erasingDelay : typingDelay;
        
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = newRoleDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000);
});

// Lenis Smooth Scrolling Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            lerp: 0.07, // Controls the buttery smoothness (lower is smoother/heavier)
            wheelMultiplier: 1.0,
            smoothWheel: true,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Connect anchor links to Lenis scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                lenis.scrollTo(this.getAttribute('href'));
            });
        });
    }
});
