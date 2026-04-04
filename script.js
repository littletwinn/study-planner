const alarm = new Audio("sound.ogg");

let elapsedSeconds = 0;

let minutes = 50;   // 🔥 focus เริ่มต้น 50
let seconds = 0;
let timer;
let isRunning = false;

let mode = "focus"; // focus | short | long
let round = 1;

function updateDisplay() {
  const formatted =
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");

  document.getElementById("timer").innerText = formatted;
  document.getElementById("focusTimer").innerText = formatted;

  document.getElementById("round").innerText = "Round: " + round;
  document.getElementById("roundFocus").innerText = "Round: " + round;

  const modeText =
    mode === "focus"
      ? "Study"
      : mode === "short"
      ? "Short Break"
      : "Long Break";

  document.getElementById("mode").innerText = modeText;
  document.getElementById("modeFocus").innerText = modeText;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timer = setInterval(() => {

    elapsedSeconds++;

    if (elapsedSeconds === 60) {
      elapsedSeconds = 0;

      if (window.addTime) {
        if (mode === "focus") {
          window.addTime(1, "focus");
        } else {
          window.addTime(1, "break");
        }
      }
    }

    if (seconds === 0) {
      if (minutes === 0) {
        switchMode();
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }

    updateDisplay();

  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  elapsedSeconds = 0;

  round = 1;

  if (mode === "focus") minutes = 50;
  else if (mode === "short") minutes = 10;
  else minutes = 25;

  seconds = 0;

  updateDisplay();
  updateBackground();
}

function switchMode() {

  let sessionMinutes;

  if (mode === "focus") sessionMinutes = 50;
  else if (mode === "short") sessionMinutes = 10;
  else sessionMinutes = 25;

  if (window.addTime) {
    window.addTime(sessionMinutes, mode);
  }

  alarm.play();

  clearInterval(timer);
  isRunning = false;

  if (mode === "focus") {
    if (round % 4 === 0) {
      mode = "long";
      minutes = 25;
    } else {
      mode = "short";
      minutes = 10;
    }
  } else {
    mode = "focus";
    round++;
    minutes = 50;
  }

  seconds = 0;

  updateDisplay();
  updateBackground();
  startTimer();
}

function openFocus(){
  document.getElementById("focusOverlay").classList.add("active");
}

function closeFocus(){
  document.getElementById("focusOverlay").classList.remove("active");
}

function changeMode(selectedMode, btn, index){
  clearInterval(timer);
  isRunning = false;

  mode = selectedMode;

  if(mode === "focus") minutes = 50;
  else if(mode === "short") minutes = 10;
  else minutes = 25;

  seconds = 0;

  updateDisplay();
  updateBackground();

  const indicator = document.getElementById("segmentIndicator");
  if(indicator && index !== undefined){
    indicator.style.transform = `translateX(${index * 100}%)`;
  }

  document.querySelectorAll(".segment-btn").forEach(b =>
    b.classList.remove("active")
  );

  if(btn) btn.classList.add("active");

  const toggle = document.getElementById("toggleSwitch");
  if(toggle) toggle.classList.remove("active");
}

function updateBackground(){
  const overlay = document.getElementById("focusOverlay");
  const card = document.querySelector(".timer-card");
  const focusBtn = document.querySelector(".focus-btn");
  const indicator = document.getElementById("segmentIndicator");

  let themeColor;

  if (mode === "focus") themeColor = "#fce3e3";
  else if (mode === "short") themeColor = "#fffac4";
  else themeColor = "#eef7ac";

  if(overlay) overlay.style.backgroundColor = themeColor;
  if(card) card.style.boxShadow = `0 10px 25px ${themeColor}40`;
  if(focusBtn) focusBtn.style.backgroundColor = themeColor;
  if(indicator) indicator.style.backgroundColor = themeColor;
}

function toggleTimer() {
  const btn = document.querySelector(".spotify-btn .icon");

  if (isRunning) {
    pauseTimer();
    btn.innerText = "▶";
  } else {
    startTimer();
    btn.innerText = "❚❚";
  }
}

updateDisplay();
updateBackground();