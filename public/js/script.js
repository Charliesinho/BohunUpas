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
    
    // Projectile
    this.projX = x + width / 4;
    this.projY = y + height / 4;
    this.projSpeed = 10;
  }
}

const projectileArr = [];

class Projectile {
  constructor(x, y, radius, color, velocity, dmg) {
    this.x = x;
    this.y = y;
    this.radius = radius,
    this.color = color;
    this.velocity = velocity;
    this.dmg = dmg;
  }

  updateProjectile() {
    // Move projectiles
    this.x += this.velocity.x * 7;
    this.y += this.velocity.y * 7;

    // Draw
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
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
        
    // Temp player
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.closePath();
  }

  function spawnProjectile() {
    const projectile = new Projectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 10);
    projectileArr.push(projectile);
    player.canShoot = true;
  }
console.log(player.canShoot)
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
      case "ArrowRight":
          player.moveRight = true;
      break;
      case "a": // Left
      case "A":
      case "ArrowLeft":
          player.moveLeft = true;
      break;
      case "w": // Up
      case "W":
      case "ArrowUp":
          player.moveUp = true;
      break;
      case "s": // Down
      case "S":
      case "ArrowDown":
          player.moveDown = true;
      break;      
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "d": // Right
      case "D":
      case "ArrowRight":
          player.moveRight = false;
      break;
      case "a": // Left
      case "A":
      case "ArrowLeft":
          player.moveLeft = false;
      break;
      case "w": // Up
      case "W":
      case "ArrowUp":
          player.moveUp = false;
      break;
      case "s": // Down
      case "S":
      case "ArrowDown":
          player.moveDown = false;
      break;      
    }
  });
  document.addEventListener("click", (e) => {
    if (player.canShoot) {
      player.canShoot = false;
      setTimeout(() => {
        player.canShoot = true;
      }, 1000)
      const angle = Math.atan2(
        e.clientY - player.y,
        e.clientX - player.x
      );
  
      console.log(window.screenX, window.screenY)
  
      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
  
      const projectile = new Projectile(player.x + player.width / 2, player.y + player.height / 2, 5, "red", velocity, 10);
      projectileArr.push(projectile);      
    }
  });

  startGame()
}



