const modes = [
    {
        pomodoro: 25,
        break: 5,
        longBreak: 15
    },
    {
        pomodoro: 50,
        break: 10,
        longBreak: 30
    }
];

let currentMode = 0;    // current mode can be 0 or 1, meaning 25 or 50 min pomodoro
let currentTimer = 0; // current timer can be 0, 1 or 2. For "pomodoro", "break", "longBreak"
let seconds = 0;    // keep track of the time remaining in the timer
let interval;   // clear interval identifier
let percent; // to set the progress bar

function updateSeconds() {
    if (currentTimer === 0) {
        seconds = (modes[currentMode]["pomodoro"] * 60) - 1;
    } else if (currentTimer === 1) {
        seconds = (modes[currentMode]["break"] * 60) - 1;
    } else {
        seconds = (modes[currentMode]["longBreak"] * 60) - 1;
    }
}

// PLAY, PAUSE, RESET and timer change btns and event handlers
const play = document.getElementById("play");
const pause = document.getElementById("pause");
const reset = document.getElementById("reset");
const timerChangeBtn = document.getElementById('change-btn');
const timerName = document.querySelector('.timer-name');

play.addEventListener("click", playIt);
pause.addEventListener("click", pauseIt);
reset.addEventListener("click", resetIt);
timerChangeBtn.addEventListener("click", updateTimer);


// Getting elements to set and update time
const minTime = document.getElementById("min-time");
const secTime = document.getElementById("sec-time");

function displayTimer() {
    currentTimer %= 3;  // To make sure currentTimer does not go above 2
    if (currentTimer === 0) {
        minTime.innerText = modes[currentMode]["pomodoro"];
        secTime.innerText = "00";
        timerName.innerText = "POMODORO";
    } else if (currentTimer === 1) {
        minTime.innerText = (modes[currentMode]["break"]) < 10 ? '0' + modes[currentMode]["break"] : modes[currentMode]["break"];
        secTime.innerText = "00";
        timerName.innerText = "BREAK";
    } else if (currentTimer === 2) {
        minTime.innerText = modes[currentMode]["longBreak"];
        secTime.innerText = "00";
        timerName.innerText = "LONG BREAK";
    }
    updateSeconds();
}
displayTimer(); // display the pomodoro timer on load


function updateTimer() {
    clearInterval(interval);
    play.disabled = false;
    currentTimer++;
    displayTimer();
}

function changeMode() {
    if (currentMode === 0) {
        currentTimer = 0;   // timer will start at pomodoro
        displayTimer();
    } else if (currentMode === 1) {
        currentTimer = 0; // timer will start at pomodoro
        displayTimer();
    }
}

function setTimer() {
    interval = setInterval(() => {
        let mins = ("0" + Math.floor(seconds / 60)).slice(-2);
        let secs = ("0" + (seconds % 60)).slice(-2);

        minTime.innerText = mins;
        secTime.innerText = secs;

        if (seconds === 0) {
            clearInterval(interval);
            timerCompleted();
            displayTimer();
        }

        seconds--;
    }, 1000);
}

function playIt() {
    play.disabled = true;
    setTimer();
}

function pauseIt() {
    play.disabled = false;
    clearInterval(interval);
}

function resetIt() {
    play.disabled = false;
    clearInterval(interval);
    displayTimer();
}

// Audio for when a timer is completed
const pomoEndAudio = new Audio("../audio/pomo-end.wav");
const breakEndAudio = new Audio("../audio/break-end.wav");
const clickAudio = new Audio("../audio/click.wav");

function timerCompleted() {
    currentTimer %= 3;      // To make sure currentTimer does not go above 2 
    if (currentTimer === 0) {
        pomoEndAudio.play();
    } else {
        breakEndAudio.play();
    }
}

// RULES MODAL
const rulesBtn = document.getElementById("rules");
const closeBtn = document.getElementById("close-btn");
const modal = document.querySelector(".modal-overlay");

rulesBtn.addEventListener("click", () => {
    modal.classList.add("show-modal");
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("show-modal");
});

// audio effect on all button clicks
const allBtns = document.querySelectorAll("button");

allBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        clickAudio.play();
    });
});

// To switch between two pomodoro modes
const modeSwitch = document.getElementById('mode-switch');
const clock = document.querySelector('.pomo-clock');
const dev = document.querySelector('.dev')

modeSwitch.addEventListener('click', () => {
    modeSwitch.classList.toggle('rotate');
    clock.classList.toggle('other-mode');
    dev.classList.toggle('other-mode');
    clearInterval(interval);    // stops the timer
    currentMode++;  // changes the mode
    currentMode %= 2; // there are only two modes, so if in case currentMode > 1. currentMode will go back to 0
    play.disabled = false;  // enable the button if it is in disabled state
    changeMode();
})

