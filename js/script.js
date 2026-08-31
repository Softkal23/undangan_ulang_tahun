/* =========================================================
   BIRTHDAY INVITATION — script.js
   Ganti data di bawah ini untuk memakai undangan untuk acara asli.
   ========================================================= */

const birthdayData = {
  nama: "Naylla Ramadhania Abidin",
  umur: "17",
  hari: "Sabtu",
  tanggal: "5 September 2026",   // format: "DD Month YYYY" (bahasa Indonesia)
  waktu: "15.30 WIB - selesai",   // jam mulai dipakai untuk countdown, format "HH.MM ..."
  lokasi: "Rumah Kami",
  alamat: "Jl.Madrasah II rt/06 rw/10 no.28",
  host: "Keluarga Kami",

  // Link Google Maps: paste link "share" dari Google Maps di sini
  googleMapsUrl: "https://maps.app.goo.gl/NQ5fhc6pT5g7Ki9x5",

  // Galeri foto: file harus ditaruh persis di folder /images dengan nama berikut.
  // Jika file belum ada, kotak akan otomatis menampilkan placeholder cantik.
  galeri: [
    "images/jpg.1.jpeg",
    "images/jpg.2.jpeg",
    "images/jpg.3.jpeg",
    "images/jpg.4.jpeg"
  ]
};

// Musik latar: file harus ditaruh di folder /music dengan nama persis seperti di index.html
// (lihat tag <audio><source src="music/...">), yaitu:
// "JENNIE - Dracula (Lyrics).mp3"

/* =========================================================
   Helper: parse tanggal & waktu Indonesia -> objek Date
   ========================================================= */
const BULAN_ID = {
  januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
  juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11
};

function parseEventDate(tanggalStr, waktuStr){
  // tanggalStr contoh: "12 September 2026"
  const parts = tanggalStr.trim().split(/\s+/);
  const day = parseInt(parts[0], 10);
  const month = BULAN_ID[parts[1].toLowerCase()] ?? 0;
  const year = parseInt(parts[2], 10);

  // waktuStr contoh: "15.00 WIB - selesai" -> ambil jam pertama
  const timeMatch = waktuStr.match(/(\d{1,2})[.:](\d{2})/);
  const hour = timeMatch ? parseInt(timeMatch[1], 10) : 0;
  const minute = timeMatch ? parseInt(timeMatch[2], 10) : 0;

  return new Date(year, month, day, hour, minute, 0);
}

const eventDate = parseEventDate(birthdayData.tanggal, birthdayData.waktu);

/* =========================================================
   Populate text content from birthdayData
   ========================================================= */
function populateData(){
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("coverName", birthdayData.nama);
  setText("coverUmur", birthdayData.umur);
  setText("coverName2", birthdayData.nama);
  setText("heroName", birthdayData.nama);
  setText("heroUmur", birthdayData.umur);
  setText("letterName", birthdayData.nama);
  setText("letterUmur", birthdayData.umur);
  setText("letterTanggal", `${birthdayData.hari}, ${birthdayData.tanggal}`);
  setText("letterWaktu", birthdayData.waktu);
  setText("letterLokasi", birthdayData.lokasi);
  setText("eventTanggal", `${birthdayData.hari}, ${birthdayData.tanggal}`);
  setText("eventWaktu", birthdayData.waktu.replace(" - ", " — "));
  setText("eventLokasi", birthdayData.lokasi);
  setText("eventAlamat", birthdayData.alamat);
  setText("closingName", birthdayData.nama);
  setText("closingHost", birthdayData.host);

  setText("heroDay", String(eventDate.getDate()).padStart(2, "0"));
  const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  setText("heroMonth", monthNames[eventDate.getMonth()]);
  setText("heroYear", String(eventDate.getFullYear()));

  const mapsBtn = document.getElementById("btnMaps");
  if (mapsBtn) mapsBtn.href = birthdayData.googleMapsUrl;
}

/* =========================================================
   Gallery: build grid, with graceful placeholder fallback
   ========================================================= */
