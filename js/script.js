// ==============================
// STATE CONTROL (ANTI BUG)
// ==============================
let typingStarted = false;

// ==============================
// LOAD HTML COMPONENT (PARTIAL)
// ==============================
async function loadComponent(id, file) {
    try {
        const res = await fetch(file);

        if (!res.ok) {
            throw new Error(`Gagal load ${file}`);
        }

        const html = await res.text();
        document.getElementById(id).innerHTML = html;

        console.log(`${id} loaded`);

    } catch (err) {
        console.error("ERROR:", err);
    }
}


// ==============================
// TYPING EFFECT (FIXED)
// ==============================
function startTyping() {
    if (typingStarted) return; // ❌ cegah double run
    typingStarted = true;

    const text = ["Web Developer", "UI Designer", "Laravel Dev"];
    let i = 0;
    let j = 0;
    let del = false;

    function type() {
        const el = document.getElementById("typing");
        if (!el) return; // ❌ stop kalau elemen hilang

        let current = text[i].substring(0, j);
        el.innerHTML = current;

        if (!del) {
            j++;
        } else {
            j--;
        }

        if (j === text[i].length) {
            del = true;
            setTimeout(type, 800);
            return;
        }

        if (j === 0 && del) {
            del = false;
            i = (i + 1) % text.length;
        }

        setTimeout(type, del ? 60 : 100);
    }

    type();
}


// ==============================
// NAVBAR ACTIVE SCROLL
// ==============================
function handleNavbarScroll() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav a");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 120;

            if (window.scrollY >= sectionTop) {
                current = sec.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");

            if (link.getAttribute("href")?.includes(current)) {
                link.classList.add("active");
            }
        });
    });
}


// ==============================
// SCROLL ANIMATION
// ==============================
function scrollAnimation() {
    const sections = document.querySelectorAll(".section");

    function reveal() {
        const trigger = window.innerHeight * 0.85;

        sections.forEach(sec => {
            const top = sec.getBoundingClientRect().top;

            if (top < trigger) {
                sec.classList.add("show");

                if (sec.classList.contains("about")) {
                    animateSkills();
                }
            }
        });
    }

    window.addEventListener("scroll", reveal);
    reveal();
}


// ==============================
// SKILL BAR ANIMATION
// ==============================
function animateSkills() {
    const skills = document.querySelectorAll(".bar span");

    skills.forEach(skill => {
        const width = skill.getAttribute("data-width");
        if (width) {
            skill.style.width = width;
        }
    });
}


// ==============================
// CURSOR GLOW EFFECT
// ==============================
function cursorGlow() {
    const glow = document.createElement("div");

    glow.style.position = "fixed";
    glow.style.width = "20px";
    glow.style.height = "20px";
    glow.style.borderRadius = "50%";
    glow.style.background = "cyan";
    glow.style.pointerEvents = "none";
    glow.style.filter = "blur(15px)";
    glow.style.zIndex = "9999";

    document.body.appendChild(glow);

    document.addEventListener("mousemove", e => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    });
}


// ==============================
// INIT SEMUA
// ==============================
document.addEventListener("DOMContentLoaded", async () => {

    // Load components
    await loadComponent("navbar", "components/navbar.html");
    await loadComponent("hero", "components/hero.html");
    await loadComponent("footer", "components/footer.html");

    // Init after DOM ready
    setTimeout(() => {
        handleNavbarScroll();
        scrollAnimation();
        startTyping(); // ✅ hanya sekali di sini
    }, 500);

    cursorGlow();
});


// ==============================
// EMAILJS INIT
// ==============================
(function() {
    emailjs.init("8vBWLuPzO9NkU9xqR");
})();


// ==============================
// CONTACT FORM
// ==============================
document.addEventListener("submit", function(e) {
    if (e.target.classList.contains("contact-form")) {
        e.preventDefault();

        const btn = e.target.querySelector("button");
        btn.innerText = "Mengirim...";
        btn.disabled = true;

        const name = e.target.querySelector("input[type='text']").value;
        const email = e.target.querySelector("input[type='email']").value;
        const message = e.target.querySelector("textarea").value;

        emailjs.send("service_86d0oyp", "template_abobcm2", {
            name,
            email,
            message
        })
        .then(() => {
            showToast("Pesan berhasil dikirim 🚀");
            e.target.reset();
        })
        .catch(() => {
            showToast("Gagal mengirim ❌");
        })
        .finally(() => {
            btn.innerText = "Kirim Pesan";
            btn.disabled = false;
        });
    }
});

console.log("JS jalan");

// ==============================
// TOAST
// ==============================
function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
