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

let race;

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

if (dinoCheck) {
  race = "Dino"
}
if (undeadCheck) {
  race = "Undead"
}
if (humanCheck) {
  race = "Human"
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

let gifTest = new Image();
gifTest.src = "../images/slime.gif"

let souls = parseInt(document.querySelector("#souls").innerHTML)
console.log(souls)

let backgroundTest = new Image();
backgroundTest.src = "../images/CanvasTest.png"






let animateId;
const myCanvas = document.querySelector("canvas");
const ctx = myCanvas.getContext("2d");

class Player {
  constructor(race, x, y, width, height, xSpeed, ySpeed, xFacing, yFacing) {
    this.type = "player";
    this.race = race;
    
    // Pass in vars
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.xFacing = xFacing;
    this.yFacing = yFacing;

    // Movement
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    // Shoot
    this.shootRight = false;
    this.shootLeft = false;
    this.shootUp = false;
    this.shootDown = false;
    this.shoot = false;
    this.canShoot = true;
    
    // Collision
    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;

    // Gameplay values
    this.takenDamage = false;
    this.iframes = 500;
    this.alive = true;
    this.hp = 20;
  }

  updateCollision() {
    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
  }

  checkCollision(arr, ot, or, ob, ol) {
    for (let i = 0; i < arr.length; i++) {
      if (this.left - ol < arr[i].right &&
        this.right + or > arr[i].left &&
        this.top - ot < arr[i].bottom &&
        this.bottom + ob >= arr[i].top) { 
          if (arr[i].getType() === "environment") {
            return true;
          } else if (arr[i].getType() === "enemy") {
            this.hit(arr[i].damage)
          }
        }
    }
  }

  getType() {
    return this.type;
  }

  getUnstuck() {
    this.x = 100;
    this.y = 300
  }

  hit(damage) {
    if (!this.takenDamage) {
      this.takenDamage = true;
      this.hp -= damage;
      console.log("HIT - ", this.hp)
      if (this.hp <= 0) {
        this.destroy();
      } else {
        setTimeout(() => {
          this.takenDamage = false;
        }, this.iframes)
      }
    }
  }

  destroy() {
    this.alive = false;
  }


}

const enemyArr = [];
class Enemy {
  constructor(name, x, y, width, height) {
    this.type = "enemy"

    this.name = name;    
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.imgContainer = [];
    this.img = new Image();
    this.imageFrames;
    this.spriteSpeed = 12;
    this.currentFrame = 0;

    // Collision
    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;

    // Gameplay values
    this.hp;
    this.iframes = 100;
    this.damage;
    this.takenDamage = false;
  }

  initialize() {
    if (this.name === "slime") {
      this.hp = 10;
      this.damage = 1;
      this.imageFrames = 4;
      for (let i = 0; i < this.imageFrames; i++) {
        this.imgContainer.push("../images/Meadow/Slime/slime"+i+".png");
      }
    }
  } 

  updateCollision() {
    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
  }

  hit(damage) {
    this.takenDamage = true;
    this.hp -= damage;
    if (this.hp <= 0) {
      this.destroy();
    } else {
      setTimeout(() => {
        this.takenDamage = false;
      }, this.iframes)
    }
  }

  destroy() {
    const posInArr = enemyArr.indexOf(this);
    enemyArr.splice(posInArr, 1);
  }

  getType() {
    return this.type; 
  }
}

const projectileArr = [];
class Projectile {
  constructor(x, y, rad, color, xDir, yDir, speed, damage) {
    this.type = "projectile";

    this.x = x;
    this.y = y;
    this.rad = rad,
    this.color = color;
    this.xDir = xDir;
    this.yDir = yDir;
    this.speed = speed;
    this.damage = damage;

    // Collision
    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
  }

  updateProjectile() {
    // Collision
    this.left = this.x;
    this.right = this.x + this.rad / 2;
    this.top = this.y;
    this.bottom = this.y + this.rad / 2;

    // Move projectiles
    this.x += this.speed * this.xDir;
    this.y += this.speed * this.yDir;

    // Draw
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  checkCollision(arr, ot, or, ob, ol) {
    for (let i = 0; i < arr.length; i++) {
      if (this.left - ol < arr[i].right &&
        this.right + or > arr[i].left &&
        this.top - ot < arr[i].bottom &&
        this.bottom + ob >= arr[i].top) { 
          // Enemy Collision
          if (arr[i].getType() === "enemy") {
            const projectile = projectileArr.indexOf(this);
            if (!arr[i].takenDamage) arr[i].hit(projectileArr[projectile].damage);
            projectileArr[projectile].destroy();
            break;
          } 
          this.destroy();
        }
    }
    // Leaving canvas
    if (this.x < 0 || this.y < 0 || this.x > myCanvas.width + this.rad || this.y > myCanvas.height + this.height) {
      this.destroy();
    }
  }

  destroy() {
    const posInArr = projectileArr.indexOf(this);
    projectileArr.splice(this, 1);
  }

  getType() {
    return this.type;
  }
}

const collisionObjectArr = [];
class CollisionObject {
  constructor(x, y, width, height, type, debug) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.debug = debug;

    // Collision
    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
  }

  updateCollisionObjects() {
    if (this.debug) {
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.5";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.closePath();
    }
  }

  getType() {
    return this.type;
  }
}

window.onload = () => {
  myCanvas.style.backgroundColor = "white";
  myCanvas.style.border = "1px solid black";
  myCanvas.style.align = "center";
  const player = new Player(race ,100, 300, 32, 32, 5, 5, 1, 0);

  function startGame() {
    // TOP LEFT TREE GROUP
    collisionObjectArr.push(new CollisionObject(0, 0, 225, 50, "environment", false));
    collisionObjectArr.push(new CollisionObject(0, 50, 175, 25, "environment", false));
    collisionObjectArr.push(new CollisionObject(0, 75, 125, 25, "environment", false));
    collisionObjectArr.push(new CollisionObject(0, 100, 90, 40, "environment", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 64, myCanvas.height / 2 - 48, 110, 75, "environment", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 70, 0, 55, 55, "environment", false));

    // TOP RIGHT TREE GROUP
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 300, 0, 300, 80, "environment", true));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 270, 150, 300, 25, "environment", true));

    // ROOM TRANSITIONING TOP
    collisionObjectArr.push(new CollisionObject(myCanvas.width/4 - 70, 0, 305, 30, "roomtransit", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width/2 - 15, 0, 320, 30, "roomtransit", false));

    const slime = new Enemy("slime", 900, 400, 75, 70);
    slime.initialize();
    enemyArr.push(slime);
    const slime2 = new Enemy("slime", 200, 200, 75, 70);
    slime2.initialize();
    enemyArr.push(slime2);

    gameplayLoop();
  }

  function gameplayLoop() {
    // Reset for new drawing
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

    //Background Test
    ctx.drawImage(backgroundTest, 0, 0 , 1200, 700);    

    // Player
    updatePlayer();
    // Projectiles
    updateProjectiles();
    //Enemies
    updateEnemies();
    // Collisions
    updateCollisionObjects();
    
    // Gameplay loop
    animateId = requestAnimationFrame(gameplayLoop);
  }

  function updatePlayer() {
    if (player.alive) {
      // Collision
      player.updateCollision();
      player.checkCollision(enemyArr, 0, 0, 0, 0);

      // Movement and Boundaries
      if (player.moveRight && player.x < myCanvas.width - player.width && !player.checkCollision(collisionObjectArr, 0, 5, 0, 0)) {
        player.x += player.xSpeed;
      }
      if (player.moveLeft && player.x > 0 && !player.checkCollision(collisionObjectArr, 0, 0, 0, 5)) {
        player.x -= player.xSpeed;
      }
      if (player.moveUp && player.y > 0 && !player.checkCollision(collisionObjectArr, 5, 0, 0, 0)) {
        player.y -= player.ySpeed;
      }
      if (player.moveDown && player.y < myCanvas.height - player.height && !player.checkCollision(collisionObjectArr, 0, 0, 5, 0)) {
        player.y += player.ySpeed;
      }
      
      // Shooting
      if (player.canShoot) {
        if (player.shootLeft && player.shootUp) { // TOP LEFT
          spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", -1, -1, 8, 5);
        } else if (player.shootUp && player.shootRight) { // TOP RIGHT
          spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 1, -1, 8, 5);
        } else if (player.shootRight && player.shootDown) { // BOTTOM RIGHT
          spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 1, 1, 8, 5);
        } else if (player.shootDown && player.shootLeft) { // BOTTOM LEFT
          spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", -1, 1, 8, 5);
        } else if (player.shootRight) { // RIGHT
          spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 1, 0, 8, 5);
        } else if (player.shootLeft) { // LEFT
          spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", -1, 0, 8, 5);
        } else if (player.shootDown) { // DOWN
          spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 0, 1, 8, 5);
        } else if (player.shootUp) { // UP
          spawnProjectile(player.x + 16 / 2, player.y + 16 / 2, 16, "red", 0, -1, 8, 5);
        }
        player.canShoot = false;
        setTimeout(() => {
          player.canShoot = true;
        }, 500);
      }

      // Temp player
      ctx.beginPath();
      if (player.race === "Dino") {
        ctx.fillStyle = "green";            
      }
      else if (player.race === "Undead") {        
        ctx.fillStyle = "black";         
      }
      else if (player.race === "Human") {        
        ctx.fillStyle = "yellow";
      }
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.closePath();
    }
  }

  //Update Enemies
  function updateEnemies() {
    for (let i = 0; i < enemyArr.length; i++) {
      enemyArr[i].x += .1;
      enemyArr[i].updateCollision();
      animate(enemyArr[i], enemyArr[i].spriteSpeed);
    }
  }

  function spawnProjectile(x, y, rad, color, xDir, yDir, speed, damage) {
    const projectile = new Projectile(x, y, rad, color, xDir, yDir, speed, damage);
    projectileArr.push(projectile);
  }

  function updateProjectiles() {
    for (let i = 0; i < projectileArr.length; i++) {
        if (projectileArr[i] !== undefined) projectileArr[i].updateProjectile();
        if (projectileArr[i] !== undefined)projectileArr[i].checkCollision(enemyArr, 0, 0, 0, 0);
        if (projectileArr[i] !== undefined)projectileArr[i].checkCollision(collisionObjectArr, 0, 0, 0, 0);
    }
  }

  function updateCollisionObjects() {
    for (let i = 0; i < collisionObjectArr.length; i++) {
      collisionObjectArr[i].updateCollisionObjects();
    }
  }

  function animate(obj, speed) {
    // Reset the sprite count
    if (obj.currentFrame >= obj.imageFrames - 1) {
      // Reset frames
      if (animateId % speed === 0) {
        obj.currentFrame = -1;
      }
    }

    // Reset frames
    if (animateId % speed === 0) {
      obj.currentFrame++;
    }
    obj.img.src = obj.imgContainer[obj.currentFrame];
    // Draw sprite
    ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
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
      case "p": // Shoot
      case "P": // Shoot
        player.getUnstuck();
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



