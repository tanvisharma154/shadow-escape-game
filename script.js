import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// -- AUTH GUARD -- 
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        document.getElementById("userEmail").innerText = user.email;
        document.getElementById("headerEl").style.display = "flex";
    } else {
        // Redirect to login if not authenticated
        window.location.href = "login.html";
    }
});

window.logout = function () {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Sign out error", error);
    });
}

// -- GAME LOGIC --
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const scoreDisplay = document.getElementById("score");

let playerX = 50;
let playerY = 50;

let enemyX = 300;
let enemyY = 200;

let score = 0;
let gameOver = false;
let gameIntervals = [];

document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    // Prevent default scrolling for arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    // Define speed and boundaries (assuming gameArea is 600x400 and elements are 20px)
    const speed = 15;
    const maxW = 600 - 20;
    const maxH = 400 - 20;

    if (e.key === "ArrowUp") playerY = Math.max(0, playerY - speed);
    if (e.key === "ArrowDown") playerY = Math.min(maxH, playerY + speed);
    if (e.key === "ArrowLeft") playerX = Math.max(0, playerX - speed);
    if (e.key === "ArrowRight") playerX = Math.min(maxW, playerX + speed);

    update();
});

function update() {
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
    enemy.style.left = enemyX + "px";
    enemy.style.top = enemyY + "px";
}

function moveEnemy() {
    if (gameOver) return;

    // Enemy follows player slightly slower
    const enemySpeed = 2.5;

    if (enemyX < playerX) enemyX += enemySpeed;
    if (enemyX > playerX) enemyX -= enemySpeed;
    if (enemyY < playerY) enemyY += enemySpeed;
    if (enemyY > playerY) enemyY -= enemySpeed;

    checkCollision();
    update();
}

function checkCollision() {
    // Hitbox distance
    if (Math.abs(playerX - enemyX) < 20 && Math.abs(playerY - enemyY) < 20) {
        endGame();
    }
}

function increaseScore() {
    if (gameOver) return;
    score++;
    scoreDisplay.innerText = score;
}

async function endGame() {
    gameOver = true;

    // Stop intervals
    gameIntervals.forEach(clearInterval);

    player.style.background = "#555";
    player.style.boxShadow = "none";
    enemy.style.background = "#fff";
    enemy.style.boxShadow = "none";

    document.getElementById("restartBtn").style.display = "block";
    document.getElementById("restartBtn").innerText = "Saving Score...";
    document.getElementById("restartBtn").disabled = true;

    if (currentUser) {
        try {
            await addDoc(collection(db, "scores"), {
                email: currentUser.email,
                score: score,
                time: Date.now()
            });
            document.getElementById("restartBtn").innerText = "Play Again";
            document.getElementById("restartBtn").disabled = false;
        } catch (err) {
            console.error("Error saving score: ", err);
            document.getElementById("restartBtn").innerText = "Play Again (Score not saved)";
            document.getElementById("restartBtn").disabled = false;
        }
    }
}

window.restartGame = function () {
    location.reload();
}

// Start game loops
gameIntervals.push(setInterval(moveEnemy, 30));
gameIntervals.push(setInterval(increaseScore, 1000));

update();
