let timerDisplay = document.getElementById('timer');
let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');

let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let currentTime = workDuration;
let interval = null;
let isWork = true;

const workEndSound = document.getElementById('workEndSound');
const breakEndSound = document.getElementById('breakEndSound');

function updateDisplay() {
  let minutes = Math.floor(currentTime / 60);
  let seconds = currentTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (interval) return;
  interval = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;
      if (isWork) {
        workEndSound?.play();
      } else {
        breakEndSound?.play();
      }
      isWork = !isWork;
      currentTime = isWork ? workDuration : breakDuration;
      updateDisplay();
      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  stopTimer();
  isWork = true;
  currentTime = workDuration;
  updateDisplay();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// --- Modifier durée ---
const modifyBtn = document.createElement("button");
modifyBtn.textContent = "Modifier durée";
modifyBtn.style.marginTop = "20px";
document.querySelector(".buttons").appendChild(modifyBtn);

const popup = document.getElementById("duration-popup");
const durationForm = document.getElementById("duration-form");
const durationInput = document.getElementById("duration");

modifyBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
});

durationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newMinutes = parseInt(durationInput.value);
  if (!isNaN(newMinutes) && newMinutes > 0) {
    workDuration = newMinutes * 60;
    breakDuration = Math.round(workDuration / 5);
    resetTimer();
  }
  popup.classList.add("hidden");
});

updateDisplay();
