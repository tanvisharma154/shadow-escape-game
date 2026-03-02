import { auth, db } from "./firebase.js";

import {
addDoc,
collection
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const scoreDisplay = document.getElementById("score");

let playerX=50;
let playerY=50;

let enemyX=300;
let enemyY=200;

let score=0;
let gameOver=false;

document.addEventListener("keydown",(e)=>{

if(gameOver)return;

if(e.key==="ArrowUp")playerY-=10;
if(e.key==="ArrowDown")playerY+=10;
if(e.key==="ArrowLeft")playerX-=10;
if(e.key==="ArrowRight")playerX+=10;

update();

});

function update(){
player.style.left=playerX+"px";
player.style.top=playerY+"px";
enemy.style.left=enemyX+"px";
enemy.style.top=enemyY+"px";
}

function moveEnemy(){

if(gameOver)return;

if(enemyX<playerX)enemyX+=2;
if(enemyX>playerX)enemyX-=2;

if(enemyY<playerY)enemyY+=2;
if(enemyY>playerY)enemyY-=2;

checkCollision();

update();

}

function checkCollision(){

if(
Math.abs(playerX-enemyX)<20 &&
Math.abs(playerY-enemyY)<20
){
endGame();
}

}

function increaseScore(){

if(gameOver)return;

score++;
scoreDisplay.innerText=score;

}

async function endGame(){

gameOver=true;

document.getElementById("restartBtn").style.display="block";

const user=auth.currentUser;

if(user){

await addDoc(collection(db,"scores"),{
email:user.email,
score:score,
time:Date.now()
});

}

}

window.restartGame=function(){
location.reload();
}

setInterval(moveEnemy,50);
setInterval(increaseScore,1000);

update();
