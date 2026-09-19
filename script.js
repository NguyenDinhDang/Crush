/* =========================================================
   TVU-love-page premium script.js
   Editorial + Romantic + Minimal + Premium Architecture
   1. Loading screen
   2. Background canvas (calm starry motes)
   3. Floating hearts layer (gentle vector SVG motes)
   4. Cursor interaction (subtle soft dot)
   5. Hero typing effect
   6. Scroll reveal (IntersectionObserver) + parallax blobs
   7. Story-line sequential reveal on scroll
   8. "No" button dodge logic
   9. "Yes" button celebration (confetti / fireworks / hearts)
   10. Click ripple & easter eggs
   11. Audio controller with Lucide iconography
========================================================= */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function refreshIcons(root = document) {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({ root });
  }
}

/* ---------------------------------------------------------
   1. LOADING SCREEN
--------------------------------------------------------- */
function runLoadingScreen(onDone) {
  const fill = $("#loadingBarFill");
  if (fill) {
    requestAnimationFrame(() => {
      fill.style.width = "100%";
    });
  }

  setTimeout(() => {
    const screen = $("#loading-screen");
    if (screen) screen.classList.add("fade-out");
    setTimeout(onDone, 900);
  }, 2800);
}

/* ---------------------------------------------------------
   2. BACKGROUND CANVAS (Calm Starry Dust & Subtle Motes)
   Tạo bầu không khí êm dịu, không gây nhiễu cho việc đọc
--------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = $("#bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Đạo hữu xin nương tay, chu thiên tinh tú trận pháp này đang dẫn dắt linh quang hư không xoay chuyển, chớ dại mà chỉnh sửa kẻo tẩu hỏa nhập ma!
  const stars = Array.from({ length: 36 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.4 + 0.5,
    tw: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.012 + 0.006
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);

    stars.forEach((s) => {
      s.tw += s.speed;
      const alpha = 0.2 + Math.sin(s.tw) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 93, 143, ${alpha * 0.6})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ---------------------------------------------------------
   3. FLOATING HEARTS LAYER (Gentle, Slow, Background SVG)
--------------------------------------------------------- */
function spawnFloatingHeart() {
  const layer = $("#floating-hearts-layer");
  if (!layer) return;

  const heart = document.createElement("div");
  heart.className = "floating-heart";

  const size = Math.floor(Math.random() * 8 + 13); // 13px - 21px
  const left = Math.random() * 100;
  const duration = Math.random() * 5 + 11; // 11s - 16s
  const drift = (Math.random() * 120 - 60) + "px";
  const colors = ["rgba(232, 93, 143, 0.45)", "rgba(240, 139, 174, 0.4)", "rgba(247, 183, 204, 0.35)"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  heart.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

  heart.style.left = left + "vw";
  heart.style.setProperty("--drift", drift);
  heart.style.animationDuration = duration + "s";

  layer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000 + 300);
}

function startFloatingHeartsLoop() {
  spawnFloatingHeart();
  // Spawn mỗi 2.4s rất thưa và nhẹ nhàng, không gây rối mắt
  setInterval(spawnFloatingHeart, 2400);
}

/* ---------------------------------------------------------
   4. CURSOR INTERACTION (Soft Subtle Dot)
--------------------------------------------------------- */
function initCursorTrail() {
  const layer = $("#cursor-hearts-layer");
  if (!layer) return;
  let last = 0;

  function spawn(x, y) {
    const el = document.createElement("div");
    el.className = "cursor-dot";
    el.style.left = x + "px";
    el.style.top = y + "px";
    layer.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }

  window.addEventListener("pointermove", (e) => {
    const now = Date.now();
    if (now - last < 75) return;
    last = now;
    spawn(e.clientX, e.clientY);
  });

  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;
    const now = Date.now();
    if (now - last < 75) return;
    last = now;
    spawn(t.clientX, t.clientY);
  }, { passive: true });
}

