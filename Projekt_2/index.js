const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
document.getElementById("restartButton").addEventListener("click", resetGame);
const gameOverScreen = document.getElementById("gameOverScreen");
const startScreen = document.getElementById("startScreen");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Responsywność
window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    baseY = canvas.height - baseHeight; 
});
// ---------------------------

// Zmienne stanu gry
let isGameOver = false;
let isGameStarted = false;
let score = 0;
let animationId = 0;
let isGameOverScreenShown = false;

// ---------------------------

// Ptaszek
const birdWidth = 34;
const birdHeight = 24;
let birdY = 150;
const birdX = 50;
const jumpPower = 17;
const gravity = 0.50;
let velocity = 0;
let rotationAngle = 0;
let birdAnimationFrame = 0;
let birdAnimationCounter = 0; 
// ---------------------------

// Rury 
let pipes = [];
const pipeWidth = 52;
const pipeGap = 150;
const pipeSpeed = 4;
const minPipeHeight = 100;
let pipeInterval = null; 
// ---------------------------

// Podłoga
const baseHeight = 112;
const bgScrollSpeed = 0.5;
let bgX = 0;
let baseY = canvas.height - baseHeight;
// ---------------------------


// Zdjęcia itd.
const bg = new Image();
bg.src = "assets/Flappy Bird/background-day.png";


// Stany ptaszka
const birdMid = new Image();
birdMid.src = "assets/Flappy Bird/yellowbird-midflap.png";

const birdUp = new Image();
birdUp.src = "assets/Flappy Bird/yellowbird-upflap.png";

const birdDown = new Image();
birdDown.src = "assets/Flappy Bird/yellowbird-downflap.png";

// ---------------------------------
const pipeImg = new Image();
pipeImg.src = "assets/Flappy Bird/pipe-green.png";

const pipeDownImg = new Image();
pipeDownImg.src = "assets/Flappy Bird/pipe-green-down.png";

// Podłoga
const baseImg = new Image();
baseImg.src = "assets/Flappy Bird/base.png"

// Dźwięki

const death = new Audio();
death.src = "assets/Sound Efects/die.ogg";

const hit = new Audio();
hit.src = "assets/Sound Efects/hit.ogg";

const point = new Audio();
point.src = "assets/Sound Efects/point.ogg";

const swoosh = new Audio();
swoosh.src = "assets/Sound Efects/swoosh.ogg";

const wing = new Audio();
wing.src = "assets/Sound Efects/wing.ogg";

// ---------------------------------

// Latanie ptaszka

document.addEventListener("keydown",flyUp);

function flyUp(event) {
    if (event.code === "Space"){
        if (!isGameStarted) {
            startGame();
            return;
        }
        
        if (!isGameOver){
            velocity = -0.60 * jumpPower;
            wing.currentTime = 0;   
            wing.play();
        }
    }
}

function startGame() {
    isGameStarted = true;
    startScreen.classList.add("hidden");
    pipeInterval = setInterval(generatePipes, 2000);
}

// ---------------------------------


// Generowanie rur

function generatePipes() {
    const minHeight = 150;
    const maxHeight = canvas.height - baseHeight- pipeGap - 150;

    const topPipeHeight = Math.floor(Math.random()*(maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        height: topPipeHeight,
        scored: false,
    })
}

// ---------------------------------


// Kolizje

function checkForCollision() {

    // Kolizja z górną i dolną krawędzią
    if (birdY + birdHeight >= baseY || birdY < 0) {
        if (!isGameOver){
            isGameOver = true;
            hit.play(); 
            clearInterval(pipeInterval);
        }
        return;
        
    }

    // Kolizja z rurą
    pipes.forEach(pipe => {
        const collisionX = birdX < pipe.x + pipeWidth && birdX + birdWidth > pipe.x;
        const collisionY = birdY < pipe.height || birdY + birdHeight > pipe.height + pipeGap;

        if (collisionX && collisionY){
            if (!isGameOver) { 
                isGameOver = true;
                hit.play();
                clearInterval(pipeInterval);
            }
            return;
        }
    })
}

// ---------------------------------

const digitImgs = [];
for (let i = 0; i <= 9; i++) {
    const img = new Image();
    img.src = `assets/UI/Numbers/${i}.png`;
    digitImgs.push(img);
}


// Pokazywanie wyniku w prawym górnym rogu

function drawScore() {
    if (!isGameStarted) return; 
    if (isGameOverScreenShown) return;

    const scoreStr = score.toString();
    const digitWidth = 24;
    const digitHeight = 36;
    const gap = 2;

    let totalWidth = scoreStr.length * (digitWidth + gap);
    
    let x = canvas.width - totalWidth - 20; 
    let y = 20;

    for (let char of scoreStr) {
        const d = parseInt(char);
        if (digitImgs[d].complete) {
            ctx.drawImage(digitImgs[d], x, y, digitWidth, digitHeight);
        }
        x += digitWidth + gap;
    }
}

// ---------------------------

// Najlepsze wyniki 

function getHighScores() {
    const scoreJSON = localStorage.getItem("highScores");
    if (scoreJSON) {
        return JSON.parse(scoreJSON); 
    }
    return [];
}

