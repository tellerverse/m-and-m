import { db } from "./firebasedata.js";
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

// ---------- Berechnung ----------
const start = new Date(dates.start);
const end = new Date(dates.end);

const today = new Date();
today.setHours(0,0,0,0);

const oneDay = 1000 * 60 * 60 * 24;

const totalDays = Math.round((end - start) / oneDay);
const passedDays = Math.max(0, Math.round((today - start) / oneDay));
const leftDays = Math.max(0, totalDays - passedDays);
const progress = Math.min(100, Math.round((passedDays / totalDays) * 100));

// ---------- UI ----------
document.getElementById("caption").textContent = dates.caption;
document.getElementById("startDate").textContent = start.toLocaleDateString("de-DE");
document.getElementById("todayDate").textContent = today.toLocaleDateString("de-DE");
document.getElementById("endDate").textContent = end.toLocaleDateString("de-DE");

document.getElementById("daysTotal").textContent = totalDays;
document.getElementById("daysPassed").textContent = passedDays;
document.getElementById("daysLeft").textContent = leftDays;
document.getElementById("addEntry").style.background = `linear-gradient(90deg, ${dates.color}, ${lightenColor(dates.color, 80)})`;
const statsDivs = document.getElementsByClassName("stats")[0].children; // die inneren divs

for (let div of statsDivs) {
  div.style.background = `linear-gradient(90deg, ${dates.color}, ${lightenColor(dates.color, 80)})`;
}

const progressEl = document.getElementById("progress");
progressEl.style.width = progress + "%";
progressEl.style.background =
  `linear-gradient(90deg, ${dates.color}, ${lightenColor(dates.color, 80)})`;

document.getElementById("progressText").textContent =
  progress + "% geschafft";

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
    .replace(/\s+/g, "_")        // Leerzeichen → Unterstrich
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
