const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const startBtn = document.getElementById("startBtn");
const bgMusic = document.getElementById("bgMusic");
const gameOverSound = document.getElementById("gameOverSound");
const colorPicker = document.getElementById("snakeColorPicker");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
let snakeColor = localStorage.getItem("snakeColor") || "#00eeff";

highScoreElement.innerText = "High Score: " + (localStorage.getItem("high-score") || 0);

// Set initial color picker value sesuai yang tersimpan
colorPicker.value = snakeColor;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    bgMusic.pause();
    gameOverSound.play();

    // Tampilkan modal game over
    document.getElementById("gameOverModal").style.display = "flex";
};

const restartGame = () => {
    location.reload();
}

const changeDirection = (e) => {
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}))
})

const initGame = () => {
    if(gameOver){
        return handleGameOver();
    }
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        let highScore = localStorage.getItem("high-score") || 0;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);

        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Update posisi tubuh ular
    for(let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    // Gerak ular
    snakeX += velocityX;
    snakeY += velocityY;

    // Cek tabrakan dinding
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    // Gambar ular dan cek tabrakan badan
    for(let i = 0; i < snakeBody.length; i++){
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; background: ${snakeColor};"></div>`;
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

function changeSnakeColor(color) {
    snakeColor = color;
    localStorage.setItem("snakeColor", color);
}

colorPicker.addEventListener("input", (e) => {
    changeSnakeColor(e.target.value);
});

startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    changeFoodPosition();
    bgMusic.play();
    document.addEventListener("keydown", changeDirection);
    setIntervalId = setInterval(initGame, 190);
});
