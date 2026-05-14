/**
 * KIRA CLINIC ONLINE — script.js
 * Animations, interactions & form handling
 */

/* =============================================
   1. SCROLL-TRIGGERED FADE-IN
   Elements with .fade-in-up animate when they
   enter the viewport.
   ============================================= */
(function initScrollReveal() {
  const targets = document.querySelectorAll(".fade-in-up");

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  targets.forEach((el) => {
    // Pause animation initially; play when visible
    el.style.animationPlayState = "paused";
    observer.observe(el);
  });
})();

/* =============================================
   2. NAV LINK HOVER RIPPLE
   Adds a subtle ripple on nav link click.
   ============================================= */
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position:absolute;
      border-radius:50%;
      background:rgba(255,255,255,0.4);
      width:60px;height:60px;
      transform:translate(-50%,-50%) scale(0);
      animation:ripple-anim 0.5s ease-out forwards;
      pointer-events:none;
      left:${e.offsetX}px;
      top:${e.offsetY}px;
    `;
    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Ripple keyframes injected once
(function injectRippleStyle() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: translate(-50%,-50%) scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* =============================================
   3. SERVICE CARD TILT EFFECT (home page)
   Cards respond to mouse position with a
   subtle 3D tilt.
   ============================================= */
document
  .querySelectorAll(".service-card, .service-detail-card")
  .forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.style.transform = `
      translateY(-6px)
      rotateX(${(-y * 10).toFixed(1)}deg)
      rotateY(${(x * 10).toFixed(1)}deg)
    `;
      this.style.boxShadow = `
      ${-x * 14}px ${-y * 14}px 32px rgba(0,0,0,0.16)
    `;
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.boxShadow = "";
      this.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
    });
  });

/* =============================================
   4. CONTACT FORM HANDLING
   Validates & shows success message.
   ============================================= */
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const btn = this.querySelector(".btn-send");
    btn.textContent = "Sending…";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // Simulate network delay
    setTimeout(() => {
      btn.textContent = "Send Message";
      btn.disabled = false;
      btn.style.opacity = "1";

      if (formSuccess) {
        formSuccess.style.display = "block";
        contactForm.reset();

        // Hide success after 5 s
        setTimeout(() => {
          formSuccess.style.display = "none";
        }, 5000);
      }
    }, 1200);
  });

  // Live input border highlight
  contactForm.querySelectorAll(".form-input").forEach((input) => {
    input.addEventListener("input", function () {
      this.style.borderColor = this.value.trim() ? "var(--green)" : "";
    });
  });
}

/* =============================================
   5. HEADER SHRINK ON SCROLL
   Slightly compresses the header after scrolling
   down 60 px for a polished sticky feel.
   ============================================= */
(function initHeaderShrink() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 60) {
        header.style.boxShadow = "0 4px 24px rgba(0,0,0,0.14)";
        header.style.padding = "0";
      } else {
        header.style.boxShadow = "";
        header.style.padding = "";
      }
    },
    { passive: true },
  );
})();

/* =============================================
   6. "BOOK NOW" BUTTON PARTICLE BURST
   Small confetti-like dots burst on click.
   ============================================= */
document
  .querySelectorAll(".btn-book-now, .btn-book, .btn-send")
  .forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const colors = ["#17C3B2", "#2ECC40", "#1A237E", "#fff", "#E8420A"];
      for (let i = 0; i < 10; i++) {
        const dot = document.createElement("span");
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 50;
        dot.style.cssText = `
        position:fixed;
        left:${e.clientX}px;
        top:${e.clientY}px;
        width:7px;height:7px;
        border-radius:50%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events:none;
        z-index:9999;
        transform:translate(-50%,-50%);
        animation:dot-burst 0.6s ease-out forwards;
        --dx:${(Math.cos(angle) * dist).toFixed(0)}px;
        --dy:${(Math.sin(angle) * dist).toFixed(0)}px;
      `;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 650);
      }
    });
  });

// Dot burst keyframes injected once
(function injectDotBurst() {
  const s = document.createElement("style");
  s.textContent = `
    @keyframes dot-burst {
      0%   { opacity:1; transform:translate(-50%,-50%) scale(1); }
      100% { opacity:0;
             transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3); }
    }
  `;
  document.head.appendChild(s);
})();

(function initBookingForm() {
  const bookingForm = document.getElementById("bookingForm");
  const confirmation = document.getElementById("bookingConfirmation");

  if (!bookingForm) return;

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const btn = this.querySelector(".btn-book-appointment");
    const originalText = btn.textContent;
    btn.textContent = "Submitting…";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // Simulate async submission
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = "1";

      // Show confirmation
      if (confirmation) {
        confirmation.style.display = "block";
        bookingForm.reset();

        // Auto-hide after 6 seconds
        setTimeout(() => {
          confirmation.style.display = "none";
        }, 6000);
      }

      // Scroll confirmation into view
      confirmation?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 1400);
  });

  // Live input border highlight (extends script.js behaviour)
  bookingForm.querySelectorAll(".form-input").forEach((input) => {
    input.addEventListener("input", function () {
      this.style.borderColor = this.value.trim() ? "var(--green)" : "";
    });
  });
})();
