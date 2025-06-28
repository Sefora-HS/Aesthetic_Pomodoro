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

// Thèmes
const workThemes = [
  {
    background: 'image/background1.jpg',
    textColor: '#ffe3fb',
    buttonBg: '#ffe3fb',
    buttonText: '#52126a'
  },
  {
    background: 'image/background2.jpg',
    textColor: '#ffffff',
    buttonBg: '#333333',
    buttonText: '#ffffff'
  },
  {
    background: 'image/background3.jpg',
    textColor: '#6a004d',
    buttonBg: '#ffe3ee',
    buttonText: '#6a004d'
  }
];

let currentThemeIndex = 0;

function applyWorkTheme(index) {
  const theme = workThemes[index];

  // ✅ Inclure le filtre noir ici :
  document.body.style.backgroundImage =
    `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${theme.background}')`;

  document.documentElement.style.setProperty('--text-color', theme.textColor);
  document.documentElement.style.setProperty('--button-bg', theme.buttonBg);
  document.documentElement.style.setProperty('--button-text', theme.buttonText);
}

const themeButton = document.getElementById('themeButton');
themeButton.addEventListener('click', () => {
  if (!isWork) return;
  currentThemeIndex = (currentThemeIndex + 1) % workThemes.length;
  applyWorkTheme(currentThemeIndex);
});

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
        workEndSound.play();
        workEndSound.onended = () => {
          isWork = false;
          currentTime = breakDuration;
          document.body.classList.remove('work-mode');
          document.body.classList.add('break-mode');

          // ✅ Pause : image de pause sans filtre
          document.body.style.backgroundImage = "url('image/your-break-background.jpg')";
          document.documentElement.style.setProperty('--text-color', '#ffffff');
          document.documentElement.style.setProperty('--button-bg', '#ffffff');
          document.documentElement.style.setProperty('--button-text', '#000000');

          updateDisplay();
          startTimer();
        };
      } else {
        breakEndSound.play();
        breakEndSound.onended = () => {
          isWork = true;
          currentTime = workDuration;
          document.body.classList.remove('break-mode');
          document.body.classList.add('work-mode');

          applyWorkTheme(currentThemeIndex); // ✅ avec le filtre intégré
          updateDisplay();
          startTimer();
        };
      }
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
  document.body.classList.remove('break-mode');
  document.body.classList.add('work-mode');
  applyWorkTheme(currentThemeIndex);
  updateDisplay();
}

// Modifier durée
const modifyBtn = document.getElementById("modify");
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

// Initialisation
applyWorkTheme(currentThemeIndex);
updateDisplay();

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
