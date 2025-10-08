let timerInterval = null;
let timerTime = 0;
let timerRunning = false;
let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRunning = false;
let lapCounter = 1;
let alarms = [];
let alarmCheckInterval = null;
let clockFormat24h = false;
let alarmFormat24h = false;

// Tab switching
document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        const tabId = tab.dataset.tab;
        document
            .querySelectorAll(".nav-tab")
            .forEach((t) => t.classList.remove("active"));
        document
            .querySelectorAll(".tab-content")
            .forEach((c) => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tabId).classList.add("active");
    });
});

// Clock functionality
function formatTime12h(hours, minutes, seconds) {
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return {
        time: `${String(displayHours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
        period: period,
    };
}

function formatTime24h(hours, minutes, seconds) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(2, "0")}`;
}

function showTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    let timeDisplay;

    if (clockFormat24h) {
        timeDisplay = formatTime24h(hours, minutes, seconds);
    } else {
        const formatted = formatTime12h(hours, minutes, seconds);
        timeDisplay = `${formatted.time} ${formatted.period}`;
    }

    document.getElementById("time").innerText = timeDisplay;

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    document.getElementById("date").innerText = currentTime.toLocaleDateString(
        "en-US",
        options
    );
}

// Timer functionality
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(2, "0")}`;
}

function updateTimerDisplay() {
    document.getElementById("timer-display").textContent =
        formatTime(timerTime);
}

function startTimer() {
    if (!timerRunning) {
        if (timerTime === 0) {
            const hours =
                parseInt(document.getElementById("timer-hours").value) || 0;
            const minutes =
                parseInt(document.getElementById("timer-minutes").value) || 0;
            const seconds =
                parseInt(document.getElementById("timer-seconds").value) || 0;
            timerTime = hours * 3600 + minutes * 60 + seconds;
        }

        if (timerTime > 0) {
            timerRunning = true;
            timerInterval = setInterval(() => {
                timerTime--;
                updateTimerDisplay();
                if (timerTime <= 0) {
                    clearInterval(timerInterval);
                    timerRunning = false;
                    showNotification("Timer finished!");
                }
            }, 1000);
        }
    }
}

function pauseTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerTime = 0;
    updateTimerDisplay();
    document.getElementById("timer-hours").value = "";
    document.getElementById("timer-minutes").value = "";
    document.getElementById("timer-seconds").value = "";
}

// Stopwatch functionality
function updateStopwatchDisplay() {
    document.getElementById("stopwatch-display").textContent =
        formatTime(stopwatchTime);
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            updateStopwatchDisplay();
        }, 1000);
    }
}

function pauseStopwatch() {
    if (stopwatchRunning) {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
    }
}

function lapStopwatch() {
    if (stopwatchRunning) {
        const lapTime = formatTime(stopwatchTime);
        const lapElement = document.createElement("div");
        lapElement.className = "lap-item";
        lapElement.innerHTML = `<span>Lap ${lapCounter}</span><span>${lapTime}</span>`;
        document.getElementById("lap-times").appendChild(lapElement);
        lapCounter++;
    }
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchRunning = false;
    stopwatchTime = 0;
    lapCounter = 1;
    updateStopwatchDisplay();
    document.getElementById("lap-times").innerHTML = "";
}

// Alarm functionality
function updateAlarmInputFormat() {
    const hoursInput = document.getElementById("alarm-hours");
    const ampmSelect = document.getElementById("alarm-ampm");

    if (alarmFormat24h) {
        hoursInput.max = 23;
        hoursInput.placeholder = "HH (0-23)";
        ampmSelect.style.display = "none";
    } else {
        hoursInput.max = 12;
        hoursInput.placeholder = "HH (1-12)";
        ampmSelect.style.display = "block";
    }
}

function convertTo24h(hours, minutes, period) {
    if (period === "AM") {
        return hours === 12 ? 0 : hours;
    } else {
        return hours === 12 ? 12 : hours + 12;
    }
}

function convertTo12h(hours24) {
    if (hours24 === 0) return { hours: 12, period: "AM" };
    if (hours24 < 12) return { hours: hours24, period: "AM" };
    if (hours24 === 12) return { hours: 12, period: "PM" };
    return { hours: hours24 - 12, period: "PM" };
}

function setAlarm() {
    let hours = parseInt(document.getElementById("alarm-hours").value);
    const minutes = parseInt(document.getElementById("alarm-minutes").value);

    if (isNaN(hours) || isNaN(minutes) || minutes < 0 || minutes > 59) {
        showNotification("Please enter valid time");
        return;
    }

    let hours24;
    if (alarmFormat24h) {
        if (hours < 0 || hours > 23) {
            showNotification("Hours must be between 0-23 in 24h format");
            return;
        }
        hours24 = hours;
    } else {
        if (hours < 1 || hours > 12) {
            showNotification("Hours must be between 1-12 in 12h format");
            return;
        }
        const period = document.getElementById("alarm-ampm").value;
        hours24 = convertTo24h(hours, minutes, period);
    }

    const alarmTime24 = `${String(hours24).padStart(2, "0")}:${String(
        minutes
    ).padStart(2, "0")}`;
    const alarmId = Date.now();

    let displayTime;
    if (alarmFormat24h) {
        displayTime = alarmTime24;
    } else {
        const converted = convertTo12h(hours24);
        displayTime = `${String(converted.hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")} ${converted.period}`;
    }

    alarms.push({
        id: alarmId,
        time24: alarmTime24,
        displayTime: displayTime,
        hours24: hours24,
        minutes,
    });

    updateAlarmList();
    document.getElementById("alarm-hours").value = "";
    document.getElementById("alarm-minutes").value = "";
    showNotification(`Alarm set for ${displayTime}`);

    if (!alarmCheckInterval) {
        alarmCheckInterval = setInterval(checkAlarms, 1000);
    }
}

