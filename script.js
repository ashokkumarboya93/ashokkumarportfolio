// Portfolio - Deploy-Ready JS
// (Lucide Icons, Scroll Reveal, Nav, Toggle Mode, Netflix Carousel, Rain, Sprinkles)
document.addEventListener('DOMContentLoaded', () => {

    /* ====== Lucide Icons ====== */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ====== Scroll Reveal ====== */
    document.querySelectorAll('.section').forEach(s => {
        s.querySelectorAll(
            '.section-header,.edu-card,.train-track,.project-card,.netflix-card,.exp-tree-item,.cert-card,.extra-card,.info-card,.contact-form'
        ).forEach(el => el.classList.add('reveal'));
    });

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('revealed');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
       PROJECTS: Toggle Mode (Normal Grid ↔ Animated Netflix)
       ============================================================ */
    const toggleBtn = document.getElementById('modeToggleBtn');
    const toggleWrap = document.getElementById('modeToggleWrap');
    const projectsGrid = document.getElementById('projectsGrid');
    const projectsNetflix = document.getElementById('projectsNetflix');
    const labelNormal = document.querySelector('.mode-label-normal');
    const labelAnimated = document.querySelector('.mode-label-animated');
    let isAnimated = false;

    function setMode(animated) {
        isAnimated = animated;
        if (animated) {
            if (projectsGrid) projectsGrid.classList.remove('active-mode');
            if (projectsNetflix) projectsNetflix.classList.add('active-mode');
            if (toggleBtn) toggleBtn.classList.add('active');
            if (labelNormal) labelNormal.classList.remove('active-label');
            if (labelAnimated) labelAnimated.classList.add('active-label');
            // Re-create Lucide icons in Netflix track since it was display:none
            if (typeof lucide !== 'undefined') {
                requestAnimationFrame(() => lucide.createIcons());
            }
            // Center on the first card after a brief delay (allow layout to settle)
            setTimeout(() => scrollToNetflixCard(currentNetflixIndex), 120);
        } else {
            if (projectsNetflix) projectsNetflix.classList.remove('active-mode');
            if (projectsGrid) projectsGrid.classList.add('active-mode');
            if (toggleBtn) toggleBtn.classList.remove('active');
            if (labelAnimated) labelAnimated.classList.remove('active-label');
            if (labelNormal) labelNormal.classList.add('active-label');
        }
    }

    // Only listen on toggleBtn — stop propagation so toggleWrap doesn't double-fire
    if (toggleBtn) {
        toggleBtn.addEventListener('click', e => {
            e.stopPropagation();
            setMode(!isAnimated);
        });
    }
    // Wrap click for clicking labels/anywhere on the pill
    if (toggleWrap) {
        toggleWrap.addEventListener('click', e => {
            // If the click came from the button itself, ignore (already handled)
            if (e.target === toggleBtn || toggleBtn?.contains(e.target)) return;
            setMode(!isAnimated);
        });
    }

    /* ============================================================
       Netflix Carousel Logic
       ============================================================ */
    const netflixTrack = document.getElementById('netflixTrack');
    const netflixCards = netflixTrack
        ? Array.from(netflixTrack.querySelectorAll('.netflix-card'))
        : [];
    const netflixPrev = document.getElementById('netflixPrev');
    const netflixNext = document.getElementById('netflixNext');
    const netflixDots = document.querySelectorAll('.netflix-dot');
    let currentNetflixIndex = 0;

    function scrollToNetflixCard(index) {
        if (!netflixTrack || netflixCards.length === 0) return;
        index = Math.max(0, Math.min(index, netflixCards.length - 1));
        currentNetflixIndex = index;

        const card = netflixCards[index];
        // Calculate the scroll position to center this card
        const trackWidth = netflixTrack.clientWidth;
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const scrollTarget = cardLeft - (trackWidth / 2) + (cardWidth / 2);

        netflixTrack.scrollTo({ left: scrollTarget, behavior: 'smooth' });

        // Update visuals immediately — no need to wait for scroll event
        setActiveCard(index);
    }

    function setActiveCard(idx) {
        netflixCards.forEach((card, i) => {
            card.classList.toggle('netflix-active', i === idx);
        });
        netflixDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
        currentNetflixIndex = idx;
    }

    // On scroll, detect which card is nearest to center
    let scrollRaf = null;
    function onTrackScroll() {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
            scrollRaf = null;
            if (!netflixTrack || netflixCards.length === 0) return;
            const trackRect = netflixTrack.getBoundingClientRect();
            const centerX = trackRect.left + trackRect.width / 2;
            let closestIdx = 0;
            let closestDist = Infinity;

            netflixCards.forEach((card, i) => {
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

    if (netflixTrack) {
        netflixTrack.addEventListener('scroll', onTrackScroll, { passive: true });
    }

    // Prev / Next buttons
    if (netflixPrev) {
        netflixPrev.addEventListener('click', () => {
            scrollToNetflixCard(currentNetflixIndex - 1);
        });
    }
    if (netflixNext) {
        netflixNext.addEventListener('click', () => {
            scrollToNetflixCard(currentNetflixIndex + 1);
        });
    }

    // Dot clicks
    netflixDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.dot, 10);
            if (!isNaN(idx)) scrollToNetflixCard(idx);
        });
    });

    // Horizontal mouse-wheel scroll on the Netflix track
    if (netflixTrack) {
        netflixTrack.addEventListener('wheel', e => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                netflixTrack.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }

    // Keyboard arrows when Netflix is visible
    document.addEventListener('keydown', e => {
        if (!isAnimated) return;
        if (e.key === 'ArrowLeft') scrollToNetflixCard(currentNetflixIndex - 1);
        if (e.key === 'ArrowRight') scrollToNetflixCard(currentNetflixIndex + 1);
    });

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

    /* ====== Contact Form Handler ====== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<span>Message Sent! ✓</span>';
                btn.disabled = true;
                btn.style.opacity = '0.7';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    contactForm.reset();
                }, 2500);
            }
        });
    }
});