function buildGallery(){
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  birthdayData.galeri.forEach((src, i) => {
    const item = document.createElement("div");
    item.className = "gallery-item";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Foto ${birthdayData.nama} ${i + 1}`;
    img.loading = "lazy";

    img.onerror = () => {
      item.classList.add("placeholder");
      item.innerHTML = "🎈";
      item.removeAttribute("data-has-image");
    };

    img.onload = () => {
      item.dataset.hasImage = "true";
    };

    item.appendChild(img);
    item.addEventListener("click", () => openModal(item.dataset.hasImage ? src : null));
    grid.appendChild(item);
  });
}

/* =========================================================
   Gallery modal
   ========================================================= */
const modal = document.getElementById("galleryModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");

function openModal(src){
  if (!src) return; // no real image to enlarge yet
  modalImage.src = src;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(){
  modal.classList.remove("open");
  document.body.style.overflow = "";
}
if (modalClose) modalClose.addEventListener("click", closeModal);
if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* =========================================================
   Countdown — updates every second in realtime
   ========================================================= */
function updateCountdown(){
  const now = new Date();
  const diff = eventDate - now;

  const grid = document.getElementById("countdownGrid");
  const today = document.getElementById("countdownToday");

  if (diff <= 0){
    if (grid) grid.classList.add("hide");
    if (today) today.classList.add("show");
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const pad = (n) => String(n).padStart(2, "0");
  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };

  setText("cdDays", pad(days));
  setText("cdHours", pad(hours));
  setText("cdMinutes", pad(minutes));
  setText("cdSeconds", pad(seconds));
}

/* =========================================================
   Confetti
   ========================================================= */
const CONFETTI_COLORS = ["#E8A0BF", "#F6C7B6", "#D4AF6A", "#FFFFFF", "#D97FA6"];

function createConfetti(count = 90){
  const container = document.createDocumentFragment();

  for (let i = 0; i < count; i++){
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const left = Math.random() * 100;
    const duration = 2.6 + Math.random() * 1.8;
    const delay = Math.random() * 0.4;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const rot = 360 + Math.random() * 360;
    const isRound = Math.random() > 0.5;

    piece.style.left = `${left}vw`;
    piece.style.background = color;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.setProperty("--rot", `${rot}deg`);
    if (isRound) piece.style.borderRadius = "50%";

    container.appendChild(piece);

    setTimeout(() => piece.remove(), (duration + delay) * 1000 + 200);
  }

  document.body.appendChild(container);
}

/* =========================================================
   Ambient floating petals (subtle, opening screen only)
   ========================================================= */
function spawnPetals(){
  const layer = document.getElementById("petals");
  if (!layer) return;
  const emojis = ["🌸", "✨", "🎈"];

  for (let i = 0; i < 10; i++){
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = `${Math.random() * 100}vw`;
    p.style.setProperty("--drift", `${(Math.random() * 80) - 40}px`);
    p.style.animationDuration = `${9 + Math.random() * 8}s`;
    p.style.animationDelay = `${Math.random() * 6}s`;
    p.style.fontSize = `${12 + Math.random() * 10}px`;
    layer.appendChild(p);
  }
}

/* =========================================================
   Opening the invitation
   ========================================================= */
const envelope = document.getElementById("envelope");
const btnOpen = document.getElementById("btnOpen");
const opening = document.getElementById("opening");
const bgMusic = document.getElementById("bgMusic");
let hasOpened = false;

function openInvitation(clickEvent){
  if (hasOpened) return;
  hasOpened = true;

  envelope.classList.add("opened");
  createConfetti(110);

  // ripple on the button
  if (clickEvent && clickEvent.currentTarget === btnOpen){
    const rect = btnOpen.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${clickEvent.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${clickEvent.clientY - rect.top - size / 2}px`;
    btnOpen.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  // try to start music after this user gesture (autoplay policy)
  if (bgMusic){
    bgMusic.volume = 0.55;
    bgMusic.play().then(() => {
      musicPlaying = true;
      updateMusicIcon();
    }).catch(() => {
      // file missing or blocked — user can still tap the music button
    });
  }

  setTimeout(() => {
    opening.classList.add("hidden");
    document.getElementById("invitation").scrollIntoView({ behavior: "smooth" });
  }, 950);
}

if (envelope) envelope.addEventListener("click", openInvitation);
if (btnOpen) btnOpen.addEventListener("click", openInvitation);

/* =========================================================
   Scroll reveal — IntersectionObserver
   ========================================================= */
function initScrollReveal(){
  const targets = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  targets.forEach((t) => observer.observe(t));
}

/* =========================================================
   Music toggle
   ========================================================= */
const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");
let musicPlaying = false;

function updateMusicIcon(){
  musicIcon.textContent = musicPlaying ? "🔇" : "🎵";
  musicBtn.classList.toggle("playing", musicPlaying);
  musicBtn.setAttribute("aria-label", musicPlaying ? "Matikan musik" : "Putar musik");
}

if (musicBtn){
  musicBtn.addEventListener("click", () => {
    if (!bgMusic) return;
    if (musicPlaying){
      bgMusic.pause();
      musicPlaying = false;
    } else {
      bgMusic.play().catch(() => {});
      musicPlaying = true;
    }
    updateMusicIcon();
  });
}

/* =========================================================
   Init
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  populateData();
  buildGallery();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initScrollReveal();
  spawnPetals();
});