function ShowBasic() {
  if (document.getElementById("basicPack").style.display === "block") {
    document.getElementById("basicPack").style.display = "none";
  } else {
    document.getElementById("basicPack").style.display = "block";
    document.getElementById("mediumPack").style.display = "none";
    document.getElementById("legendaryPack").style.display = "none";
  }
}

function ShowMedium() {
  if (document.getElementById("mediumPack").style.display === "block") {
    document.getElementById("mediumPack").style.display = "none";
  } else {
    document.getElementById("mediumPack").style.display = "block";
    document.getElementById("legendaryPack").style.display = "none";
    document.getElementById("basicPack").style.display = "none";
  }
}

function ShowLegendary() {
  if (document.getElementById("legendaryPack").style.display === "block") {
    document.getElementById("legendaryPack").style.display = "none";
  } else {
    document.getElementById("legendaryPack").style.display = "block";
    document.getElementById("mediumPack").style.display = "none";
    document.getElementById("basicPack").style.display = "none";
  }
}

window.addEventListener("load", () => {
  setTimeout(() => {  
    if (document.getElementById("mediumPack")) {
    if (document.getElementById("mediumPack").style.display === "block") {
      document.getElementById("mediumPack").style.display = "none";
    }}
  
    if (document.getElementById("mediumPack")) {
    if (document.getElementById("legendaryPack").style.display === "block") {
      document.getElementById("legendaryPack").style.display = "none";
    }}
  }, 3000)
  
  setTimeout(() => {    
      if (document.getElementById("caveMap")) document.getElementById("caveMap").style.display = "none";  
  }, 2000)
  
  const saveBtn = document.querySelector("#saveGameButton");
  
  document.addEventListener("DOMContentLoaded", () => {
    console.log("BohunUpas JS imported successfully!");
  });
  
  let session = document.querySelector("#sessionInProgress");
  let sessionInProgress = false;
  
  // Run if logged in
  if (session) {
    if (session.style.display === "block") {
      sessionInProgress = true;
    }
  }
  
  // All code execution only if session
  if (sessionInProgress) {
    // Get races
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
    if (dinoCheck) race = "Dino";
    if (undeadCheck) race = "Undead";
    if (humanCheck) race = "Human";
    
    // Equipment based stats
    let gDamage, gDefense, gModifier
    if (document.querySelector("#noWeapon").style.display === "block") {
      gDamage = parseInt(document.querySelector("#damage").innerHTML);
    } else {
      gDamage = 1;
    }
    if (document.querySelector("#noArmor").style.display === "block") {
      gDefense = parseInt(document.querySelector("#defense").innerHTML);
    } else {
      gDefense = 1;
    }
    if (document.querySelector("#noArtefact").style.display === "block") {
      gModifier = parseInt(document.querySelector("#artefactmodifier").innerHTML);
    } else {
      gModifier = 1;
    }
  
    // Equipment fetch
    const projectileImgArr = [];
    let gWeapon, gArmor, gArtefact; //Equipment
    let souls, experience, gLevel; // Stats
    if (document.querySelector("#noWeapon").style.display === "block") {
      gWeapon = document.querySelector("#weaponname").innerHTML;
      souls = parseInt(document.querySelector("#souls").value)
      experience = parseInt(document.querySelector("#experience").value)
      gLevel = parseInt(document.querySelector("#level").innerHTML)  
    } else {
      gWeapon = "";
      souls = parseInt(document.querySelector("#souls").value)
      experience = parseInt(document.querySelector("#experience").value)
      gLevel = 1; 
    }
    if (document.querySelector("#noArmor").style.display === "block") {
      gArmor = document.querySelector("#armorname").innerHTML;
    } else {
      gArmor = "";
    }
    if (document.querySelector("#noArtefact").style.display === "block") {
      gArtefact = document.querySelector("#artefactname").innerHTML;
    } else {
      gArtefact = "";
    }

    // Add Achievements
    //const achievementCtn = document.querySelector("#achievementContainer");

    // World  
    let screen0init = false;
    let screen1init = false;
    let screen2init = false;
    let screen3init = false;
    let screen4init = false;
    let screen5init = false;
    let screen6init = false;
    let screen7init = false;
    let screen8init = false;
    let screen9init = false;
    
    let level4MeadowSpawn = true;
    let level2CaveSpawn = true;
  
    let currentLevel = "Meadow";
    let levelScreen = 0;
  
    let roomTransit = false;
    let transitSpeed = 0.5;
    let transitDir = "";
    let enemySpawnInProgress = false;
    const myCanvas = document.querySelector("canvas");
    const ctx = myCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
  
    class InputHandler {
      constructor(game, player) {
        this.game = game;
        this.player = player;
        // Controls
        document.addEventListener("keydown", (e) => {
          switch (e.key) {
            case "d": // Right
            case "D":
              this.player.moveRight = true;
            break;
            case "a": // Left
            case "A":
              this.player.moveLeft = true;
            break;
            case "w": // Up
            case "W":
              this.player.moveUp = true;
            break;
            case "s": // Down
            case "S":
              this.player.moveDown = true;
            break;
            case "ArrowRight": // Shoot
              this.player.shootRight = true;
            break;
            case "ArrowLeft": // Shoot
              this.player.shootLeft = true;
            break;
            case "ArrowUp": // Shoot
              this.player.shootUp = true;
            break;
            case "ArrowDown": // Shoot
              this.player.shootDown = true;
            break;
            case "p": // Shoot
            case "P": // Shoot
              this.player.getUnstuck();
            break;
          }
        });
        document.addEventListener("keyup", (e) => {
          switch (e.key) {
            case "d": // Right
            case "D":
              this.player.moveRight = false;
            break;
            case "a": // Left
            case "A":
              this.player.moveLeft = false;
            break;
            case "w": // Up
            case "W":
              this.player.moveUp = false;
            break;
            case "s": // Down
            case "S":
              this.player.moveDown = false;
            break;
            case "ArrowRight": // Shoot
              this.player.shootRight = false;
            break;
            case "ArrowLeft": // Shoot
              this.player.shootLeft = false;
            break;
            case "ArrowUp": // Shoot
              this.player.shootUp = false;
            break;
            case "ArrowDown": // Shoot
              this.player.shootDown = false;
            break;
          }
        });  
      }
    }

    class Game {
      constructor(width, height) {
        this.width = width;
        this.height = height;
        this.backgrounds = [];
        this.player = new Player(this, race, 800, 270, 80, 80, 0.3, 0.2, 1, 0);
        this.enemies = [];
        this.projectiles = [];
        this.input = new InputHandler(this, this.player);
      }
      render(context, deltaTime) {
        // Backgrounds
        for (let i = 0; i < this.backgrounds.length; i++) {
          this.backgrounds[i].draw(context);
        }
        // Player
        this.player.draw(context);
        this.player.updatePlayer(deltaTime);
        // Enemies
        for (let i = 0; i < this.enemies.length; i++) {
          this.enemies[i].draw(context);
          this.enemies[i].updateEnemies(deltaTime);
        }
        // Projectiles
        for (let i = 0; i < this.projectiles.length; i++) {
          this.projectiles[i].draw(context);
          this.projectiles[i].updateProjectiles(deltaTime);
        }
        // Collisions DEBUG ONLY
/*         for (let i = 0; i < collisionObjectArr.length; i++) {
          if (collisionObjectArr[i].debug) collisionObjectArr[i].updateCollisionObjects();
        } */
      }
    }

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

      draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    }
    
    class Player {
      constructor(game, race, x, y, width, height, xSpeed, ySpeed, xFacing, yFacing) {
        this.game = game;
        this.type = "player";
        this.race = race;
        this.experience = experience;
        this.level = gLevel;
        
        // Pass in vars
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.xFacing = xFacing;
        this.yFacing = yFacing;

        // Images and animations
        this.image;
        this.spriteWidth = 600;
        this.spriteHeight = 600;
        this.fps = 30;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrameIdle = 3;
        this.maxFrameRun = 5;
        this.shadow = new Image();
        this.shadow.src = "../images/ShadowPlayer.png";
  
        // Movement
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
  
        // Gameplay values
        this.damage;
        this.takenDamage = false;
        this.iframes = 500;
        this.alive = true;
        this.hp = 10;
        this.health = document.querySelector("#health")
        this.health.max = this.hp
        this.health.value = this.hp
  
        // Equipment
        this.weapon;
        this.weaponProjectile;
        this.weaponShootInterval;
        this.weaponProjectileSpeed;
        this.weaponLifeSpan;
        
        this.armor;
  
        this.artefact;
  
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
      }
  
      initialize() {
        // Projectile array images
        for (let i = 0; i < 6; i++) {
          projectileImgArr.push("../images/Projectiles/pro"+i+".png");
        }
        // Configure Weapon values
        this.weapon = gWeapon;
        this.damage = gDamage;
        if (this.weapon.includes("Wooden Wand")) {
          this.weaponProjectile = projectileImgArr[4];
          this.weaponShootInterval = 500;
          this.weaponLifeSpan = 30;
          this.weaponProjectileSpeed = 0.8;
        } else if (this.weapon.includes("Rusty Sword")) {
          this.weaponProjectile = projectileImgArr[0];
          this.weaponShootInterval = 500;
          this.weaponLifeSpan = 40;
          this.weaponProjectileSpeed = 0.8;
        } else if (this.weapon.includes("Lancer")) {
          this.weaponProjectile = projectileImgArr[2];
          this.weaponShootInterval = 1000;
          this.weaponLifeSpan = 50;
          this.weaponProjectileSpeed = 2;
        } else if (this.weapon.includes("Heavy Sword")) {
          this.weaponProjectile = projectileImgArr[1];
          this.weaponShootInterval = 400;
          this.weaponLifeSpan = 1000;
          this.weaponProjectileSpeed = 0.05;
        } else if (this.weapon.includes("Moonlair")) {
          this.weaponProjectile = projectileImgArr[3];
          this.weaponShootInterval = 0.1;
          this.weaponLifeSpan = 1000;
          this.weaponProjectileSpeed = Math.floor(Math.random() * (2 - 1) + 1);
        } else if (this.weapon.includes("Swampy")) {
          this.weaponProjectile = projectileImgArr[5];
          this.weaponShootInterval = 1000;
          this.weaponLifeSpan = 5000;
          this.weaponProjectileSpeed = 0.02;
        } else {
          this.weaponProjectile = projectileImgArr[4];
          this.weaponShootInterval = 600;
          this.weaponLifeSpan = 30;
          this.weaponProjectileSpeed = 0.8;
        }
        // Configure Armor values
        this.armor = gArmor;
        this.defense = gDefense;
        
        // Configure Artefact values
        this.artefact = gArtefact;
  
        // Load player sprites
        if (this.race === "Dino") this.image = document.getElementById("dino"); 
        if (this.race === "Undead") this.image = document.getElementById("undead");
        if (this.race === "Human") this.image = document.getElementById("human");
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
              if (arr[i].getType() === "environment" || arr[i].getType() === "playerblock") {
                return true;
              } else if (arr[i].getType() === "enemy" || (arr[i].getType() === "projectile" && arr[i].firedBy === "enemy")) {
                this.hit(arr[i].damage)
              } else if (arr[i].getType() === "roomtransit" && !roomTransit) {
                roomTransit = true;
                levelScreen = arr[i].nextScreen;
                currentLevel = arr[i].nextLevel;
                transitDir = arr[i].transitDir;
                handleRoomTransit();
              } else if (arr[i].getType() === "waypoint") {
                handleWaypointTransit();
              }
            }
        }
      }
      
      updatePlayer(deltaTime) {
        if (this.alive) {
          // Collision
          this.updateCollision();
          this.checkCollision(game.enemies, -50, -14, -17, -14);
  
          // Update Stats
          document.querySelector("#souls").value = souls;
          document.querySelector("#experience").value = experience;
          // Update move
          if (this.moveRight && this.x < myCanvas.width - this.width) {
            if (!this.checkCollision(collisionObjectArr, 0, 5, 0, 0) && !roomTransit) this.x += this.xSpeed * deltaTime;
            this.xFacing = 1;
            this.frameY = 2;
          }
          if (this.moveLeft && this.x > 0) {
            if (!this.checkCollision(collisionObjectArr, 0, 0, 0, 5) && !roomTransit) this.x -= this.xSpeed * deltaTime;
            this.xFacing = -1;
            this.frameY = 3;
          }
          if (this.moveUp && this.y > 0) {
            if (!this.checkCollision(collisionObjectArr, 5, 0, 0, 0) && !roomTransit) this.y -= this.ySpeed * deltaTime;
            if(this.xFacing === 1 && !this.moveRight) {
              this.frameY = 2;
            }
            if(this.xFacing === -1 && !this.moveLeft) {
              this.frameY = 3;
            }
          }
          if (this.moveDown && this.y < myCanvas.height - this.height && !roomTransit) {
            if (!this.checkCollision(collisionObjectArr, 0, 0, 5, 0) && !roomTransit) this.y += this.ySpeed * deltaTime;
            if(this.xFacing === 1 && !this.moveRight) {
              this.frameY = 2;
            }
            if(this.xFacing === -1 && !this.moveLeft) {
              this.frameY = 3;
            }     
          }
          if (!this.moveDown && !this.moveLeft && !this.moveRight && !this.moveUp && !roomTransit) {
            if(this.xFacing === 1) {
              this.frameY = 0;
            }
            if(this.xFacing === -1) {
              this.frameY = 1;
            }
          }
          // Move sprites
          if (this.frameTimer > this.frameInterval) {
            if (this.frameY < 2) {
              if (this.frameX < this.maxFrameIdle) {
                this.frameX++;
              } else {
                this.frameX = 0;
              }
            } else {
              if (this.frameX < this.maxFrameRun) {
                this.frameX++;
              } else {
                this.frameX = 0;
              }
            }
            this.frameTimer = 0;
          } else {
            this.frameTimer += deltaTime;
          }
          
          // Shooting
          if (this.shootUp || this.shootDown || this.shootRight || this.shootLeft) {
            this.shoot = true;
          } else {
            this.shoot = false;
          }

          if (this.canShoot && this.shoot) {
            if (this.shootLeft && this.shootUp) { // TOP LEFT
              this.spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, -1, -1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
            } else if (this.shootUp && this.shootRight) { // TOP RIGHT
              this.spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, 1, -1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
            } else if (this.shootRight && this.shootDown) { // BOTTOM RIGHT
              this.spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, 1, 1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
            } else if (this.shootDown && this.shootLeft) { // BOTTOM LEFT
              this.spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, -1, 1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
            } else if (this.shootRight) { // RIGHT
              this.spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, 1, 0, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
            } else if (this.shootLeft) { // LEFT
              this.spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, -1, 0, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
            } else if (this.shootDown) { // DOWN
              this.spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, 0, 1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
            } else if (this.shootUp) { // UP
              this.spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, 0, -1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
            }
            this.canShoot = false;
            setTimeout(() => {
              this.canShoot = true;
            }, this.weaponShootInterval); 
          }      
        }
      }

      spawnProjectile(x, y, width, height, xDir, yDir, speed, damage, lifeSpan, firedBy, src) {
        const projectile = new Projectile(x, y, width, height, xDir, yDir, speed, damage, lifeSpan, firedBy, src);
        game.projectiles.push(projectile);
      }
      
      draw(ctx) {
        // Movement and Boundaries
        ctx.globalAlpha = 0.4;
        ctx.drawImage(this.shadow, this.x - 2, this.y, this.width, this.height)
        ctx.globalAlpha = 1;
        // Draw Player
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
      }
  
      getType() {
        return this.type;
      }
  
      getUnstuck() {
        this.x = 300;
        this.y = 300;
      }
  
      getDamage() {
        return this.damage + this.level;
      }
      getDefense() {
        return this.defense;
      }
  
      hit(damage) {
        if (!roomTransit) {
          // Check iframes
          if (!this.takenDamage) {
            this.takenDamage = true;
            // Receive Damage
            if (damage - this.getDefense() > 0) {
              this.hp -= damage - this.getDefense();
              this.health.value -= damage - this.getDefense();
            } else {
              this.hp -= 1;
              this.health.value -= 1
            }
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
      }
  
      destroy() {
        this.alive = false;
        setTimeout(() => {
          history.back()
        }, 2000)
      }
    }
  

    class Enemy {
      constructor(name, x, y, width, height, fps) {
        this.type = "enemy"
        this.souls = 0;
        this.experience = 0;
  
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

        this.image;
        this.spriteWidth;
        this.spriteHeight;
        this.fps = fps;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 3;
  
        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.cOffTop = 0;
        this.cOffRight = 0;
        this.cOffBottom = 0;
        this.cOffLeft = 0;
        this.knockBackDir = {x: 0, y: 0};
        this.knockBackTimer = 1;
  
        // Boss
        this.xDir;
        this.yDir;
        this.canSpawn;
        this.spawnInterval;
        this.state;
        this.ecrolState = true;
        this.movementArr;
        this.ecrolTimeout = 5000;
  
        // Gameplay values
        this.alive = true;
        this.initialized = false;
        this.hp;
        this.iframes = 100;
        this.damage;
        this.takenDamage = false;
        this.randomMoveTimer;
        this.moveSpeed;
        this.moveTo;
        this.canShoot = false;
        this.shootInterval;
      }
  
      initialize() {
        if (this.name === "slime") {
          this.image = document.getElementById("slime");
          this.spriteWidth = 700;
          this.spriteHeight = 700;
          // Collisions
          this.cOffTop = 2;
          this.cOffRight = 6;
          this.cOffBottom = this.width / 2 - 2;
          this.cOffLeft = 6;
          // Gameplay
          this.souls = 1;
          this.experience = 1;
          this.hp = 15;
          this.damage = 5;
          this.imageFrames = 4;
          this.moveSpeed = 0.1;
          this.randomMoveTimer = Math.floor(Math.random() * (4000 - 2000) + 2000);
          this.moveTo = this.getRandomCoordinates();
          this.moveTowardsTarget(this.moveTo);
          setInterval(() => {
            this.moveTo = this.getRandomCoordinates();
          }, this.randomMoveTimer)
        }
        if (this.name === "bat") {
          this.image = document.getElementById("bat");
          this.spriteWidth = 100;
          this.spriteHeight = 64;
          // Collisions
          this.cOffTop = 0;
          this.cOffRight = 0;
          this.cOffBottom = 0;
          this.cOffLeft = 0;
          // Gameplay
          this.souls = 1;
          this.experience = 1;
          this.hp = 15;
          this.damage = 7;
          this.imageFrames = 4;
          this.xDir = 1;
          this.moveSpeed = 0.1;
          this.canShoot = true;
          this.shootInterval = this.getRandomShootInterval();
        }
        if (this.name === "enemyProjectileFire") {
          this.image = document.getElementById("enemyProjectileFire");
          this.spriteWidth = 600;
          this.spriteHeight = 600;
          // Collisions
          this.cOffTop = 0;
          this.cOffRight = 0;
          this.cOffBottom = 0;
          this.cOffLeft = 0;
          // Gameplay
          this.souls = 0;
          this.experience = 0;
          this.hp = 10;
          this.damage = 15;
          this.imageFrames = 1;
          this.yDir = 1;
          this.moveSpeed = 0.1;
        }
        if (this.name === "slimeBoss") {
          this.image = document.getElementById("slimeBoss");
          this.spriteWidth = 328;
          this.spriteHeight = 260;
          // Collisions
          this.cOffTop = 2;
          this.cOffRight = 6;
          this.cOffBottom = this.width / 3 - 2;
          this.cOffLeft = 6;
          // Gameplay
          this.souls = 100;
          this.experience = 50;
          this.hp = 500;
          this.damage = 10;
          this.imageFrames = 6;
          this.moveSpeed = 50;
          this.xDir = -1;
          this.yDir = -1;
          this.canSpawn = false;
        }
        if (this.name === "ecrol") {
          this.imageUp = document.getElementById("ecrol0");
          this.imageRight = document.getElementById("ecrol1");
          this.imageDown = document.getElementById("ecrol2");
          this.imageLeft = document.getElementById("ecrol3");

          this.image = this.imageRight;
          this.spriteWidth = 531;
          this.spriteHeight = 150;
          // Collisions
          this.cOffTop = 0;
          this.cOffRight = 0;
          this.cOffBottom = 0;
          this.cOffLeft = 0;
          // Gameplay
          this.souls = 500;
          this.experience = 1000;
          this.hp = 500;
          this.damage = 1000;
          this.imageFrames = 4;
          this.moveSpeed = 0.85;
          this.movementArr = this.ecrolPatterns();
          this.x = this.movementArr[0].x;
          this.y = this.movementArr[0].y;
          if (this.ecrolState) this.state = 0;
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
  
      getRandomShootInterval() {
        return Math.floor(Math.random() * (5000 - 3000) + 3000);
      }
          
      updateCollision() {
        if (this.name === "enemyProjectileFire" && this.y > myCanvas.height - this.height) this.destroy();
        this.left = this.x + this.cOffLeft;
        this.right = this.x + this.width - this.cOffRight;
        this.top = this.y + this.cOffTop;
        this.bottom = this.y + this.height - this.cOffBottom;
      }

      checkCollision(arr, ot, or, ob, ol) {
        for (let i = 0; i < arr.length; i++) {
          if (this.left - ol < arr[i].right &&
            this.right + or > arr[i].left &&
            this.top - ot < arr[i].bottom &&
            this.bottom + ob >= arr[i].top) { 
              if (arr[i].getType() === "environment" && arr[i].getType() !== "playerblock") {
                return true;
              }
          }
        }
      }

      applyKnockback(deltaTime) {
        if ((this.knockBackDir.x !== 0 || this.knockBackDir.y !== 0) && this.knockBackTimer > 0) {
          if (!this.checkCollision(collisionObjectArr, 12, 10, 12, 10)) {
            this.x += this.knockBackDir.x * deltaTime;
            this.y += this.knockBackDir.y * deltaTime;
          }
          this.knockBackTimer -= 0.3;
          if (this.knockBackTimer <= 0) {
            this.knockBackDir.x = 0;
            this.knockBackDir.y = 0;
            this.knockBackTimer = 1;
          }
        }
      }

      draw(ctx) {
        if (this.name === "enemyProjectileFire") this.initialize();
        // Hit effect
        if (this.takenDamage) {
          ctx.filter = "brightness(100)";
        } else {
          ctx.filter = "brightness(1)";
        }
        // Draw
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        // Reset hit effect
        ctx.filter = "brightness(1)";
      }

      updateEnemies(deltaTime) {
        if (deltaTime === undefined) deltaTime = 0;
        // Kill
        if (!this.alive && this.knockBackTimer === 1) this.destroy()
        // Normal enemies
        if (this.name === "slime") {
          this.moveTowardsTarget(this.moveTo, deltaTime);
          this.applyKnockback(deltaTime);
        }
        if (this.name === "bat") {
          this.moveLeftRight(deltaTime);
          this.shootDown();
        }
        if (this.name === "enemyProjectileFire") {
          if(!this.initialized) this.initialize()
          this.moveDown(deltaTime);
        }

        // Bosses
        if (this.name === "slimeBoss") {
          this.slimeBossMovement(deltaTime);
          if (!this.canSpawn) {
            this.canSpawn = true;
            this.spawnInterval = setInterval(() => {
              const newEnemy = new Enemy("slime", myCanvas.width / 2 - 90, myCanvas.height / 2 - 80, 90, 80, 5);
              newEnemy.initialize();
              game.enemies.splice(game.enemies.length-2, 0, newEnemy);
            }, 2000)
            setTimeout(() => {
              // ROOM TRANSIT
              collisionObjectArr.push(new CollisionObject(220, myCanvas.height - 15, 680, 15, "roomtransit", 4, "Meadow", "down", false, false));
              // TO DUNGEON
              collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 380, 0, 680, 15, "roomtransit", 0, "Cave", "up", false, false));
              // GET DESTROYED
              collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, 0, 120, 50, "environment", -1, "", "", false, true));
            }, 1500)
            setTimeout(() => {
              collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 50, myCanvas.width, 50, "environment", -1, "", "", false, true));
            }, 5000)
          }
        }

        // ECROL
        if (this.name === "ecrol") {
          this.ecrolBossMovement(deltaTime);
          if (!this.initialized) {
            this.initialized = true;
            setTimeout(() => {
              // ROOM TRANSIT
              collisionObjectArr.push(new CollisionObject(220, myCanvas.height - 15, 680, 15, "roomtransit", 1, "Cave", "down", false, false));
              // TO DUNGEON
              collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 380, 0, 680, 15, "roomtransit", -10, "Cave", "up", false, false));
              // GET DESTROYED
              collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 25, 0, 120, 50, "environment", -1, "", "", false, true));
            }, 1500)
            setTimeout(() => {
              collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 50, myCanvas.width, 50, "environment", -1, "", "", false, true));
            }, 5000)
          }
        }
        
        // Collisions
        this.updateCollision();

        // Frame counter
        if (this.name !== "ecrol") {
          if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) {
              this.frameX++;
            } else {
              this.frameX = 0;
            }
            this.frameTimer = 0;
          } else {
            this.frameTimer += deltaTime;
          }
        }
      }
  
      moveTowardsTarget(randomCoordinates, deltaTime) {
        if (deltaTime === undefined) deltaTime = 0;
        // Horizontal Movement
        if (this.x < randomCoordinates.x && this.x < myCanvas.width - this.width && !this.checkCollision(collisionObjectArr, 0, 10, 0, 0) && !roomTransit) {
          this.x += this.moveSpeed * deltaTime;
        } else if (this.x > randomCoordinates.x && this.x > 0 && !this.checkCollision(collisionObjectArr, 0, 0, 0, 10) && !roomTransit) {
          this.x -= this.moveSpeed * deltaTime;
        }
        // Vertial Movement
        if (this.y > randomCoordinates.y && this.y > 0 && !this.checkCollision(collisionObjectArr, 10, 0, 0, 0) && !roomTransit) {
          this.y -= this.moveSpeed * deltaTime;
        } else if (this.x < randomCoordinates.y && this.y < myCanvas.height - this.height && !this.checkCollision(collisionObjectArr, 0, 0, 10, 0) && !roomTransit) {
          this.y += this.moveSpeed * deltaTime;
        }
      }
  
      moveLeftRight(deltaTime) {
        if (this.checkCollision(collisionObjectArr, 0, 5, 0, 0) || this.checkCollision(collisionObjectArr, 0, 0, 0, 5)) {
          this.xDir *= -1;
        }
        this.x += (this.moveSpeed * this.xDir) * deltaTime;
      }
  
      shootDown() {
        if (this.canShoot) {
          this.canShoot = false;
          game.enemies.push(new Enemy("enemyProjectileFire", this.x, this.y, 32, 32, 0));
          setTimeout(() => {
            this.canShoot = true;
          }, this.shootInterval);
        }
      }
  
      moveDown(deltaTime) {
        this.y += this.moveSpeed * deltaTime;
      }
  
      slimeBossMovement(deltaTime) {
        if (deltaTime === undefined) deltaTime = 0;
        // Horizontal Collisions
        if (this.checkCollision(collisionObjectArr, 0, 5, 0, 0) || this.checkCollision(collisionObjectArr, 0, 0, 0, 5)) {
          this.xDir *= -1;
        }
        // Vertical Collisions
        if (this.checkCollision(collisionObjectArr, 5, 0, 0, 0) || this.checkCollision(collisionObjectArr, 0, 0, 5, 0)) {
          this.yDir *= -1;
        }
        // Move 
        this.x += ((this.moveSpeed / 1.2 / this.hp) * this.xDir) * deltaTime;
        this.y += ((this.moveSpeed / this.hp) * this.yDir) * deltaTime;
        // Destroy if escapes boundaries
        if (this.x < 0 || this.y < 0 || this.x > myCanvas.width + this.width || this.y > myCanvas.height + this.height) {
          this.destroy();
        }
      }
  
      ecrolPositionPicker() {
        this.state = Math.floor(Math.random() * 5)
      }
  
      ecrolBossMovement(deltaTime) {
        if (this.ecrolState) {
          switch (this.state) {
            case 0:
              this.ecrolState = false;
              this.spriteWidth = 531;
              this.spriteHeight = 150;
              this.image = this.imageRight;
              this.x = this.movementArr[this.state].x
              this.y = this.movementArr[this.state].y
              setTimeout(() => {
                this.ecrolState = true;
                this.ecrolPositionPicker();
              }, this.ecrolTimeout)
              break;
            case 1:
              this.ecrolState = false;
              this.spriteWidth = 531;
              this.spriteHeight = 150;
              this.image = this.imageLeft;
              this.x = this.movementArr[this.state].x
              this.y = this.movementArr[this.state].y
              setTimeout(() => {
                this.ecrolState = true;
                this.ecrolPositionPicker();
              }, this.ecrolTimeout)
              break;
            case 2:
              this.ecrolState = false;
              this.spriteWidth = 150;
              this.spriteHeight = 531;
              this.image = this.imageDown;
              this.x = this.movementArr[this.state].x
              this.y = this.movementArr[this.state].y
              setTimeout(() => {
                this.ecrolState = true;
                this.ecrolPositionPicker();
              }, this.ecrolTimeout)
              break;
            case 3:
              this.ecrolState = false;
              this.spriteWidth = 150;
              this.spriteHeight = 531;
              this.image = this.imageDown;
              this.x = this.movementArr[this.state].x
              this.y = this.movementArr[this.state].y
              setTimeout(() => {
                this.ecrolState = true;
                this.ecrolPositionPicker();
              }, this.ecrolTimeout)
              break;
            case 4:
              this.ecrolState = false;
              this.spriteWidth = 150;
              this.spriteHeight = 531;
              this.image = this.imageUp;
              this.x = this.movementArr[this.state].x
              this.y = this.movementArr[this.state].y
              setTimeout(() => {
                this.ecrolState = true;
                this.ecrolPositionPicker();
              }, this.ecrolTimeout)
              break;
          }
        }
        if (this.state < 2) {
          this.width = 531
          this.height = 150
          ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
          this.width = 150
          this.height = 531
          ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        this.ecrolMove(deltaTime);
      }
  
      ecrolMove(deltaTime) {
        if (deltaTime === undefined) deltaTime = 0;
        switch (this.state) {
          case 0:
            this.x += this.moveSpeed * deltaTime;
            break;
          case 1:
            this.x -= this.moveSpeed * deltaTime;
            break;
          case 2:
            this.y += this.moveSpeed * deltaTime;
            break;
          case 3:
            this.y += this.moveSpeed * deltaTime;
            break;
          case 4:
            this.y -= this.moveSpeed * deltaTime;
            break;
        }
      }
  
      ecrolPatterns() {
        const arr = [
          // LEFT -> RIGHT 0
          {
            x: -myCanvas.width,
            y: 100,
          },
          // RIGHT -> LEFT 1
          {
            x: myCanvas.width * 2,
            y: 350,
          },
          // TOP -> BOTTOM (middle) 2
          {
            x: 300,
            y: -myCanvas.height,
          },
          // TOP -> BOTTOM (offset) 3
          {
            x: 550,
            y: -myCanvas.height,
          },
          // BOTTOM -> TOP () 4
          {
            x: myCanvas.width / 2 + 150,
            y: myCanvas.height * 2,
          },
        ]
        
        return arr;
      }
  
      hit(damage) {
        if (this.name === "enemyProjectileFire") this.destroy();
        this.takenDamage = true;
        this.hp -= damage;
        if (this.hp <= 0) {
          this.alive = false;
        } else {
          setTimeout(() => {
            this.takenDamage = false;
          }, this.iframes)
        }
      }
  
      destroy() { // GRANT SOULS AND XP
        if (this.name === "slimeBoss" || this.name === "ecrol") {
          for (let i = collisionObjectArr.length - 1; i >= 0; i--) {
            if (collisionObjectArr[i].triggerDestroy) {
              collisionObjectArr[i].destroy();
            }
          }
          clearInterval(this.spawnInterval);
        }
        this.dropSouls();
        this.grantXp();
        const posInArr = game.enemies.indexOf(this);
        game.enemies.splice(posInArr, 1);
      }
  
      remove() { // DON'T GRANT SOULS OR XP
        const posInArr = game.enemies.indexOf(this);
        game.enemies.splice(posInArr, 1);
      }
  
      dropSouls() {
        souls += this.souls;
      }
      grantXp() {
        experience += this.experience;
      }
  
      getType() {
        return this.type; 
      }
    }
  
  
    class Projectile {
      constructor(x, y, width, height, xDir, yDir, speed, damage, lifeSpan, firedBy, src) {
        this.type = "projectile";
  
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xDir = xDir;
        this.yDir = yDir;
        this.speed = speed;
        this.damage = damage;
        this.lifeSpan = lifeSpan;
        this.firedBy = firedBy;
        this.src = src
  
        this.img = new Image();
        this.img.src = this.src;
  
        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
      }
  
      updateProjectiles(deltaTime) {
        if (deltaTime === undefined) deltaTime = 0;
        // Collision
        this.left = this.x;
        this.right = this.x + this.width
        this.top = this.y;
        this.bottom = this.y + this.height;
  
        // Move projectiles
        if (this.xDir + this.yDir === 1) {
          this.x += (this.speed * this.xDir) * deltaTime;
          this.y += (this.speed * this.yDir) * deltaTime;
        } else {
          this.x += (this.speed / 1.4 * this.xDir) * deltaTime;
          this.y += (this.speed / 1.4 * this.yDir) * deltaTime;
        }
        this.checkCollision(game.enemies, 0, 0, 0, 0);
        this.checkCollision(collisionObjectArr, 0, 0, 0, 0);
  
        // Destory if lifeSpan reached or out of screen
        this.lifeSpan--;
        if (this.lifeSpan <= 0 || this.x < 0 || this.y < 0 || this.x > myCanvas.width + this.width || this.y > myCanvas.height + this.height) {
          this.destroy();
        }
      }

      draw(ctx) {
        // Draw
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
  
      checkCollision(arr, ot, or, ob, ol) {
        for (let i = 0; i < arr.length; i++) {
          if (this.left - ol < arr[i].right &&
            this.right + or > arr[i].left &&
            this.top - ot < arr[i].bottom &&
            this.bottom + ob >= arr[i].top) { 
              // Enemy Collision
              if (arr[i].getType() === "enemy" && this.firedBy === "player") {
                const projectile = game.projectiles.indexOf(this);
                arr[i].knockBackDir = {x: this.xDir, y: this.yDir};
                if (!arr[i].takenDamage) arr[i].hit(game.projectiles[projectile].damage);
                game.projectiles[projectile].destroy();
                break;
              } 
              if (arr[i].getType() === "environment" || arr[i].getType() === "roomtransit") {
                this.destroy();
              }
              if (arr[i].getType() === "spawntrigger") {
                arr[i].initiatieEnemySpawn()
                this.destroy();
              }
            }
        }
      }
  
      destroy() {
        const posInArr = game.projectiles.indexOf(this);
        game.projectiles.splice(posInArr, 1);
      }
  
      getType() {
        return this.type;
      }
    }
  
    const collisionObjectArr = [];
    class CollisionObject {
      constructor(x, y, width, height, type, nextScreen, nextLevel, transitDir, debug, triggerDestroy) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.nextScreen = nextScreen;
        this.nextLevel = nextLevel
        this.transitDir = transitDir;
        this.debug = debug;
        this.triggerDestroy = triggerDestroy;
  
        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
  
        // Functional
        this.spawnInit = false;
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
  
      selfDestruct() {
        if (this.triggerDestroy) {
          setTimeout(() => {
            this.destroy();
          }, 5000)
        }
      }
  
      initiatieEnemySpawn() {
        if (!this.spawnInit) {
          enemySpawnInProgress = true;
          this.spawnInit = true;
          this.destroy()
        }
      }
  
      destroy() {
        const posInArr = collisionObjectArr.indexOf(this);
        collisionObjectArr.splice(posInArr, 1);
      }
  
      getType() {
        return this.type;
      }
  
      getNextScreen() {
        return this.nextScreen;
      }
    }

    const game = new Game(myCanvas.width, myCanvas.height);
    myCanvas.style.backgroundColor = "white";
    myCanvas.style.border = "1px solid black";
    myCanvas.style.align = "center";
    
    let lastTime = 0;
    startGame(lastTime);

    function startGame(lastTime) {
      game.backgrounds.push(new Background(0, 0, myCanvas.width, myCanvas.height, `../images/${currentLevel}/Backgrounds/${currentLevel[0].toLowerCase() + currentLevel.slice(1)}${levelScreen}.png`));
      game.player.initialize()
      checkLevelScreen(levelScreen);
      gameplayLoop(lastTime);
    }

    function checkLevelScreen(levelScreen) {
      if (currentLevel === "Meadow") {
        switch (levelScreen) {
          case 0:
            if (!screen0init) loadScreen0();
            break;
          // Meadow Screens
          case 1:
            if (!screen1init) loadScreen1();
            break;
          case 2:
            if (!screen2init) loadScreen2();
            break;
          case 3:
            if (!screen3init) loadScreen3();
            break;
          case 4:
            if (!screen4init) loadScreen4();
            break;
          case 5:
            if (!screen5init) loadScreen5();
            break;
        }
      } else if (currentLevel === "Cave") {
        switch(levelScreen) {
          // Cave Screens
          case 0:
            if (!screen6init) loadScreen6();
            break;
          case 1:
            if (!screen7init) loadScreen7();
            break;
          case 2:
            if (!screen8init) loadScreen8();
            break;
          case 3:
            if (!screen9init) loadScreen9();
            break;
        }
      }
    }

    
    function gameplayLoop(timeStamp) {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      // Reset for new drawing
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
      // Collisions
      updateCollisionObjects();
      // Transit
      roomTransitioning(deltaTime);
      // Render Game
      game.render(ctx, deltaTime);
      // Level Events
      checkLevelEvents();
      // Loop
      requestAnimationFrame(gameplayLoop);
    }

    // Transit rooms
    function roomTransitioning(deltaTime) {
      if (roomTransit) {
        if (levelScreen === -10) {
          roomTransit = false;
          saveBtn.click();
        } else {
          // Find background to display
          let nextBg;
          for (let i = 0; i < game.backgrounds.length; i++) {
            if (JSON.stringify(game.backgrounds[i].source) === `"../images/${currentLevel}/Backgrounds/${currentLevel[0].toLowerCase() + currentLevel.slice(1)}${levelScreen}.png"`) {
              nextBg = i;
              break;
            }
          }

          // Reset for new drawing
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          // Moving DOWN a screen
          if (transitDir === "up" && game.backgrounds[nextBg].y < 0) {
            transitMoveElements(deltaTime);
          // Moving UP a screen
          } else if (transitDir === "down" && game.backgrounds[nextBg].y > 0) {
            transitMoveElements(deltaTime);
          // Moving RIGHT a screen
          } else if (transitDir === "right" && game.backgrounds[nextBg].x > 0) {
            transitMoveElements(deltaTime);
          // Moving LEFT a screen
          } else if (transitDir === "left" && game.backgrounds[nextBg].x < 0) {
            transitMoveElements(deltaTime);
          // Resume Game
          } else {
            for (let i = 0; i < game.backgrounds.length; i++) {
              game.backgrounds[i].x = Math.round(game.backgrounds[i].x / 100) * 100;
              game.backgrounds[i].y = Math.round(game.backgrounds[i].y / 100) * 100;
            }
            roomTransit = false;
            checkLevelScreen(levelScreen);
          }
        }
      }
    }

    function transitMoveElements(deltaTime) {
      // Shift and draw backgrounds
      for (let i = 0; i < game.backgrounds.length; i++) {
        if (transitDir === "down") game.backgrounds[i].y -= transitSpeed * deltaTime;
        if (transitDir === "up") game.backgrounds[i].y += transitSpeed * deltaTime;
        if (transitDir === "right") game.backgrounds[i].x -= transitSpeed * deltaTime;
        if (transitDir === "left") game.backgrounds[i].x += transitSpeed * deltaTime;
      }
      // Shift enemies
      for (let i = 0; i < game.enemies.length; i++) {
        if (transitDir === "down") game.enemies[i].y -= transitSpeed * deltaTime;
        if (transitDir === "up") game.enemies[i].y += transitSpeed * deltaTime;
        if (transitDir === "right") game.enemies[i].x -= transitSpeed * deltaTime;
        if (transitDir === "left") game.enemies[i].x += transitSpeed * deltaTime;
      }
      // Shift collisions
      for (let i = 0; i < collisionObjectArr.length; i++) {
        if (transitDir === "down") collisionObjectArr[i].y -= transitSpeed * deltaTime;
        if (transitDir === "up") collisionObjectArr[i].y += transitSpeed * deltaTime;
        if (transitDir === "right") collisionObjectArr[i].x -= transitSpeed * deltaTime;
        if (transitDir === "left") collisionObjectArr[i].x += transitSpeed * deltaTime;
      }
      // Destroy Projectiles
      for (let i = 0; i < game.projectiles.length; i++) {
        game.projectiles[i].destroy();
      }
      // Player
      if (transitDir === "down") game.player.y -= (transitSpeed - 0.1) * deltaTime;
      if (transitDir === "up") game.player.y += (transitSpeed - 0.1) * deltaTime;
      if (transitDir === "right") game.player.x -= (transitSpeed - 0.1) * deltaTime;
      if (transitDir === "left") game.player.x += (transitSpeed - 0.1) * deltaTime;
    }

    function handleRoomTransit() {
      let bgFound = false;
      if (transitDir === "up") {
        for (let i = 0; i < game.backgrounds.length; i++) {
          if (JSON.stringify(game.backgrounds[i].source) === `"../images/${currentLevel}/Backgrounds/${currentLevel[0].toLowerCase() + currentLevel.slice(1)}${levelScreen}.png"`) {
            bgFound = true;
            break;
          }
        }
        if (!bgFound) game.backgrounds.push(new Background(0, -myCanvas.height, myCanvas.width, myCanvas.height, `../images/${currentLevel}/Backgrounds/${currentLevel[0].toLowerCase() + currentLevel.slice(1)}${levelScreen}.png`));
      } else if (transitDir === "right") {
        for (let i = 0; i < game.backgrounds.length; i++) {
          if (JSON.stringify(game.backgrounds[i].source) === `"../images/${currentLevel}/Backgrounds/${currentLevel[0].toLowerCase() + currentLevel.slice(1)}${levelScreen}.png"`) {
            bgFound = true;
            break;
          }
        }
        if (!bgFound) game.backgrounds.push(new Background(myCanvas.width, 0, myCanvas.width, myCanvas.height, `../images/${currentLevel}/Backgrounds/${currentLevel[0].toLowerCase() + currentLevel.slice(1)}${levelScreen}.png`));
      } else if (transitDir === "down") {
        for (let i = 0; i < game.backgrounds.length; i++) {
          if (JSON.stringify(game.backgrounds[i].source) === `"../images/${currentLevel}/Backgrounds/${currentLevel[0].toLowerCase() + currentLevel.slice(1)}${levelScreen}.png"`) {
            bgFound = true;
            break;
          }
        }
        if (!bgFound) game.backgrounds.push(new Background(0, myCanvas.height, myCanvas.width, myCanvas.height, `../images/${currentLevel}/Backgrounds/${currentLevel[0].toLowerCase() + currentLevel.slice(1)}${levelScreen}.png`));
      } else if (transitDir === "left") {
        for (let i = 0; i < game.backgrounds.length; i++) {
          if (JSON.stringify(game.backgrounds[i].source) === `"../images/${currentLevel}/Backgrounds/${currentLevel[0].toLowerCase() + currentLevel.slice(1)}${levelScreen}.png"`) {
            bgFound = true;
            break;
          }
        }
        if (!bgFound) game.backgrounds.push(new Background(-myCanvas.width, 0, myCanvas.width, myCanvas.height, `../images/${currentLevel}/Backgrounds/${currentLevel[0].toLowerCase() + currentLevel.slice(1)}${levelScreen}.png`));
      }
    }

    function handleWaypointTransit() {
      unloadAll();
      if (currentLevel === "Meadow") {
        currentLevel = "Cave";
        game.backgrounds.push(new Background(0, 0, myCanvas.width, myCanvas.height, `../images/Cave/Backgrounds/cave0.png`))
        game.player.x = myCanvas.width / 2 - 100;
        game.player.y = myCanvas.height - 200;
      }
      checkLevelScreen(levelScreen);
    }

    function unloadAll() {
      // Clear arrays
      collisionObjectArr.splice(0, collisionObjectArr.length);
      game.enemies.splice(0, game.enemies.length);
      game.backgrounds.splice(0, game.backgrounds.length);
      game.projectiles.splice(0, game.projectiles.length);
      // Reset level states
      screen0init = false;
      screen1init = false;
      screen2init = false;
      screen3init = false;
      screen4init = false;
      screen5init = false;
      screen6init = false;
      screen7init = false;
      screen8init = false;
      screen9init = false;
      level4MeadowSpawn = true;
      level2CaveSpawn = true;
    }

    function checkLevelEvents() {  
      // Level Dependent Enemy Spawns
      let waypointImg = new Image();
      waypointImg.src = "../images/Cave/Bat/bat.png";
      if (levelScreen === 0 && currentLevel === "Meadow" && !roomTransit) ctx.drawImage(waypointImg, myCanvas.width / 2 + 110, 200, 25, 25)
      let spawnImg = new Image();
      spawnImg.src = "../images/Environment/spawnSlimeGel.png";
      if (level4MeadowSpawn && levelScreen === 4 && !roomTransit) {
        ctx.drawImage(spawnImg, myCanvas.width / 2 - 72, myCanvas.height / 2  - 72, 72, 72)
      }
      if (level2CaveSpawn && levelScreen === 2 && !roomTransit) {
        ctx.drawImage(spawnImg, myCanvas.width / 2 - 72, myCanvas.height / 2  - 72, 72, 72)
      }
      if (enemySpawnInProgress) {
        enemySpawnInProgress = false;
        if (levelScreen === 4 && currentLevel === "Meadow") level4MeadowSpawn = false;
        if (levelScreen === 2 && currentLevel === "Cave") level2CaveSpawn = false;
        initiateSpawn()
      }
      // 3D Level Models
      if (currentLevel === "Meadow") {
        document.getElementById("meadowMap").style.display = "block";
        document.getElementById("caveMap").style.display = "none";
      }
      if (currentLevel === "Cave") {
        document.getElementById("caveMap").style.display = "block";
        document.getElementById("meadowMap").style.display = "none";
      }

    }


    function updateCollisionObjects() {
      for (let i = 0; i < collisionObjectArr.length; i++) {
        collisionObjectArr[i].updateCollisionObjects();
      }
    }

    function initiateSpawn() {
      // Spawn boundaries
      collisionObjectArr.push(new CollisionObject(0, 0, 45, myCanvas.height, "environment", -1, "", "", false, true));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 45, 0, 45, myCanvas.height, "environment", -1, "", "", false, true));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 45, myCanvas.width, 45, "environment", -1, "", "", false, true));
      for (let i = collisionObjectArr.length - 1; i >= 0; i--) {
        collisionObjectArr[i].selfDestruct();
      }
      
      if (currentLevel === "Meadow" && levelScreen === 4) {
        // Spawn enemies
        game.enemies.push(new Enemy("slime", 200, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 250, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 300, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 350, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 400, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 450, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 600, 500, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 650, 500, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 700, 500, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 750, 500, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 800, 500, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 850, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 900, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 950, 400, 90, 80, 5));
      } else if (currentLevel === "Meadow" && levelScreen === 2) {
        // Spawn enemies
        game.enemies.push(new Enemy("slime", 200, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 250, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 300, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 350, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 400, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 450, 400, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 600, 300, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 650, 300, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 700, 300, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 750, 300, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 800, 300, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 850, 300, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 900, 300, 90, 80, 5));
        game.enemies.push(new Enemy("slime", 950, 300, 90, 80, 5));
        game.enemies.push(new Enemy("bat", 150, 120, 52, 36, 4));
        game.enemies.push(new Enemy("bat", 250, 120, 52, 36, 4));
        game.enemies.push(new Enemy("bat", 350, 120, 52, 36, 4));
        game.enemies.push(new Enemy("bat", 450, 120, 52, 36, 4));
        game.enemies.push(new Enemy("bat", 550, 120, 52, 36, 4));
        game.enemies.push(new Enemy("bat", 600, 120, 52, 36, 4));
        game.enemies.push(new Enemy("bat", 700, 120, 52, 36, 4));
        game.enemies.push(new Enemy("bat", 800, 120, 52, 36, 4));
        game.enemies.push(new Enemy("bat", 900, 120, 52, 36, 4));
        game.enemies.push(new Enemy("bat", 1000, 120, 52, 36, 4));
      }
      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].initialize();
      }
      enemySpawnInProgress = false;
      inBattle = true;
    }


    // SCREENS AND LEVELS DEFINED HERE
    function loadScreen0() {
      // COLLISIONS
      collisionObjectArr.push(new CollisionObject(0, 0, 400, myCanvas.height, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width, 130, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height-130, myCanvas.width, 130, "environment", -1, "", "", false, false));
      // ROOM TRANSITIONING RIGHT
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 15, 130, 15, 440, "roomtransit", 1, "Meadow", "right", false, false));
      // WAYPOINT
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 110, 200, 5, 5, "waypoint", -10, "", "", "down", true, false));
      
      // SAVE
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 110, myCanvas.height / 2 - 40, 5, 5, "roomtransit", -10, "", "", "down", false, false));
      screen0init = true;
    }

    function loadScreen1() {
      // TOP LEFT TREE GROUP
      collisionObjectArr.push(new CollisionObject(0, 0, 225, 50, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 50, 175, 25, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 75, 125, 25, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 100, 90, 40, "environment", -1, "", "", false, false));
      // MIDDLE STONES
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 64, myCanvas.height / 2 - 48, 110, 75, "environment", "", "", false, false));
      // TOP CENTER TREE
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 70, 0, 55, 55, "environment", -1, "", "", false, false));
      // TOP RIGHT TREE GROUP
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 300, 0, 300, 80, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 255, 80, 300, 25, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 200, 105, 300, 25, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 42, 130, 300, 25, "environment", -1, "", "", false, false));
      // BOTTOM RIGHT TREE GROUP
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 250, myCanvas.height - 30, 250, 25, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 220, myCanvas.height - 55, 250, 25, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 180, myCanvas.height - 80, 250, 25, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 100, myCanvas.height - 97, 250, 17, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 40, myCanvas.height - 114, 250, 17, "environment", -1, "", "", false, false));
      // BOTTOM LEFT TREE GROUP
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 30, 195, 30, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 60, 150, 30, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 75, 80, 15, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 105, 35, 30, "environment", -1, "", "", false, false));
      // ROOM TRANSITIONING TOP
      collisionObjectArr.push(new CollisionObject(myCanvas.width/4 - 70, 0, 675, 15, "roomtransit", 2, "Meadow", "up", false, false));
      // ROOM TRANSITIONING RIGHT
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 15, 155, 15, 430, "roomtransit", 4, "Meadow", "right", false, false));
      // ROOM TRANSITIONING BOTTOM
      collisionObjectArr.push(new CollisionObject(212, myCanvas.height - 15, 740, 15, "roomtransit", 3, "Meadow", "down", false, false));
      // ROOM TRANSITIONING LEFT
      collisionObjectArr.push(new CollisionObject(0, 150, 15, 440, "roomtransit", 0, "Meadow", "left", false, false));
      // ENEMIES
      game.enemies.push(new Enemy("slime", 900, 400, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 500, 200, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 300, 600, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 500, 600, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 300, 500, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 800, 600, 90, 80, 5));
      
      // Initialize enemies
      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].initialize();
      }

      screen1init = true;
    }

    function loadScreen2() {
      // TREES TOP GROUP
      collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width, 75, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 75, 125, 25, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 100, 90, 40, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 4 + 40, 75, 50, 22, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 52, 75, 50, 22, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 152, 75, 50, 22, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 340, 75, 300, 22, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 390, 97, 300, 25, "environment", -1, "", "", false, false));
      // TREES RIGHT GROUP
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 75, 122, 90, 120, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 45, 242, 45, myCanvas.height - 242, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 73, 480, 28, 300, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 154, myCanvas.height - 85, 81, 85, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 194, myCanvas.height - 36, 40, 36, "environment", -1, "", "", false, false));
      // TREES LEFT GROUP
      collisionObjectArr.push(new CollisionObject(0, 140, 40, myCanvas.height - 140, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(40, myCanvas.height - 45, 160, 45, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(40, myCanvas.height - 105, 60, 105, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(40, myCanvas.height - 205, 40, 205, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 190, 10, 305, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(50, 190, 15, 80, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(50, 270, 30, 160, "environment", -1, "", "", false, false));
      // FOUNTAIN
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 180, myCanvas.height / 2 - 85, 350, 240, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 170, myCanvas.height / 2 - 40, 400, 148, "environment", -1, "", "", false, false));
      // ROOM TRANSIT
      collisionObjectArr.push(new CollisionObject(190, myCanvas.height - 15, 820, 15, "roomtransit", 1, "Meadow", "down", false, false));

      // ENEMIES
      game.enemies.push(new Enemy("slime", 900, 400, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 200, 200, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 200, 400, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 500, 200, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 200, 500, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 200, 200, 90, 80, 5));
      
      // Initialize enemies
      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].initialize();
      }
      screen2init = true;
    }
    
    function loadScreen3() {
      // TREES LEFT GROUP
      collisionObjectArr.push(new CollisionObject(0, 0, 40, myCanvas.height, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 0, 185, 45, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 45, 150, 30, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 75, 90, 30, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 105, 50, 30, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 190, 25, 240, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(65, 270, 15, 160, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 430, 10, 280, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(50, 495, 30, 210, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(80, 590, 30, 110, "environment", -1, "", "", false, false));
      // TREES BOTTOM GROUP
      collisionObjectArr.push(new CollisionObject(110, 635, 315, 110, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(425, 665, 245, 110, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(670, 650, 550, 110, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(935, 610, 550, 40, "environment", -1, "", "", false, false));
      // TREES RIGHT GROUP
      collisionObjectArr.push(new CollisionObject(900, 0, 300, 80, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(940, 80, 270, 20, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(1000, 100, 270, 20, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 40, 120, 40, 500, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 80, 120, 40, 120, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 70, 450, 30, 160, "environment", -1, "", "", false, false));
      // RUINS
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 65, myCanvas.height / 2 - 145, 30, 160, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 35, myCanvas.height / 2 - 145, 90, 120, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 55, myCanvas.height / 2 - 95, 20, 70, "environment", -1, "", "", false, false));
      // ROOM TRANSITIONING TOP
      collisionObjectArr.push(new CollisionObject(220, 0, 740, 15, "roomtransit", 1, "Meadow", "up", false, false));

      // ENEMIES
      game.enemies.push(new Enemy("slime", 900, 400, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 200, 200, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 300, 500, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 500, 500, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 200, 500, 90, 80, 5));
      game.enemies.push(new Enemy("slime", 800, 500, 90, 80, 5));
      
      // Initialize enemies
      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].initialize();
      }
      screen3init = true;
    }

    function loadScreen4() {
      // TREES TOP LEFT GROUP
      collisionObjectArr.push(new CollisionObject(0, 0, 220, 130, "environment", -1, "", "", false, false));
      // TREES TOP RIGHT GROUP
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 280, 0, 280, 70, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 200, 70, 230, 50, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 110, 120, 130, 600, "environment", -1, "", "", false, false));
      // BOTTOM GROUP
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 90, 100, 90, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(100, myCanvas.height - 50, myCanvas.width - 100, 50, "environment", -1, "", "", false, false));
      // BOTTOM RIGHT
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 280, myCanvas.height - 190, 200, 200, "environment", -1, "", "", false, false));
      
      // ROOM TRANSITIONING LEFT
      collisionObjectArr.push(new CollisionObject(0, 130, 15, 675, "roomtransit", 1, "Meadow", "left", false, false));
      // ROOM TRANSITIONING TOP
      collisionObjectArr.push(new CollisionObject(220, 0, 700, 15, "roomtransit", 5, "Meadow", "up", false, false));

      // Enemy Spawner
      collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width, 45, "environment", -1, "", "", false, true));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 64, myCanvas.height / 2 - 64, 64, 64, "spawntrigger", -1, "", "", false, false));

      // ENEMIES
      game.enemies.push(new Enemy("slime", 900, 400, 90, 80, 5));
      
      // Initialize enemies
      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].initialize();
      }

      screen4init = true;
    }

    function loadScreen5() {
      // ENVIRONMENT
      collisionObjectArr.push(new CollisionObject(0, 0, 50, myCanvas.height, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(50, 0, myCanvas.width / 2 - 150, 50, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 20, 0, myCanvas.width / 2 - 50, 50, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 50, 0, 50, myCanvas.height, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(50, myCanvas.height - 50, 170, 50, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 300, myCanvas.height - 50, 250, 50, "environment", -1, "", "", false, false));

      // SOME COLLISIONS AND TRANSITS CREATED IN UPDATEENEMY()

      // BOSS
      game.enemies.push(new Enemy("slimeBoss", myCanvas.width / 2 + 15, myCanvas.height + 50, 300, 280, 5));
      
      // Initialize enemies
      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].initialize();
      }

      screen5init = true;
    }

    function loadScreen6() {
      collisionObjectArr.push(new CollisionObject(0, 0, 60, myCanvas.height, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(60, myCanvas.height - 100, 400, 100, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 0, 400, 70, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 200, 0, 100, 70, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 560, 0, 110, 70, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 150, 0, 400, 70, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 70, 0, myCanvas.width / 2 - 200, myCanvas.height, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 200, myCanvas.height - 100, 100, 100, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 560, myCanvas.height - 100, 500, 100, "environment", -1, "", "", false, false));
      
      collisionObjectArr.push(new CollisionObject(60, 60, 400, 200, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(60, 400, 400, 50, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(870, 60, 200, 200, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 80, 200, 40, 270, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 80, myCanvas.height / 2 + 50, 320, 70, "environment", -1, "", "", false, false));
      
      // ROOM TRANSITIONING TOP
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 110, 0, 150, 15, "roomtransit", 1, "Cave", "up", false, false)); // TOP
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 110, myCanvas.height - 15, 150, 15, "roomtransit", 5, "Meadow", "down", false, false)); // BOTTOM
      screen6init = true;
    }

    function loadScreen7() {
      // COLLISIONS
      collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width / 2 - 110, 90, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 90, 60, myCanvas.height - 90, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(60, myCanvas.height - 90, myCanvas.width / 2 - 170, 90, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, myCanvas.height - 90, myCanvas.width / 2 - 110, 90, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 70, 90, 70, myCanvas.height - 90, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(240, myCanvas.height / 2 + 50, 760, 40, "playerblock", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(60, 200, 420, 60, "playerblock", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, myCanvas.height - 200, 360, 60, "playerblock", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 80, myCanvas.height / 2 - 100, 40, 100, "playerblock", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, 0, 560, 90, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 200, 180, 400, 90, "playerblock", -1, "", "", false, false));
      
      // Transitions
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, 0, 130, 15, "roomtransit", 2, "Cave", "up", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, myCanvas.height-15, 130, 15, "roomtransit", 0, "Cave", "down", false, false));
      
      // ENEMIES
      game.enemies.push(new Enemy("bat", 100, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 200, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 300, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 400, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 500, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 150, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 250, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 350, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 450, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 550, 120, 52, 36, 5));

      game.enemies.push(new Enemy("bat", 600, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 700, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 800, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 900, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 1000, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 650, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 750, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 850, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 950, 120, 52, 36, 5));
      game.enemies.push(new Enemy("bat", 1050, 120, 52, 36, 5));

      // Initialize enemies
      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].initialize();
        if (i > 8) game.enemies[i].xDir = -1;
      }
      
      screen7init = true;
    }

    function  loadScreen8() {
      // COLLISIONS
      collisionObjectArr.push(new CollisionObject(0, 0, 60, myCanvas.height, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 60, 0, 60, myCanvas.height, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 0, 475, 70, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, 0, 600, 70, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 90, 485, 90, "environment", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, myCanvas.height / 2 + 110, 480, 100, "playerblock", -1, "", "", true, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, myCanvas.height - 100, 600, 100, "environment", -1, "", "", true, false));

      // Transitions
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, 0, 130, 15, "roomtransit", 3, "Cave", "up", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, myCanvas.height-15, 130, 15, "roomtransit", 1, "Cave", "down", false, false));

      // Enemy Spawner
      collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width, 45, "environment", -1, "", "", false, true));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 64, myCanvas.height / 2 - 64, 64, 64, "spawntrigger", -1, "", "", false, false));

      screen8init = true;
    }

    function  loadScreen9() {
      // COLLISIONS
      collisionObjectArr.push(new CollisionObject(0, 0, 240, myCanvas.height, "playerblock", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 250, 0, 250, myCanvas.height, "playerblock", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 0, 600, 110, "playerblock", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 160, 0, 600, 110, "playerblock", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 190, 485, 190, "playerblock", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, myCanvas.height - 190, 600, 190, "playerblock", -1, "", "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 120, myCanvas.height / 2 - 90, 225, 70, "playerblock", -1, "", "", false, false));
      
      // Transitions
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 20, 0, 130, 15, "roomtransit", -10, "", "", "up", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, myCanvas.height - 15, 130, 15, "roomtransit", 2, "Cave", "down", false, false));

      // BOSS
      setTimeout(() => {
        game.enemies.push(new Enemy("ecrol", -myCanvas.width, 0, 531, 150, 0));
        for (let i = 0; i < game.enemies.length; i++) {
          game.enemies[i].initialize();
        }
      }, 1000)
      screen9init = true;
    }
  }
  
});