/* ---------------------------------------------------------
   5. HERO TYPING EFFECT
--------------------------------------------------------- */
function typeText(el, text, speed = 48) {
  return new Promise((resolve) => {
    if (!el) return resolve();
    let i = 0;
    el.textContent = "";
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

/* ---------------------------------------------------------
   0. CONFIGURATION INJECTION
--------------------------------------------------------- */
function applyConfigToDOM() {
  if (typeof CONFIG === "undefined") return;

  if (CONFIG.pageTitle) document.title = CONFIG.pageTitle;
  if (CONFIG.musicFile) {
    const audio = $("#bg-music");
    if (audio) audio.src = CONFIG.musicFile;
  }
  if (CONFIG.loadingText) {
    const lt = $("#loading-screen .loading-text");
    if (lt) lt.textContent = CONFIG.loadingText;
  }

  // Hero Section
  if (CONFIG.heroName || CONFIG.name) {
    const hn = $("#scene-hero .name-title");
    if (hn) hn.textContent = CONFIG.heroName || CONFIG.name;
  }
  if (CONFIG.scrollHint) {
    const sh = $("#scene-hero .scroll-hint span");
    if (sh) sh.textContent = CONFIG.scrollHint;
  }

  // Story Section
  if (CONFIG.storyLines && CONFIG.storyLines.length) {
    const storyWrap = $("#scene-story .story-lines");
    if (storyWrap) {
      storyWrap.innerHTML = "";
      CONFIG.storyLines.forEach((item) => {
        const p = document.createElement("p");
        p.className = "story-line" + (item.isAccent ? " accent" : "");
        p.setAttribute("data-fx", item.fx || "fade-up");
        p.textContent = item.text;
        storyWrap.appendChild(p);
      });
    }
  }

  // Timeline Section (Rendering with Lucide icons from CONFIG)
  if (CONFIG.timelineTitle) {
    const tt = $("#scene-timeline .section-title");
    if (tt) tt.textContent = CONFIG.timelineTitle;
  }
  if (CONFIG.timelineItems && CONFIG.timelineItems.length) {
    const timelineWrap = $("#scene-timeline .timeline");
    if (timelineWrap) {
      timelineWrap.innerHTML = '<div class="timeline-line"></div>';
      CONFIG.timelineItems.forEach((item) => {
        const div = document.createElement("div");
        div.className = "timeline-item reveal-item";
        div.setAttribute("data-fx", item.direction || "slide-right");
        
        const iconKey = item.icon || "sparkles";
        div.innerHTML = `
          <div class="timeline-dot ${item.isAccent ? 'glow-dot' : ''}">
            <i data-lucide="${iconKey}"></i>
          </div>
          <div class="timeline-card glass ${item.isAccent ? 'accent-card' : ''}">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
          </div>
        `;
        timelineWrap.appendChild(div);
      });
    }
  }

  // Gallery Section
  if (CONFIG.galleryTitle) {
    const gt = $("#scene-gallery .section-title");
    if (gt) gt.textContent = CONFIG.galleryTitle;
  }
  if (CONFIG.polaroids && CONFIG.polaroids.length) {
    const pCards = $$("#scene-gallery .polaroid");
    pCards.forEach((card, idx) => {
      const item = CONFIG.polaroids[idx];
      if (item) {
        const cap = card.querySelector(".polaroid-caption");
        if (cap && item.caption) cap.textContent = item.caption;
        if (item.rot) card.style.setProperty("--rot", item.rot);
        const photoEl = card.querySelector(".polaroid-photo");
        if (photoEl && item.image) {
          photoEl.style.backgroundImage = `url("${item.image}")`;
        }
      }
    });
  }

  // Quote Section
  if (CONFIG.quoteLine1 && CONFIG.quoteLine2) {
    const qEl = $("#scene-quote .big-quote");
    if (qEl) qEl.innerHTML = `${CONFIG.quoteLine1}<br><span>${CONFIG.quoteLine2}</span>`;
  }

  // Ask Section
  if (CONFIG.askName || CONFIG.name) {
    const an = $("#scene-ask .name-title");
    if (an) an.textContent = CONFIG.askName || CONFIG.name;
  }
  if (CONFIG.askQuestion) {
    const aq = $("#scene-ask .ask-question");
    if (aq) aq.textContent = CONFIG.askQuestion;
  }
  if (CONFIG.yesBtnText) {
    const yesText = $("#yesBtn .btn-text");
    if (yesText) yesText.textContent = CONFIG.yesBtnText;
  }
  if (CONFIG.noBtnText) {
    const noText = $("#noBtn .btn-text");
    if (noText) noText.textContent = CONFIG.noBtnText;
  }

  // Success Section
  if (CONFIG.successThankTitle) {
    const st = $("#scene-success .thank-you");
    if (st) st.textContent = CONFIG.successThankTitle;
    const gt = $("#galaxy-success-card .galaxy-title");
    if (gt) gt.textContent = CONFIG.successThankTitle;
  }
  const thankLines = $$("#scene-success .thank-line");
  if (thankLines.length >= 2) {
    if (CONFIG.successLine1) thankLines[0].textContent = CONFIG.successLine1;
    if (CONFIG.successLine2) thankLines[1].textContent = CONFIG.successLine2;
  }
  const gLine1 = $("#galaxy-success-card .galaxy-line-1");
  const gLine2 = $("#galaxy-success-card .galaxy-line-2");
  if (gLine1 && CONFIG.successLine1) gLine1.textContent = CONFIG.successLine1;
  if (gLine2 && CONFIG.successLine2) gLine2.textContent = CONFIG.successLine2;

  // Footer
  if (CONFIG.footerText) {
    const ftText = $("#site-footer .footer-text");
    if (ftText) ftText.textContent = CONFIG.footerText;
  }

  refreshIcons();
}

async function runHeroTyping() {
  const text = (typeof CONFIG !== "undefined" && CONFIG.heroTypedText) 
    ? CONFIG.heroTypedText 
    : "Anh có điều muốn nói...";
  await typeText($("#heroTyped"), text, 50);
}

/* ---------------------------------------------------------
   6. SCROLL REVEAL (IntersectionObserver) + PARALLAX BLOBS
--------------------------------------------------------- */
function initScrollReveal() {
  const items = $$(".reveal-item");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = Array.from(el.parentElement.children).indexOf(el) * 80;
        setTimeout(() => el.classList.add("in-view"), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -6% 0px" });

  items.forEach((el) => io.observe(el));
}

function initParallaxBlobs() {
  const blobs = $$(".blob");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      blobs.forEach((b, i) => {
        const speed = 0.04 + i * 0.02;
        b.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

/* ---------------------------------------------------------
   7. STORY-LINE SEQUENTIAL REVEAL ON SCROLL
--------------------------------------------------------- */
function initStoryReveal() {
  const lines = $$("#scene-story .story-line");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = lines.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add("show"), idx * 240);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  lines.forEach((l) => io.observe(l));
}

/* ---------------------------------------------------------
   8. "NO" BUTTON DODGE LOGIC (Preserving Icon and Layout)
--------------------------------------------------------- */
function initDodgeButton() {
  const noBtn = $("#noBtn");
  if (!noBtn) return;

  const defaultPhrases = [
    "Không đồng ý",
    "Em chắc chứ?",
    "Đừng mà...",
    "Nghĩ lại nha",
    "Không được đâu",
    "Anh buồn đó",
    "Thật sao em?",
    "Suy nghĩ lại chút đi mà"
  ];
  const phrases = (typeof CONFIG !== "undefined" && CONFIG.noDodgePhrases) 
    ? CONFIG.noDodgePhrases 
    : defaultPhrases;
  let dodgeCount = 0;

  function moveButton() {
    const margin = 40;
    const maxX = Math.max(window.innerWidth - 220, margin);
    const maxY = Math.max(window.innerHeight - 100, margin);

    const x = Math.random() * (maxX - margin) + margin;
    const y = Math.random() * (maxY - margin) + margin;
    const rot = (Math.random() * 24 - 12).toFixed(1);

    noBtn.classList.add("escaping");
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
    noBtn.style.transform = `rotate(${rot}deg) scale(0.96)`;

    dodgeCount++;
    if (dodgeCount % 2 === 0) {
      const btnText = noBtn.querySelector(".btn-text");
      const nextPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      if (btnText) {
        btnText.textContent = nextPhrase;
      } else {
        noBtn.textContent = nextPhrase;
      }
    }
  }

  noBtn.addEventListener("pointerenter", moveButton);
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    moveButton();
  });
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveButton();
  }, { passive: false });
}

/* ---------------------------------------------------------
   9. CELEBRATION FX ENGINE (Canvas vector particles)
--------------------------------------------------------- */
const fxCanvas = $("#fx-canvas");
const fxCtx = fxCanvas ? fxCanvas.getContext("2d") : null;

function resizeFxCanvas() {
  if (!fxCanvas) return;
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFxCanvas);
resizeFxCanvas();

const POOL_SIZE = 400;
const pool = Array.from({ length: POOL_SIZE }, () => ({ active: false }));
const colors = ["#E85D8F", "#F08BAE", "#F7B7CC", "#FFE3EC", "#FCE8F0", "#FFFFFF"];

function getFreeParticle() {
  for (const p of pool) if (!p.active) return p;
  return pool[0];
}

function spawnConfetti(cx, cy, count = 40) {
  for (let i = 0; i < count; i++) {
    const p = getFreeParticle();
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2.5;
    Object.assign(p, {
      active: true,
      type: "confetti",
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 8 - 4,
      life: 0,
      maxLife: 85 + Math.random() * 35,
      gravity: 0.14
    });
  }
}

function spawnHearts(cx, cy, count = 12) {
  for (let i = 0; i < count; i++) {
    const p = getFreeParticle();
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4.5 + 1.8;
    Object.assign(p, {
      active: true,
      type: "heart",
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5,
      size: Math.random() * 10 + 10,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
      life: 0,
      maxLife: 65 + Math.random() * 25,
      gravity: 0.07,
      rotation: Math.random() * 40 - 20,
      rotSpeed: Math.random() * 3 - 1.5
    });
  }
}

function spawnSparkles(cx, cy, count = 18) {
  for (let i = 0; i < count; i++) {
    const p = getFreeParticle();
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3.5 + 1;
    Object.assign(p, {
      active: true,
      type: "sparkle",
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2.5 + 1.2,
      life: 0,
      maxLife: 35 + Math.random() * 20,
      gravity: 0.02
    });
  }
}

// Hàm vẽ vector heart mượt mà trên canvas, hoàn toàn không phụ thuộc unicode emoji
function drawCanvasHeart(ctx, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const d = size * 0.6;
  ctx.moveTo(0, -d * 0.2);
  ctx.bezierCurveTo(-d * 0.5, -d * 0.8, -d, -d * 0.1, 0, d * 0.8);
  ctx.bezierCurveTo(d, -d * 0.1, d * 0.5, -d * 0.8, 0, -d * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function updateAndDrawFx() {
  if (!fxCtx) return;
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  for (const p of pool) {
    if (!p.active) continue;
    p.life++;
    if (p.life >= p.maxLife) {
      p.active = false;
      continue;
    }

    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    if (p.rotation !== undefined) p.rotation += p.rotSpeed || 0;

    const alpha = Math.max(1 - p.life / p.maxLife, 0);

    fxCtx.save();
    fxCtx.globalAlpha = alpha;
    fxCtx.translate(p.x, p.y);
    if (p.rotation) fxCtx.rotate((p.rotation * Math.PI) / 180);

    if (p.type === "confetti") {
      fxCtx.fillStyle = p.color;
      fxCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
    } else if (p.type === "heart") {
      drawCanvasHeart(fxCtx, p.size, p.color);
    } else if (p.type === "sparkle") {
      fxCtx.fillStyle = "#FFF9E6";
      fxCtx.beginPath();
      fxCtx.arc(0, 0, p.size, 0, Math.PI * 2);
      fxCtx.fill();
    }
    fxCtx.restore();
  }

  requestAnimationFrame(updateAndDrawFx);
}
updateAndDrawFx();

function fireworkAt(x, y) {
  spawnConfetti(x, y, 36);
  spawnHearts(x, y, 10);
  spawnSparkles(x, y, 16);
}

function flashScreen() {
  const overlay = $("#flash-overlay");
  if (!overlay) return;
  overlay.classList.remove("flash");
  void overlay.offsetWidth;
  overlay.classList.add("flash");
}

function celebrateYes() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  flashScreen();

  let count = 0;
  const fwInterval = setInterval(() => {
    fireworkAt(Math.random() * w, Math.random() * h * 0.6 + h * 0.15);
    count++;
    if (count > 8) clearInterval(fwInterval);
  }, 240);

  let rainTicks = 0;
  const rainInterval = setInterval(() => {
    spawnConfetti(Math.random() * w, -20, 6);
    rainTicks++;
    if (rainTicks > 30) clearInterval(rainInterval);
  }, 140);

  // Sparkles có giới hạn thời gian kết thúc (5 giây), tránh vòng lặp vô hạn
  const sparkleInterval = setInterval(() => {
    spawnSparkles(Math.random() * w, Math.random() * h * 0.5, 3);
  }, 450);

  setTimeout(() => {
    clearInterval(sparkleInterval);
  }, 5000);
}

/* ---------------------------------------------------------
   10. CLICK RIPPLE & EASTER EGGS
--------------------------------------------------------- */
function spawnRipple(x, y) {
  const ripple = document.createElement("div");
  Object.assign(ripple.style, {
    position: "fixed",
    left: x + "px",
    top: y + "px",
    width: "8px",
    height: "8px",
    marginLeft: "-4px",
    marginTop: "-4px",
    borderRadius: "50%",
    border: "1.5px solid rgba(232, 93, 143, 0.55)",
    pointerEvents: "none",
    zIndex: "55",
    transition: "transform 0.55s var(--ease-out), opacity 0.55s var(--ease-out)"
  });
  document.body.appendChild(ripple);

  requestAnimationFrame(() => {
    ripple.style.transform = "scale(6)";
    ripple.style.opacity = "0";
  });
  setTimeout(() => ripple.remove(), 600);
}

let clickTimestamps = [];
function initClickBurst() {
  // Chỉ tạo ripple nhẹ khi click thông thường, không spam particle
  document.addEventListener("pointerdown", (e) => {
    spawnRipple(e.clientX, e.clientY);

    // Easter egg: nhấp liên tục 8 lần trong 1.2s -> heart rain
    const now = Date.now();
    clickTimestamps.push(now);
    clickTimestamps = clickTimestamps.filter((t) => now - t < 1200);
    if (clickTimestamps.length >= 8) {
      heartRain();
      clickTimestamps = [];
    }
  });

  document.addEventListener("dblclick", (e) => {
    fireworkAt(e.clientX, e.clientY);
  });
}

function heartRain() {
  const w = window.innerWidth;
  let ticks = 0;
  const rain = setInterval(() => {
    spawnHearts(Math.random() * w, -20, 2);
    ticks++;
    if (ticks > 25) clearInterval(rain);
  }, 70);
}

/* ---------------------------------------------------------
   11. EASTER EGG: KONAMI CODE
--------------------------------------------------------- */
function initKonamiCode() {
  const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let progress = 0;

  window.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === sequence[progress]) {
      progress++;
      if (progress === sequence.length) {
        progress = 0;
        showKonamiMessage();
      }
    } else {
      progress = (key === sequence[0]) ? 1 : 0;
    }
  });
}

