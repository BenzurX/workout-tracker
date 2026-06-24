const dayButtons = document.querySelectorAll('.day-btn');
const dayTitle = document.getElementById('day-title');
const inputs = document.querySelectorAll('#workout-table input');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const modal = document.getElementById('modal');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');

let activeDay = 'monday';

const dayPrefixes = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday'
};

const dayDefaults = {
  monday: 'Push',
  tuesday: 'Pull',
  wednesday: 'Legs',
  thursday: 'Push',
  friday: 'Pull'
};

function updateTitle(day) {
  const saved = localStorage.getItem(day + 'Subtitle');
  const subtitle = saved || dayDefaults[day];
  document.getElementById('day-prefix').textContent = dayPrefixes[day] + ' - ';
  document.getElementById('day-subtitle').textContent = subtitle;
}

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
    updateTitle(activeDay);
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
updateTitle(activeDay);
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

function attachSubtitleListener() {
  const subtitle = document.getElementById('day-subtitle');
  if (!subtitle) return;

  subtitle.addEventListener('click', function() {
    const current = this.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = current;
    input.id = 'subtitle-input';
    this.replaceWith(input);
    input.focus();

    function saveSubtitle() {
      const newValue = input.value.trim() || dayDefaults[activeDay];
      localStorage.setItem(activeDay + 'Subtitle', newValue);
      const span = document.createElement('span');
      span.id = 'day-subtitle';
      span.title = 'Click to edit';
      span.textContent = newValue;
      input.replaceWith(span);
      attachSubtitleListener();
    }

    input.addEventListener('blur', saveSubtitle);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        input.removeEventListener('blur', saveSubtitle);
        saveSubtitle();
      }
    });
  });
}

attachSubtitleListener();