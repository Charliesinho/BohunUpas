window.addEventListener("load", () => {
    setTimeout(() => {  
      if ( document.getElementById("mediumPack")) {
      if (document.getElementById("mediumPack").style.display === "block") {
        document.getElementById("mediumPack").style.display = "none";
      }}
    
      if ( document.getElementById("mediumPack")) {
      if (document.getElementById("legendaryPack").style.display === "block") {
        document.getElementById("legendaryPack").style.display = "none";
      }}
    }, 3000)
    
    setTimeout(() => {    
        document.getElementById("caveMap").style.display = "none";  
    }, 2000)
    
    
    
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
    
    
    const saveBtn = document.querySelector("#saveGameButton");
    
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
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
    
      // Backgrounds
      const backgroundArr = [];
      let background = new Image();
    
      let worldInit = false;
    
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
    
      let levelScreen = 0;
    
      let roomTransit = false;
      let transitSpeed = 5;
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
          this.player = new Player(this, race, 800, 270, 80, 80, 0.4, 0.3, 1, 0);
          this.enemies = [];
          this.input = new InputHandler(this, this.player);
        }
        render(context, deltaTime) {
          this.player.draw(context);
          this.player.updatePlayer(deltaTime);
          for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw(context);
            this.enemies[i].updateEnemies(deltaTime);
          }
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
      }
      
      class Player {
        constructor(game, race, x, y, width, height, xSpeed, ySpeed, xFacing, yFacing) {
          this.game = game;
          this.type = "player";
          this.race = race;
          this.experience = experience;
          this.level = gLevel;
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
          this.moveInterval = 500/this.fps;
          this.moveTimer = 0;
          this.move = 0;
          this.maxMove = 4;
          this.moveLeft = false;
          this.moveRight = false;
          this.moveUp = false;
          this.moveDown = false;
    
          //Animation
          this.shadow = new Image();
          this.shadow.src = "../images/ShadowPlayer.png";
          this.imgContainerRight = [];
          this.imgContainerLeft = [];
          this.imgContainerIdleLeft = [];
          this.imgContainerIdleRight = [];
    
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
            this.weaponProjectileSpeed = 8;
          } else if (this.weapon.includes("Rusty Sword")) {
            this.weaponProjectile = projectileImgArr[0];
            this.weaponShootInterval = 500;
            this.weaponLifeSpan = 40;
            this.weaponProjectileSpeed = 8;
          } else if (this.weapon.includes("Lancer")) {
            this.weaponProjectile = projectileImgArr[2];
            this.weaponShootInterval = 1000;
            this.weaponLifeSpan = 50;
            this.weaponProjectileSpeed = 20;
          } else if (this.weapon.includes("Heavy Sword")) {
            this.weaponProjectile = projectileImgArr[1];
            this.weaponShootInterval = 400;
            this.weaponLifeSpan = 1000;
            this.weaponProjectileSpeed = .5;
          } else if (this.weapon.includes("Moonlair")) {
            this.weaponProjectile = projectileImgArr[3];
            this.weaponShootInterval = 1;
            this.weaponLifeSpan = 1000;
            this.weaponProjectileSpeed = Math.floor(Math.random() * (21 - 1) + 1);
          } else if (this.weapon.includes("Swampy")) {
            this.weaponProjectile = projectileImgArr[5];
            this.weaponShootInterval = 1000;
            this.weaponLifeSpan = 5000;
            this.weaponProjectileSpeed = .2;
          } else {
            this.weaponProjectile = projectileImgArr[4];
            this.weaponShootInterval = 600;
            this.weaponLifeSpan = 30;
            this.weaponProjectileSpeed = 8;
          }
          // Configure Armor values
          this.armor = gArmor;
          this.defense = gDefense;
          
          // Configure Artefact values
          this.artefact = gArtefact;
    
          // Load player sprites
          if (this.race === "Dino") {   
            this.image = document.getElementById("dino"); 
          } 
          if (this.race === "Undead") {   

          } 
          if (this.race === "Human") {    

          } 
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
                  transitDir = arr[i].transitDir;
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
            if (this.moveDown && this.y < myCanvas.height - this.height) {
              if (!this.checkCollision(collisionObjectArr, 0, 0, 5, 0) && !roomTransit) this.y += this.ySpeed * deltaTime;
              if(this.xFacing === 1 && !this.moveRight) {
                this.frameY = 2;
              }
              if(this.xFacing === -1 && !this.moveLeft) {
                this.frameY = 3;
              }     
            }
            if (!this.moveDown && !this.moveLeft && !this.moveRight && !this.moveUp) {
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
            if (this.canShoot) {
              if (this.shootLeft && this.shootUp) { // TOP LEFT
                spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, -1, -1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
              } else if (this.shootUp && this.shootRight) { // TOP RIGHT
                spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, 1, -1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
              } else if (this.shootRight && this.shootDown) { // BOTTOM RIGHT
                spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, 1, 1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
              } else if (this.shootDown && this.shootLeft) { // BOTTOM LEFT
                spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, -1, 1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
              } else if (this.shootRight) { // RIGHT
                spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, 1, 0, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
              } else if (this.shootLeft) { // LEFT
                spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, -1, 0, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
              } else if (this.shootDown) { // DOWN
                spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, 0, 1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
              } else if (this.shootUp) { // UP
                spawnProjectile(this.x + this.width / 2 - 32, this.y + this.height / 2 - 32, 50, 50, 0, -1, this.weaponProjectileSpeed, this.getDamage(), this.weaponLifeSpan, "player", this.weaponProjectile);
              }
              this.canShoot = false;
              setTimeout(() => {
                this.canShoot = true;
              }, this.weaponShootInterval); // Passing in shootInterval from player as timeout value
            }      
          }
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
            this.xDir = -1;
            this.moveSpeed = 1;
            this.canShoot = true;
            this.shootInterval = this.getRandomShootInterval();
            for (let i = 0; i < this.imageFrames; i++) {
              this.imgContainer.push("../images/Dungeon/Bat/bat"+i+".png");
            }
          }
          if (this.name === "enemyprojectile") {
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
            this.moveSpeed = 1;
            this.imgContainer.push("../images/Projectiles/weakFire.png");
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
            this.moveSpeed = 12;
            this.movementArr = this.ecrolPatterns();
            this.x = this.movementArr[0].x;
            this.y = this.movementArr[0].y;
            if (this.ecrolState) this.state = 0;
            for (let i = 0; i < this.imageFrames; i++) {
              this.imgContainer.push("../images/Ecrol/ecrol"+i+".png");
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
    
        getRandomShootInterval() {
          return Math.floor(Math.random() * (5000 - 3000) + 3000);
        }
            
        updateCollision() {
          if (this.name === "enemyprojectile" && this.y > myCanvas.height - this.height) this.destroy();
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

        draw(ctx) {
          ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }

        updateEnemies(deltaTime) {
          if (deltaTime === undefined) deltaTime = 0;
          // Normal enemies
          if (this.name === "slime") this.moveTowardsTarget(this.moveTo, deltaTime);
          if (this.name === "bat") {
            this.moveLeftRight();
            this.shootDown();
          }
          if (this.name === "enemyprojectile") {
            if(!this.initialized) this.initialize()
            this.moveDown();
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
                collisionObjectArr.push(new CollisionObject(220, myCanvas.height - 15, 680, 15, "roomtransit", 4, "up", false, false));
                // TO DUNGEON
                collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 380, 0, 680, 15, "roomtransit", 6, "down", false, false));
                // GET DESTROYED
                collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, 0, 120, 50, "environment", -1, "", false, true));
              }, 1500)
              setTimeout(() => {
                collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 50, myCanvas.width, 50, "environment", -1, "", false, true));
              }, 5000)
            }
          }
  
          // ECROL
          if (this.name === "ecrol") {
            this.ecrolBossMovement(deltaTime);
          }
  
          // Collisions
          this.updateCollision();

          // Frame counter
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
    
        moveLeftRight() {
          if (this.checkCollision(collisionObjectArr, 0, 5, 0, 0) || this.checkCollision(collisionObjectArr, 0, 0, 0, 5)) {
            this.xDir *= -1;
          }
          this.x += (this.moveSpeed * this.xDir) * deltaTime;
        }
    
        shootDown() {
          if (this.canShoot) {
            this.canShoot = false;
            game.enemies.push(new Enemy("enemyprojectile", this.x, this.y, 32, 32));
            setTimeout(() => {
              this.canShoot = true;
            }, this.shootInterval);
          }
        }
    
        moveDown() {
          this.y += this.moveSpeed * deltaTime;
        }
    
        slimeBossMovement(deltaTime) {
          console.log(this.xDir, this.yDir)
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
        }
    
        ecrolPositionPicker() {
          this.state = Math.floor(Math.random() * 5)
        }
    
        ecrolBossMovement(deltaTime) {
          if (this.ecrolState) {
            switch (this.state) {
              case 0:
                this.ecrolState = false;
                this.img.src = this.imgContainer[1];
                this.x = this.movementArr[this.state].x
                this.y = this.movementArr[this.state].y
                setTimeout(() => {
                  this.ecrolState = true;
                  this.ecrolPositionPicker();
                }, this.ecrolTimeout)
                break;
              case 1:
                this.ecrolState = false;
                this.img.src = this.imgContainer[3];
                this.x = this.movementArr[this.state].x
                this.y = this.movementArr[this.state].y
                setTimeout(() => {
                  this.ecrolState = true;
                  this.ecrolPositionPicker();
                }, this.ecrolTimeout)
                break;
              case 2:
                this.ecrolState = false;
                this.img.src = this.imgContainer[2];
                this.x = this.movementArr[this.state].x
                this.y = this.movementArr[this.state].y
                setTimeout(() => {
                  this.ecrolState = true;
                  this.ecrolPositionPicker();
                }, this.ecrolTimeout)
                break;
              case 3:
                this.ecrolState = false;
                this.img.src = this.imgContainer[2];
                this.x = this.movementArr[this.state].x
                this.y = this.movementArr[this.state].y
                setTimeout(() => {
                  this.ecrolState = true;
                  this.ecrolPositionPicker();
                }, this.ecrolTimeout)
                break;
              case 4:
                this.ecrolState = false;
                this.img.src = this.imgContainer[0];
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
          if (this.name === "enemyprojectile") this.destroy();
          this.takenDamage = true;
          this.hp -= damage;
          if (this.hp <= 0) {
            this.destroy();
          } else {
            setTimeout(() => {
              this.takenDamage = false;
            }, this.iframes)
          }
          console.log("HIT")
        }
    
        destroy() { // GRANT SOULS AND XP
          if (this.name === "slimeBoss") {
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
    
    
      const projectileArr = [];
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
    
        updateProjectile() {
          // Collision
          this.left = this.x;
          this.right = this.x + this.width
          this.top = this.y;
          this.bottom = this.y + this.height;
    
          // Move projectiles
          if (this.xDir + this.yDir === 1) {
            this.x += this.speed * this.xDir;
            this.y += this.speed * this.yDir;
          } else {
            this.x += this.speed / 1.4 * this.xDir;
            this.y += this.speed / 1.4 * this.yDir;
          }
          // Draw
          ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    
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
                if (arr[i].getType() === "enemy" && this.firedBy === "player") {
                  const projectile = projectileArr.indexOf(this);
                  if (!arr[i].takenDamage) arr[i].hit(projectileArr[projectile].damage);
                  projectileArr[projectile].destroy();
                  break;
                } 
                if (arr[i].getType() === "environment") {
                  this.destroy();
                }
                if (arr[i].getType() === "spawntrigger") {
                  arr[i].initiatieEnemySpawn()
                  this.destroy();
                }
              }
          }
          // Leaving canvas
          if (this.x < 0 || this.y < 0 || this.x > myCanvas.width + this.width || this.y > myCanvas.height + this.height) {
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
        constructor(x, y, width, height, type, nextScreen, transitDir, debug, triggerDestroy) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.type = type;
          this.nextScreen = nextScreen;
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
    let level4Spawn = true;
    let level8Spawn = true;
    function preloadImages(array) {
      if (!preloadImages.list) {
          preloadImages.list = [];
      }
      let list = preloadImages.list;
      for (let i = 0; i < array.length; i++) {
          let img = new Image();
          img.onload = function() {
              let index = list.indexOf(this);
              if (index !== -1) {
                  // remove image from the array once it's loaded
                  // for memory consumption reasons
                  list.splice(index, 1);
              }
          }
          list.push(img);
          img.src = array[i];
      }
    }

    myCanvas.style.backgroundColor = "white";
    myCanvas.style.border = "1px solid black";
    myCanvas.style.align = "center";
    const game = new Game(myCanvas.width, myCanvas.height);
    //const player = new Player(game, race, 800, 270, 80, 80, 5, 5, 1, 0);
    let lastTime = 0;
    startGame(lastTime);

    function startGame(lastTime) {
      game.player.initialize()
      preloadImages(game.player.imgContainerIdleLeft);
      preloadImages(game.player.imgContainerIdleRight);
      preloadImages(game.player.imgContainerRight);
      preloadImages(game.player.imgContainerLeft); 
      checkLevelScreen(levelScreen);
      gameplayLoop(lastTime);
    }

    function checkLevelScreen(levelScreen) {
      switch (levelScreen) {
        case 0:
          if (!worldInit) loadWorld();
          if (!screen0init) loadScreen0();
          background.src = backgroundArr[levelScreen].source;
          break;
        // Meadow Screens
        case 1:
          if (!worldInit) loadWorld();
          if (!screen1init) loadScreen1();
          background.src = backgroundArr[levelScreen].source;
          break;
        case 2:
          if (!worldInit) loadWorld();
          if (!screen2init) loadScreen2();
          background.src = backgroundArr[levelScreen].source;
          break;
        case 3:
          if (!worldInit) loadWorld();
          if (!screen3init) loadScreen3();
          background.src = backgroundArr[levelScreen].source;
          break;
        case 4:
          if (!worldInit) loadWorld();
          if (!screen4init) loadScreen4();
          background.src = backgroundArr[levelScreen].source;
          break;
        case 5:
          if (!worldInit) loadWorld();
          if (!screen5init) loadScreen5();
          background.src = backgroundArr[levelScreen].source;
          break;
        // Cave Screens
        case 6:
          if (!worldInit) loadWorld();
          if (!screen6init) loadScreen6();
          background.src = backgroundArr[levelScreen].source;
          break;
        case 7:
          if (!worldInit) loadWorld();
          if (!screen7init) loadScreen7();
          background.src = backgroundArr[levelScreen].source;
          break;
        case 8:
          if (!worldInit) loadWorld();
          if (!screen8init) loadScreen8();
          background.src = backgroundArr[levelScreen].source;
          break;
        case 9:
          if (!worldInit) loadWorld();
          if (!screen9init) loadScreen9();
          background.src = backgroundArr[levelScreen].source;
          break;
      }
    }

    
    function gameplayLoop(timeStamp) {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      // Reset for new drawing
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
      //Background Test
      ctx.drawImage(background, 0, 0, 1200, 700);
      // Projectiles
      updateProjectiles();
      // Level Events
      checkLevelEvents();
      // Collisions
      updateCollisionObjects();
      // Transit
      roomTransitioning();
      
      game.render(ctx, deltaTime);
      requestAnimationFrame(gameplayLoop);
    }

    // Transit rooms
    function roomTransitioning() {
      if (roomTransit) {
        if (levelScreen === -10) {
          saveBtn.click();
        }
        
        // Reset for new drawing
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        // Moving DOWN a screen
        if (transitDir === "down" && backgroundArr[levelScreen].y < 0) {
          transitMoveElements();
        // Moving UP a screen
        } else if (transitDir === "up" && backgroundArr[levelScreen].y > 0) {
          transitMoveElements();
        // Moving RIGHT a screen
        } else if (transitDir === "right" && backgroundArr[levelScreen].x > 0) {
          transitMoveElements();
        // Moving LEFT a screen
        } else if (transitDir === "left" && backgroundArr[levelScreen].x < 0) {
          transitMoveElements();
        // Resume Game
        } else {
          roomTransit = false;
          checkLevelScreen(levelScreen);
        }
      }
    }

    function transitMoveElements() {
      // Shift and draw backgrounds
      for (let i = 0; i < backgroundArr.length; i++) {
        if (transitDir === "up") backgroundArr[i].y -= transitSpeed;
        if (transitDir === "down") backgroundArr[i].y += transitSpeed;
        if (transitDir === "right") backgroundArr[i].x -= transitSpeed;
        if (transitDir === "left") backgroundArr[i].x += transitSpeed;
        ctx.drawImage(backgroundArr[i].img, backgroundArr[i].x, backgroundArr[i].y, backgroundArr[i].width, backgroundArr[i].height);
      }
      // Shift enemies
      for (let i = 0; i < game.enemies.length; i++) {
        if (transitDir === "up") game.enemies[i].y -= transitSpeed;
        if (transitDir === "down") game.enemies[i].y += transitSpeed;
        if (transitDir === "right") game.enemies[i].x -= transitSpeed;
        if (transitDir === "left") game.enemies[i].x += transitSpeed;
      }
      // Shift collisions
      for (let i = 0; i < collisionObjectArr.length; i++) {
        if (transitDir === "up") collisionObjectArr[i].y -= transitSpeed;
        if (transitDir === "down") collisionObjectArr[i].y += transitSpeed;
        if (transitDir === "right") collisionObjectArr[i].x -= transitSpeed;
        if (transitDir === "left") collisionObjectArr[i].x += transitSpeed;
      }
      // Destroy Projectiles
      for (let i = 0; i < projectileArr.length; i++) {
        projectileArr[i].destroy();
      }
      // Player
      if (transitDir === "up") {
        game.player.y -= transitSpeed - 1;
        //animate(game.player, game.player.imgContainerRight, 6, 8);
      }
      if (transitDir === "down") {
        game.player.y += transitSpeed - 1;
        //animate(game.player, game.player.imgContainerLeft, 6, 8);
      }
      if (transitDir === "right") {
        game.player.x -= transitSpeed - 1;
        //animate(game.player, game.player.imgContainerRight, 6, 8);
      }
      if (transitDir === "left") {
        game.player.x += transitSpeed - 1;
        //(game.player, game.player.imgContainerLeft, 6, 8);
      }
    }

    function checkLevelEvents() {      
      // Level Dependent Enemy Spawns
      let spawnImg = new Image();
      spawnImg.src = "../images/Environment/spawnSlimeGel.png";
      if (level4Spawn && levelScreen === 4) {
        ctx.drawImage(spawnImg, myCanvas.width / 2 - 72, myCanvas.height / 2  - 72, 72, 72)
      }
      if (level8Spawn && levelScreen === 8) {
        ctx.drawImage(spawnImg, myCanvas.width / 2 - 72, myCanvas.height / 2  - 72, 72, 72)
      }
      if (enemySpawnInProgress) {
        enemySpawnInProgress = false;
        if (levelScreen === 4) level4Spawn = false;
        if (levelScreen === 8) level8Spawn = false;
        initiateSpawn()
      }
      // 3D Level Models
      if (levelScreen < 6) {
        document.getElementById("meadowMap").style.display = "block";
        document.getElementById("caveMap").style.display = "none";
      }
      if (levelScreen > 5) {
        document.getElementById("caveMap").style.display = "block";
        document.getElementById("meadowMap").style.display = "none";
      }

    }


    function spawnProjectile(x, y, width, height, xDir, yDir, speed, damage, lifeSpan, firedBy, src) {
      const projectile = new Projectile(x, y, width, height, xDir, yDir, speed, damage, lifeSpan, firedBy, src);
      projectileArr.push(projectile);
    }

    function updateProjectiles() {
      for (let i = 0; i < projectileArr.length; i++) {
          if (projectileArr[i] !== undefined) projectileArr[i].updateProjectile();
          if (projectileArr[i] !== undefined) projectileArr[i].checkCollision(game.enemies, 0, 0, 0, 0);
          if (projectileArr[i] !== undefined) projectileArr[i].checkCollision(collisionObjectArr, 0, 0, 0, 0);
      }
    }

    function updateCollisionObjects() {
      for (let i = 0; i < collisionObjectArr.length; i++) {
        collisionObjectArr[i].updateCollisionObjects();
      }
    }

    function initiateSpawn() {
      // Spawn boundaries
      collisionObjectArr.push(new CollisionObject(0, 0, 45, myCanvas.height, "environment", -1, "", false, true));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 45, 0, 45, myCanvas.height, "environment", -1, "", false, true));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 45, myCanvas.width, 45, "environment", -1, "", false, true));
      for (let i = collisionObjectArr.length - 1; i >= 0; i--) {
        collisionObjectArr[i].selfDestruct();
      }
      
      if (levelScreen === 4) {
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
      } else if (levelScreen === 8) {
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
        game.enemies.push(new Enemy("bat", 150, 120, 52, 36));
        game.enemies.push(new Enemy("bat", 250, 120, 52, 36));
        game.enemies.push(new Enemy("bat", 350, 120, 52, 36));
        game.enemies.push(new Enemy("bat", 450, 120, 52, 36));
        game.enemies.push(new Enemy("bat", 550, 120, 52, 36));
        game.enemies.push(new Enemy("bat", 600, 120, 52, 36));
        game.enemies.push(new Enemy("bat", 700, 120, 52, 36));
        game.enemies.push(new Enemy("bat", 800, 120, 52, 36));
        game.enemies.push(new Enemy("bat", 900, 120, 52, 36));
        game.enemies.push(new Enemy("bat", 1000, 120, 52, 36));
      }
      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].initialize();
      }
      enemySpawnInProgress = false;
      inBattle = true;
    }


    // SCREENS AND LEVELS DEFINED HERE
    function loadWorld() {
      // Get Backgrounds
      backgroundArr.push(new Background(0, 0, myCanvas.width, myCanvas.height, `../images/Meadow/Backgrounds/meadow5.png`));
      backgroundArr.push(new Background(myCanvas.width, 0, myCanvas.width, myCanvas.height, `../images/Meadow/Backgrounds/meadow0.png`));
      backgroundArr.push(new Background(myCanvas.width, -myCanvas.height, myCanvas.width, myCanvas.height, `../images/Meadow/Backgrounds/meadow1.png`));
      backgroundArr.push(new Background(myCanvas.width, myCanvas.height, myCanvas.width, myCanvas.height, `../images/Meadow/Backgrounds/meadow2.png`));
      backgroundArr.push(new Background(myCanvas.width * 2, 0, myCanvas.width, myCanvas.height, `../images/Meadow/Backgrounds/meadow3.png`));
      backgroundArr.push(new Background(myCanvas.width * 2, -myCanvas.height, myCanvas.width, myCanvas.height, `../images/Meadow/Backgrounds/meadow4.png`));
      backgroundArr.push(new Background(myCanvas.width * 2, -myCanvas.height * 2, myCanvas.width, myCanvas.height, "../images/Dungeon/dungeon0.png"));
      backgroundArr.push(new Background(myCanvas.width * 2, -myCanvas.height * 3, myCanvas.width, myCanvas.height, "../images/Dungeon/dungeon1.png"));
      backgroundArr.push(new Background(myCanvas.width * 2, -myCanvas.height * 4, myCanvas.width, myCanvas.height, "../images/Dungeon/dungeon2.png"));
      backgroundArr.push(new Background(myCanvas.width * 2, -myCanvas.height * 5, myCanvas.width, myCanvas.height, "../images/Dungeon/dungeon3.png"));
      worldInit = true;
    }

    function loadScreen0() {
      // COLLISIONS
      collisionObjectArr.push(new CollisionObject(0, 0, 400, myCanvas.height, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width, 130, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height-130, myCanvas.width, 130, "environment", -1, "", false, false));
      // ROOM TRANSITIONING RIGHT
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 15, 130, 15, 440, "roomtransit", 1, "right", false, false));
      
      // SAVE
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 110, myCanvas.height / 2 - 40, 5, 5, "roomtransit", -10, "up", false, false));
      screen0init = true;
    }

    function loadScreen1() {
      // TOP LEFT TREE GROUP
      collisionObjectArr.push(new CollisionObject(0, 0, 225, 50, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 50, 175, 25, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 75, 125, 25, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 100, 90, 40, "environment", -1, "", false, false));
      // MIDDLE STONES
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 64, myCanvas.height / 2 - 48, 110, 75, "environment", "", false, false));
      // TOP CENTER TREE
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 70, 0, 55, 55, "environment", -1, "", false, false));
      // TOP RIGHT TREE GROUP
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 300, 0, 300, 80, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 255, 80, 300, 25, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 200, 105, 300, 25, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 42, 130, 300, 25, "environment", -1, "", false, false));
      // BOTTOM RIGHT TREE GROUP
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 250, myCanvas.height - 30, 250, 25, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 220, myCanvas.height - 55, 250, 25, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 180, myCanvas.height - 80, 250, 25, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 100, myCanvas.height - 97, 250, 17, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 40, myCanvas.height - 114, 250, 17, "environment", -1, "", false, false));
      // BOTTOM LEFT TREE GROUP
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 30, 195, 30, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 60, 150, 30, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 75, 80, 15, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 105, 35, 30, "environment", -1, "", false, false));
      // ROOM TRANSITIONING TOP
      collisionObjectArr.push(new CollisionObject(myCanvas.width/4 - 70, 0, 675, 15, "roomtransit", 2, "down", false, false));
      // ROOM TRANSITIONING RIGHT
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 15, 155, 15, 430, "roomtransit", 4, "right", false, false));
      // ROOM TRANSITIONING BOTTOM
      collisionObjectArr.push(new CollisionObject(212, myCanvas.height - 15, 740, 15, "roomtransit", 3, "up", false, false));
      // ROOM TRANSITIONING LEFT
      collisionObjectArr.push(new CollisionObject(0, 150, 15, 440, "roomtransit", 0, "left", false, false));
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
      collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width, 75, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 75, 125, 25, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 100, 90, 40, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 4 + 40, 75, 50, 22, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 52, 75, 50, 22, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 152, 75, 50, 22, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 340, 75, 300, 22, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 390, 97, 300, 25, "environment", -1, "", false, false));
      // TREES RIGHT GROUP
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 75, 122, 90, 120, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 45, 242, 45, myCanvas.height - 242, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 73, 480, 28, 300, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 154, myCanvas.height - 85, 81, 85, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 194, myCanvas.height - 36, 40, 36, "environment", -1, "", false, false));
      // TREES LEFT GROUP
      collisionObjectArr.push(new CollisionObject(0, 140, 40, myCanvas.height - 140, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(40, myCanvas.height - 45, 160, 45, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(40, myCanvas.height - 105, 60, 105, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(40, myCanvas.height - 205, 40, 205, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 190, 10, 305, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(50, 190, 15, 80, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(50, 270, 30, 160, "environment", -1, "", false, false));
      // FOUNTAIN
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 180, myCanvas.height / 2 - 85, 350, 240, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 170, myCanvas.height / 2 - 40, 400, 148, "environment", -1, "", false, false));
      // ROOM TRANSIT
      collisionObjectArr.push(new CollisionObject(190, myCanvas.height - 15, 820, 15, "roomtransit", 1, "up", false, false));

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
      collisionObjectArr.push(new CollisionObject(0, 0, 40, myCanvas.height, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 0, 185, 45, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 45, 150, 30, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 75, 90, 30, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 105, 50, 30, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 190, 25, 240, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(65, 270, 15, 160, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(40, 430, 10, 280, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(50, 495, 30, 210, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(80, 590, 30, 110, "environment", -1, "", false, false));
      // TREES BOTTOM GROUP
      collisionObjectArr.push(new CollisionObject(110, 635, 315, 110, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(425, 665, 245, 110, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(670, 650, 550, 110, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(935, 610, 550, 40, "environment", -1, "", false, false));
      // TREES RIGHT GROUP
      collisionObjectArr.push(new CollisionObject(900, 0, 300, 80, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(940, 80, 270, 20, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(1000, 100, 270, 20, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 40, 120, 40, 500, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 80, 120, 40, 120, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 70, 450, 30, 160, "environment", -1, "", false, false));
      // RUINS
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 65, myCanvas.height / 2 - 145, 30, 160, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 35, myCanvas.height / 2 - 145, 90, 120, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 55, myCanvas.height / 2 - 95, 20, 70, "environment", -1, "", false, false));
      // ROOM TRANSITIONING TOP
      collisionObjectArr.push(new CollisionObject(220, 0, 740, 15, "roomtransit", 1, "down", false, false));

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
      collisionObjectArr.push(new CollisionObject(0, 0, 220, 130, "environment", -1, "", false, false));
      // TREES TOP RIGHT GROUP
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 280, 0, 280, 70, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 200, 70, 230, 50, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 110, 120, 130, 600, "environment", -1, "", false, false));
      // BOTTOM GROUP
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 90, 100, 90, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(100, myCanvas.height - 50, myCanvas.width - 100, 50, "environment", -1, "", false, false));
      // BOTTOM RIGHT
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 280, myCanvas.height - 190, 200, 200, "environment", -1, "", false, false));
      
      // ROOM TRANSITIONING LEFT
      collisionObjectArr.push(new CollisionObject(0, 130, 15, 675, "roomtransit", 1, "left", false, false));
      // ROOM TRANSITIONING TOP
      collisionObjectArr.push(new CollisionObject(220, 0, 700, 15, "roomtransit", 5, "down", false, false));

      // Enemy Spawner
      collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width, 45, "environment", -1, "", false, true));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 64, myCanvas.height / 2 - 64, 64, 64, "spawntrigger", -1, "", false, false));

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
      collisionObjectArr.push(new CollisionObject(0, 0, 50, myCanvas.height, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(50, 0, myCanvas.width / 2 - 150, 50, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 20, 0, myCanvas.width / 2 - 50, 50, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 50, 0, 50, myCanvas.height, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(50, myCanvas.height - 50, 170, 50, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 300, myCanvas.height - 50, 250, 50, "environment", -1, "", false, false));

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
      collisionObjectArr.push(new CollisionObject(0, 0, 60, myCanvas.height, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(60, myCanvas.height - 100, 400, 100, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 0, 400, 70, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 200, 0, 100, 70, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 560, 0, 110, 70, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 150, 0, 400, 70, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 70, 0, myCanvas.width / 2 - 200, myCanvas.height, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 200, myCanvas.height - 100, 100, 100, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 560, myCanvas.height - 100, 500, 100, "environment", -1, "", false, false));
      
      collisionObjectArr.push(new CollisionObject(60, 60, 400, 200, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(60, 400, 400, 50, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(870, 60, 200, 200, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 80, 200, 40, 270, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 80, myCanvas.height / 2 + 50, 320, 70, "environment", -1, "", false, false));
      
      // ROOM TRANSITIONING TOP
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 110, 0, 150, 15, "roomtransit", 7, "down", false, false)); // TOP
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 110, myCanvas.height - 15, 150, 15, "roomtransit", 5, "up", false, false)); // BOTTOM
      screen6init = true;
    }

    function loadScreen7() {
      // COLLISIONS
      collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width / 2 - 110, 90, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 90, 60, myCanvas.height - 90, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(60, myCanvas.height - 90, myCanvas.width / 2 - 170, 90, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, myCanvas.height - 90, myCanvas.width / 2 - 110, 90, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 70, 90, 70, myCanvas.height - 90, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(240, myCanvas.height / 2 + 50, 760, 40, "playerblock", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(60, 200, 420, 60, "playerblock", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, myCanvas.height - 200, 360, 60, "playerblock", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 80, myCanvas.height / 2 - 100, 40, 100, "playerblock", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, 0, 560, 90, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 200, 180, 400, 90, "playerblock", -1, "", false, false));
      
      // Transitions
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, 0, 130, 15, "roomtransit", 8, "down", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, myCanvas.height-15, 130, 15, "roomtransit", 6, "up", false, false));
      
      // ENEMIES
      game.enemies.push(new Enemy("bat", 100, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 200, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 300, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 400, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 500, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 150, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 250, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 350, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 450, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 550, 120, 52, 36));

      game.enemies.push(new Enemy("bat", 600, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 700, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 800, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 900, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 1000, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 650, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 750, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 850, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 950, 120, 52, 36));
      game.enemies.push(new Enemy("bat", 1050, 120, 52, 36));

      // Initialize enemies
      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].initialize();
        if (i > 8) game.enemies[i].xDir = 1;
      }
      
      screen7init = true;
    }

    function  loadScreen8() {
      // COLLISIONS
      collisionObjectArr.push(new CollisionObject(0, 0, 60, myCanvas.height, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 60, 0, 60, myCanvas.height, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 0, 475, 70, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, 0, 600, 70, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 90, 485, 90, "environment", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, myCanvas.height / 2 + 110, 600, 240, "environment", -1, "", false, false));

      // Transitions
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, 0, 130, 15, "roomtransit", 9, "down", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, myCanvas.height-15, 130, 15, "roomtransit", 7, "up", false, false));

      // Enemy Spawner
      collisionObjectArr.push(new CollisionObject(0, 0, myCanvas.width, 45, "environment", -1, "", false, true));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 64, myCanvas.height / 2 - 64, 64, 64, "spawntrigger", -1, "", false, false));

      screen8init = true;
    }

    function  loadScreen9() {
      // COLLISIONS
      collisionObjectArr.push(new CollisionObject(0, 0, 240, myCanvas.height, "playerblock", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width - 250, 0, 250, myCanvas.height, "playerblock", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, 0, 600, 110, "playerblock", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 160, 0, 600, 110, "playerblock", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(0, myCanvas.height - 190, 485, 190, "playerblock", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 40, myCanvas.height - 190, 600, 190, "playerblock", -1, "", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 120, myCanvas.height / 2 - 90, 225, 70, "playerblock", -1, "", false, false));
      
      // Transitions
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 + 20, 0, 130, 15, "roomtransit", -10, "down", false, false));
      collisionObjectArr.push(new CollisionObject(myCanvas.width / 2 - 100, myCanvas.height - 15, 130, 15, "roomtransit", 8, "up", false, false));

      // BOSS
      setTimeout(() => {
        game.enemies.push(new Enemy("ecrol", -myCanvas.width, 0, 531, 150));
        for (let i = 0; i < game.enemies.length; i++) {
          game.enemies[i].initialize();
        }
      }, 1000)
      screen9init = true;
    }
  }
})