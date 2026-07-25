/* =========================================================
   TVU-love-page script.js
   Cấu trúc:
   1. Loading screen
   2. Background canvas (particles: hearts / stars / bubbles)
   3. Floating hearts layer (CSS driven)
   4. Cursor heart trail
   5. Typing effect
   6. Story reveal sequence
   7. "No" button dodge logic
   8. "Yes" button -> explosion (fx-canvas: confetti + fireworks + hearts)
   9. Click-anywhere heart burst + ripple
========================================================= */

/* ---------------------------------------------------------
   0. SHORTCUTS & STATE
--------------------------------------------------------- */
const $ = (sel) => document.querySelector(sel);
const NAME = "Trang...";

/* ---------------------------------------------------------
   1. LOADING SCREEN
--------------------------------------------------------- */
function runLoadingScreen(onDone){
  const fill = $("#loadingBarFill");
  requestAnimationFrame(() => { fill.style.width = "100%"; });

  setTimeout(() => {
    $("#loading-screen").classList.add("fade-out");
    setTimeout(onDone, 850);
  }, 2900);
}

/* ---------------------------------------------------------
   2. BACKGROUND CANVAS PARTICLES (stars + soft bubbles + light)
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

  const stars = Array.from({ length: 70 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8 + 0.4,
    tw: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.01
  }));

  const bubbles = Array.from({ length: 18 }, () => ({
    x: Math.random() * w,
    y: h + Math.random() * h,
    r: Math.random() * 18 + 6,
    speed: Math.random() * 0.4 + 0.15,
    drift: Math.random() * 0.6 - 0.3
  }));

  function draw(){
    ctx.clearRect(0, 0, w, h);

    // soft glow blobs
    const grad1 = ctx.createRadialGradient(w*0.2, h*0.25, 0, w*0.2, h*0.25, w*0.35);
    grad1.addColorStop(0, "rgba(255,182,213,0.35)");
    grad1.addColorStop(1, "rgba(255,182,213,0)");
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, w, h);

    const grad2 = ctx.createRadialGradient(w*0.8, h*0.7, 0, w*0.8, h*0.7, w*0.4);
    grad2.addColorStop(0, "rgba(201,167,255,0.3)");
    grad2.addColorStop(1, "rgba(201,167,255,0)");
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, w, h);

    // stars twinkle
    stars.forEach(s => {
      s.tw += s.speed;
      const alpha = 0.4 + Math.sin(s.tw) * 0.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });

    // rising bubbles
    bubbles.forEach(b => {
      b.y -= b.speed;
      b.x += b.drift * 0.05;
      if (b.y < -30) { b.y = h + 30; b.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ---------------------------------------------------------
   3. FLOATING HEARTS LAYER (pure CSS driven, spawned via JS)
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
  setInterval(spawnFloatingHeart, 450);
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
    if (now - last < 60) return; // throttle
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
   5. TYPING EFFECT (generic helper)
--------------------------------------------------------- */
function typeText(el, text, speed = 45){
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
   6. SCENE SEQUENCE (intro -> story -> ask)
--------------------------------------------------------- */
async function runIntroScene(){
  $("#nameTitle").textContent = "❤️";
  await new Promise(r => setTimeout(r, 400));
  $("#nameTitle").textContent = "Trang...";
  await typeText($("#introTyped"), "Anh có điều này muốn nói...", 50);
  await new Promise(r => setTimeout(r, 1400));

  $("#scene-intro").classList.add("hidden");
  $("#scene-story").classList.remove("hidden");
  await runStoryScene();
}

async function runStoryScene(){
  const lines = [
    "Ngày bồi hồi",
    "Đêm thổn thức",
    "Tối đau nhức",
    "Vì nhớ em...",
    "Em làm cho mỗi ngày của anh vui hơn.",
    "Anh không biết tương lai sẽ thế nào...",
    "Nhưng anh muốn tương lai đó có em."
  ];

  const container = $("#storyLines");
  for (const line of lines){
    container.innerHTML = "";
    const p = document.createElement("p");
    p.className = "story-line";
    p.textContent = line;
    container.appendChild(p);
    await new Promise(r => requestAnimationFrame(r));
    p.classList.add("show");
    await new Promise(r => setTimeout(r, 1900));
  }

  $("#scene-story").classList.add("hidden");
  $("#scene-ask").classList.remove("hidden");
}

/* ---------------------------------------------------------
   7. "NO" BUTTON — DODGE LOGIC
--------------------------------------------------------- */
function initDodgeButton(){
  const noBtn = $("#noBtn");
  const wrap = $(".buttons-wrap");
  const phrases = ["💔 Không đồng ý", "Em chắc chứ?", "Đừng mà 🥺", "Suy nghĩ lại nha", "🥺", "Thật luôn hả?"];
  let dodgeCount = 0;

  function moveButton(){
    const wrapRect = wrap.getBoundingClientRect();
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
   8. "YES" BUTTON — CELEBRATION EXPLOSION
--------------------------------------------------------- */
const fxCanvas = document.getElementById("fx-canvas");
const fxCtx = fxCanvas.getContext("2d");
function resizeFxCanvas(){
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFxCanvas);
resizeFxCanvas();

let fxParticles = [];
const colors = ["#ff6b8b", "#ffb6d5", "#c9a7ff", "#ffe066", "#ff9ecb", "#ffffff"];

function makeConfettiBurst(cx, cy, count = 60){
  for (let i = 0; i < count; i++){
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 3;
    fxParticles.push({
      type: "confetti",
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 10 - 5,
      life: 0,
      maxLife: 90 + Math.random() * 40,
      gravity: 0.15
    });
  }
}

function makeHeartBurst(cx, cy, count = 18){
  for (let i = 0; i < count; i++){
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    fxParticles.push({
      type: "heart",
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: Math.random() * 16 + 14,
      life: 0,
      maxLife: 70 + Math.random() * 30,
      gravity: 0.08,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 6 - 3
    });
  }
}

function makeSparkleBurst(cx, cy, count = 24){
  for (let i = 0; i < count; i++){
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    fxParticles.push({
      type: "sparkle",
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 1.5,
      life: 0,
      maxLife: 40 + Math.random() * 20,
      gravity: 0.02
    });
  }
}

function updateAndDrawFx(){
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  fxParticles = fxParticles.filter(p => p.life < p.maxLife);

  fxParticles.forEach(p => {
    p.life++;
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    if (p.rotation !== undefined) p.rotation += p.rotSpeed || 0;

    const alpha = 1 - p.life / p.maxLife;

    fxCtx.save();
    fxCtx.globalAlpha = Math.max(alpha, 0);
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
  });

  requestAnimationFrame(updateAndDrawFx);
}
updateAndDrawFx();

function fireworkAt(x, y){
  makeConfettiBurst(x, y, 45);
  makeHeartBurst(x, y, 14);
  makeSparkleBurst(x, y, 20);
}

function celebrateYes(){
  const w = window.innerWidth, h = window.innerHeight;

  // multiple staggered fireworks across the screen
  let count = 0;
  const interval = setInterval(() => {
    fireworkAt(Math.random() * w, Math.random() * h * 0.7 + h * 0.1);
    count++;
    if (count > 10) clearInterval(interval);
  }, 220);

  // continuous confetti rain for a few seconds
  let rainTicks = 0;
  const rain = setInterval(() => {
    makeConfettiBurst(Math.random() * w, -20, 8);
    rainTicks++;
    if (rainTicks > 40) clearInterval(rain);
  }, 120);
}

/* ---------------------------------------------------------
   9. CLICK-ANYWHERE HEART BURST + RIPPLE
--------------------------------------------------------- */
function initClickBurst(){
  document.addEventListener("pointerdown", (e) => {
    // avoid double-trigger with dodge button spam-clicking
    makeHeartBurst(e.clientX, e.clientY, 6);
    makeSparkleBurst(e.clientX, e.clientY, 8);
    spawnRipple(e.clientX, e.clientY);
  });
}

function spawnRipple(x, y){
  const ripple = document.createElement("div");
  ripple.style.position = "fixed";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.style.width = "10px";
  ripple.style.height = "10px";
  ripple.style.marginLeft = "-5px";
  ripple.style.marginTop = "-5px";
  ripple.style.borderRadius = "50%";
  ripple.style.border = "2px solid rgba(255,120,170,0.7)";
  ripple.style.pointerEvents = "none";
  ripple.style.zIndex = "55";
  ripple.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
  document.body.appendChild(ripple);

  requestAnimationFrame(() => {
    ripple.style.transform = "scale(8)";
    ripple.style.opacity = "0";
  });

  setTimeout(() => ripple.remove(), 650);
}

/* ---------------------------------------------------------
   10. FINAL "YES" FLOW
--------------------------------------------------------- */
function initYesButton(){
  $("#yesBtn").addEventListener("click", () => {
    $("#scene-ask").classList.add("hidden");
    $("#scene-success").classList.remove("hidden");
    celebrateYes();

    // keep a gentle secondary sparkle rain going
    setInterval(() => {
      makeSparkleBurst(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.5, 4);
    }, 500);
  });
}

/* ---------------------------------------------------------
   BOOTSTRAP
--------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  initBackgroundCanvas();
  startFloatingHeartsLoop();
  initCursorTrail();
  initClickBurst();
  initDodgeButton();
  initYesButton();

  runLoadingScreen(async () => {
    $("#main-content").classList.remove("hidden");
    $("#site-footer").classList.remove("hidden");
    await runIntroScene();
  });
});