function showKonamiMessage() {
  const msg = (typeof CONFIG !== "undefined" && CONFIG.konamiMessage) 
    ? CONFIG.konamiMessage 
    : "Anh thích em rất nhiều.";

  const el = document.createElement("div");
  el.className = "konami-popup";
  el.innerHTML = `<span style="display:inline-flex;align-items:center;gap:8px;"><i data-lucide="heart" style="width:20px;height:20px;stroke-width:2;color:#E85D8F;fill:#E85D8F;"></i> ${msg}</span>`;

  Object.assign(el.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.9)",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",
    padding: "20px 32px",
    borderRadius: "18px",
    fontSize: "20px",
    fontFamily: "var(--font-serif)",
    fontWeight: "600",
    color: "#E85D8F",
    boxShadow: "0 18px 45px rgba(180, 110, 140, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.9)",
    zIndex: "900",
    opacity: "0",
    transition: "opacity 0.4s ease, transform 0.4s var(--ease-soft)"
  });

  document.body.appendChild(el);
  refreshIcons(el);

  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translate(-50%, -50%) scale(1)";
  });

  fireworkAt(window.innerWidth / 2, window.innerHeight / 2);

  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 450);
  }, 2600);
}

/* =========================================================
   CINEMATIC 3D HEART GALAXY CELEBRATION (Three.js Engine)
   Sequence:
   - Phase 1: Intro (0 -> 1.2s) Scattered surrounding particles
   - Phase 2: Heart Formation (1.2 -> 3.5s) Organic light-weaving
   - Phase 3: Heart Complete (3.5 -> 5.0s) Brightness burst & breathing pulse
   - Phase 4: 3D Orbit (5.0s+) Orbital rings, mini-hearts, floating text, camera drift
========================================================= */

