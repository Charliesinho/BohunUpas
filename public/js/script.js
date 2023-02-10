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
const myCanvas = document.querySelector("canvas");
const ctx = myCanvas.getContext("2d");

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
    this.canShoot = true;
    
    // Shoot
    this.shootRight = false;
    this.shootLeft = false;
    this.shootUp = false;
    this.shootDown = false;
  }

  
  
}

const enemyArr = [];
class Enemy {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

const projectileArr = [];
class Projectile {
  constructor(x, y, rad, color, xDir, yDir, speed, damage) {
    this.x = x;
    this.y = y;
    this.rad = rad,
    this.color = color;
    this.xDir = xDir;
    this.yDir = yDir;
    this.speed = speed;
    this.damage = damage;
  }

  updateProjectile() {
    // Move projectiles
    this.x += this.speed * this.xDir;
    this.y += this.speed * this.yDir;

    // Draw
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2, false);
    ctx.fillStyle = "red"
    ctx.fill();
    ctx.closePath();
  }
}




window.onload = () => {
  myCanvas.style.backgroundColor = "white";
  myCanvas.style.border = "1px solid black";
  myCanvas.style.align = "center";
  const player = new Player(100, 100, 32, 32, 5, 5, 1, 0);

  function startGame() {
    gameplayLoop();
  }

  function gameplayLoop() {
    // Reset for new drawing
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

    //Background Test
    ctx.drawImage(backgroundTest, 0, 0 , 1400, 800);

    // Player
    updatePlayer();
    // Projectiles
    updateProjectiles();

    
    // Gameplay loop
    animateId = requestAnimationFrame(gameplayLoop);
  }

  function updatePlayer() {
    // Movement and Boundaries
    if (player.moveRight && player.x < myCanvas.width - player.width) {
      player.x += player.xSpeed;
    }
    if (player.moveLeft && player.x > 0) {
      player.x -= player.xSpeed;
    }
    if (player.moveUp && player.y > 0) {
      player.y -= player.ySpeed;
    }
    if (player.moveDown && player.y < myCanvas.height - player.height) {
      player.y += player.ySpeed;
    }    
    
    if (player.canShoot) {
      if (player.shootLeft && player.shootUp) { // TOP LEFT
        spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", -1, -1, 8, 10);
      } else if (player.shootUp && player.shootRight) { // TOP RIGHT
        spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 1, -1, 8, 10);
      } else if (player.shootRight && player.shootDown) { // BOTTOM RIGHT
        spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 1, 1, 8, 10);
      } else if (player.shootDown && player.shootLeft) { // BOTTOM LEFT
        spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", -1, 1, 8, 10);
      } else if (player.shootRight) { // RIGHT
        spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 1, 0, 8, 10);
      } else if (player.shootLeft) { // LEFT
        spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", -1, 0, 8, 10);
      } else if (player.shootDown) { // DOWN
        spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 0, 1, 8, 10);
      } else if (player.shootUp) { // UP
        spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 0, -1, 8, 10);
      }
      player.canShoot = false;
      setTimeout(() => {
        player.canShoot = true;
      }, 500)
    }
  
    // Temp player
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.closePath();
  }

  function spawnProjectile(x, y, rad, color, xDir, yDir, speed, damage) {
    const projectile = new Projectile(x, y, rad, color, xDir, yDir, speed, damage);
    projectileArr.push(projectile);
  }

  function updateProjectiles() {
    for (let i = 0; i < projectileArr.length; i++) {
      projectileArr[i].updateProjectile();
    }
  }
  
  // Controls
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "d": // Right
      case "D":
          player.moveRight = true;
      break;
      case "a": // Left
      case "A":
          player.moveLeft = true;
      break;
      case "w": // Up
      case "W":
          player.moveUp = true;
      break;
      case "s": // Down
      case "S":
          player.moveDown = true;
      break;
      case "ArrowRight": // Shoot
        player.shootRight = true;
      break;
      case "ArrowLeft": // Shoot
        player.shootLeft = true;
      break;
      case "ArrowUp": // Shoot
        player.shootUp = true;
      break;
      case "ArrowDown": // Shoot
        player.shootDown = true;
      break;
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "d": // Right
      case "D":
        player.moveRight = false;
      break;
      case "a": // Left
      case "A":
        player.moveLeft = false;
      break;
      case "w": // Up
      case "W":
        player.moveUp = false;
      break;
      case "s": // Down
      case "S":
        player.moveDown = false;
      break;
      case "ArrowRight": // Shoot
        player.shootRight = false;
      break;
      case "ArrowLeft": // Shoot
        player.shootLeft = false;
      break;
      case "ArrowUp": // Shoot
        player.shootUp = false;
      break;
      case "ArrowDown": // Shoot
        player.shootDown = false;
      break;
    }
  });
  
  startGame()
}



