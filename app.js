const dayButtons = document.querySelectorAll('.day-btn');
const dayTitle = document.getElementById('day-title');
const inputs = document.querySelectorAll('#workout-table input');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const modal = document.getElementById('modal');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');

let activeDay = 'monday';

const dayTitles = {
  monday: 'Monday - Push',
  tuesday: 'Tuesday - Pull',
  wednesday: 'Wednesday - Rest',
  thursday: 'Thursday - Legs',
  friday: 'Friday - Core'
};

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function loadDay(day) {
  const saved = JSON.parse(localStorage.getItem(day)) || [];
  inputs.forEach((input, i) => {
    input.value = saved[i] || '';
  });
}

function saveDay(day) {
  const data = Array.from(inputs).map(input => input.value);
  localStorage.setItem(day, JSON.stringify(data));
}

function clearDay(day) {
  inputs.forEach(input => input.value = '');
  localStorage.removeItem(day);
}

// Day button clicks
dayButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    dayButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeDay = btn.dataset.day;
    dayTitle.textContent = dayTitles[activeDay];
    loadDay(activeDay);
    localStorage.setItem('activeDay', activeDay);
  });
});

// Auto-save on input
inputs.forEach(input => {
  input.addEventListener('change', () => {
    saveDay(activeDay);
  });
});

// Clear -- show modal
clearBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

// Confirm clear
confirmBtn.addEventListener('click', () => {
  clearDay(activeDay);
  modal.classList.add('hidden');
});

// Cancel
cancelBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Load default day on startup
const savedActiveDay = localStorage.getItem('activeDay') || 'monday';
activeDay = savedActiveDay;
dayTitle.textContent = dayTitles[activeDay];
document.querySelector(`[data-day="${activeDay}"]`).classList.add('active');
document.querySelector('[data-day="monday"]').classList.remove('active');
loadDay(activeDay);

// Tracker checkboxes
const trackerBoxes = document.querySelectorAll('#day-tracker input[type="checkbox"]');
const clearTrackerBtn = document.getElementById('clear-tracker-btn');

// Load tracker state
function loadTracker() {
  const saved = JSON.parse(localStorage.getItem('dayTracker')) || [];
  trackerBoxes.forEach((box, i) => {
    box.checked = saved[i] || false;
  });
}

// Save tracker state
function saveTracker() {
  const data = Array.from(trackerBoxes).map(box => box.checked);
  localStorage.setItem('dayTracker', JSON.stringify(data));
}

trackerBoxes.forEach(box => {
  box.addEventListener('change', saveTracker);
});

const trackerModal = document.getElementById('tracker-modal');
const confirmTrackerBtn = document.getElementById('confirm-tracker-btn');
const cancelTrackerBtn = document.getElementById('cancel-tracker-btn');

clearTrackerBtn.addEventListener('click', () => {
  trackerModal.classList.remove('hidden');
});

confirmTrackerBtn.addEventListener('click', () => {
  trackerBoxes.forEach(box => box.checked = false);
  localStorage.removeItem('dayTracker');
  trackerModal.classList.add('hidden');
});

cancelTrackerBtn.addEventListener('click', () => {
  trackerModal.classList.add('hidden');
});

loadTracker();

// Close modals when clicking outside
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) modal.classList.add('hidden');
});

document.getElementById('tracker-modal').addEventListener('click', function(e) {
  if (e.target === this) trackerModal.classList.add('hidden');
});