function removeAlarm(alarmId) {
    alarms = alarms.filter((alarm) => alarm.id !== alarmId);
    updateAlarmList();
    if (alarms.length === 0) {
        clearInterval(alarmCheckInterval);
        alarmCheckInterval = null;
    }
}

function updateAlarmList() {
    const alarmList = document.getElementById("alarm-list");
    alarmList.innerHTML = "";

    alarms.forEach((alarm) => {
        const alarmElement = document.createElement("div");
        alarmElement.className = "alarm-item";

        let displayTime;
        if (alarmFormat24h) {
            displayTime = alarm.time24;
        } else {
            const converted = convertTo12h(alarm.hours24);
            displayTime = `${String(converted.hours).padStart(2, "0")}:${String(
                alarm.minutes
            ).padStart(2, "0")} ${converted.period}`;
        }

        alarmElement.innerHTML = `<span class="alarm-time">${displayTime}</span><button class="btn danger" onclick="removeAlarm(${alarm.id})">Delete</button>`;
        alarmList.appendChild(alarmElement);
    });
}

function checkAlarms() {
    const now = new Date();
    const currentTime24 = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
    ).padStart(2, "0")}`;

    alarms.forEach((alarm) => {
        if (alarm.time24 === currentTime24 && now.getSeconds() === 0) {
            const displayTime = alarmFormat24h
                ? alarm.time24
                : (() => {
                      const converted = convertTo12h(alarm.hours24);
                      return `${String(converted.hours).padStart(
                          2,
                          "0"
                      )}:${String(alarm.minutes).padStart(2, "0")} ${
                          converted.period
                      }`;
                  })();
            showNotification(`Alarm! It's ${displayTime}`);
        }
    });
}

// Notification system
function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notification-text");
    notificationText.textContent = message;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

// Event listeners
document.getElementById("timer-start").addEventListener("click", startTimer);
document.getElementById("timer-pause").addEventListener("click", pauseTimer);
document.getElementById("timer-reset").addEventListener("click", resetTimer);
document
    .getElementById("stopwatch-start")
    .addEventListener("click", startStopwatch);
document
    .getElementById("stopwatch-pause")
    .addEventListener("click", pauseStopwatch);
document
    .getElementById("stopwatch-lap")
    .addEventListener("click", lapStopwatch);
document
    .getElementById("stopwatch-reset")
    .addEventListener("click", resetStopwatch);
document.getElementById("alarm-set").addEventListener("click", setAlarm);

document
    .getElementById("clock-format-toggle")
    .addEventListener("change", function () {
        clockFormat24h = this.checked;
        document.getElementById("clock-format-label").textContent =
            clockFormat24h ? "24H" : "12H";
    });

document
    .getElementById("alarm-format-toggle")
    .addEventListener("change", function () {
        alarmFormat24h = this.checked;
        document.getElementById("alarm-format-label").textContent =
            alarmFormat24h ? "24H" : "12H";
        updateAlarmInputFormat();
        updateAlarmList();
    });

// Initialize
setInterval(showTime, 1000);
showTime();
updateTimerDisplay();
updateStopwatchDisplay();
updateAlarmInputFormat();
