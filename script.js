/* =========================================================
   TVU-love-page premium script.js
   1. Loading screen
   2. Background canvas (stars / bubbles / glow)
   3. Floating hearts layer
   4. Cursor heart trail
   5. Hero typing effect
   6. Scroll reveal (IntersectionObserver) + parallax blobs
   7. Story-line sequential reveal on scroll
   8. "No" button dodge logic
   9. "Yes" button celebration (confetti / fireworks / hearts)
   10. Click-anywhere burst + ripple
   11. Easter eggs: Konami code, rapid-click rain, double-click firework
========================================================= */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ---------------------------------------------------------
   1. LOADING SCREEN
--------------------------------------------------------- */
function runLoadingScreen(onDone){
  const fill = $("#loadingBarFill");
  requestAnimationFrame(() => { fill.style.width = "100%"; });

  setTimeout(() => {
    $("#loading-screen").classList.add("fade-out");
    setTimeout(onDone, 900);
  }, 3000);
}

/* ---------------------------------------------------------
   2. BACKGROUND CANVAS (stars + bubbles + glow blobs)
--------------------------------------------------------- */
function initBackgroundCanvas(){
  const canvas = $("#bg-canvas");
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8 + 0.4,
    tw: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.01
  }));

  const bubbles = Array.from({ length: 20 }, () => ({
    x: Math.random() * w,
    y: h + Math.random() * h,
    r: Math.random() * 18 + 6,
    speed: Math.random() * 0.4 + 0.15,
    drift: Math.random() * 0.6 - 0.3
  }));

  function draw(){
    ctx.clearRect(0, 0, w, h);

    stars.forEach(s => {
      s.tw += s.speed;
      const alpha = 0.4 + Math.sin(s.tw) * 0.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });

    bubbles.forEach(b => {
      b.y -= b.speed;
      b.x += b.drift * 0.05;
      if (b.y < -30) { b.y = h + 30; b.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ---------------------------------------------------------
   3. FLOATING HEARTS LAYER
--------------------------------------------------------- */
function spawnFloatingHeart(){
  const layer = $("#floating-hearts-layer");
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = ["❤️","💗","💓","💕","💖"][Math.floor(Math.random()*5)];

  const size = Math.random() * 18 + 14;
  const left = Math.random() * 100;
  const duration = Math.random() * 6 + 7;
  const drift = (Math.random() * 160 - 80) + "px";

  heart.style.left = left + "vw";
  heart.style.fontSize = size + "px";
  heart.style.setProperty("--drift", drift);
  heart.style.animationDuration = duration + "s";

  layer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000 + 200);
}

function startFloatingHeartsLoop(){
  spawnFloatingHeart();
  setInterval(spawnFloatingHeart, 500);
}

/* ---------------------------------------------------------
   4. CURSOR HEART TRAIL
--------------------------------------------------------- */
function initCursorTrail(){
  const layer = $("#cursor-hearts-layer");
  let last = 0;

  function spawn(x, y){
    const el = document.createElement("div");
    el.className = "cursor-heart";
    el.textContent = "❤️";
    el.style.left = x + "px";
    el.style.top = y + "px";
    layer.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  window.addEventListener("pointermove", (e) => {
    const now = Date.now();
    if (now - last < 60) return;
    last = now;
    spawn(e.clientX, e.clientY);
  });

  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;
    const now = Date.now();
    if (now - last < 60) return;
    last = now;
    spawn(t.clientX, t.clientY);
  }, { passive: true });
}

/* ---------------------------------------------------------
   5. HERO TYPING EFFECT
--------------------------------------------------------- */
function typeText(el, text, speed = 48){
  return new Promise((resolve) => {
    let i = 0;
    el.textContent = "";
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length){
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

/* ---------------------------------------------------------
   0. CONFIGURATION INJECTION
--------------------------------------------------------- */
function applyConfigToDOM(){
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
      CONFIG.storyLines.forEach(item => {
        const p = document.createElement("p");
        p.className = "story-line" + (item.isAccent ? " accent" : "");
        p.setAttribute("data-fx", item.fx || "fade-up");
        p.textContent = item.text;
        storyWrap.appendChild(p);
      });
    }
  }

  // Timeline Section
  if (CONFIG.timelineTitle) {
    const tt = $("#scene-timeline .section-title");
    if (tt) tt.textContent = CONFIG.timelineTitle;
  }
  if (CONFIG.timelineItems && CONFIG.timelineItems.length) {
    const timelineWrap = $("#scene-timeline .timeline");
    if (timelineWrap) {
      timelineWrap.innerHTML = '<div class="timeline-line"></div>';
      CONFIG.timelineItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "timeline-item reveal-item";
        div.setAttribute("data-fx", item.direction || "slide-right");
        div.innerHTML = `
          <div class="timeline-dot ${item.isAccent ? 'glow-dot' : ''}">${item.dot || '✨'}</div>
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
      if (CONFIG.polaroids[idx]) {
        const cap = card.querySelector(".polaroid-caption");
        if (cap) cap.textContent = CONFIG.polaroids[idx].caption;
        if (CONFIG.polaroids[idx].rot) card.style.setProperty("--rot", CONFIG.polaroids[idx].rot);
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
    const yb = $("#yesBtn");
    if (yb) yb.textContent = CONFIG.yesBtnText;
  }
  if (CONFIG.noBtnText) {
    const nb = $("#noBtn");
    if (nb) nb.textContent = CONFIG.noBtnText;
  }

  // Success Section
  if (CONFIG.successThankTitle) {
    const st = $("#scene-success .thank-you");
    if (st) st.textContent = CONFIG.successThankTitle;
  }
  const thankLines = $$("#scene-success .thank-line");
  if (thankLines.length >= 2) {
    if (CONFIG.successLine1) thankLines[0].textContent = CONFIG.successLine1;
    if (CONFIG.successLine2) thankLines[1].textContent = CONFIG.successLine2;
  }

  // Footer
  if (CONFIG.footerText) {
    const ft = $("#site-footer");
    if (ft) ft.textContent = CONFIG.footerText;
  }
}

async function runHeroTyping(){
  const text = (typeof CONFIG !== "undefined" && CONFIG.heroTypedText) ? CONFIG.heroTypedText : "Anh có điều muốn nói...";
  await typeText($("#heroTyped"), text, 50);
}


/* ---------------------------------------------------------
   6. SCROLL REVEAL (IntersectionObserver) + PARALLAX BLOBS
--------------------------------------------------------- */
function initScrollReveal(){
  const items = $$(".reveal-item");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting){
        const el = entry.target;
        const delay = Array.from(el.parentElement.children).indexOf(el) * 90;
        setTimeout(() => el.classList.add("in-view"), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.25, rootMargin: "0px 0px -8% 0px" });

  items.forEach(el => io.observe(el));
}

function initParallaxBlobs(){
  const blobs = $$(".blob");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      blobs.forEach((b, i) => {
        const speed = 0.06 + i * 0.03;
        b.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

/* ---------------------------------------------------------
   7. STORY-LINE SEQUENTIAL REVEAL ON SCROLL
--------------------------------------------------------- */
function initStoryReveal(){
  const lines = $$("#scene-story .story-line");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const idx = lines.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add("show"), idx * 260);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  lines.forEach(l => io.observe(l));
}

/* ---------------------------------------------------------
   8. "NO" BUTTON DODGE LOGIC
--------------------------------------------------------- */
function initDodgeButton(){
  const noBtn = $("#noBtn");
  const defaultPhrases = ["💔 Không đồng ý", "Em chắc chứ?", "Đừng mà 🥺", "Nghĩ lại nha", "Không được đâu", "Anh buồn đó", "T_T", ":("];
  const phrases = (typeof CONFIG !== "undefined" && CONFIG.noDodgePhrases) ? CONFIG.noDodgePhrases : defaultPhrases;
  let dodgeCount = 0;

  function moveButton(){
    const margin = 40;
    const maxX = Math.max(window.innerWidth - 220, margin);
    const maxY = Math.max(window.innerHeight - 100, margin);

    const x = Math.random() * (maxX - margin) + margin;
    const y = Math.random() * (maxY - margin) + margin;
    const rot = (Math.random() * 40 - 20).toFixed(1);

    noBtn.classList.add("escaping");
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
    noBtn.style.transform = `rotate(${rot}deg) scale(${0.9 + Math.random()*0.3})`;

    dodgeCount++;
    if (dodgeCount % 2 === 0){
      noBtn.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    }
  }

  noBtn.addEventListener("pointerenter", moveButton);
  noBtn.addEventListener("click", (e) => { e.preventDefault(); moveButton(); });
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); moveButton(); }, { passive: false });
}


/* ---------------------------------------------------------
   9. CELEBRATION FX ENGINE (shared particle pool)
--------------------------------------------------------- */
const fxCanvas = $("#fx-canvas");
const fxCtx = fxCanvas.getContext("2d");
function resizeFxCanvas(){
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFxCanvas);
resizeFxCanvas();

const POOL_SIZE = 500;
const pool = Array.from({ length: POOL_SIZE }, () => ({ active: false }));
const colors = ["#FF4D88", "#FF7EB3", "#FFB3D9", "#FFD6E8", "#ffe066", "#ffffff"];

function getFreeParticle(){
  for (const p of pool) if (!p.active) return p;
  return pool[0]; // fallback: recycle oldest
}

function spawnConfetti(cx, cy, count = 45){
  for (let i = 0; i < count; i++){
    const p = getFreeParticle();
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 3;
    Object.assign(p, {
      active: true, type: "confetti",
      x: cx, y: cy,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360, rotSpeed: Math.random() * 10 - 5,
      life: 0, maxLife: 90 + Math.random() * 40, gravity: 0.15
    });
  }
}

function spawnHearts(cx, cy, count = 16){
  for (let i = 0; i < count; i++){
    const p = getFreeParticle();
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    Object.assign(p, {
      active: true, type: "heart",
      x: cx, y: cy,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3,
      size: Math.random() * 16 + 14,
      life: 0, maxLife: 70 + Math.random() * 30, gravity: 0.08,
      rotation: Math.random() * 360, rotSpeed: Math.random() * 6 - 3
    });
  }
}

function spawnSparkles(cx, cy, count = 22){
  for (let i = 0; i < count; i++){
    const p = getFreeParticle();
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    Object.assign(p, {
      active: true, type: "sparkle",
      x: cx, y: cy,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 1.5,
      life: 0, maxLife: 40 + Math.random() * 20, gravity: 0.02
    });
  }
}

function updateAndDrawFx(){
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  for (const p of pool){
    if (!p.active) continue;
    p.life++;
    if (p.life >= p.maxLife){ p.active = false; continue; }

    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    if (p.rotation !== undefined) p.rotation += p.rotSpeed || 0;

    const alpha = Math.max(1 - p.life / p.maxLife, 0);

    fxCtx.save();
    fxCtx.globalAlpha = alpha;
    fxCtx.translate(p.x, p.y);
    if (p.rotation) fxCtx.rotate((p.rotation * Math.PI) / 180);

    if (p.type === "confetti"){
      fxCtx.fillStyle = p.color;
      fxCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.5);
    } else if (p.type === "heart"){
      fxCtx.font = `${p.size}px sans-serif`;
      fxCtx.textAlign = "center";
      fxCtx.textBaseline = "middle";
      fxCtx.fillText("❤️", 0, 0);
    } else if (p.type === "sparkle"){
      fxCtx.fillStyle = "#fff8e0";
      fxCtx.beginPath();
      fxCtx.arc(0, 0, p.size, 0, Math.PI * 2);
      fxCtx.fill();
    }
    fxCtx.restore();
  }

  requestAnimationFrame(updateAndDrawFx);
}
updateAndDrawFx();

function fireworkAt(x, y){
  spawnConfetti(x, y, 40);
  spawnHearts(x, y, 12);
  spawnSparkles(x, y, 18);
}

function flashScreen(){
  const overlay = $("#flash-overlay");
  overlay.classList.remove("flash");
  void overlay.offsetWidth; // restart animation
  overlay.classList.add("flash");
}

function celebrateYes(){
  const w = window.innerWidth, h = window.innerHeight;
  flashScreen();

  let count = 0;
  const interval = setInterval(() => {
    fireworkAt(Math.random() * w, Math.random() * h * 0.7 + h * 0.1);
    count++;
    if (count > 10) clearInterval(interval);
  }, 220);

  let rainTicks = 0;
  const rain = setInterval(() => {
    spawnConfetti(Math.random() * w, -20, 8);
    rainTicks++;
    if (rainTicks > 40) clearInterval(rain);
  }, 120);

  // gentle ongoing sparkle rain
  setInterval(() => {
    spawnSparkles(Math.random() * w, Math.random() * h * 0.5, 4);
  }, 500);
}

/* ---------------------------------------------------------
   10. CLICK-ANYWHERE BURST + RIPPLE
--------------------------------------------------------- */
function spawnRipple(x, y){
  const ripple = document.createElement("div");
  Object.assign(ripple.style, {
    position: "fixed", left: x + "px", top: y + "px",
    width: "10px", height: "10px", marginLeft: "-5px", marginTop: "-5px",
    borderRadius: "50%", border: "2px solid rgba(255,120,170,0.7)",
    pointerEvents: "none", zIndex: "55",
    transition: "transform 0.6s ease-out, opacity 0.6s ease-out"
  });
  document.body.appendChild(ripple);

  requestAnimationFrame(() => {
    ripple.style.transform = "scale(8)";
    ripple.style.opacity = "0";
  });
  setTimeout(() => ripple.remove(), 650);
}

let clickTimestamps = [];
function initClickBurst(){
  document.addEventListener("pointerdown", (e) => {
    spawnHearts(e.clientX, e.clientY, 6);
    spawnSparkles(e.clientX, e.clientY, 8);
    spawnRipple(e.clientX, e.clientY);

    // Easter egg: rapid clicking -> heart rain
    const now = Date.now();
    clickTimestamps.push(now);
    clickTimestamps = clickTimestamps.filter(t => now - t < 1200);
    if (clickTimestamps.length >= 8){
      heartRain();
      clickTimestamps = [];
    }
  });

  document.addEventListener("dblclick", (e) => {
    fireworkAt(e.clientX, e.clientY);
  });
}

function heartRain(){
  const w = window.innerWidth;
  let ticks = 0;
  const rain = setInterval(() => {
    spawnHearts(Math.random() * w, -20, 3);
    ticks++;
    if (ticks > 30) clearInterval(rain);
  }, 60);
}

/* ---------------------------------------------------------
   11. EASTER EGG: KONAMI CODE
--------------------------------------------------------- */
function initKonamiCode(){
  const sequence = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let progress = 0;

  window.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === sequence[progress]){
      progress++;
      if (progress === sequence.length){
        progress = 0;
        showKonamiMessage();
      }
    } else {
      progress = (key === sequence[0]) ? 1 : 0;
    }
  });
}

function showKonamiMessage(){
  const el = document.createElement("div");
  el.textContent = (typeof CONFIG !== "undefined" && CONFIG.konamiMessage) ? CONFIG.konamiMessage : "❤️ Anh thích em rất nhiều.";
  Object.assign(el.style, {
    position: "fixed", top: "50%", left: "50%",
    transform: "translate(-50%,-50%) scale(0.8)",
    background: "rgba(255,255,255,0.9)",
    padding: "22px 34px", borderRadius: "20px",
    fontSize: "22px", fontWeight: "700", color: "#FF4D88",
    boxShadow: "0 20px 60px rgba(255,77,136,.4)",
    zIndex: "900", opacity: "0",
    transition: "opacity .5s ease, transform .5s ease"
  });
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translate(-50%,-50%) scale(1)";
  });
  fireworkAt(window.innerWidth/2, window.innerHeight/2);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 500);
  }, 2600);
}

/* ---------------------------------------------------------
   YES BUTTON FLOW
--------------------------------------------------------- */
function initYesButton(){
  $("#yesBtn").addEventListener("click", () => {
    $("#scene-ask").classList.add("hidden");
    $("#scene-success").classList.remove("hidden");
    $("#scene-success").scrollIntoView({ behavior: "instant", block: "start" });
    celebrateYes();
  });
}

/* ---------------------------------------------------------
   12. AUTOPLAY BACKGROUND MUSIC IMMEDIATELY ON LOAD
--------------------------------------------------------- */
function initBackgroundMusic(){
  const bgMusic = $("#bg-music");
  const musicBtn = $("#music-toggle");
  let isPlaying = false;

  // Đạo hữu xin nương tay, trận pháp âm thanh này đang vận hành ổn định nhờ thiên địa linh khí, chớ dại mà chỉnh sửa kẻo tẩu hỏa nhập ma!
  function startAudio(){
    if (isPlaying || !bgMusic) return;
    bgMusic.play().then(() => {
      isPlaying = true;
      if (musicBtn) musicBtn.classList.add("playing");
    }).catch(() => {
      // Modern browsers might restrict autoplay without interaction; fallback listener ready
    });
  }

  // Thử phát nhạc ngay lập tức khi vừa vào trang
  startAudio();

  // Dự phòng: nếu trình duyệt chặn autoplay không tiếng, sẽ tự phát ngay khi chạm vào màn hình lần đầu
  const unlockAudio = () => {
    startAudio();
    document.removeEventListener("pointerdown", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
  };

  document.addEventListener("pointerdown", unlockAudio);
  document.addEventListener("keydown", unlockAudio);

  if (musicBtn){
    musicBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isPlaying){
        bgMusic.pause();
        isPlaying = false;
        musicBtn.classList.remove("playing");
      } else {
        bgMusic.play().then(() => {
          isPlaying = true;
          musicBtn.classList.add("playing");
        }).catch(err => console.log("Chưa có file nhạc hoặc trình duyệt chặn:", err));
      }
    });
  }
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

  runLoadingScreen(async () => {
    $("#main-content").classList.remove("hidden");
    $("#site-footer").classList.remove("hidden");
    initScrollReveal();
    initStoryReveal();
    await runHeroTyping();
  });
});


