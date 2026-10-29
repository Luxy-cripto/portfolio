// ==============================
// LOAD HTML COMPONENT (PARTIAL)
// ==============================
async function loadComponent(id, file) {
    const target = document.getElementById(id);
    if (!target) {
        console.warn(`Elemen #${id} tidak ditemukan`);
        return;
    }

    try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Gagal load ${file} (${res.status})`);
        target.innerHTML = await res.text();
    } catch (err) {
        console.error("ERROR:", err);
    }
}


// ==============================
// TYPING EFFECT
// ==============================
let typingStarted = false;

function startTyping() {
    const el = document.getElementById("typing");
    if (!el || typingStarted) return;
    typingStarted = true;

    const words = ["Web Developer", "UI Designer", "Laravel Dev"];
    let i = 0;
    let j = 0;
    let deleting = false;

    function type() {
        const word = words[i];

        j += deleting ? -1 : 1;
        el.textContent = word.substring(0, j);

        // selesai mengetik -> jeda, lalu mulai menghapus
        if (!deleting && j === word.length) {
            deleting = true;
            setTimeout(type, 1200);
            return;
        }

        // selesai menghapus -> pindah ke kata berikutnya
        if (deleting && j === 0) {
            deleting = false;
            i = (i + 1) % words.length;
            setTimeout(type, 400);
            return;
        }

        setTimeout(type, deleting ? 60 : 100);
    }

    type();
}


// ==============================
// NAVBAR ACTIVE SCROLL
// ==============================
function handleNavbarScroll() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#']");

    function update() {
        let current = "";

        sections.forEach(sec => {
            const top = sec.getBoundingClientRect().top + window.scrollY - 120;
            if (window.scrollY >= top) current = sec.id;
        });

        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
        });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
}


// ==============================
// SCROLL ANIMATION
// ==============================
function scrollAnimation() {
    const sections = document.querySelectorAll(".section");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("show");

            if (entry.target.classList.contains("about")) {
                animateSkills();
            }

            observer.unobserve(entry.target); // cukup sekali
        });
    }, { rootMargin: "0px 0px -15% 0px", threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
}


// ==============================
// SKILL BAR ANIMATION
// ==============================
function animateSkills() {
    document.querySelectorAll(".bar span").forEach(skill => {
        const width = skill.dataset.width;
        if (width) skill.style.width = width;
    });
}


// ==============================
// CURSOR GLOW EFFECT
// ==============================
function cursorGlow() {
    // tidak perlu di layar sentuh
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const glow = document.createElement("div");

    Object.assign(glow.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "cyan",
        pointerEvents: "none",
        filter: "blur(15px)",
        zIndex: "9999",
        willChange: "transform"
    });

    document.body.appendChild(glow);

    document.addEventListener("mousemove", e => {
        glow.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    });
}


// ==============================
// TOAST
// ==============================
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
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}


// ==============================
// EMAILJS INIT
// ==============================
if (typeof emailjs !== "undefined") {
    emailjs.init("8vBWLuPzO9NkU9xqR");
} else {
    console.error("SDK EmailJS belum dimuat. Cek tag <script> di index.html");
}


// ==============================
// CONTACT FORM
// ==============================
document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!form.classList.contains("contact-form")) return;

    e.preventDefault();

    if (typeof emailjs === "undefined") {
        showToast("Layanan email belum siap ❌");
        return;
    }

    const btn = form.querySelector("button[type='submit']");
    btn.textContent = "Mengirim...";
    btn.disabled = true;

    try {
        await emailjs.send("service_86d0oyp", "template_abobcm2", {
            name: form.querySelector("input[type='text']").value.trim(),
            email: form.querySelector("input[type='email']").value.trim(),
            message: form.querySelector("textarea").value.trim()
        });

        showToast("Pesan berhasil dikirim 🚀");
        form.reset();
    } catch (err) {
        console.error("EmailJS error:", err);
        showToast("Gagal mengirim ❌");
    } finally {
        btn.textContent = "Kirim Pesan";
        btn.disabled = false;
    }
});


// ==============================
// INIT SEMUA
// ==============================
document.addEventListener("DOMContentLoaded", async () => {
    // muat komponen secara paralel, lalu init setelah semuanya siap
    await Promise.all([
        loadComponent("navbar", "components/navbar.html"),
        loadComponent("hero", "components/hero.html"),
        loadComponent("footer", "components/footer.html")
    ]);

    handleNavbarScroll();
    scrollAnimation();
    startTyping();
    cursorGlow();
});
