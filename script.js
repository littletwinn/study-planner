let minutes = 25;
let seconds = 0;
let timer;
let isRunning = false;

let mode = "focus"; // focus | short | long
let round = 1;

function updateDisplay() {
  document.getElementById("timer").innerText =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  document.getElementById("round").innerText = "Round: " + round;

  document.getElementById("mode").innerText =
    mode === "focus"
      ? "Focus Time"
      : mode === "short"
      ? "Short Break"
      : "Long Break";
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timer = setInterval(() => {
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
  mode = "focus";
  round = 1;
  minutes = 25;
  seconds = 0;
  updateDisplay();
}

function switchMode() {
  clearInterval(timer);
  isRunning = false;

  if (mode === "focus") {
    if (round % 4 === 0) {
      mode = "long";
      minutes = 15;
    } else {
      mode = "short";
      minutes = 5;
    }
    seconds = 0;
  } else {
    mode = "focus";
    round++;
    minutes = 25;
    seconds = 0;
  }

  updateDisplay();
  startTimer();
}

updateDisplay();