// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("BohunUpas JS imported successfully!");
});


let dinoSelect = document.querySelector("#dinoSelect")
let dinoCheck = false;

let undeadSelect = document.querySelector("#undeadSelect")
let undeadCheck = false;

let humanSelect = document.querySelector("#humanSelect")
let humanCheck = false;


if (dinoSelect.style.display === "block") {
  dinoCheck = true;
  console.log("dino")
}

if (undeadSelect.style.display === "block") {
  undeadCheck = true;
  console.log("undead")
}

if (humanSelect.style.display === "block") {
  humanCheck = true;
  console.log("human")
}

let noArmor = document.querySelector("#noArmor")
let noArmorCheck = false;

if (noArmor.style.display === "block") {
  noArmorCheck = true;
  console.log("no armor")
}

let noWeapon = document.querySelector("#noWeapon")
let noWeaponCheck = false;

if (noWeapon.style.display === "block") {
  noWeaponCheck = true;
  console.log("no weapon")
}

let souls = parseInt(document.querySelector("#souls").innerHTML)
console.log(souls)

let backgroundTest = new Image();
backgroundTest.src = "../images/CanvasTest.png"

let animateId;

class Player {
  constructor(x, y, width, height, xSpeed, ySpeed, xFacing, yFacing) {
    // Pass in vars
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.xFacing = xFacing;
    this.yFacing = yFacing;

    // Movement / Attack
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.shoot = false;
    this.canShoot = false;
  }

  
}

let xPos = 100;
let yPos = 100;
const xSpeed = 5;
const ySpeed = 5;
let pWidth = 32;
let pHeight = 32;

let xProjPos = xPos + pWidth / 2;
let yProjPos = yPos + pHeight / 2;



window.onload = () => {
  //Canvas
  const myCanvas = document.querySelector("canvas");
  const ctx = myCanvas.getContext("2d");
  myCanvas.style.backgroundColor = "white";
  myCanvas.style.border = "1px solid black";
  myCanvas.style.align = "center";

  function startGame() {
    // Reset for new drawing
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

    //Background Test
    ctx.drawImage(backgroundTest, 0, 0 , 1400, 800);
    
    // Player
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(xPos, yPos, 32, 32);
    ctx.closePath();

    // Movement and Boundaries
    if (moveRight && xPos < myCanvas.width - 32) {
      xPos += xSpeed;
    }
    if (moveLeft && xPos > 0) {
      xPos -= xSpeed;
    }
    if (moveUp && yPos > 0) {
      yPos -= ySpeed;
    }
    if (moveDown && yPos < myCanvas.height - 32) {
      yPos += ySpeed;
    }
    if (isShooting) {
      spawnProjectile();
    }
    // Gameplay loop
    animateId = requestAnimationFrame(startGame);
  }

  function spawnProjectile() {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(xProjPos, yProjPos, 16, 16);
    ctx.closePath();
    xProjPos += 2;
  }
  
  // Controls
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "d": // Right
      case "D":
      case "ArrowRight":
          moveRight = true;
      break;
      case "a": // Left
      case "A":
      case "ArrowLeft":
          moveLeft = true;
      break;
      case "w": // Up
      case "W":
      case "ArrowUp":
          moveUp = true;
      break;
      case "s": // Down
      case "S":
      case "ArrowDown":
          moveDown = true;
      break;
      case " ": // Shoot
          isShooting = true;
          console.log("Shoot")
      break;
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "d": // Right
      case "D":
      case "ArrowRight":
          moveRight = false;
      break;
      case "a": // Left
      case "A":
      case "ArrowLeft":
          moveLeft = false;
      break;
      case "w": // Up
      case "W":
      case "ArrowUp":
          moveUp = false;
      break;
      case "s": // Down
      case "S":
      case "ArrowDown":
          moveDown = false;
      break;
      case " ": // Shoot
          isShooting = false;
      break;
    }
  });

  

  startGame()
}



