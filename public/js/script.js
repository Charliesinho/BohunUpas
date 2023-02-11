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

let souls = parseInt(document.querySelector("#souls").innerHTML)




// Backgrounds
const backgroundArrMeadow = [];
const backgroundArrCave = [];
let background = new Image();

let levelMeadowInit = false;
let levelCaveInit = false;

let screen0init = false;
let screen1init = false;
let screen2init = false;
let screen3init = false;
let screen4init = false;

let levelScreen = 0;

let animateId;
let roomTransit = false;
let transitSpeed = 5;
let transitDir = "";
const myCanvas = document.querySelector("canvas");
const ctx = myCanvas.getContext("2d");

class Background {
  constructor(x, y, width, height, source) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.source = source;

    this.img = new Image();
    this.img.src = this.source;
  }
}

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

    //Animation
    this.shadow = new Image();
    this.shadow.src = "../images/ShadowPlayer.png"
    this.imgContainerRight = [];
    this.imgContainerLeft = [];
    this.imgContainerIdleLeft = [];
    this.imgContainerIdleRight = [];

    this.img = new Image();
    this.imageFrames;
    this.spriteSpeed = 12;
    this.currentFrame = 0;

    // Equipment
    this.weaponShootInterval = 300;
    this.weaponLifeSpan = 30;
    this.armor = 2;

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

  initialize() {
    if (this.race === "Dino") {      
      for (let i = 0; i < 6; i++) {
        this.imgContainerRight.push("../images/Races/Dino/RunRight/dino"+i+".png");
        this.imgContainerLeft.push("../images/Races/Dino/RunLeft/dino"+i+".png");
      }
      for (let i = 0; i < 4; i++) {
        this.imgContainerIdleLeft.push("../images/Races/Dino/IdleLeft/dino"+i+".png");
        this.imgContainerIdleRight.push("../images/Races/Dino/IdleRight/dino"+i+".png");
      }
    } console.log(this.imgContainerRight)
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
          } else if (arr[i].getType() === "roomtransit" && !roomTransit) {
            roomTransit = true;
            levelScreen = arr[i].nextScreen;
            transitDir = arr[i].transitDir;
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
    // Check iframes
    if (!this.takenDamage) {
      this.takenDamage = true;
      // Receive Damage
      if (damage - this.armor > 0) {
        this.hp -= damage - this.armor;
      } else {
        this.hp -= 1;
      }
      console.log("HIT - ", this.hp)
      // Kill player
      if (this.hp <= 0) {
        this.destroy();
      } else { // Reset iframes
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
    this.souls = 0;

    this.name = name;    
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.screen = levelScreen;

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
    this.randomMoveTimer;
    this.moveSpeed;
    this.moveTo;
  }

  initialize() {
    if (this.name === "slime") {
      this.souls = 1;
      this.hp = 10;
      this.damage = 5;
      this.imageFrames = 4;
      this.moveSpeed = 1;
      this.randomMoveTimer = Math.floor(Math.random() * (400 - 200) + 200);
      this.moveTo = this.getRandomCoordinates();
      this.moveTowardsTarget(this.moveTo);
      for (let i = 0; i < this.imageFrames; i++) {
        this.imgContainer.push("../images/Meadow/Slime/slime"+i+".png");
      }
    }
  } 

  getRandomCoordinates() {
    const randomPointX = myCanvas.width;
    const randomPointY = myCanvas.height;
    const randomCoordinates = {
      x: Math.floor(Math.random() * ((randomPointX - this.width - 60) - (this.width + 60) + (this.width + 60))),
      y: Math.floor(Math.random() * ((randomPointY - this.height - 60) - (this.height + 60) + (this.width + 60))),
    };
    return randomCoordinates;
  }

  checkCollision(arr, ot, or, ob, ol) {
    for (let i = 0; i < arr.length; i++) {
      if (this.left - ol < arr[i].right &&
        this.right + or > arr[i].left &&
        this.top - ot < arr[i].bottom &&
        this.bottom + ob >= arr[i].top) { 
          if (arr[i].getType() === "environment") {
            return true;
          }
      }
    }
  }

  moveTowardsTarget(randomCoordinates) {
    // Horizontal Movement
    if (this.x < randomCoordinates.x && this.x < myCanvas.width - this.width && !this.checkCollision(collisionObjectArr, 0, 10, 0, 0)) {
      this.x += this.moveSpeed;
    } else if (this.x > randomCoordinates.x && this.x > 0 && !this.checkCollision(collisionObjectArr, 0, 0, 0, 10)) {
      this.x -= this.moveSpeed;
    }
    // Vertial Movement
    if (this.y > randomCoordinates.y && this.y > 0 && !this.checkCollision(collisionObjectArr, 10, 0, 0, 0)) {
      this.y -= this.moveSpeed;
    } else if (this.x < randomCoordinates.y && this.y < myCanvas.height - this.height && !this.checkCollision(collisionObjectArr, 0, 0, 10, 0)) {
      this.y += this.moveSpeed;
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
    this.dropSouls()
    const posInArr = enemyArr.indexOf(this);
    enemyArr.splice(posInArr, 1);
  }

  dropSouls() {
    souls += this.souls;
  }

  getType() {
    return this.type; 
  }
}


const projectileArr = [];
class Projectile {
  constructor(x, y, rad, color, xDir, yDir, speed, damage, lifeSpan) {
    this.type = "projectile";

    this.x = x;
    this.y = y;
    this.rad = rad,
    this.color = color;
    this.xDir = xDir;
    this.yDir = yDir;
    this.speed = speed;
    this.damage = damage;
    this.lifeSpan = lifeSpan;

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
    if (this.xDir + this.yDir === 1) {
      this.x += this.speed * this.xDir;
      this.y += this.speed * this.yDir;
    } else {
      this.x += this.speed / 1.4 * this.xDir;
      this.y += this.speed / 1.4 * this.yDir;
    }
    // Draw
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    // Destory if lifeSpan reached
    this.lifeSpan--;
    if (this.lifeSpan <= 0) {
      this.destroy();
    }
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
          if (arr[i].getType() === "environment") {
            this.destroy();
          }
        }
    }
    // Leaving canvas
    if (this.x < 0 || this.y < 0 || this.x > myCanvas.width + this.rad || this.y > myCanvas.height + this.height) {
      this.destroy();
    }
  }

  destroy() {
    const posInArr = projectileArr.indexOf(this);
    projectileArr.splice(posInArr, 1);
  }

  getType() {
    return this.type;
  }
}

