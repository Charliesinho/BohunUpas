// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("BohunUpas JS imported successfully!");
});

//document.querySelector("#btn-logout").style.display = "none";

window.onload = () => {
  console.log(session);

}

//Canvas
const myCanvas = document.querySelector("canvas");
const ctx = myCanvas.getContext("2d")
myCanvas.style.backgroundColor = "black"


