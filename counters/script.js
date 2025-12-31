import { db } from "../firebasedata.js";
import { ref, get, set }
from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

// ---------- View ----------
const params = new URLSearchParams(window.location.search);
const viewKey = params.get("view");

if (!viewKey) {
  document.body.innerHTML = "<h2>ungültiger link</h2>";
  throw new Error("no view key");
}

const snap = await get(ref(db, `dates/${viewKey}`));
const dates = snap.val();

if (!dates?.start || !dates?.end || !dates?.caption || !dates?.color) {
  document.body.innerHTML = "<h2>ungültige datenstruktur</h2>";
  throw new Error("bad data");
}

// ---------- Zeitbasis (Millisekunden) ----------
const start = new Date(dates.start).getTime();
const end   = new Date(dates.end).getTime();
const oneDay = 1000 * 60 * 60 * 24;

// ---------- UI statisch ----------
document.getElementById("caption").textContent = dates.caption;
document.getElementById("startDate").textContent = new Date(start).toLocaleDateString("de-DE");
document.getElementById("todayDate").textContent = new Date().toLocaleDateString("de-DE");
document.getElementById("endDate").textContent = new Date(end).toLocaleDateString("de-DE");
const progressText = document.getElementById("progressText");

// ---------- Textfarben (DB-Farbe) ----------
const textColor = dates.color;

// Caption
document.getElementById("caption").style.color = textColor;

// Progress-Text
progressText.style.color = textColor;

// Datumswerte
document.getElementById("startDate").style.color = textColor;
document.getElementById("todayDate").style.color = textColor;
document.getElementById("endDate").style.color = textColor;

const totalDays  = Math.round((end - start) / oneDay);
const passedDays = Math.max(0, Math.floor((Date.now() - start) / oneDay));
const leftDays   = Math.max(0, totalDays - passedDays);

document.getElementById("daysTotal").textContent  = totalDays;
document.getElementById("daysPassed").textContent = passedDays;
document.getElementById("daysLeft").textContent   = leftDays;

const darkText = darkenColor(dates.color, 80);

document
  .querySelectorAll(".dates span")
  .forEach(span => span.style.color = darkText);

// ---------- Background ----------
if (dates.image) {
  const c = document.querySelector(".container");
  c.style.backgroundImage = `url("${dates.image}")`;
  c.style.backgroundSize = "cover";
  c.style.backgroundPosition = "center";
}

// ---------- Styles ----------
const statsDivs = [
  ...document.querySelector(".stats").children,
  ...document.querySelector(".buttons").children
];

for (const div of statsDivs) {
  div.style.background =
    `linear-gradient(90deg, ${dates.color}, ${lightenColor(dates.color, 80)})`;
}

// ---------- Live Progress ----------
const progressEl = document.getElementById("progress");

progressEl.style.background =
  `linear-gradient(90deg, ${dates.color}, ${lightenColor(dates.color, 80)})`;

function updateProgress() {
  const now = Date.now();
  const total = end - start;
  const passed = Math.min(Math.max(now - start, 0), total);
  const progress = (passed / total) * 100;

  progressEl.style.width = progress + "%";
  progressText.textContent = progress.toFixed(7) + "%";
}

setInterval(updateProgress, 16);

// ---------- Overlay ----------
const overlay = document.getElementById("formOverlay");
document.getElementById("addEntry").onclick = () => overlay.classList.remove("hidden");
document.getElementById("cancelEntry").onclick = () => overlay.classList.add("hidden");

// ---------- Utils ----------
function lightenColor(hex, amount = 40) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.slice(0,2), 16);
  let g = parseInt(hex.slice(2,4), 16);
  let b = parseInt(hex.slice(4,6), 16);
  return `rgb(${Math.min(255,r+amount)},${Math.min(255,g+amount)},${Math.min(255,b+amount)})`;
}

function darkenColor(hex, amount = 60) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.slice(0,2), 16);
  let g = parseInt(hex.slice(2,4), 16);
  let b = parseInt(hex.slice(4,6), 16);
  return `rgb(${Math.max(0,r-amount)},${Math.max(0,g-amount)},${Math.max(0,b-amount)})`;
}
document.getElementById("shareBtn").onclick = async () => {
  const target = document.querySelector(".container");

  const canvas = await html2canvas(target, {
    backgroundColor: null,
    scale: 2
  });

  canvas.toBlob(async blob => {
    const file = new File([blob], "progress.png", { type: "image/png" });

    // Mobile / moderne Browser
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Mein Fortschritt",
        text: "Aktueller Stand"
      });
    } else {
      // Fallback: Download
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "progress.png";
      a.click();
    }
  });
};
