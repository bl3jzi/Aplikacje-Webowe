let seconds = 0;
let minutes = 0;

const buttonStart = document.getElementById("button-start");
const buttonStop = document.getElementById("button-stop");
const buttonReset = document.getElementById("button-reset");
const displayElement = document.getElementById("display");

let Interval;

buttonStart.onclick = function() {
    clearInterval(Interval);
    Interval = setInterval(startTimer,1000);
}

buttonStop.onclick = function() {
    clearInterval(Interval);
}

buttonReset.onclick = function() {
    clearInterval(Interval);
    minutes = 0;
    seconds = 0;
    displayElement.innerHTML = seconds + "s";
}

function startTimer() {
    seconds++;
    if (seconds > 59) {
        minutes++;
        seconds = 0;
    }
    if (minutes > 0) {
        displayElement.innerHTML = minutes + "min " + seconds + "s";
    } else {
        displayElement.innerHTML = seconds + "s";
    }
}