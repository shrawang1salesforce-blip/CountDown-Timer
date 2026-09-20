const dateInput = document.querySelector("#target-date");
const setDateButton = document.querySelector("#set-date");
const statusText = document.querySelector("#status-text");
const targetLabel = document.querySelector("#target-label");
const helperText = document.querySelector("#helper-text");
const timeValues = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

let targetDate = getDefaultTarget();
let intervalId;

function getDefaultTarget() {
  const savedDate = localStorage.getItem("countdown-target");
  const savedTime = savedDate ? new Date(savedDate).getTime() : 0;

  if (savedTime > Date.now()) {
    dateInput.value = toInputValue(new Date(savedTime));
    return savedTime;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  dateInput.value = toInputValue(tomorrow);
  return tomorrow.getTime();
}

function toInputValue(date) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function updateClock() {
  const remaining = Math.max(0, targetDate - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  timeValues.days.textContent = String(days).padStart(2, "0");
  timeValues.hours.textContent = String(hours).padStart(2, "0");
  timeValues.minutes.textContent = String(minutes).padStart(2, "0");
  timeValues.seconds.textContent = String(seconds).padStart(2, "0");

  if (remaining === 0) {
    document.body.classList.add("finished");
    statusText.textContent = "The moment is here";
    helperText.textContent = "Choose another date whenever you are ready.";
    clearInterval(intervalId);
  } else {
    document.body.classList.remove("finished");
    statusText.textContent = "Counting down";
    helperText.textContent = "The timer updates every second.";
  }
}

function setTargetDate() {
  const nextDate = new Date(dateInput.value);

  if (
    !dateInput.value ||
    Number.isNaN(nextDate.getTime()) ||
    nextDate.getTime() <= Date.now()
  ) {
    helperText.textContent = "Please choose a date and time in the future.";
    dateInput.focus();
    return;
  }

  targetDate = nextDate.getTime();
  localStorage.setItem("countdown-target", nextDate.toISOString());
  targetLabel.textContent = formatDate(nextDate);
  helperText.textContent = "The timer updates every second.";
  updateClock();
  clearInterval(intervalId);
  intervalId = setInterval(updateClock, 1000);
}

targetLabel.textContent = formatDate(new Date(targetDate));
setDateButton.addEventListener("click", setTargetDate);
dateInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    setTargetDate();
  }
});

updateClock();
intervalId = setInterval(updateClock, 1000);
