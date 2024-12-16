const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");
const nextButton = document.getElementById("nextButton");
const restartMessage = document.getElementById("restartMessage");

// Game settings
const screenWidth = 800;
const screenHeight = 600;

// Colors
const BACKGROUND = "#1e1e1e";
const BOX_COLOR = 0; // Green box
const WHITE = "#ffffff";
const RED = "#FF6F61"; // Soft red
const GREEN = "#4CAF50"; // Light green for buttons

// Physics variables
let mass = 50;
let force = 0;
let acceleration = 0;
let velocity = 0;
let height = 100;
let springForce = 0;

// Level settings
let currentLevel = 1;
let gameOver = false;

// Box settings
const boxWidth = 120;
const boxHeight = 120;
let boxX = 100;
let boxY = 160;

// Create a box image
const boxImage = new Image();
boxImage.src = 'images/box_image-rj.png';  // Replace with your actual image path

// Utility functions
function calculateAcceleration(force, mass) {
  return force / mass;
}

function calculateMomentum(mass, velocity) {
  return mass * velocity;
}

function calculateEnergy(mass, height) {
  const kineticEnergy = 0.5 * mass * velocity ** 2;
  const potentialEnergy = mass * 9.81 * height;
  return { kineticEnergy, potentialEnergy };
}

// Reset level
function resetLevel() {
  boxX = 100;
  velocity = 0;
  force = 0;
  springForce = 0;
  gameOver = false;
  nextButton.style.display = "none";
  restartMessage.style.display = "none";
}

// Reset game
function resetGame() {
  currentLevel = 1;
  resetLevel();
}

// Handle logic for each level
function handleLevelLogic() {
  if (currentLevel === 1) {
    acceleration = calculateAcceleration(force, mass);
    velocity += acceleration;
    boxX += velocity;
    if (boxX > screenWidth - boxWidth) {
      boxX = screenWidth - boxWidth;
      velocity = 0;
      gameOver = true;
    }
    info.innerText = `Level: ${currentLevel} | Force: ${force} N | Velocity: ${velocity.toFixed(
      2
    )} m/s | Acceleration: ${acceleration.toFixed(2)} m/s²`;
  } else if (currentLevel === 2) {
    const momentum = calculateMomentum(mass, velocity);
    boxX += velocity;
    if (boxX > screenWidth - boxWidth) gameOver = true;
    info.innerText = `Level: ${currentLevel} | Momentum: ${momentum.toFixed(
      2
    )} kg·m/s | Velocity: ${velocity.toFixed(2)} m/s`;
  } else if (currentLevel === 3) {
    const { kineticEnergy, potentialEnergy } = calculateEnergy(mass, height);
    if (springForce > 0) {
      velocity += springForce;
      boxX += velocity;
      springForce -= 1;
    }
    if (boxX > screenWidth - boxWidth) gameOver = true;
    info.innerText = `Level: ${currentLevel} | KE: ${kineticEnergy.toFixed(
      2
    )} J | PE: ${potentialEnergy.toFixed(2)} J`;
  } else if (currentLevel === 4) {
    const friction = 20;
    if (velocity > 0) {
      velocity -= friction / mass;
      boxX += velocity;
    }
    if (velocity <= 0) gameOver = true;
    info.innerText = `Level: ${currentLevel} | Friction Force: ${friction} N | Velocity: ${velocity.toFixed(2)} m/s`;
  } else if (currentLevel === 5) {
    if (boxY < screenHeight - boxHeight) {
      velocity += 9.81 / 60;
      boxY += velocity;
    } else {
      velocity = 0;
      gameOver = true;
    }
    const currentHeight = screenHeight - boxY - boxHeight;
    info.innerText = `Level: ${currentLevel} | Height: ${currentHeight.toFixed(
      2
    )} m | Velocity: ${velocity.toFixed(2)} m/s`;
  }
}

// Draw the box
function drawBox() {
  // If image is loaded, draw the image on canvas
  if (boxImage.complete) {
    ctx.drawImage(boxImage, boxX, boxY, boxWidth, boxHeight);
  } else {
    // If the image isn't loaded yet, you can draw a fallback color box
    ctx.fillStyle = BOX_COLOR;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, screenWidth, screenHeight);
  drawBox();
  handleLevelLogic();

  if (gameOver) {
    if (currentLevel < 5) {
      nextButton.style.display = "block";
    } else {
      restartMessage.style.display = "block";
      restartMessage.innerText = "Congratulations! Press 'R' to restart.";
    }
  }

  requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    if (currentLevel === 1) force += 5;
    if (currentLevel === 2 || currentLevel === 4 || currentLevel === 5)
      velocity += 5;
    if (currentLevel === 3) springForce += 1;
  } else if (e.key === "ArrowDown") {
    if (currentLevel === 1) force -= 5;
    if (currentLevel === 2 || currentLevel === 4) velocity -= 5;
  } else if (e.key === "r") {
    resetGame();
  }
});

nextButton.addEventListener("click", () => {
  currentLevel++;
  resetLevel();
});

// Start the game
resetGame();
gameLoop();
