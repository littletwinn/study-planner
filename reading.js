

let timer = null;
let seconds = 0;
let isRunning = false;
let goalSeconds = 0;
let goalReached = false;

const toggleBtn = document.getElementById("toggleBtn");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");
const todayTotalDisplay = document.getElementById("todayTotal");
const goalStatus = document.getElementById("goalStatus");
const goalInput = document.getElementById("goalInput");


// ------------------------
// โหลดข้อมูลวันปัจจุบัน
// ------------------------
let todayKey = new Date().toDateString();
let todayTotal = parseInt(localStorage.getItem(todayKey)) || 0;
todayTotalDisplay.innerText = Math.floor(todayTotal / 60);


// ------------------------
// โหลด goal
// ------------------------
goalSeconds = parseInt(localStorage.getItem("readingGoal")) || 0;

if (goalSeconds > 0) {
    goalStatus.innerText = "🎯 Goal: " + (goalSeconds / 60) + " นาที";
    progressBar.style.width = "0%";
}


// ------------------------
// แปลงเวลา
// ------------------------
function formatTime(sec) {
    let hrs = Math.floor(sec / 3600);
    let mins = Math.floor((sec % 3600) / 60);
    let secs = sec % 60;

    return (
        String(hrs).padStart(2, '0') + ":" +
        String(mins).padStart(2, '0') + ":" +
        String(secs).padStart(2, '0')
    );
}


// ------------------------
// ปุ่มกด Start / Pause
// ------------------------
window.toggleTimer = function () {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
};

window.startTimer = function () {
    if (timer !== null) return;

    isRunning = true;
    toggleBtn.innerHTML = "⏸";

    timer = setInterval(() => {
        seconds++;
        timerDisplay.innerText = formatTime(seconds);
        updateProgress();
    }, 1000);
}

window.pauseTimer =function () {
    clearInterval(timer);
    timer = null;
    isRunning = false;
    toggleBtn.innerHTML = "▶";
}


// ------------------------
// Reset Timer
// ------------------------
window.resetTimer = async function () {

    clearInterval(timer);
    timer = null;
    isRunning = false;
    toggleBtn.innerHTML = "▶";

    if (seconds > 0) {

        try {
            await db.collection("readingTracker").add({
                date: new Date().toDateString(),
                durationSeconds: seconds,
                goalSeconds: goalSeconds,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log("Saved to Firebase");
        } catch (error) {
            console.error("Error saving:", error);
        }

        todayTotal += seconds;
        localStorage.setItem(todayKey, todayTotal);
        todayTotalDisplay.innerText = Math.floor(todayTotal / 60);
    }

    seconds = 0;
    timerDisplay.innerText = "00:00:00";
    progressBar.style.width = "0%";
    goalReached = false;
};


// ------------------------
// ตั้งเป้าหมาย
// ------------------------
window.setGoal = function () {

    let minutes = parseInt(goalInput.value);

    if (!minutes || minutes <= 0) {
        alert("กรุณาใส่จำนวนนาทีที่ถูกต้อง");
        return;
    }

    goalSeconds = minutes * 60;
    localStorage.setItem("readingGoal", goalSeconds);

    goalReached = false;
    progressBar.style.width = "0%";

    goalStatus.innerText = "🎯 Goal: " + minutes + " นาที";
};


// ------------------------
// อัปเดต Progress Bar
// ------------------------
function updateProgress() {

    if (goalSeconds > 0) {

        let percent = (seconds / goalSeconds) * 100;
        percent = Math.min(percent, 100);
        progressBar.style.width = percent + "%";

        if (seconds >= goalSeconds && !goalReached) {
            goalReached = true;
            alert("🎉 DONE! ถึงเป้าหมายแล้ว");
        }
    }
}