let galaxyCelebrationState = null;

function makeParticleGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
  grad.addColorStop(0.25, "rgba(255, 210, 230, 0.95)");
  grad.addColorStop(0.55, "rgba(232, 60, 120, 0.65)");
  grad.addColorStop(0.85, "rgba(140, 20, 70, 0.2)");
  grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function createHeartParticleScene() {
  const overlay = $("#heart-galaxy-overlay");
  const canvas = $("#heart-galaxy-canvas");
  if (!overlay || !canvas || typeof THREE === "undefined") return null;

  const isMobile = window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2.2, 14.5);
  camera.lookAt(0, 1.2, 0);

  const glowTexture = makeParticleGlowTexture();

  return {
    overlay,
    canvas,
    renderer,
    scene,
    camera,
    glowTexture,
    isMobile,
    clock: new THREE.Clock(),
    animId: null,
    running: false
  };
}

// Đạo hữu xin nương tay, Vạn Cổ Tinh Hà Trận Pháp dệt tinh quang thành vạn kiếp chân tâm này đang vận hành cực kỳ huyền diệu, chớ dại mà chỉnh sửa kẻo nghịch chuyển kinh mạch tẩu hỏa nhập ma!
function createHeartParticles(state) {
  const { scene, glowTexture, isMobile } = state;
  const count = isMobile ? 1400 : 3800;

  const geo = new THREE.BufferGeometry();
  const currentPos = new Float32Array(count * 3);
  const originPos = new Float32Array(count * 3);
  const targetPos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const durations = new Float32Array(count);

  const colorPalette = [
    new THREE.Color("#FFFFFF"),
    new THREE.Color("#FFEAF2"),
    new THREE.Color("#FF8AB5"),
    new THREE.Color("#E83362"),
    new THREE.Color("#B8144E")
  ];

  const heartScale = isMobile ? 0.14 : 0.165;
  const centerY = 1.35;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Đường cong trái tim tham số toán học
    const t = Math.random() * Math.PI * 2;
    const sinT = Math.sin(t);
    const xBase = 16 * Math.pow(sinT, 3);
    const yBase = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    // 75% tạo viền vỏ ngoài sắc nét, 25% tạo làn sương thể tích bên trong
    const isSurface = Math.random() < 0.75;
    const volumeFactor = isSurface ? (0.92 + Math.random() * 0.16) : Math.pow(Math.random(), 0.6) * 0.9;

    // Chiều sâu Z với độ thuôn tự nhiên ra ngoài rìa
    const distFromCenter = Math.sqrt(xBase * xBase + yBase * yBase) / 16;
    const maxZ = Math.max(0, 1 - distFromCenter * 0.55);
    const zBase = (Math.random() - 0.5) * (isSurface ? 2.4 : 3.8) * maxZ;

    const tx = xBase * heartScale * volumeFactor + (Math.random() - 0.5) * 0.08;
    const ty = yBase * heartScale * volumeFactor + centerY + (Math.random() - 0.5) * 0.08;
    const tz = zBase * heartScale;

    targetPos[i3] = tx;
    targetPos[i3 + 1] = ty;
    targetPos[i3 + 2] = tz;

    // Vị trí gốc ban đầu rải rác xung quanh không gian 3D trong Phase 1
    const scatterAngle = Math.random() * Math.PI * 2;
    const scatterRadius = Math.random() * 14 + 7;
    const ox = Math.cos(scatterAngle) * scatterRadius;
    const oy = (Math.random() - 0.5) * 14 + centerY;
    const oz = Math.sin(scatterAngle) * scatterRadius + (Math.random() - 0.5) * 8;

    originPos[i3] = ox;
    originPos[i3 + 1] = oy;
    originPos[i3 + 2] = oz;

    currentPos[i3] = ox;
    currentPos[i3 + 1] = oy;
    currentPos[i3 + 2] = oz;

    // Bảng màu lãng mạn cao cấp
    const cChoice = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = cChoice.r;
    colors[i3 + 1] = cChoice.g;
    colors[i3 + 2] = cChoice.b;

    // Phân tầng thời gian đến đích (dệt ánh sáng hữu cơ)
    delays[i] = Math.random() * 0.95;
    durations[i] = Math.random() * 0.7 + 1.6;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(currentPos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: isMobile ? 0.16 : 0.18,
    sizeAttenuation: true,
    vertexColors: true,
    map: glowTexture,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  return {
    points,
    geo,
    mat,
    count,
    originPos,
    targetPos,
    delays,
    durations,
    centerY
  };
}

function createOrbitParticles(state) {
  const { scene, glowTexture, isMobile } = state;
  const group = new THREE.Group();

  // 1. Đĩa thiên hà xoáy (Cosmic Spiral Galaxy Disc)
  const galaxyCount = isMobile ? 900 : 2600;
  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyPos = new Float32Array(galaxyCount * 3);
  const galaxyCol = new Float32Array(galaxyCount * 3);
  const arms = 4;
  const maxRadius = 10.5;

  const cInner = new THREE.Color("#FFFFFF");
  const cMid = new THREE.Color("#FF7DA7");
  const cOuter = new THREE.Color("#6B0D38");

  for (let i = 0; i < galaxyCount; i++) {
    const i3 = i * 3;
    const r = Math.pow(Math.random(), 1.6) * maxRadius + 0.8;
    const spin = r * 0.75;
    const armAngle = ((i % arms) / arms) * Math.PI * 2;
    const jitter = 0.22 * r;
    const rx = (Math.random() - 0.5) * jitter;
    const rz = (Math.random() - 0.5) * jitter;
    const ry = (Math.random() - 0.5) * 0.25 - 0.4;

    galaxyPos[i3] = Math.cos(armAngle + spin) * r + rx;
    galaxyPos[i3 + 1] = ry;
    galaxyPos[i3 + 2] = Math.sin(armAngle + spin) * r + rz;

    const ratio = r / maxRadius;
    const mixed = ratio < 0.4 
      ? cInner.clone().lerp(cMid, ratio / 0.4) 
      : cMid.clone().lerp(cOuter, (ratio - 0.4) / 0.6);
    galaxyCol[i3] = mixed.r;
    galaxyCol[i3 + 1] = mixed.g;
    galaxyCol[i3 + 2] = mixed.b;
  }
  galaxyGeo.setAttribute("position", new THREE.BufferAttribute(galaxyPos, 3));
  galaxyGeo.setAttribute("color", new THREE.BufferAttribute(galaxyCol, 3));

  const galaxyMat = new THREE.PointsMaterial({
    size: isMobile ? 0.09 : 0.11,
    sizeAttenuation: true,
    vertexColors: true,
    map: glowTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
  galaxyPoints.position.y = -0.6;
  group.add(galaxyPoints);

  // 2. Các vòng quỹ đạo sáng elip nghiêng trong không gian (Orbital Rings)
  const ringParams = [
    { radius: 5.2, tiltX: 0.45, tiltZ: 0.2, speed: 0.18, count: isMobile ? 120 : 350, col: "#FF9EC7" },
    { radius: 7.2, tiltX: -0.6, tiltY: 0.35, speed: -0.14, count: isMobile ? 140 : 420, col: "#FF4D88" },
    { radius: 9.0, tiltX: 0.8, tiltZ: -0.4, speed: 0.11, count: isMobile ? 160 : 480, col: "#FFFFFF" }
  ];

  const ringMeshes = ringParams.map((rp) => {
    const rGeo = new THREE.BufferGeometry();
    const rPos = new Float32Array(rp.count * 3);
    const rCol = new Float32Array(rp.count * 3);
    const baseCol = new THREE.Color(rp.col);

    for (let j = 0; j < rp.count; j++) {
      const j3 = j * 3;
      const angle = (j / rp.count) * Math.PI * 2;
      const radJitter = rp.radius + (Math.random() - 0.5) * 0.3;
      rPos[j3] = Math.cos(angle) * radJitter;
      rPos[j3 + 1] = (Math.random() - 0.5) * 0.18;
      rPos[j3 + 2] = Math.sin(angle) * radJitter;

      // Độ sáng phân bổ không đều tạo vẻ tự nhiên
      const brightness = 0.4 + Math.sin(angle * 3) * 0.4 + Math.random() * 0.2;
      rCol[j3] = baseCol.r * brightness;
      rCol[j3 + 1] = baseCol.g * brightness;
      rCol[j3 + 2] = baseCol.b * brightness;
    }
    rGeo.setAttribute("position", new THREE.BufferAttribute(rPos, 3));
    rGeo.setAttribute("color", new THREE.BufferAttribute(rCol, 3));

    const rMat = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.1,
      sizeAttenuation: true,
      vertexColors: true,
      map: glowTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const rPoints = new THREE.Points(rGeo, rMat);
    rPoints.rotation.x = rp.tiltX;
    if (rp.tiltY) rPoints.rotation.y = rp.tiltY;
    if (rp.tiltZ) rPoints.rotation.z = rp.tiltZ;
    rPoints.position.y = 1.35;
    group.add(rPoints);

    return { points: rPoints, geo: rGeo, mat: rMat, speed: rp.speed };
  });

  scene.add(group);

  return {
    group,
    galaxyPoints,
    galaxyGeo,
    galaxyMat,
    ringMeshes
  };
}

function createSmallHearts(state) {
  const { scene, isMobile } = state;
  const count = isMobile ? 9 : 18;

  // Dựng hình học trái tim 3D mượt mà không dùng emoji
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.18);
  shape.bezierCurveTo(0, 0.32, -0.16, 0.42, -0.3, 0.42);
  shape.bezierCurveTo(-0.52, 0.42, -0.52, 0.18, -0.52, 0.18);
  shape.bezierCurveTo(-0.52, 0, -0.32, -0.22, 0, -0.5);
  shape.bezierCurveTo(0.32, -0.22, 0.52, 0, 0.52, 0.18);
  shape.bezierCurveTo(0.52, 0.18, 0.52, 0.42, 0.3, 0.42);
  shape.bezierCurveTo(0.16, 0.42, 0, 0.32, 0, 0.18);

  const geom = new THREE.ShapeGeometry(shape);
  const colors = [0xFF6EA7, 0xFFAEC9, 0xFF3366, 0xFFFFFF];

  const hearts = [];
  const group = new THREE.Group();

  for (let i = 0; i < count; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const mesh = new THREE.Mesh(geom, mat);
    const scale = (Math.random() * 0.12 + 0.1) * (isMobile ? 0.85 : 1);
    mesh.scale.set(scale, scale, scale);

    const orbitRadius = Math.random() * 4.5 + 3.4;
    const orbitSpeed = (Math.random() * 0.35 + 0.18) * (Math.random() < 0.5 ? 1 : -1);
    const tilt = (Math.random() - 0.5) * 1.4;
    const yOffset = (Math.random() - 0.5) * 2.5 + 1.35;
    const initialAngle = (i / count) * Math.PI * 2;

    group.add(mesh);
    hearts.push({
      mesh,
      mat,
      orbitRadius,
      orbitSpeed,
      tilt,
      yOffset,
      angle: initialAngle
    });
  }

  scene.add(group);
  return { group, geom, hearts };
}

function createFloatingTexts(state) {
  const { scene, isMobile } = state;
  const defaultTexts = [
    "Yêu em",
    "Forever",
    "Love you",
    "Em là điều tuyệt vời nhất",
    "Together",
    "Bình yên bên em"
  ];
  const texts = (typeof CONFIG !== "undefined" && CONFIG.floatingRomanticTexts && CONFIG.floatingRomanticTexts.length)
    ? CONFIG.floatingRomanticTexts
    : defaultTexts;

  const count = isMobile ? Math.min(texts.length, 4) : texts.length;
  const group = new THREE.Group();
  const textItems = [];

  for (let i = 0; i < count; i++) {
    const text = texts[i];
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.font = "italic 500 36px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = "rgba(255, 235, 245, 0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(232, 93, 143, 0.9)";
    ctx.shadowBlur = 16;
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.4, 0.85, 1);

    const radius = Math.random() * 2.6 + 4.8;
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
    const y = (Math.random() - 0.5) * 2.2 + 1.4;
    const speed = 0.08 * (i % 2 === 0 ? 1 : -0.9);

    group.add(sprite);
    textItems.push({
      sprite,
      mat,
      texture,
      radius,
      angle,
      y,
      speed
    });
  }

  scene.add(group);
  return { group, textItems };
}

function animateHeartFormation(state, modules, onHeartComplete) {
  const { renderer, scene, camera, clock } = state;
  const { heart, orbit, smallHearts, floatingTexts } = modules;

  let completedTriggered = false;

  function tick() {
    if (!state.running) return;
    state.animId = requestAnimationFrame(tick);

    const elapsed = clock.getElapsedTime();

    // ---------------------------------------------------------
    // PHASE 1 (0 -> 1.2s): INTRO — Các hạt sáng lơ lửng xung quanh
    // ---------------------------------------------------------
    if (elapsed < 1.2) {
      const p1Progress = Math.min(elapsed / 1.2, 1);
      heart.mat.opacity = 0.15 + p1Progress * 0.45;

      const pos = heart.geo.attributes.position.array;
      for (let i = 0; i < heart.count; i++) {
        const i3 = i * 3;
        pos[i3] = heart.originPos[i3] + Math.sin(elapsed * 1.5 + i) * 0.08;
        pos[i3 + 1] = heart.originPos[i3 + 1] + Math.cos(elapsed * 1.5 + i) * 0.08;
        pos[i3 + 2] = heart.originPos[i3 + 2];
      }
      heart.geo.attributes.position.needsUpdate = true;
    }

    // ---------------------------------------------------------
    // PHASE 2 (1.2 -> 3.5s): DỆT ÁNH SÁNG THÀNH HÌNH TRÁI TIM
    // ---------------------------------------------------------
    else if (elapsed >= 1.2 && elapsed < 3.5) {
      const formationTime = elapsed - 1.2;
      const pos = heart.geo.attributes.position.array;

      for (let i = 0; i < heart.count; i++) {
        const i3 = i * 3;
        const delay = heart.delays[i];
        const duration = heart.durations[i];
        const t = Math.max(0, Math.min((formationTime - delay) / duration, 1));

        // Hàm easing quartic mượt mà
        const ease = 1 - Math.pow(1 - t, 4);

        const ox = heart.originPos[i3];
        const oy = heart.originPos[i3 + 1];
        const oz = heart.originPos[i3 + 2];

        const tx = heart.targetPos[i3];
        const ty = heart.targetPos[i3 + 1];
        const tz = heart.targetPos[i3 + 2];

        // Độ xoáy góc nhẹ khi các luồng ánh sáng hội tụ
        const swirlAngle = (1 - ease) * 0.45;
        const cosS = Math.cos(swirlAngle);
        const sinS = Math.sin(swirlAngle);
        const curX = ox + (tx - ox) * ease;
        const curZ = oz + (tz - oz) * ease;

        pos[i3] = curX * cosS - curZ * sinS;
        pos[i3 + 1] = oy + (ty - oy) * ease;
        pos[i3 + 2] = curX * sinS + curZ * cosS;
      }
      heart.geo.attributes.position.needsUpdate = true;
      heart.mat.opacity = 0.6 + ((elapsed - 1.2) / 2.3) * 0.35;
    }

    // ---------------------------------------------------------
    // PHASE 3 & 4 (3.5s+): TRÁI TIM HOÀN THÀNH & VẬN HÀNH 3D ORBIT
    // ---------------------------------------------------------
    else {
      if (!completedTriggered) {
        completedTriggered = true;
        if (onHeartComplete) onHeartComplete();
      }

      const pulseTime = elapsed - 3.5;
      // Nhịp đập thở hữu cơ dịu dàng
      const breath = 1.0 + Math.sin(pulseTime * 2.2) * 0.035;
      heart.points.scale.set(breath, breath, breath);

      // Gợn sóng vi mô lấp lánh trên bề mặt trái tim
      const pos = heart.geo.attributes.position.array;
      for (let i = 0; i < heart.count; i++) {
        const i3 = i * 3;
        const tx = heart.targetPos[i3];
        const ty = heart.targetPos[i3 + 1];
        const tz = heart.targetPos[i3 + 2];
        const shimmer = Math.sin(pulseTime * 3.5 + i * 0.12) * 0.015;
        pos[i3] = tx + shimmer;
        pos[i3 + 1] = ty + shimmer;
        pos[i3 + 2] = tz + shimmer;
      }
      heart.geo.attributes.position.needsUpdate = true;

      // Hiện dần đĩa thiên hà & các vòng quỹ đạo
      const ringAlpha = Math.min(pulseTime / 1.8, 1);
      orbit.galaxyMat.opacity = ringAlpha * 0.75;
      orbit.ringMeshes.forEach((r) => {
        r.mat.opacity = ringAlpha * 0.85;
      });

      // Hiện dần các trái tim nhỏ
      smallHearts.hearts.forEach((h) => {
        h.mat.opacity = ringAlpha * 0.8;
      });

      // Hiện dần chữ tình cảm bay lơ lửng
      floatingTexts.textItems.forEach((item) => {
        item.mat.opacity = Math.min(pulseTime / 2.5, 0.7);
      });
    }

    // Chuyển động xoay của đĩa thiên hà & các vòng quỹ đạo
    orbit.galaxyPoints.rotation.y = elapsed * 0.08;

    orbit.ringMeshes.forEach((r) => {
      r.points.rotation.y += r.speed * 0.012;
    });

    // Cập nhật vị trí các trái tim 3D nhỏ quay quanh
    smallHearts.hearts.forEach((h) => {
      h.angle += h.orbitSpeed * 0.018;
      const x = Math.cos(h.angle) * h.orbitRadius;
      const z = Math.sin(h.angle) * h.orbitRadius;
      const y = h.yOffset + Math.sin(h.angle * 2) * 0.4;
      h.mesh.position.set(x, y, z);
      h.mesh.rotation.y = h.angle + Math.PI / 2;
      h.mesh.rotation.z = Math.sin(h.angle) * 0.2;
    });

    // Cập nhật các câu chữ tình cảm 3D lơ lửng
    floatingTexts.textItems.forEach((item) => {
      item.angle += item.speed * 0.012;
      item.sprite.position.x = Math.cos(item.angle) * item.radius;
      item.sprite.position.z = Math.sin(item.angle) * item.radius;
      item.sprite.position.y = item.y + Math.sin(item.angle * 1.5) * 0.2;
    });

    // Camera chuyển động góc nhìn điện ảnh chậm rãi, bao quát
    camera.position.x = Math.sin(elapsed * 0.14) * 3.2;
    camera.position.z = 14.5 + Math.cos(elapsed * 0.14) * 1.2;
    camera.position.y = 2.2 + Math.sin(elapsed * 0.09) * 0.6;
    camera.lookAt(0, 1.35, 0);

    renderer.render(scene, camera);
  }

  tick();
}

function startCelebration() {
  const yesBtn = $("#yesBtn");
  const noBtn = $("#noBtn");
  if (yesBtn) yesBtn.disabled = true;
  if (noBtn) noBtn.disabled = true;

  // Dọn dẹp phiên kỷ niệm trước nếu có
  cleanupCelebration();

  // Khởi tạo Three.js
  const state = createHeartParticleScene();
  if (!state) {
    // Dự phòng nếu WebGL không khả dụng
    $("#scene-ask").classList.add("hidden");
    const fallbackScene = $("#scene-success");
    if (fallbackScene) {
      fallbackScene.classList.remove("hidden");
      fallbackScene.scrollIntoView({ behavior: "instant", block: "start" });
    }
    return;
  }

  galaxyCelebrationState = state;
  state.running = true;

  // Kích hoạt overlay tối lãng mạn
  state.overlay.classList.add("active");
  const askScene = $("#scene-ask");
  if (askScene) askScene.style.opacity = "0";

  // Khởi tạo các cấu phần
  const heart = createHeartParticles(state);
  const orbit = createOrbitParticles(state);
  const smallHearts = createSmallHearts(state);
  const floatingTexts = createFloatingTexts(state);

  const modules = { heart, orbit, smallHearts, floatingTexts };
  state.modules = modules;

  state.onResize = () => {
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", state.onResize);

  // Khởi chạy chuỗi chuyển động
  animateHeartFormation(state, modules, () => {
    const successCard = $("#galaxy-success-card");
    if (successCard) {
      successCard.classList.add("show");
      refreshIcons(successCard);
    }
  });

  // Xử lý nút "Xem lại" mượt mà
  const replayBtn = $("#btn-replay-galaxy");
  if (replayBtn) {
    replayBtn.onclick = (e) => {
      e.stopPropagation();
      const successCard = $("#galaxy-success-card");
      if (successCard) successCard.classList.remove("show");
      state.clock.start();
      animateHeartFormation(state, modules, () => {
        if (successCard) {
          successCard.classList.add("show");
          refreshIcons(successCard);
        }
      });
    };
  }
}

function cleanupCelebration() {
  if (!galaxyCelebrationState) return;
  const s = galaxyCelebrationState;
  s.running = false;
  if (s.animId) cancelAnimationFrame(s.animId);
  if (s.onResize) window.removeEventListener("resize", s.onResize);

  if (s.modules) {
    const { heart, orbit, smallHearts, floatingTexts } = s.modules;
    if (heart) {
      heart.geo.dispose();
      heart.mat.dispose();
    }
    if (orbit) {
      orbit.galaxyGeo.dispose();
      orbit.galaxyMat.dispose();
      orbit.ringMeshes.forEach((r) => {
        r.geo.dispose();
        r.mat.dispose();
      });
    }
    if (smallHearts) {
      smallHearts.geom.dispose();
      smallHearts.hearts.forEach((h) => h.mat.dispose());
    }
    if (floatingTexts) {
      floatingTexts.textItems.forEach((t) => {
        t.mat.dispose();
        t.texture.dispose();
      });
    }
  }

  if (s.glowTexture) s.glowTexture.dispose();
  if (s.renderer) s.renderer.dispose();

  galaxyCelebrationState = null;
}

// Alias tương thích
function celebrateYes() {
  startCelebration();
}

/* ---------------------------------------------------------
   YES BUTTON FLOW
--------------------------------------------------------- */
function initYesButton() {
  const yesBtn = $("#yesBtn");
  if (!yesBtn) return;

  yesBtn.addEventListener("click", () => {
    startCelebration();
  });
}

/* ---------------------------------------------------------
   12. AUDIO & MUSIC CONTROLLER WITH LUCIDE ICONS
--------------------------------------------------------- */
function initBackgroundMusic() {
  const bgMusic = $("#bg-music");
  const musicBtn = $("#music-toggle");
  let isPlaying = false;

  function setMusicButtonState(playing) {
    if (!musicBtn) return;
    isPlaying = playing;
    musicBtn.innerHTML = playing 
      ? '<i data-lucide="volume-2"></i>' 
      : '<i data-lucide="volume-x"></i>';
    musicBtn.setAttribute("aria-label", playing ? "Tắt nhạc" : "Bật nhạc");
    musicBtn.setAttribute("title", playing ? "Tắt nhạc" : "Bật nhạc");
    if (playing) {
      musicBtn.classList.add("playing");
    } else {
      musicBtn.classList.remove("playing");
    }
    refreshIcons(musicBtn);
  }

  // Đạo hữu xin nương tay, trận pháp âm thanh này đang vận hành ổn định nhờ thiên địa linh khí, chớ dại mà chỉnh sửa kẻo tẩu hỏa nhập ma!
  function startAudio() {
    if (isPlaying || !bgMusic) return;
    bgMusic.play().then(() => {
      setMusicButtonState(true);
    }).catch(() => {
      // Modern browsers restrict autoplay before initial user gesture
      setMusicButtonState(false);
    });
  }

  startAudio();

  const unlockAudio = () => {
    startAudio();
    document.removeEventListener("pointerdown", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
  };

  document.addEventListener("pointerdown", unlockAudio);
  document.addEventListener("keydown", unlockAudio);

  if (musicBtn) {
    musicBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isPlaying) {
        bgMusic.pause();
        setMusicButtonState(false);
      } else {
        bgMusic.play().then(() => {
          setMusicButtonState(true);
        }).catch((err) => console.log("Chưa có file nhạc hoặc trình duyệt chặn:", err));
      }
    });
  }
}

/* ---------------------------------------------------------
   INTERACTIVE POLAROID LOCAL IMAGE UPLOAD
--------------------------------------------------------- */
function initPolaroidUpload() {
  const pCards = $$("#scene-gallery .polaroid");
  pCards.forEach((card) => {
    const photoEl = card.querySelector(".polaroid-photo");
    if (!photoEl) return;

    // Đạo hữu xin nương tay, huyền pháp biến hóa ảo ảnh FileReader này đang chuyển hóa linh ảnh từ máy người dùng vô cùng ổn định, chớ dại động vào!
    card.addEventListener("click", () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            photoEl.style.backgroundImage = `url("${evt.target.result}")`;
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
    });
  });
}

