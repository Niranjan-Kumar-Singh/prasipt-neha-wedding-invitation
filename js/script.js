/* ── Particle Physics Class for Gold Sparkles ────────── */
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reset();
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = -20;
    this.size = Math.random() * 2.2 + 0.6;
    this.speedY = Math.random() * 0.7 + 0.2;
    this.speedX = Math.random() * 0.4 - 0.2;
    this.alpha = Math.random() * 0.5 + 0.3;
    this.decay = Math.random() * 0.005 + 0.002;
    this.color = this.getRandomGold();
    this.angle = Math.random() * Math.PI * 2;
    this.spinSpeed = Math.random() * 0.02 - 0.01;
  }

  getRandomGold() {
    const goldTints = [
      'rgba(212, 175, 55, ',   // Gold
      'rgba(252, 246, 186, ',  // Light gold
      'rgba(186, 148, 62, ',   // Dim gold
      'rgba(255, 251, 183, '   // Sparkle gold
    ];
    return goldTints[Math.floor(Math.random() * goldTints.length)];
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.angle) * 0.15;
    this.angle += this.spinSpeed;
    this.alpha -= this.decay;

    if (
      this.alpha <= 0 ||
      this.y > this.canvas.height + 10 ||
      this.x < -10 ||
      this.x > this.canvas.width + 10
    ) {
      this.reset();
    }
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.alpha;
    this.ctx.shadowBlur = Math.random() > 0.82 ? 6 : 2;
    this.ctx.shadowColor = '#FCF6BA';
    this.ctx.fillStyle = this.color + this.alpha + ')';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
}

