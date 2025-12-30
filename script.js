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

// ---------- UI ----------
document.getElementById("caption").textContent = dates.caption;

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

