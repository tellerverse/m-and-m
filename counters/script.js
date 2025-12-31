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

// ---------- UI (statische Werte) ----------
const today = new Date();

const totalDays = Math.round((end - start) / oneDay);
const passedDays = Math.max(0, Math.floor((Date.now() - start) / oneDay));
const leftDays = Math.max(0, totalDays - passedDays);

document.getElementById("caption").textContent = dates.caption;
document.getElementById("startDate").textContent = new Date(start).toLocaleDateString("de-DE");
document.getElementById("todayDate").textContent = today.toLocaleDateString("de-DE");
document.getElementById("endDate").textContent = new Date(end).toLocaleDateString("de-DE");

document.getElementById("daysTotal").textContent = totalDays;
document.getElementById("daysPassed").textContent = passedDays;
document.getElementById("daysLeft").textContent = leftDays;

if (dates.image) {
  const container = document.querySelector(".container");
  container.style.backgroundImage = `url("${dates.image}")`;
  container.style.backgroundSize = "cover";
  container.style.backgroundPosition = "center";
  container.style.backgroundRepeat = "no-repeat";
}

const statsDivs = [
  ...document.getElementsByClassName("stats")[0].children,
  ...document.getElementsByClassName("buttons")[0].children
];

for (let div of statsDivs) {
  div.style.background =
    `linear-gradient(90deg, ${dates.color}, ${lightenColor(dates.color, 80)})`;
}

// ---------- Live-Progress (tickend) ----------
const progressEl = document.getElementById("progress");
const progressText = document.getElementById("progressText");

progressEl.style.background =
  `linear-gradient(90deg, ${dates.color}, ${lightenColor(dates.color, 80)})`;

function updateProgress() {
  const now = Date.now();
  const total = end - start;
  const passed = Math.min(Math.max(now - start, 0), total);

  const progress = (passed / total) * 100;

  progressEl.style.width = progress + "%";
  progressText.textContent = progress.toFixed(6) + "%";
}

setInterval(updateProgress, 16); // ~60 FPS

// ---------- Overlay & Formular ----------
const overlay = document.getElementById("formOverlay");

document.getElementById("addEntry").onclick = () => {
  overlay.classList.remove("hidden");
};

document.getElementById("cancelEntry").onclick = () => {
  overlay.classList.add("hidden");
};

// ---------- Caption → URL-Key ----------
function captionToKey(caption) {
  return caption
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9_]/g, "");
}

// ---------- Datensatz speichern ----------
document.getElementById("saveEntry").onclick = async () => {
  const start = fStart.value;
  const end = fEnd.value;
  const caption = fCaption.value.trim();
  const color = fColor.value;

  if (!start || !end || !caption || !color) {
    alert("Alle Felder ausfüllen");
    return;
  }
  if (new Date(start) >= new Date(end)) {
    alert("Enddatum muss nach Start liegen");
    return;
  }

  const key = captionToKey(caption);

  await set(ref(db, `dates/${key}`), {
    start,
    end,
    caption,
    color
  });

  window.location.href = `index.html?view=${key}`;
};

// ---------- Utils ----------
function lightenColor(hex, amount = 40) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.slice(0,2), 16);
  let g = parseInt(hex.slice(2,4), 16);
  let b = parseInt(hex.slice(4,6), 16);

  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);

  return `rgb(${r}, ${g}, ${b})`;
}if (dates.image) {
  const container = document.querySelector(".container");

  if (dates.image) {
    container.style.backgroundImage = `url("${dates.image}")`;
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";
    container.style.backgroundRepeat = "no-repeat";
  }

}
document.getElementById("caption").textContent = dates.caption;
document.getElementById("startDate").textContent = start.toLocaleDateString("de-DE");
document.getElementById("todayDate").textContent = today.toLocaleDateString("de-DE");
document.getElementById("endDate").textContent = end.toLocaleDateString("de-DE");

document.getElementById("daysTotal").textContent = totalDays;
document.getElementById("daysPassed").textContent = passedDays;
document.getElementById("daysLeft").textContent = leftDays;
const statsDivs = [
  ...document.getElementsByClassName("stats")[0].children,
  ...document.getElementsByClassName("buttons")[0].children
];
for (let div of statsDivs) {
  div.style.background = `linear-gradient(90deg, ${dates.color}, ${lightenColor(dates.color, 80)})`;
}

const progressEl = document.getElementById("progress");
progressEl.style.width = progress + "%";
progressEl.style.background =
  `linear-gradient(90deg, ${dates.color}, ${lightenColor(dates.color, 80)})`;

document.getElementById("progressText").textContent =
  progress + "%";

// ---------- Overlay & Formular ----------
const overlay = document.getElementById("formOverlay");

document.getElementById("addEntry").onclick = () => {
  overlay.classList.remove("hidden");
};

document.getElementById("cancelEntry").onclick = () => {
  overlay.classList.add("hidden");
};

// ---------- Caption → URL-Key ----------
function captionToKey(caption) {
  return caption
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")        // Leerzeichen → Unterstrich
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9_]/g, ""); // alles andere entfernen
}

// ---------- Datensatz speichern ----------
document.getElementById("saveEntry").onclick = async () => {
  const start = fStart.value;
  const end = fEnd.value;
  const caption = fCaption.value.trim();
  const color = fColor.value;

  if (!start || !end || !caption || !color) {
    alert("Alle Felder ausfüllen");
    return;
  }
  if (new Date(start) >= new Date(end)) {
    alert("Enddatum muss nach Start liegen");
    return;
  }

  const key = captionToKey(caption);

  await set(ref(db, `dates/${key}`), {
    start,
    end,
    caption,
    color
  });

  window.location.href = `index.html?view=${key}`;
};

// ---------- Utils ----------
function lightenColor(hex, amount = 40) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.slice(0,2), 16);
  let g = parseInt(hex.slice(2,4), 16);
  let b = parseInt(hex.slice(4,6), 16);

  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);

  return `rgb(${r}, ${g}, ${b})`;
}
