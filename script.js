// Éléments DOM
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');

const workEndSound = document.getElementById('workEndSound');
const breakEndSound = document.getElementById('breakEndSound');

const themeButton = document.getElementById('themeButton');
const modifyBtn = document.getElementById('modify');
const popup = document.getElementById('duration-popup');
const durationForm = document.getElementById('duration-form');
const durationInput = document.getElementById('duration');

const sidebar = document.getElementById('task-sidebar');
const openSidebarBtn = document.getElementById('open-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let currentTime = workDuration;
let interval = null;
let isWork = true;

// Thèmes de travail avec images et couleurs
const workThemes = [
  {
    background: 'image/background1.jpg',
    textColor: '#eae8ff',
    buttonBg: '#3b2f63',
    buttonText: '#eae8ff'
  },
  {
    background: 'image/background2.jpg',
    textColor: '#dfdfdf',
    buttonBg: '#333333',
    buttonText: '#dfdfdf'
  },
  {
    background: 'image/background3.jpg',
    textColor: '#f8dc2b',
    buttonBg: '#0b7d1a',
    buttonText: '#f8dc2b'
  }
];

let currentThemeIndex = 0;

// Appliquer un thème de travail avec filtre noir
function applyWorkTheme(index) {
  const theme = workThemes[index];
  document.body.style.backgroundImage =
    `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${theme.background}')`;

  document.documentElement.style.setProperty('--text-color', theme.textColor);
  document.documentElement.style.setProperty('--button-bg', theme.buttonBg);
  document.documentElement.style.setProperty('--button-text', theme.buttonText);
}

// Mise à jour affichage timer
function updateDisplay() {
  let minutes = Math.floor(currentTime / 60);
  let seconds = currentTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Démarrer le timer
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

          // Pause : image sans filtre
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

          applyWorkTheme(currentThemeIndex);
          updateDisplay();
          startTimer();
        };
      }
    }
  }, 1000);
}

// Arrêter le timer
function stopTimer() {
  clearInterval(interval);
  interval = null;
}

// Réinitialiser le timer
function resetTimer() {
  stopTimer();
  isWork = true;
  currentTime = workDuration;
  document.body.classList.remove('break-mode');
  document.body.classList.add('work-mode');
  applyWorkTheme(currentThemeIndex);
  updateDisplay();
}

// Changer thème via bouton
themeButton.addEventListener('click', () => {
  if (!isWork) return;
  currentThemeIndex = (currentThemeIndex + 1) % workThemes.length;
  applyWorkTheme(currentThemeIndex);
});

// Modifier la durée via popup
modifyBtn.addEventListener('click', () => {
  popup.classList.remove('hidden');
});

durationForm.addEventListener('submit', e => {
  e.preventDefault();
  const newMinutes = parseInt(durationInput.value);
  if (!isNaN(newMinutes) && newMinutes > 0) {
    workDuration = newMinutes * 60;
    breakDuration = Math.round(workDuration / 5);
    resetTimer();
  }
  popup.classList.add('hidden');
});

// Gestion menu tâches

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li span').forEach(task => {
    tasks.push(task.textContent);
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskList.innerHTML = '';
  tasks.forEach(text => addTask(text));
}

function addTask(text) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = text;

  // Bouton supprimer tâche avec image
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-task-button');

  const deleteImg = document.createElement('img');
  deleteImg.src = 'image/poubelle.png';
  deleteImg.alt = 'Supprimer tâche';

  deleteBtn.appendChild(deleteImg);

  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
  saveTasks();
}

// Ouvrir/fermer sidebar tâches
openSidebarBtn.addEventListener('click', () => {
  sidebar.classList.add('show');
  openSidebarBtn.classList.add('hidden-button');
});

closeSidebarBtn.addEventListener('click', () => {
  sidebar.classList.remove('show');
  openSidebarBtn.classList.remove('hidden-button');
});

// Ajouter tâche
addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text !== '') {
    addTask(text);
    taskInput.value = '';
  }
});

// Initialisation
applyWorkTheme(currentThemeIndex);
updateDisplay();
loadTasks();

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
