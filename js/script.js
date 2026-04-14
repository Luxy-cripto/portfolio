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

        // Jalankan script setelah load
        if (id === "hero") {
            startTyping();
        }

    } catch (err) {
        console.error("ERROR:", err);
    }
}


// ==============================
// TYPING EFFECT
// ==============================
function startTyping() {
    const text = ["Web Developer", "UI Designer", "Laravel Dev"];
    let i = 0, j = 0;
    let current = "";
    let del = false;

    function type() {
        if (!del && j <= text[i].length) {
            current = text[i].substring(0, j++);
        } else if (del && j >= 0) {
            current = text[i].substring(0, j--);
        }

        const el = document.getElementById("typing");
        if (el) el.innerHTML = current;

        if (j === text[i].length) del = true;
        if (j === 0 && del) {
            del = false;
            i = (i + 1) % text.length;
        }

        setTimeout(type, del ? 50 : 100);
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
// SCROLL ANIMATION (FIX KOSONG)
// ==============================
function scrollAnimation() {
    const sections = document.querySelectorAll(".section");

    function reveal() {
        const trigger = window.innerHeight * 0.85;

        sections.forEach(sec => {
            const top = sec.getBoundingClientRect().top;

            if (top < trigger) {
                sec.classList.add("show");

                // 🔥 Trigger skill animation pas about muncul
                if (sec.classList.contains("about")) {
                    animateSkills();
                }
            }
        });
    }

    window.addEventListener("scroll", reveal);
    reveal(); // langsung jalan saat load
}


// ==============================
// SKILL ANIMATION
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
document.addEventListener("DOMContentLoaded", () => {

    // Load component
    loadComponent("navbar", "components/navbar.html");
    loadComponent("hero", "components/hero.html");
    loadComponent("footer", "components/footer.html");

    // Delay biar DOM siap
    setTimeout(() => {
        handleNavbarScroll();
        scrollAnimation(); // 🔥 WAJIB biar gak kosong
    }, 500);

    // Cursor glow
    cursorGlow();

});

// ==============================
// EMAILJS INIT
// ==============================
(function() {
    emailjs.init("8vBWLuPzO9NkU9xqR");
})();


// ==============================
// CONTACT FORM SEND
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

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}