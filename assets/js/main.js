const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navItem = document.querySelectorAll(".nav__item"),
  header = document.getElementById("header");

// open and close menu
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav__menu--open");
  changeIcon();
});

// close the menu when the user clicks the nav links
navItem.forEach((item) => {
  item.addEventListener("click", () => {
    if (navMenu.classList.contains("nav__menu--open")) {
      navMenu.classList.remove("nav__menu--open");
    }
    changeIcon();
  });
});

// Change nav toggle icon
function changeIcon() {
  if (navMenu.classList.contains("nav__menu--open")) {
    navToggle.classList.replace("ri-menu-3-line", "ri-close-line");
  } else {
    navToggle.classList.replace("ri-close-line", "ri-menu-3-line");
  }
}

// Testimonial Slide

const testimonialSlide = new Swiper(".testimonial__wrapper", {
  loop: true,
  spaceBetween: 30,
  centeredSlides: true,
  effect: "coverflow",
  grabCursor: true,
  slidesPerView: 1,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    520: {
      slidesPerView: "auto",
    },
  },
});

// header scroll animation
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("header--scroll");
  } else {
    header.classList.remove("header--scroll");
  }
});

// ScrollReveal animations
const sr = ScrollReveal({
  duration: 2000,
  distance: "100px",
  delay: 400,
  reset: false,
});

sr.reveal(".hero__content, .about__content");
sr.reveal(".hero__img", { origin: "top" });

sr.reveal(
  ".hero__info-wrapper, .skills__title, .skills__content, .qualification__name, .qualification__item, .service__card, .project__content, .testimonial__wrapper, .footer__content",
  {
    delay: 500,
    interval: 100,
  }
);

sr.reveal(".qualification__footer-text, .contact__content", {
  origin: "left",
});

sr.reveal(".qualification__footer .btn, .contact__btn", { origin: "right" });




const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenuPanel = document.getElementById('mobile-menu-panel');
const mobileMenuLinks = mobileMenuPanel.querySelectorAll('a');

const setMobileMenuState = (isOpen) => {
    mobileMenuPanel.classList.toggle('hidden', !isOpen);
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
    const icon = mobileMenuButton.querySelector('.material-symbols-outlined');
    icon.textContent = isOpen ? 'close' : 'menu';
};

mobileMenuButton.addEventListener('click', () => {
    const isOpen = !mobileMenuPanel.classList.contains('hidden');
    setMobileMenuState(!isOpen);
});

mobileMenuLinks.forEach((link) => {
    link.addEventListener('click', () => setMobileMenuState(false));
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        setMobileMenuState(false);
    }
});

document.getElementById('current-year').textContent = new Date().getFullYear();

// Generate GUID for filename
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Handle PDF download with application/octet-stream
const downloadCvBtn = document.getElementById('download-cv-btn');
if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('assets/files/full-cv.pdf');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'full-cv.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    });
}