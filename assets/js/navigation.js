document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = Array.from(navLinks)
        .map(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                return document.querySelector(href);
            }
            return null;
        })
        .filter((sec, idx, arr) => sec && arr.indexOf(sec) === idx);

    function setActiveLink(targetId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${targetId}`) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    }

    // Instant click highlight without animation delay
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                setActiveLink(targetId);
            }
        });
    });

    // Real-time highlight as user scrolls
    function updateActiveOnScroll() {
        const scrollPosition = window.scrollY + 200; // offset for fixed header
        let currentSectionId = '';

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
                break;
            }
        }

        // Highlight last section if reached bottom of page
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            if (sections.length > 0) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }

        if (currentSectionId) {
            setActiveLink(currentSectionId);
        }
    }

    window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
    updateActiveOnScroll();
});