const collisionObjectArr = [];
class CollisionObject {
  constructor(x, y, width, height, type, nextScreen, transitDir, debug) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.nextScreen = nextScreen;
    this.transitDir = transitDir;
    this.debug = debug;

    // Collision
    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
  }

  updateCollisionObjects() {
    // Update Collisions
    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
    
    // Show Collisions
    if (this.debug) {
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.closePath();
    }
  }

  getType() {
    return this.type;
  }

  getNextScreen() {
    return this.nextScreen;
  }
}

window.onload = () => {
  myCanvas.style.backgroundColor = "white";
  myCanvas.style.border = "1px solid black";
  myCanvas.style.align = "center";
  const player = new Player(race ,100, 300, 75, 75, 5, 5, 1, 0);

  function startGame() {
    player.initialize()
    checkLevelScreen(levelScreen);
    gameplayLoop();
  }
  
  startGame();

  function checkLevelScreen(levelScreen) {
    switch (levelScreen) {
      // Meadow Screens
      case 0:
        if (!levelMeadowInit) loadMedow();
        if (!screen0init) loadScreen0();
        background.src = backgroundArrMeadow[0].source;
        break;
      case 1:
        if (!levelMeadowInit) loadMedow();
        if (!screen1init) loadScreen1();
        background.src = backgroundArrMeadow[1].source;
        break;
      case 2:
        if (!levelMeadowInit) loadMedow();
        if (!screen2init) loadScreen2();
        background.src = backgroundArrMeadow[2].source;
        break;
      case 3:
        if (!levelMeadowInit) loadMedow();
        if (!screen3init) loadScreen3();
        background.src = backgroundArrMeadow[3].source;
        break;
      case 4:
        if (!levelMeadowInit) loadMedow();
        if (!screen4init) loadScreen4();
        background.src = backgroundArrMeadow[4].source;
        break;
      // Cave Screens
    }
  }

  function gameplayLoop() {
    if (!roomTransit) {
      cancelAnimationFrame(animateId);
      // Reset for new drawing
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
      //Background Test
      ctx.drawImage(background, 0, 0 , 1200, 700);   
      // Player
      updatePlayer();
      // Projectiles
      updateProjectiles();
      //Enemies
      updateEnemies();
      // Collisions
      updateCollisionObjects();
      document.querySelector("#souls").innerHTML = souls
      // Gameplay loop
      animateId = requestAnimationFrame(gameplayLoop);
    } else {
      cancelAnimationFrame(animateId);
      // Transit
      roomTransitioning();
    }
  }

  // Transit rooms
  function roomTransitioning() {
    // Reset for new drawing
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    // Moving DOWN a screen
    if (transitDir === "down" && backgroundArrMeadow[levelScreen].y < 0) {
      transitMoveElements();
    // Moving UP a screen
    } else if (transitDir === "up" && backgroundArrMeadow[levelScreen].y > 0) {
      transitMoveElements();
    // Resume Game
    } else {
      roomTransit = false;
      checkLevelScreen(levelScreen);
      gameplayLoop(); 
    }
    // Loop
    requestAnimationFrame(gameplayLoop);
  }

  function transitMoveElements() {
    // Shift and draw backgrounds
    for (let i = 0; i < backgroundArrMeadow.length; i++) {
      if (transitDir === "up") backgroundArrMeadow[i].y -= transitSpeed;
      if (transitDir === "down") backgroundArrMeadow[i].y += transitSpeed;
      ctx.drawImage(backgroundArrMeadow[i].img, backgroundArrMeadow[i].x, backgroundArrMeadow[i].y, backgroundArrMeadow[i].width, backgroundArrMeadow[i].height);
    }
    // Shift enemies
    for (let i = 0; i < enemyArr.length; i++) {
      if (transitDir === "up") enemyArr[i].y -= transitSpeed;
      if (transitDir === "down") enemyArr[i].y += transitSpeed;
      enemyArr[i].img.src = enemyArr[i].imgContainer[0];
      ctx.drawImage(enemyArr[i].img, enemyArr[i].x, enemyArr[i].y, enemyArr[i].width, enemyArr[i].height)
    }
    // Shift collisions
    for (let i = 0; i < collisionObjectArr.length; i++) {
      if (transitDir === "up") collisionObjectArr[i].y -= transitSpeed;
      if (transitDir === "down") collisionObjectArr[i].y += transitSpeed;
    }
    // Destroy Projectiles
    for (let i = 0; i < projectileArr.length; i++) {
      projectileArr[i].destroy();
    }
    // Player
    if (transitDir === "up") player.y -= transitSpeed - 1;
    if (transitDir === "down") player.y += transitSpeed - 1;
    animate(player, player.imgContainerRight, 6, 8);
  }



  function updatePlayer() {
    if (player.alive) {
      // Collision
      player.updateCollision();
      player.checkCollision(enemyArr, 0, 0, 0, 0);

      // Movement and Boundaries
      ctx.globalAlpha = 0.4;
      ctx.drawImage(player.shadow, player.x - 2, player.y, player.width, player.height)
      ctx.globalAlpha = 1;

      if (player.moveRight && player.x < myCanvas.width - player.width) {
        if (!player.checkCollision(collisionObjectArr, 0, 5, 0, 0)) player.x += player.xSpeed;
        player.xFacing = 1;
        animate(player, player.imgContainerRight, 6, 8);
      }
      if (player.moveLeft && player.x > 0) {
        if (!player.checkCollision(collisionObjectArr, 0, 0, 0, 5)) player.x -= player.xSpeed
        player.xFacing = -1;
        animate(player, player.imgContainerLeft, 6, 8);
      }
      if (player.moveUp && player.y > 0) {
        if (!player.checkCollision(collisionObjectArr, 5, 0, 0, 0)) player.y -= player.ySpeed;
        if(player.xFacing === 1 && !player.moveRight) {
          animate(player, player.imgContainerRight, 6, 8);
        }
        if(player.xFacing === -1 && !player.moveLeft) {
          animate(player, player.imgContainerLeft, 6, 8);
        }
      }
      if (player.moveDown && player.y < myCanvas.height - player.height) {
        if (!player.checkCollision(collisionObjectArr, 0, 0, 5, 0)) player.y += player.ySpeed;
        if(player.xFacing === 1 && !player.moveRight) {
          animate(player, player.imgContainerRight, 6, 8);
        }
        if(player.xFacing === -1 && !player.moveLeft) {
          animate(player, player.imgContainerLeft, 6, 8);
        }     
      }
      if (!player.moveDown && !player.moveLeft && !player.moveRight && !player.moveUp) {
        if(player.xFacing === 1) {
          animate(player, player.imgContainerIdleRight, 4, 6);
        }
        if(player.xFacing === -1) {
          animate(player, player.imgContainerIdleLeft, 4, 6);
        }
      }
      
      // Shooting
      if (player.canShoot) {
        if (player.shootLeft && player.shootUp) { // TOP LEFT
          spawnProjectile(player.x + player.width / 2, player.y + player.height / 2, 16, "red", -1, -1, 8, 5, player.weaponLifeSpan);
        } else if (player.shootUp && player.shootRight) { // TOP RIGHT
          spawnProjectile(player.x + player.width / 2, player.y + player.height / 2, 16, "red", 1, -1, 8, 5, player.weaponLifeSpan);
        } else if (player.shootRight && player.shootDown) { // BOTTOM RIGHT
          spawnProjectile(player.x + player.width / 2, player.y + player.height / 2, 16, "red", 1, 1, 8, 5, player.weaponLifeSpan);
        } else if (player.shootDown && player.shootLeft) { // BOTTOM LEFT
          spawnProjectile(player.x + player.width / 2, player.y + player.height / 2, 16, "red", -1, 1, 8, 5, player.weaponLifeSpan);
        } else if (player.shootRight) { // RIGHT
          spawnProjectile(player.x + player.width / 2, player.y + player.height / 2, 16, "red", 1, 0, 8, 5, player.weaponLifeSpan);
        } else if (player.shootLeft) { // LEFT
          spawnProjectile(player.x + player.width / 2, player.y + player.height / 2, 16, "red", -1, 0, 8, 5, player.weaponLifeSpan);
        } else if (player.shootDown) { // DOWN
          spawnProjectile(player.x + player.width / 2, player.y + player.height / 2, 16, "red", 0, 1, 8, 5, player.weaponLifeSpan);
        } else if (player.shootUp) { // UP
          spawnProjectile(player.x + player.width / 2, player.y + player.height / 2, 16, "red", 0, -1, 8, 5, player.weaponLifeSpan);
        }
        player.canShoot = false;
        setTimeout(() => {
          player.canShoot = true;
        }, player.weaponShootInterval); // Passing in shootInterval from player as timeout value
      }      
    }
  }

  //Update Enemies
  function updateEnemies() {
    for (let i = 0; i < enemyArr.length; i++) {
      if (animateId % enemyArr[i].randomMoveTimer === 0) {
        enemyArr[i].moveTo = enemyArr[i].getRandomCoordinates();
      }
        
      enemyArr[i].moveTowardsTarget(enemyArr[i].moveTo);
      enemyArr[i].updateCollision();
      animate(enemyArr[i], enemyArr[i].imgContainer, enemyArr[i].imageFrames, enemyArr[i].spriteSpeed);
    }
  }

  function spawnProjectile(x, y, rad, color, xDir, yDir, speed, damage, lifeSpan) {
    const projectile = new Projectile(x, y, rad, color, xDir, yDir, speed, damage, lifeSpan);
    projectileArr.push(projectile);
  }

  function updateProjectiles() {
    for (let i = 0; i < projectileArr.length; i++) {
        if (projectileArr[i] !== undefined) projectileArr[i].updateProjectile();
        if (projectileArr[i] !== undefined) projectileArr[i].checkCollision(enemyArr, 0, 0, 0, 0);
        if (projectileArr[i] !== undefined) projectileArr[i].checkCollision(collisionObjectArr, 0, 0, 0, 0);
    }
  }

  function updateCollisionObjects() {
    for (let i = 0; i < collisionObjectArr.length; i++) {
      collisionObjectArr[i].updateCollisionObjects();
    }
  }

  function animate(obj, imgContainer, imageFrames, speed) {
    // Reset the sprite count
    if (obj.currentFrame >= imageFrames - 1) {
      // Reset frames
      if (animateId % speed === 0) {
        obj.currentFrame = -1;
      }
    }

    // Reset frames
    if (animateId % speed === 0) {
      obj.currentFrame++;
    }
    obj.img.src = imgContainer[obj.currentFrame];
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


  // SCREENS AND LEVELS DEFINED HERE
  function loadMedow() {
    // Get Backgrounds
    backgroundArrMeadow.push(new Background(0, 0, myCanvas.width, myCanvas.height, `../images/Meadow/Backgrounds/meadow0.png`));
    backgroundArrMeadow.push(new Background(0, -myCanvas.height, myCanvas.width, myCanvas.height, `../images/Meadow/Backgrounds/meadow1.png`));
    backgroundArrMeadow.push(new Background(0, myCanvas.height, myCanvas.width, myCanvas.height, `../images/Meadow/Backgrounds/meadow2.png`));
    levelMeadowInit = true;
  }

  function loadScreen0() {
    // TOP LEFT TREE GROUP
    collisionObjectArr.push(new CollisionObject(0, 0, 225, 50, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(0, 50, 175, 25, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(0, 75, 125, 25, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(0, 100, 90, 40, "environment", -1, "", false));
    // MIDDLE STONES
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 64, myCanvas.height / 2 - 48, 110, 75, "environment", "", false));
    // TOP CENTER TREE
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 70, 0, 55, 55, "environment", -1, "", false));
    // TOP RIGHT TREE GROUP
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 300, 0, 300, 80, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 255, 80, 300, 25, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 200, 105, 300, 25, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 42, 130, 300, 25, "environment", -1, "", false));
    // BOTTOM RIGHT TREE GROUP
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 250, myCanvas.height - 30, 250, 25, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 220, myCanvas.height - 55, 250, 25, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 180, myCanvas.height - 80, 250, 25, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 100, myCanvas.height - 97, 250, 17, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 40, myCanvas.height - 114, 250, 17, "environment", -1, "", false));
    // BOTTOM LEFT TREE GROUP
    collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 30, 195, 30, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 60, 150, 30, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 75, 80, 15, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 105, 35, 30, "environment", -1, "", false));
    // ROOM TRANSITIONING TOP
    collisionObjectArr.push(new CollisionObject(myCanvas.width/4 - 70, 0, 305, 15, "roomtransit", 1, "down", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width/2 - 15, 0, 320, 15, "roomtransit", 1, "down", false));
    // ROOM TRANSITIONING RIGHT
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 15, 155, 15, 430, "roomtransit", false));
    // ROOM TRANSITIONING BOTTOM
    collisionObjectArr.push(new CollisionObject(212, myCanvas.height - 15, 740, 15, "roomtransit", 2, "up", false));
    // ROOM TRANSITIONING LEFT
    collisionObjectArr.push(new CollisionObject(0, 150, 15, 440, "roomtransit", false));

    // ENEMIES
    enemyArr.push(new Enemy("slime", 900, 400, 90, 80));
    enemyArr.push(new Enemy("slime", 200, 200, 90, 80));
    enemyArr.push(new Enemy("slime", 300, 600, 90, 80));
    enemyArr.push(new Enemy("slime", 500, 600, 90, 80));
    enemyArr.push(new Enemy("slime", 200, 500, 90, 80));
    enemyArr.push(new Enemy("slime", 800, 600, 90, 80));
    
    // Initialize enemies
    for (let i = 0; i < enemyArr.length; i++) {
      enemyArr[i].initialize();
    }

    screen0init = true;
  }

  function loadScreen1() {
    // TREES TOP GROUP
    collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width, 75, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(0, 75, 125, 25, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(0, 100, 90, 40, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 4 + 40, 75, 50, 22, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 52, 75, 50, 22, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 152, 75, 50, 22, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 340, 75, 300, 22, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 390, 97, 300, 25, "environment", -1, "", false));
    // TREES RIGHT GROUP
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 75, 122, 90, 120, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 45, 242, 45, myCanvas.height - 242, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 73, 480, 28, 300, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 154, myCanvas.height - 85, 81, 85, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 194, myCanvas.height - 36, 40, 36, "environment", -1, "", false));
    // TREES LEFT GROUP
    collisionObjectArr.push(new CollisionObject(0, 140, 40, myCanvas.height - 140, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(40, myCanvas.height - 45, 160, 45, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(40, myCanvas.height - 105, 60, 105, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(40, myCanvas.height - 205, 40, 205, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(40, 190, 10, 305, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(50, 190, 15, 80, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(50, 270, 30, 160, "environment", -1, "", false));
    // FOUNTAIN
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 180, myCanvas.height / 2 - 85, 350, 240, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 170, myCanvas.height / 2 - 40, 400, 148, "environment", -1, "", false));
    // ROOM TRANSIT
    collisionObjectArr.push(new CollisionObject(190, myCanvas.height - 15, 820, 15, "roomtransit", 0, "up", false));

    screen1init = true;
  }
  
  function loadScreen2() {
    // TREES LEFT GROUP
    collisionObjectArr.push(new CollisionObject(0, 0, 40, myCanvas.height, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(40, 0, 185, 45, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(40, 45, 150, 30, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(40, 75, 90, 30, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(40, 105, 50, 30, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(40, 190, 25, 240, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(65, 270, 15, 160, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(40, 430, 10, 280, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(50, 495, 30, 210, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(80, 590, 30, 110, "environment", -1, "", false));
    // TREES BOTTOM GROUP
    collisionObjectArr.push(new CollisionObject(110, 635, 315, 110, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(425, 665, 245, 110, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(670, 650, 550, 110, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(935, 610, 550, 40, "environment", -1, "", false));
    // TREES RIGHT GROUP
    collisionObjectArr.push(new CollisionObject(900, 0, 300, 80, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(940, 80, 270, 20, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(1000, 100, 270, 20, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 40, 120, 40, 500, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 80, 120, 40, 120, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width - 70, 450, 30, 160, "environment", -1, "", false));
    // RUINS
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 65, myCanvas.height / 2 - 145, 30, 160, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 35, myCanvas.height / 2 - 145, 90, 120, "environment", -1, "", false));
    collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 55, myCanvas.height / 2 - 95, 20, 70, "environment", -1, "", false));
    // ROOM TRANSITIONING
    collisionObjectArr.push(new CollisionObject(230, 0, 675, 15, "roomtransit", 0, "down", false));

    screen2init = true;

  }

  function loadScreen3() {

    screen3init = true;

  }

  function loadScreen4() {

    screen4init = true;

  }
}

