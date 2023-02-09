// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("BohunUpas JS imported successfully!");
});

let animateId;
let xPos = 100;
let yPos = 100;
const xSpeed = 5;
const ySpeed = 5;

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

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
    // Gameplay loop
    animateId = requestAnimationFrame(startGame);
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
    }
  });

  

  startGame()
}



