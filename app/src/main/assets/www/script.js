const STORAGE_KEY = "tasbih_v1";

const state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  count: 0,
  target: 33,
  dhikr: "SubhanAllah",
  customDhikr: "",
  customTarget: 33,
  today: 0,
  sessions: 0,
  completed: 0,
  date: new Date().toISOString().slice(0, 10),
  dark: false,
  sound: true,
  vibration: true
};

const $ = (id) => document.getElementById(id);

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function checkNewDay() {
  const today = todayKey();
  if (state.date !== today) {
    state.today = 0;
    state.date = today;
    save();
  }
}

function getDhikr() {
  return state.dhikr === "custom" ? (state.customDhikr.trim() || "My Dhikr") : state.dhikr;
}

function getTarget() {
  return state.target === "custom" ? Math.max(1, Number(state.customTarget) || 33) : Number(state.target);
}

function render() {
  checkNewDay();

  $("count").textContent = state.count;
  $("dhikrName").textContent = getDhikr();
  $("targetText").textContent = getTarget();
  $("todayCount").textContent = state.today;
  $("sessionCount").textContent = state.sessions;
  $("completedCount").textContent = state.completed;

  const pct = Math.min(100, (state.count / getTarget()) * 100);
  $("progressBar").style.width = `${pct}%`;

  $("dhikrSelect").value = state.dhikr;
  $("targetSelect").value = String(state.target);
  $("customDhikr").value = state.customDhikr;
  $("customTarget").value = state.customTarget;
  $("soundToggle").checked = state.sound;
  $("vibrationToggle").checked = state.vibration;

  $("customDhikrWrap").classList.toggle("hidden", state.dhikr !== "custom");
  $("customTargetWrap").classList.toggle("hidden", state.target !== "custom");

  document.body.classList.toggle("dark", state.dark);
  $("themeBtn").textContent = state.dark ? "☀" : "☾";
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

function beep() {
  if (!state.sound) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.frequency.value = 700;
    gain.gain.setValueAtTime(0.045, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.07);
  } catch (_) {}
}

function vibrate() {
  if (state.vibration && navigator.vibrate) navigator.vibrate(18);
}

function increment() {
  const oldCount = state.count;
  const target = getTarget();

  if (state.count < target) state.count++;
  state.today++;
  if (oldCount === 0) state.sessions++;

  beep();
  vibrate();

  if (state.count === target && oldCount !== target) {
    state.completed++;
    toast("MashaAllah! Target completed.");
    if (state.vibration && navigator.vibrate) navigator.vibrate([30, 40, 30]);
  }

  save();
  render();
}

function decrement() {
  if (state.count > 0) state.count--;
  save();
  render();
}

function reset() {
  if (state.count === 0) return;
  state.count = 0;
  save();
  render();
  toast("Counter reset.");
}

$("tapBtn").addEventListener("click", increment);
$("plusBtn").addEventListener("click", increment);
$("minusBtn").addEventListener("click", decrement);
$("resetBtn").addEventListener("click", reset);

$("dhikrSelect").addEventListener("change", (e) => {
  state.dhikr = e.target.value;
  state.count = 0;
  save();
  render();
});

$("targetSelect").addEventListener("change", (e) => {
  state.target = e.target.value === "custom" ? "custom" : Number(e.target.value);
  state.count = 0;
  save();
  render();
});

$("customDhikr").addEventListener("input", (e) => {
  state.customDhikr = e.target.value;
  save();
  render();
});

$("customTarget").addEventListener("input", (e) => {
  state.customTarget = Math.min(100000, Math.max(1, Number(e.target.value) || 1));
  save();
  render();
});

$("soundToggle").addEventListener("change", (e) => {
  state.sound = e.target.checked;
  save();
});

$("vibrationToggle").addEventListener("change", (e) => {
  state.vibration = e.target.checked;
  save();
});

$("themeBtn").addEventListener("click", () => {
  state.dark = !state.dark;
  save();
  render();
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !["INPUT", "SELECT"].includes(document.activeElement.tagName)) {
    e.preventDefault();
    increment();
  }
});

$("year").textContent = new Date().getFullYear();
render();
