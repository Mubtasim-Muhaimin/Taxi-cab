(() => {
    "use strict";

    const preloader = document.getElementById("preloader");
    const header = document.getElementById("siteHeader");
    const scrollTopButton = document.getElementById("scrollTop");
    const navLinks = document.querySelectorAll(".navbar .nav-link");
    const collapseElement = document.getElementById("mainNavbar");
    const bookingForms = document.querySelectorAll("[data-booking-form]");
    const modalBookingForm = document.querySelector("[data-modal-booking-form]");
    const contactForm = document.querySelector("[data-contact-form]");

    const hidePreloader = () => {
        if (preloader) {
            preloader.classList.add("is-hidden");
        }
    };

    const setHeaderState = () => {
        const isScrolled = window.scrollY > 18;
        if (header) {
            header.classList.toggle("is-scrolled", isScrolled);
        }
        if (scrollTopButton) {
            scrollTopButton.classList.toggle("is-visible", window.scrollY > 520);
        }
    };

    const setActiveNavigation = () => {
        const fileName = window.location.pathname.split("/").pop() || "index.html";

        navLinks.forEach((link) => {
            const linkFile = link.getAttribute("href") || "";
            const isActive = linkFile === fileName || (fileName === "" && linkFile === "index.html");
            link.classList.toggle("active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const closeMobileMenu = () => {
        if (!collapseElement || !window.bootstrap) return;
        const collapse = window.bootstrap.Collapse.getOrCreateInstance(collapseElement, { toggle: false });
        if (collapseElement.classList.contains("show") && collapse) {
            collapse.hide();
        }
    };

    const initSmoothAnchors = () => {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (event) => {
                const targetId = anchor.getAttribute("href");
                if (!targetId || targetId === "#") return;
                const target = document.querySelector(targetId);
                if (!target) return;

                event.preventDefault();
                closeMobileMenu();
                const top = target.getBoundingClientRect().top + window.scrollY - 76;
                window.scrollTo({ top, behavior: "smooth" });
            });
        });
    };

    const initRevealAnimations = () => {
        const revealElements = document.querySelectorAll(".reveal");

        if (!("IntersectionObserver" in window)) {
            revealElements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
        );

        revealElements.forEach((element) => observer.observe(element));
    };

    const animateCounter = (counter) => {
        const target = Number(counter.dataset.count || 0);
        const duration = 1500;
        const startTime = performance.now();

        const update = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    };

    const initCounters = () => {
        const counters = document.querySelectorAll(".counter");
        if (!counters.length) return;

        if (!("IntersectionObserver" in window)) {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach((counter) => observer.observe(counter));
    };

    const fillBookingModal = (form) => {
        const modalPickup = document.getElementById("modalPickup");
        const modalDrop = document.getElementById("modalDrop");
        const modalTime = document.getElementById("modalTime");
        const modalCar = document.getElementById("modalCar");

        if (modalPickup && form.pickup) modalPickup.value = form.pickup.value;
        if (modalDrop && form.drop) modalDrop.value = form.drop.value;
        if (modalTime && form.rideTime) modalTime.value = form.rideTime.value;
        if (modalCar && form.carType) modalCar.value = form.carType.value;
    };

    const showBookingModal = () => {
        const modal = document.getElementById("bookingModal");
        if (modal && window.bootstrap) {
            window.bootstrap.Modal.getOrCreateInstance(modal).show();
        }
    };

    const initBookingForms = () => {
        bookingForms.forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
                fillBookingModal(form);
                showBookingModal();
            });
        });

        if (modalBookingForm) {
            modalBookingForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const message = modalBookingForm.querySelector("[data-form-message]");

                if (!modalBookingForm.checkValidity()) {
                    modalBookingForm.reportValidity();
                    return;
                }

                if (message) {
                    message.classList.remove("is-error");
                    message.textContent = "Thanks. Your ride request is ready for dispatch.";
                }

                modalBookingForm.reset();
            });
        }
    };

    const initContactForm = () => {
        if (!contactForm) return;

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const message = contactForm.querySelector("[data-contact-message]");

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            if (message) {
                message.classList.remove("is-error");
                message.textContent = "Thanks. We will get back to you shortly.";
            }

            contactForm.reset();
        });
    };

    const initScrollTop = () => {
        if (!scrollTopButton) return;

        scrollTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    };

    window.addEventListener("load", () => {
        window.setTimeout(hidePreloader, 250);
    });

    window.addEventListener("scroll", setHeaderState, { passive: true });

    document.addEventListener("DOMContentLoaded", () => {
        setHeaderState();
        setActiveNavigation();
        initSmoothAnchors();
        initRevealAnimations();
        initCounters();
        initBookingForms();
        initContactForm();
        initScrollTop();

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        window.setTimeout(hidePreloader, 1800);
    });
})();
