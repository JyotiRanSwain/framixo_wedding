/* ===============================================
   FRAMIXO WEDDING – MAIN JAVASCRIPT
   =============================================== */

(function () {
  "use strict";

  /* ---- CUSTOM CAMERA CURSOR ---- */
  const cursor = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursorDot");
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top  = mouseY + "px";
  });

  // Smooth cursor follow
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + "px";
    cursor.style.top  = cursorY + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll(
    "a, button, .gallery-item, .tab, .dot, .video-thumb-wrap, .album-card, .service-card, input, select, textarea"
  );
  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
  });

  // Hide cursor when out of window
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    cursorDot.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    cursorDot.style.opacity = "1";
  });

  /* ---- HEADER SCROLL ---- */
  const header = document.getElementById("header");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById("hamburger");
  const mainNav = document.getElementById("mainNav");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mainNav.classList.toggle("open");
  });

  // Close nav on link click (mobile)
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mainNav.classList.remove("open");
    });
  });

  /* ---- GALLERY FILTER ---- */
  const tabs = document.querySelectorAll(".tab");
  const items = document.querySelectorAll(".gallery-item");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;
      items.forEach((item) => {
        if (filter === "all" || item.dataset.cat === filter) {
          item.classList.remove("hidden");
          item.style.animation = "animUp 0.5s ease forwards";
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  /* ---- YOUTUBE VIDEO MODAL ---- */
  const videoThumb = document.getElementById("videoThumb");
  const videoModal = document.getElementById("videoModal");
  const modalClose = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const youtubeFrame = document.getElementById("youtubeFrame");

  const YT_EMBED = "https://www.youtube.com/embed/FD7s-3fAWyc?autoplay=1&rel=0";

  function openModal() {
    youtubeFrame.src = YT_EMBED;
    videoModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    videoModal.classList.remove("open");
    youtubeFrame.src = "";
    document.body.style.overflow = "";
  }

  videoThumb.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---- TESTIMONIAL SLIDER ---- */
  const track = document.getElementById("testimonialTrack");
  const dots  = document.querySelectorAll(".dot");
  let current = 0;
  let autoSlide;

  function goTo(index) {
    current = (index + dots.length) % dots.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d) => d.classList.remove("active"));
    dots[current].classList.add("active");
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(autoSlide);
      goTo(i);
      startAuto();
    });
  });

  function startAuto() {
    autoSlide = setInterval(() => goTo(current + 1), 4500);
  }
  startAuto();

  // Touch/swipe support for testimonials
  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      clearInterval(autoSlide);
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll(
    ".service-card, .gallery-item, .album-card, .about-grid, .stat, .contact-item, .testimonial-card, .about-img-wrap"
  );

  revealEls.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));

  /* ---- BOOKING FORM SUBMIT ---- */
  const form = document.getElementById("bookingForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name    = data.get("name");
    const mobile  = data.get("mobile");
    const email   = data.get("email");
    const service = data.get("service");
    const date    = data.get("date");
    const venue   = data.get("venue");
    const message = data.get("message");

    // Build WhatsApp message
    const text = encodeURIComponent(
      `*New Booking Enquiry – Framixo Wedding*\n\n` +
      `👤 Name: ${name}\n` +
      `📱 Mobile: ${mobile}\n` +
      `📧 Email: ${email}\n` +
      `📸 Service: ${service}\n` +
      `📅 Event Date: ${date}\n` +
      `📍 Venue/City: ${venue || "Not specified"}\n` +
      `💬 Message: ${message || "No message"}`
    );

    const waUrl = `https://wa.me/918917388020?text=${text}`;

    // Show success feedback
    showToast("✅ Redirecting to WhatsApp to send your enquiry!");
    setTimeout(() => window.open(waUrl, "_blank"), 1000);
    form.reset();
  });

  /* ---- TOAST NOTIFICATION ---- */
  function showToast(msg) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = msg;
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--gold);
      color: var(--dark);
      padding: 14px 28px;
      border-radius: 40px;
      font-family: var(--font-body);
      font-size: 0.88rem;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(201,168,76,0.35);
      opacity: 0;
      transition: all 0.4s ease;
      white-space: nowrap;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ---- ACTIVE NAV HIGHLIGHT ON SCROLL ---- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.style.color = link.getAttribute("href") === `#${current}`
        ? "var(--gold)"
        : "";
    });
  });

  /* ---- IMAGE LIGHTBOX (gallery) ---- */
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (!img) return;

      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 8000;
        background: rgba(0,0,0,0.92);
        display: flex; align-items: center; justify-content: center;
        cursor: zoom-out;
        backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease;
      `;

      const imgEl = document.createElement("img");
      imgEl.src = img.src;
      imgEl.alt = img.alt;
      imgEl.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 4px;
        box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      `;

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.style.cssText = `
        position: absolute; top: 24px; right: 28px;
        color: white; font-size: 1.4rem; background: none; border: none;
        cursor: pointer; z-index: 1;
      `;

      overlay.appendChild(imgEl);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";

      const close = () => {
        overlay.remove();
        document.body.style.overflow = "";
      };
      overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
      closeBtn.addEventListener("click", close);
      document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
      });
    });
  });

  // Add fadeIn keyframe via JS if not in CSS
  const style = document.createElement("style");
  style.textContent = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
  document.head.appendChild(style);

})();