function saveScores(scores) {
    localStorage.setItem("highScores", JSON.stringify(scores));
}

function updateHighScores() {
    let highScores = getHighScores();
    highScores.push(score);
    highScores.sort((a,b)=>b-a);
    highScores.splice(5);
    saveScores(highScores);
    displayHighScores(highScores);
}

function displayHighScores(scores) {
    document.getElementById("currentScore").innerHTML = "Twój aktualny wynik to: " + score;
    document.getElementById("bestScore").innerHTML= "Najlepszy wynik to: "+ (scores[0] || 0);

    const scoreList = document.getElementById("scoreList"); 
    scoreList.innerHTML = ""; 

    scores.forEach((score, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `"${score}"`;
        scoreList.appendChild(listItem);
    });

}


// ---------------------------

// Główna animacja
function animate() {
    requestAnimationFrame(animate);

    // Czyszczenie ekranu
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    if (!isGameOver) {
        bgX -= bgScrollSpeed;
    }
    if (bgX <= -canvas.width) {
        bgX = 0;
    }

    // Rysowanie tła
    ctx.drawImage(bg, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, bgX + canvas.width, 0, canvas.width, canvas.height);

    // Jeśli gra się nie rozpoczęła
    if (!isGameStarted) {
        // Rysowanie podłogi
        ctx.drawImage(baseImg, bgX, baseY, canvas.width, baseHeight);
        ctx.drawImage(baseImg, bgX + canvas.width, baseY, canvas.width, baseHeight);
        
        // Rysowanie ptaszka
        ctx.save();
        ctx.translate(birdX + birdWidth / 2, birdY + birdHeight / 2);
        ctx.drawImage(birdMid, -birdWidth / 2, -birdHeight / 2, birdWidth, birdHeight);
        ctx.restore();
        return;
    }

    if (!isGameOver){

        velocity += gravity;
        birdY += velocity;

        checkForCollision();

        birdAnimationCounter++;
        if (birdAnimationCounter > 5) {
            birdAnimationFrame = (birdAnimationFrame + 1) % 3;
            birdAnimationCounter = 0;
        }

        // Wstawianie rur
        pipes.forEach(pipe=> {
            pipe.x -= pipeSpeed;

            ctx.drawImage( pipeDownImg, pipe.x, 0, pipeWidth, pipe.height ); // górna
            ctx.drawImage( pipeImg, pipe.x, pipe.height+pipeGap, pipeWidth, canvas.height-pipeGap-pipe.height-baseHeight); // dolna
            
            if (pipe.x + pipeWidth < birdX && !pipe.scored) {
                score++;
                pipe.scored = true;
                point.play();
            }
        })
        // Usuwanie zbędnych pipów
        for (let i = pipes.length -1; i >=0; i--){
                let pipe = pipes[i]

                if (pipe.x+ pipeWidth < 0) {
                pipes.splice(i, 1);
                }
            }

    } 
    // Jeśli gra się skończy - animacja spadania
    else { 
        velocity += gravity;
        birdY += velocity;

        if (birdY + birdHeight >= baseY) {
            birdY = baseY - birdHeight;
            if (!isGameOverScreenShown){
                death.play(); 
                showGameOverScreen();
                isGameOverScreenShown = true;
            }
        }
        // Pozostawiamy rurki
        pipes.forEach(pipe => {
            ctx.drawImage(pipeDownImg, pipe.x, 0, pipeWidth, pipe.height);
            ctx.drawImage( pipeImg, pipe.x, pipe.height+pipeGap, pipeWidth, canvas.height-pipeGap-pipe.height-baseHeight);
             
        });
    }


    // Generowanie podłogi 
    ctx.drawImage( baseImg, bgX, baseY, canvas.width, baseHeight);
    ctx.drawImage( baseImg, bgX + canvas.width, baseY, canvas.width, baseHeight);
    
    drawScore();

    ctx.save();
    ctx.translate(birdX + birdWidth / 2, birdY + birdHeight / 2);

    rotationAngle = Math.min(velocity * 3, 45) * Math.PI / 180;
    ctx.rotate(rotationAngle);

    let currentBirdSprite = birdMid;
    if (birdAnimationFrame === 0) {
        currentBirdSprite = birdDown;
    } else if (birdAnimationFrame === 1) {
        currentBirdSprite = birdMid;
    } else {
        currentBirdSprite = birdUp;
    }

    ctx.drawImage(currentBirdSprite, -birdWidth / 2, -birdHeight / 2, birdWidth, birdHeight);

    ctx.restore();
}


// Game over screen

function showGameOverScreen() {
    gameOverScreen.classList.remove("hidden"); 
    updateHighScores();
}

// ---------------------------------

// Reset gry

function resetGame() {
    velocity = 0;
    birdY = 150;
    score = 0;
    pipes.splice(0,pipes.length);
    isGameOver = false;
    isGameOverScreenShown = false;
    bgX = 0; 
    gameOverScreen.classList.add("hidden");
    isGameStarted = false;
    startScreen.classList.remove("hidden");

    clearInterval(pipeInterval);
    pipeInterval = setInterval(generatePipes, 2000);
}

// ---------------------------------


animate();
restartButton.addEventListener("click", resetGame); 