/* ── DOM Init & Interactive Setup ──────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // Lock body scroll on initial load
  document.body.classList.add('lock-scroll');

  // Elements
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── B. Desktop Cursor Glow Effect ── */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && !isTouchDevice() && !prefersReducedMotion) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    const ease = 0.085;
    let active = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!active) {
        active = true;
        cursorGlow.classList.add('active');
        requestAnimationFrame(updateGlowPosition);
      }
    }, { passive: true });

    function updateGlowPosition() {
      const dx = mouseX - glowX;
      const dy = mouseY - glowY;
      glowX += dx * ease;
      glowY += dy * ease;

      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

      if (active) {
        requestAnimationFrame(updateGlowPosition);
      }
    }

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });
  }

  /* ── C. Ambient Dust Particles & Footer Celebration Canvas ── */
  const ambientCanvas = document.getElementById('ambient-canvas');
  let footerCelebrationActive = false;

  if (ambientCanvas && !prefersReducedMotion) {
    const actx = ambientCanvas.getContext('2d');
    let particles = [];
    let petals = [];

    function resizeAmbientCanvas() {
      ambientCanvas.width = window.innerWidth;
      ambientCanvas.height = window.innerHeight;
    }
    resizeAmbientCanvas();
    window.addEventListener('resize', resizeAmbientCanvas, { passive: true });

    // Dust particle class (swirling slowly upwards)
    class AmbientParticle {
      constructor() {
        this.reset();
        this.y = Math.random() * ambientCanvas.height;
      }
      reset() {
        this.x = Math.random() * ambientCanvas.width;
        this.y = ambientCanvas.height + 10;
        this.size = Math.random() * 1.6 + 0.4;
        this.speedY = -(Math.random() * 0.35 + 0.1);
        this.speedX = Math.random() * 0.2 - 0.1;
        this.alpha = Math.random() * 0.15 + 0.04;
        this.waveSpeed = Math.random() * 0.005 + 0.002;
        this.waveOffset = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * this.waveSpeed + this.waveOffset) * 0.15;
        if (this.y < -10 || this.x < -10 || this.x > ambientCanvas.width + 10) {
          this.reset();
        }
      }
      draw() {
        actx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
        actx.beginPath();
        actx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        actx.fill();
      }
    }

    // Petal particle class (falling downwards when footer visible)
    class PetalParticle {
      constructor() {
        this.reset();
        this.y = Math.random() * -100; // stagger starting heights
      }
      reset() {
        this.x = Math.random() * ambientCanvas.width;
        this.y = -20;
        this.size = Math.random() * 4 + 2;
        this.speedY = Math.random() * 0.8 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.2 + 0.08;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.015 - 0.007;
        this.swingSpeed = Math.random() * 0.008 + 0.003;
        this.swingOffset = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * this.swingSpeed + this.swingOffset) * 0.4;
        this.rotation += this.rotationSpeed;
        if (this.y > ambientCanvas.height + 10 || this.x < -10 || this.x > ambientCanvas.width + 10) {
          this.reset();
        }
      }
      draw() {
        actx.save();
        actx.translate(this.x, this.y);
        actx.rotate(this.rotation);
        actx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
        actx.beginPath();
        actx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        actx.fill();
        actx.restore();
      }
    }

    // Populate ambient particles
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new AmbientParticle());
    }

    // Populate footer petals
    const petalCount = 18;
    for (let i = 0; i < petalCount; i++) {
      petals.push(new PetalParticle());
    }

    let isTabVisible = true;
    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
    });

    function animateAmbient() {
      if (!isTabVisible) {
        requestAnimationFrame(animateAmbient);
        return;
      }
      actx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

      // Render floating golden dust
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Render falling petals celebration on footer
      if (footerCelebrationActive) {
        petals.forEach(p => {
          p.update();
          p.draw();
        });
      }

      requestAnimationFrame(animateAmbient);
    }
    animateAmbient();

    // Trigger celebration when footer is entered
    const footerElement = document.getElementById('footer');
    if (footerElement) {
      const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          footerCelebrationActive = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      footerObserver.observe(footerElement);
    }
  }

  // Elements
  const progressBar = document.getElementById('progress-bar');
  const progressIndicator = document.getElementById('progress-indicator');
  const preloader = document.getElementById('preloader');
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const waxSeal = document.getElementById('wax-seal');
  const enterBtn = document.getElementById('enter-btn');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const mainContent = document.getElementById('main-content');

  /* ── 1. Cinematic Preloader Progress ── */
  let progressVal = 0;
  const progressInterval = setInterval(() => {
    if (progressVal >= 100) {
      clearInterval(progressInterval);
      return;
    }
    progressVal += 2;
    if (progressBar) progressBar.style.width = `${progressVal}%`;
    if (progressIndicator) progressIndicator.style.left = `${progressVal}%`;
  }, 38);

  // Transition from preloader to envelope with cinematic sequence
  setTimeout(() => {
    const statusText = document.getElementById('preloader-status-text');
    if (statusText) statusText.textContent = 'Loading Complete';
    if (preloader) preloader.classList.add('completion-glow');
    
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.classList.add('hidden');
          if (envelopeOverlay) {
            envelopeOverlay.classList.remove('hidden');
          }
        }, 1200); // Slower, more luxurious fade
      }
    }, 2800); // Pause on 'Loading Complete' before fading (increased from 1200 to 2800ms)
  }, 3500);

  /* ── 2. Envelope Controls ── */
  if (waxSeal) {
    waxSeal.addEventListener('click', () => {
      const sealSound = document.getElementById('seal-sound');
      if (sealSound) {
        sealSound.volume = 0.4;
        sealSound.play().catch(e => console.log('Seal sound blocked'));
      }
      
      // Add particle burst effect
      if (waxSeal) waxSeal.classList.add('wax-break');
      
      setTimeout(() => {
        if (envelopeOverlay) envelopeOverlay.classList.add('open');
      }, 400); // Slight delay for the wax break effect


      // Attempt playing music
      if (bgMusic) {
        bgMusic.play().then(() => {
          if (musicToggle) {
            musicToggle.classList.add('playing');
            const textNode = musicToggle.querySelector('.music-player-text');
            if (textNode) textNode.textContent = '♫ Music Playing';
          }
        }).catch(err => {
          console.warn("Autoplay blocked by browser. Music will play upon user entry.");
        });
      }

      // Show enter button after card slide-up completes
      setTimeout(() => {
        if (enterBtn) enterBtn.classList.remove('hidden');
      }, 1400);
    });
  }

  function triggerEnter(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (envelopeOverlay && envelopeOverlay.classList.contains('fade-out')) return;

    if (envelopeOverlay) envelopeOverlay.classList.add('fade-out');

    if (bgMusic && bgMusic.paused) {
      bgMusic.play().then(() => {
        if (musicToggle) {
          musicToggle.classList.add('playing');
          const textNode = musicToggle.querySelector('.music-player-text');
          if (textNode) textNode.textContent = '♫ Music Playing';
        }
      }).catch(err => console.warn("Autoplay blocked"));
    }

    setTimeout(() => {
      if (envelopeOverlay) envelopeOverlay.classList.add('hidden');
      if (mainContent) mainContent.classList.remove('hidden');
      if (musicToggle) musicToggle.classList.remove('hidden');

      // Unlock scroll
      document.body.classList.remove('lock-scroll');

      // Start hero sparkles
      initCanvasSparkles();

      // Initialize scroll reveal observer
      initObserverReveals();
    }, 800);
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', triggerEnter);
  }

  window.addEventListener('wheel', (e) => {
    if (envelopeOverlay && !envelopeOverlay.classList.contains('hidden') && envelopeOverlay.classList.contains('open') && e.deltaY > 0) {
      triggerEnter(e);
    }
  });

  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  });
  window.addEventListener('touchmove', (e) => {
    if (envelopeOverlay && !envelopeOverlay.classList.contains('hidden') && envelopeOverlay.classList.contains('open')) {
      let touchEndY = e.touches[0].clientY;
      if (touchStartY - touchEndY > 30) {
        triggerEnter(e);
      }
    }
  });

  /* ── 3. Floating Music Toggle ── */
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (bgMusic) {
        const textNode = musicToggle.querySelector('.music-player-text');
        if (bgMusic.paused) {
          bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            if (textNode) textNode.textContent = '♫ Music Playing';
          }).catch(err => console.error(err));
        } else {
          bgMusic.pause();
          musicToggle.classList.remove('playing');
          if (textNode) textNode.textContent = '♫ Music Paused';
        }
      }
    });
  }

  /* ── 4. Ticking Countdown Timer ── */
  const daysVal = document.getElementById('days');
  const hoursVal = document.getElementById('hours');
  const minutesVal = document.getElementById('minutes');
  const secondsVal = document.getElementById('seconds');
  const timerGroup = document.getElementById('timer-display-group');

  const weddingDate = new Date("2026-06-21T00:00:00+05:30"); // IST timezone offset

  let lastDays = '';
  let lastHours = '';
  let lastMinutes = '';
  let lastSeconds = '';

  function updateTimerValue(element, newValue) {
    if (!element) return;
    if (element.textContent === newValue) return;

    element.classList.add('digit-changing');
    setTimeout(() => {
      element.textContent = newValue;
      element.classList.remove('digit-changing');
      element.classList.add('digit-changed');

      // Force repaint
      element.offsetHeight;

      requestAnimationFrame(() => {
        element.classList.remove('digit-changed');
      });
    }, 150);
  }

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
      if (timerGroup) {
        timerGroup.innerHTML = `
          <p class="font-great-vibes text-gold-metal text-center w-full" style="font-size: clamp(2rem, 8vw, 3.6rem); text-shadow: 0 2px 15px rgba(252,246,186,0.4);">
            The Celebration Has Begun!
          </p>`;
      }
      return;
    }

    const d = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
    const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

    // Smooth digit updates with transition
    updateTimerValue(daysVal, d);
    updateTimerValue(hoursVal, h);
    updateTimerValue(minutesVal, m);
    updateTimerValue(secondsVal, s);

    // Pulse time cards if minutes changed
    if (lastMinutes !== '' && m !== lastMinutes) {
      document.querySelectorAll('.glass-time-card').forEach(card => {
        card.classList.add('pulse-glow');
        setTimeout(() => {
          card.classList.remove('pulse-glow');
        }, 1000);
      });
    }

    lastDays = d;
    lastHours = h;
    lastMinutes = m;
    lastSeconds = s;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ── 5. Add to Calendar ── */
  document.querySelectorAll('.add-calendar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const eventType = btn.getAttribute('data-event');
      let titleText = '';
      let dates = '';
      let details = '';
      let venue = '';
      let city = '';

      if (eventType === 'wedding') {
        titleText = "Wedding Ceremony: Prasipt & Neha";
        dates = "20260621T180000/20260622T020000";
        details = "You are cordially invited to celebrate the Wedding Ceremony of Prasipt Kumar Singh & Neha Kumari.";
        venue = "Rasulpur Turki, Asoi, Bhagwanpur, Vaishali, Bihar";
        city = "Vaishali, Bihar";
      } else {
        titleText = "Wedding Reception: Prasipt & Neha";
        dates = "20260626T190000/20260627T020000";
        details = "You are cordially invited to celebrate the Wedding Reception of Prasipt Kumar Singh & Neha Kumari.";
        venue = "Own Residence, Shantipara, Ward No. 42, Salugara, Siliguri, Jalpaiguri, West Bengal";
        city = "Siliguri, West Bengal";
      }

      const loc = encodeURIComponent(`${venue}, ${city}`);
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titleText)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${loc}&sf=true&output=xml`;
      window.open(calendarUrl, '_blank');
    });
  });

  /* ── 6. Event Details Web Share / Clipboard Copy ── */
  document.querySelectorAll('.share-event-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const eventType = btn.getAttribute('data-event');
      let title = '';
      let dateText = '';
      let venue = '';
      let city = '';

      if (eventType === 'wedding') {
        title = "Wedding Ceremony — Prasipt & Neha";
        dateText = "21 June 2026";
        venue = "Rasulpur Turki, Asoi, Bhagwanpur, Vaishali, Bihar";
        city = "Vaishali, Bihar";
      } else {
        title = "Reception — Prasipt & Neha";
        dateText = "26 June 2026";
        venue = "Own Residence, Shantipara, Ward No. 42, Salugara, Siliguri, Jalpaiguri, West Bengal";
        city = "Siliguri, West Bengal";
      }

      const descText = `Join us for the ${eventType === 'wedding' ? "Wedding Ceremony" : "Reception"} of Prasipt & Neha on ${dateText} at ${venue}, ${city}.`;

      const shareData = {
        title: title,
        text: descText,
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.warn("Native share failed:", err);
        }
      } else {
        // Fallback to copying
        try {
          await navigator.clipboard.writeText(`${title}\nDate: ${dateText}\nVenue: ${venue}, ${city}\nLink: ${window.location.href}`);
          const originalText = btn.innerHTML;
          btn.textContent = '✓ Copied Details';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2500);
        } catch (err) {
          console.warn("Clipboard copy failed:", err);
        }
      }
    });
  });

  /* ── 7. Map Address Clipboard Copying ── */
  document.querySelectorAll('.copy-address-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const address = btn.getAttribute('data-address');
      try {
        await navigator.clipboard.writeText(address);
        const originalText = btn.innerHTML;
        btn.textContent = '✓ Address Copied!';
        btn.style.color = '#D4AF37';
        btn.style.borderColor = '#D4AF37';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 2000);
      } catch (err) {
        console.warn("Address copy failed:", err);
      }
    });
  });

  /* ── 8. Image Gallery Lightbox Modal ── */
  const galleryImages = [
    "assets/images/gallery-mehendi.png",
    "assets/images/gallery-mandap.png",
    "assets/images/gallery-diya.png",
    "assets/images/gallery-mandala.png"
  ];
  let currentGalleryIndex = 0;

  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index'), 10);
      openLightbox(idx);
    });
  });

  function openLightbox(idx) {
    currentGalleryIndex = idx;
    if (lightboxImg) lightboxImg.src = galleryImages[currentGalleryIndex];
    if (lightbox) lightbox.classList.remove('hidden');
    document.body.classList.add('lock-scroll');
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightbox) lightbox.classList.add('hidden');
      document.body.classList.remove('lock-scroll');
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
      if (lightboxImg) lightboxImg.src = galleryImages[currentGalleryIndex];
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
      if (lightboxImg) lightboxImg.src = galleryImages[currentGalleryIndex];
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        document.body.classList.remove('lock-scroll');
      }
    });
  }

  /* ── 9. Client RSVP Form Validator ── */
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear existing logs
      document.querySelectorAll('.error-log').forEach(err => err.textContent = '');

      let isValid = true;

      const nameInput = document.getElementById('rsvp-name');
      const emailInput = document.getElementById('rsvp-email');
      const phoneInput = document.getElementById('rsvp-phone');
      const guestsSelect = document.getElementById('rsvp-guests');

      if (!nameInput.value.trim()) {
        const nameError = document.getElementById('name-error');
        if (nameError) nameError.textContent = 'Name is required.';
        isValid = false;
      }

      if (emailInput.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
          const emailError = document.getElementById('email-error');
          if (emailError) emailError.textContent = 'Please enter a valid email.';
          isValid = false;
        }
      }

      if (!phoneInput.value.trim()) {
        const phoneError = document.getElementById('phone-error');
        if (phoneError) phoneError.textContent = 'Phone number is required.';
        isValid = false;
      } else {
        const cleanPhone = phoneInput.value.replace(/\s+/g, '');
        const phonePattern = /^[+]?[0-9\s-]{10,15}$/;
        if (!phonePattern.test(cleanPhone)) {
          const phoneError = document.getElementById('phone-error');
          if (phoneError) phoneError.textContent = 'Enter a valid phone (at least 10 digits).';
          isValid = false;
        }
      }

      if (!guestsSelect.value) {
        const guestsError = document.getElementById('guests-error');
        if (guestsError) guestsError.textContent = 'Please select guests count.';
        isValid = false;
      }

      if (isValid) {
        const submitBtn = document.getElementById('rsvp-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registering Attendance...';
        submitBtn.disabled = true;

        // Simulate network delay
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          if (rsvpSuccess) rsvpSuccess.classList.remove('hidden');
          rsvpForm.reset();
        }, 1200);
      }
    });
  }
});

/* ── 10. Sparkles Canvas Physics Engine ────────────── */
let canvas, ctx, animFrameId;
let sparkles = [];

function initCanvasSparkles() {
  canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  sparkles = [];
  const isMobile = window.innerWidth < 768;
  const sparkleCount = isMobile ? 15 : 45;
  for (let i = 0; i < sparkleCount; i++) {
    sparkles.push(new Particle(canvas));
  }

  // Optimize performance by pausing when hero is not visible
  const heroSection = document.getElementById('hero');
  if (heroSection && window.IntersectionObserver) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
      });
    }, { threshold: 0 });
    heroObserver.observe(heroSection);
  }

  animateParticles();
}

function resizeCanvas() {
  if (!canvas) return;
  const parent = canvas.parentNode;
  const rect = parent.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

let isHeroVisible = true;
function animateParticles() {
  if (!isHeroVisible) {
    animFrameId = requestAnimationFrame(animateParticles);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  sparkles.forEach(s => {
    s.update();
    s.draw();
  });

  animFrameId = requestAnimationFrame(animateParticles);
}

/* ── 11. Intersection Observer reveals ────────────── */
function initObserverReveals() {
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ── 12. Luxury Divider Observer ────────────── */
const dividerObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.2
});

document.querySelectorAll('.luxury-divider').forEach(divider => {
  dividerObserver.observe(divider);
});
