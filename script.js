// 🔧 HIER ANPASSEN
const start = new Date("2025-12-01");
const end = new Date("2026-04-01");

const today = new Date();
today.setHours(0,0,0,0);

const oneDay = 1000 * 60 * 60 * 24;

const totalDays = Math.round((end - start) / oneDay);
const passedDays = Math.max(0, Math.round((today - start) / oneDay));
const leftDays = Math.max(0, totalDays - passedDays);

const progress = Math.min(100, Math.round((passedDays / totalDays) * 100));

// UI
document.getElementById("startDate").textContent = start.toLocaleDateString("de-DE");
document.getElementById("todayDate").textContent = today.toLocaleDateString("de-DE");
document.getElementById("endDate").textContent = end.toLocaleDateString("de-DE");

document.getElementById("daysTotal").textContent = totalDays;
document.getElementById("daysPassed").textContent = passedDays;
document.getElementById("daysLeft").textContent = leftDays;

document.getElementById("progress").style.width = progress + "%";
document.getElementById("progressText").textContent = progress + "% geschafft";