/* ---------------------------------------------------------
   AUTO & CLICK SCROLL TO NEXT SCENE
--------------------------------------------------------- */
function initAutoScrollNext() {
  let autoTimer = null;
  const delaySec = (typeof CONFIG !== "undefined" && CONFIG.autoScrollSeconds !== undefined) 
    ? CONFIG.autoScrollSeconds 
    : 7;
  const autoDelayMs = delaySec * 1000;

  // Đạo hữu xin nương tay, thuật dịch chuyển không gian này đang định vị các phân cảnh vô cùng chính xác, chớ dại mà chỉnh sửa kẻo tẩu hỏa nhập ma!
  function getNextScene() {
    const scenes = $$("section.scene:not(.hidden)");
    for (let i = 0; i < scenes.length; i++) {
      const rect = scenes[i].getBoundingClientRect();
      if (rect.top > 80) {
        return scenes[i];
      }
    }
    return null;
  }

  function scrollToNext() {
    const next = getNextScene();
    if (next) {
      next.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    resetTimer();
  }

  function resetTimer() {
    if (autoTimer) clearTimeout(autoTimer);
    if (autoDelayMs <= 0) return;
    autoTimer = setTimeout(() => {
      scrollToNext();
    }, autoDelayMs);
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("button, input, a, .polaroid, .btn, #music-toggle")) {
      resetTimer();
      return;
    }
    scrollToNext();
  });

  window.addEventListener("scroll", () => {
    resetTimer();
  }, { passive: true });

  resetTimer();
}

/* ---------------------------------------------------------
   BOOTSTRAP
--------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  applyConfigToDOM();
  initBackgroundCanvas();
  startFloatingHeartsLoop();
  initCursorTrail();
  initClickBurst();
  initDodgeButton();
  initYesButton();
  initKonamiCode();
  initParallaxBlobs();
  initBackgroundMusic();
  initPolaroidUpload();

  runLoadingScreen(async () => {
    const mainContent = $("#main-content");
    const footer = $("#site-footer");
    if (mainContent) mainContent.classList.remove("hidden");
    if (footer) footer.classList.remove("hidden");

    refreshIcons();
    initScrollReveal();
    initStoryReveal();
    initAutoScrollNext();
    await runHeroTyping();
  });
});
