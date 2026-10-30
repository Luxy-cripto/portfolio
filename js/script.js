// ==========================================
// 1. LOAD HTML COMPONENT (PARTIALS)
// ==========================================
async function loadComponent(id, file) {
    const target = document.getElementById(id);
    if (!target) return;

    try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Gagal memuat ${file} (${res.status})`);
        target.innerHTML = await res.text();
    } catch (err) {
        console.warn(`[Component Info] ${err.message}. Pastikan diakses via HTTP/HTTPS server.`);
    }
}


// ==========================================
// 2. TYPING EFFECT
// ==========================================
let typingStarted = false;

function startTyping() {
    const el = document.getElementById("typing");
    if (!el || typingStarted) return;
    typingStarted = true;

    const words = [
        "Full-Stack Developer",
        "Software Engineer",
        "Laravel Specialist",
        "Flutter Developer",
        "Python Enthusiast"
    ];
    
    let i = 0;
    let j = 0;
    let deleting = false;

    function type() {
        const word = words[i];
        j += deleting ? -1 : 1;
        el.textContent = word.substring(0, j);

        if (!deleting && j === word.length) {
            deleting = true;
            setTimeout(type, 1500);
            return;
        }

        if (deleting && j === 0) {
            deleting = false;
            i = (i + 1) % words.length;
            setTimeout(type, 400);
            return;
        }

        setTimeout(type, deleting ? 50 : 90);
    }

    type();
}


// ==========================================
// 3. NAVBAR ACTIVE & SCROLL MONITOR (PRESISI)
// ==========================================
function handleNavbarScroll() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#']");

    function update() {
        let current = "";
        const scrollPosition = window.scrollY + 180;

        sections.forEach(sec => {
            const top = sec.getBoundingClientRect().top + window.scrollY;
            const height = sec.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                current = sec.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
        });

        const backToTopBtn = document.getElementById("backToTop");
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
}


// ==========================================
// 4. SMOOTH SCROLL ANCHOR LINKS WITH OFFSET
// ==========================================
function setupSmoothScroll() {
    document.addEventListener("click", (e) => {
        const anchor = e.target.closest("a[href^='#']");
        if (!anchor) return;

        const targetId = anchor.getAttribute("href");
        if (targetId === "#") return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
}


// ==========================================
// 5. SCROLL ANIMATION & INTERSECTION OBSERVER
// ==========================================
function scrollAnimation() {
    const sections = document.querySelectorAll(".section, .hero");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("show");

            if (entry.target.classList.contains("about") || entry.target.id === "about") {
                animateSkills();
            }

            observer.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

    sections.forEach(sec => observer.observe(sec));
}


// ==========================================
// 6. SKILL BAR ANIMATION
// ==========================================
function animateSkills() {
    document.querySelectorAll(".bar span").forEach(skill => {
        const targetWidth = skill.dataset.width || skill.style.width;
        if (targetWidth) {
            skill.style.width = "0%";
            requestAnimationFrame(() => {
                setTimeout(() => {
                    skill.style.width = targetWidth;
                }, 150);
            });
        }
    });
}


// ==========================================
// 7. CURSOR GLOW EFFECT (DESKTOP ONLY)
// ==========================================
function cursorGlow() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let glow = document.getElementById("cursorGlow");
    if (!glow) {
        glow = document.createElement("div");
        glow.id = "cursorGlow";

        Object.assign(glow.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#00f5c4",
            pointerEvents: "none",
            filter: "blur(18px)",
            opacity: "0.6",
            zIndex: "9999",
            willChange: "transform",
            transition: "transform 0.08s ease-out"
        });

        document.body.appendChild(glow);
    }

    document.addEventListener("mousemove", e => {
        glow.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
    });
}


// ==========================================
// 8. BACK TO TOP BUTTON GENERATOR
// ==========================================
function createBackToTopButton() {
    if (document.getElementById("backToTop")) return;

    const btn = document.createElement("button");
    btn.id = "backToTop";
    btn.innerHTML = `<i class="fas fa-arrow-up"></i>`;
    btn.setAttribute("aria-label", "Kembali ke atas");

    Object.assign(btn.style, {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        background: "linear-gradient(45deg, #00f5c4, #7b2ff7)",
        color: "#020617",
        border: "none",
        cursor: "pointer",
        fontSize: "18px",
        boxShadow: "0 0 15px rgba(0, 245, 196, 0.4)",
        opacity: "0",
        visibility: "hidden",
        transition: "all 0.3s ease",
        zIndex: "999"
    });

    const styleTag = document.createElement("style");
    styleTag.textContent = `
        #backToTop.show {
            opacity: 1 !important;
            visibility: visible !important;
        }
        #backToTop:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: 0 0 25px rgba(0, 245, 196, 0.7);
        }
    `;
    document.head.appendChild(styleTag);
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


// ==========================================
// 9. TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 3500);
}


// ==========================================
// 10. EMAILJS INITIALIZATION
// ==========================================
if (typeof emailjs !== "undefined") {
    emailjs.init("8vBWLuPzO9NkU9xqR");
}


// ==========================================
// 11. CONTACT FORM HANDLER
// ==========================================
document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!form.classList.contains("contact-form") && form.id !== "contactForm") return;

    e.preventDefault();

    if (typeof emailjs === "undefined") {
        showToast("Layanan email belum terhubung ❌");
        return;
    }

    const nameInput = form.querySelector("input[name='name'], input[type='text']");
    const emailInput = form.querySelector("input[name='email'], input[type='email']");
    const messageInput = form.querySelector("textarea[name='message'], textarea");
    const btn = form.querySelector("button[type='submit']");

    if (!nameInput?.value.trim() || !emailInput?.value.trim() || !messageInput?.value.trim()) {
        showToast("Lengkapi semua kolom pesan! ⚠️");
        return;
    }

    const originalBtnText = btn.innerHTML;
    btn.textContent = "Mengirim...";
    btn.disabled = true;

    try {
        await emailjs.send("service_86d0oyp", "template_abobcm2", {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        });

        showToast("Pesan berhasil dikirim ke Wandi! 🚀");
        form.reset();
    } catch (err) {
        console.error("EmailJS Error:", err);
        showToast("Gagal mengirim pesan, coba lagi ❌");
    } finally {
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
    }
});


// ==========================================
// 12. INITIALIZE ALL ON DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        loadComponent("navbar", "components/navbar.html"),
        loadComponent("hero", "components/hero.html"),
        loadComponent("footer", "components/footer.html")
    ]);

    handleNavbarScroll();
    setupSmoothScroll();
    scrollAnimation();
    startTyping();
    cursorGlow();
    createBackToTopButton();
});
