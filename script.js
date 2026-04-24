const navbar = document.querySelector(".navbar");
const navMenu = document.getElementById("navMenu");
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById("backToTop");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const faqItems = document.querySelectorAll(".faq-item");

const closeMenu = () => {
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
};

const openMenu = () => {
    navMenu.classList.add("is-open");
    navToggle.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
};

navToggle?.addEventListener("click", () => {
    if (navMenu.classList.contains("is-open")) {
        closeMenu();
    } else {
        openMenu();
    }
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        closeMenu();
    }
});

faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-question");

    trigger?.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        faqItems.forEach((faqItem) => {
            faqItem.classList.remove("active");
            faqItem.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
        });

        if (!isActive) {
            item.classList.add("active");
            trigger.setAttribute("aria-expanded", "true");
        }
    });
});

revealItems.forEach((item) => {
    const delay = item.dataset.delay;
    if (delay) {
        item.style.setProperty("--delay", `${delay}ms`);
    }
});

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
    }
);

revealItems.forEach((item) => revealObserver.observe(item));

const animateCounter = (element) => {
    const target = Number(element.dataset.target);
    const duration = 1700;
    const startTime = performance.now();

    const updateValue = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased).toLocaleString("ka-GE");

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    };

    requestAnimationFrame(updateValue);
};

const counterObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.5
    }
);

counters.forEach((counter) => counterObserver.observe(counter));

const scrollSections = document.querySelectorAll("section[id]");

const updateOnScroll = () => {
    const scrollPosition = window.scrollY;

    navbar.classList.toggle("scrolled", scrollPosition > 18);
    backToTop.classList.toggle("show", scrollPosition > 540);

    scrollSections.forEach((section) => {
        const top = section.offsetTop - 140;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute("id");
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

        if (!navLink) {
            return;
        }

        if (scrollPosition >= top && scrollPosition < bottom) {
            navLinks.forEach((link) => link.classList.remove("active"));
            navLink.classList.add("active");
        }
    });
};

let ticking = false;

const updateParallax = () => {
    const offset = window.scrollY;
    parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallax) || 0.1;
        item.style.transform = `translate3d(0, ${offset * speed}px, 0)`;
    });
};

const onScroll = () => {
    if (ticking) {
        return;
    }

    ticking = true;
    requestAnimationFrame(() => {
        updateOnScroll();
        updateParallax();
        ticking = false;
    });
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateOnScroll);

backToTop?.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

updateOnScroll();
updateParallax();
