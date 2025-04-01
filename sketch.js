const highScoreID = "highScorev1";
let ship;
let ufo;
let ufoInterval;
let ufoMoveInterval = null;
let asteroidCount = 5;
let asteroids = [];
let bullets = [];
let gameOver = false;
let startGameButton;
let playAgainButton;
let winGame = false;
let score = 0;
let highScore = localStorage.getItem(highScoreID) ? parseInt(localStorage.getItem(highScoreID)) : 0;
let stars = [];
let numStars = 500;

function preload() {  
  console.log("Preload");  
  loadSounds();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionGameButton(startGameButton);  
  positionGameButton(playAgainButton);
  createStars();
}

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  
  // If sound gets crashy - turn it off with this...
  //getAudioContext().suspend(); // Suspend audio context
  
  createPlayAgainButton();
  createResetHighScoreButton();  
  createStartGameButton(); 
  
}

function draw() {
    
  background(0);

  if (gameOver) {
    displayGameOver();
  } else {
    updateAndShowGameObjects();
  }

  displayScore();
  
}


function resetGame() {
  
  score = 0;
  
  winGame = false;
  gameOver = false;

  // Clear bullets, UFO bullets, and asteroids
  asteroids = [];
  bullets = [];  
  
  // Clear UFO bullets and stop sounds
  if (ufo) {
    for (let bullet of ufo.ufoBullets) {
      stopSound(bullet.sound);      
    }
    ufo.ufoBullets = [];
    ufo.destroy();
    ufo = null;
  }

  // Clear UFO intervals
  stopUFOs();  
  
  // Call loadSounds and pass in a callback that will run once all sounds are loaded
  loadSounds(() => {
    console.log("Game reset and sounds are ready!");
    startGame();
  });  
}

function startGame() {
  
  if(startGameButton) {
    startGameButton.hide();
  }
  startRandomUFO();
  
  ship = new Ship();
  ufo = null;

  createStars();  
  
  if (soundsLoaded.gameplaySound) {
    gamePlaySoundLoaded();
  }
  
  createAsteroids();
  playAgainButton.hide();
  resetHighScoreButton.hide();
  loop();
  startRandomUFO();
  
}

function keyPressed() {
  
  if(gameOver) {
    return;
  }
  
  if (keyCode === RIGHT_ARROW) {
    ship.setRotation(0.1);
  }
  else if (keyCode === LEFT_ARROW) {
    ship.setRotation(-0.1);
  }
  else if (keyCode === UP_ARROW) {
    ship.boosting(true);
    playSound(thrustSound, true);
  } 
  else if (key === ' ') {
    fireBullet();
  }
}

function fireBullet()
{
  const bulletColor = [255, 0, 0];
  bullets.push(new Bullet(ship.pos.copy(), ship.heading, bulletColor));   
  playSound(bulletSound); 
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    ship.setRotation(0);
  }
  if (keyCode === UP_ARROW) {
    ship.boosting(false);
    stopSound(thrustSound);
  }
  else if (key === ' ') {
    stopSound(bulletSound);
  }
}

function createAsteroids() {
  for (let i = 0; i < asteroidCount; i++) {
    let asteroid = new Asteroid();
    while (dist(asteroid.pos.x, asteroid.pos.y, ship.pos.x, ship.pos.y) < 150) {
      asteroid = new Asteroid();
    }
    asteroids.push(asteroid);
  }
}

function createStartGameButton() {
  startGameButton = createButton('Start Game');
  startGameButton.size(200, 50);
  startGameButton.style('font-size', '24px');
  startGameButton.mousePressed(startGame);
  positionGameButton(startGameButton);
  startGameButton.show();
}

function createPlayAgainButton() {
  playAgainButton = createButton('Play Again');
  playAgainButton.size(200, 50);
  playAgainButton.style('font-size', '24px');
  playAgainButton.mousePressed(resetGame);
  positionGameButton(playAgainButton);
  playAgainButton.hide();
}

function positionGameButton(button) {
  if(button) {
       button.position(width / 2 - button.width / 2, height / 2 + 30);
  }
}

function createResetHighScoreButton() {
  // Create the reset button once
  resetHighScoreButton = createButton('Reset');
  resetHighScoreButton.size(80, 30);   // Smaller size
  resetHighScoreButton.style('font-size', '14px');
  resetHighScoreButton.mousePressed(resetHighScore);
  resetHighScoreButton.hide();
}

function displayGameOver() {
  
  let message = "";  // Store win/loss message
  let messageColor;
  
  stopSound(gameplaySound);
  stopSound(thrustSound);
  
  console.log("Game Over!");
  noLoop();

  if (winGame){
    console.log("You Win!");
    updateHighScore();
    playSound(youWinSound);
    message = "You Win!";
    messageColor = color(0, 255, 0);  // Green for win
  }
  else {
    console.log("You Lose!");
    playSound(youLoseSound);
    message = "You lose!";
    messageColor = color(255, 0, 0);  // Red for lose
  }
  
  if(ufo){
    ufo.destroy();
    ufo = null;
  }
    
  stopUFOs();

  // Show Game Over.
  setTimeout(() => {
    noStroke();  // Remove the outline
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("Game Over", width / 2, height / 2 - 50);
    fill(messageColor);
    textSize(28);
    text(message, width / 2, height / 2);   
  }, 1000);
  
  showResetHighScore();
  
  // Unload sounds and then show play again button.
  setTimeout(() => {
    unloadSounds(showPlayAgain);
  }, 3000);    

}

function showPlayAgain() {
  playAgainButton.show();  
}

function showResetHighScore() {
  resetHighScoreButton.show();
}

function updateAndShowGameObjects() {
  
  // Display and move stars
  for (let star of stars) {
    star.move();
    star.display();
  }   
  
  if (ufo)
  {
    ufo.move();
    ufo.display();
    ufo.handleUFObullets();  
  }
  
  if (ship) {
      ship.update();
      ship.show();
    
      if (ship.health <= 0) {
        gameOver = true;
      }    
  }  
 
  handleBullets();
  handleAsteroids();
  checkUfoCollision();
}

function handleBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();

    if (bullets[i].offscreen()) {
      bullets.splice(i, 1);
    } else {
      checkBulletCollisions(i);
    }
  }
}

function checkBulletCollisions(i) 
{
  
  // First, check for collision between bullet and UFO
  if (ufo && bullets[i].hits(ufo)) {
    console.log("Bullet hit UFO");
    if (!ufoHitSound.isPlaying()) {
      ufoHitSound.play();
    }
    
    // Award points for destroying UFO
    score += 500;
    
    bullets.splice(i, 1); // Remove the bullet
    ufo.destroy(); // Destroy the UFO
    ufo = null; // Remove the reference to the UFO
    startRandomUFO(); // Spawn a new UFO after hit
    return; // Exit early since the bullet hit the UFO
  }

  // Then, check for collision between bullet and asteroids
  for (let j = asteroids.length - 1; j >= 0; j--) {
    if (bullets[i].hits(asteroids[j])) {
      bullets.splice(i, 1); // Remove the bullet
      asteroids[j].breakup(); // Break asteroid apart
      asteroids.splice(j, 1); // Remove the asteroid from the array

      // Check if all asteroids are destroyed.
      if (asteroids.length === 0) {
        winGame = true;
        gameOver = true;
      }
      break; // Exit the loop once collision is detected
    }
  }
}

function checkUfoCollision() {   
  if (ship && ufo && !ufo.shipCollision && ship.hits(ufo)) {
    ufo.shipCollision = true;
    ship.takeDamage(50);
  }
}

function handleAsteroids() {
  for (let a of asteroids) {
    a.update();
    a.show();
    
    if (ship.hits(a)) {
      playSound(spaceshipHitSound);   
      gameOver = true;
    }
    
  }
}

// Function to start the random UFO spawning
function startRandomUFO() {
  console.log("Random UFO...");

  // Don't start spawning if the game is over
  if (gameOver) {
    console.log("Game is over, no more UFOs will spawn.");
    return;
  }

  // Set a random time between 7 and 30 seconds to spawn the next UFO
  let randomTime = Math.random() * 23000 + 7000;
  
  // For testing UFO hits, this spawns UFO more often...
  //let randomTime = Math.random() * 3000 + 3000;
  
  ufoInterval = setTimeout(() => {
    // Only spawn a new UFO if no UFO is active
    if (!ufo) {
      spawnUFO();  // Spawn a new UFO if no active UFO exists
    } else {
      console.log("UFO already exists, not spawning a new one.");
    }

    // Continue the random UFO spawning cycle
    if (!gameOver) {
      startRandomUFO();  // Continue spawning if game is not over
    }
  }, randomTime);
}


function spawnUFO() {
  
  //console.log("Spawn UFO...");

  ufo = new UFO(ship, ufoBulletSound);

  // Move the UFO at intervals
  ufoMoveInterval = setInterval(() => {
    
    if(!ufo){
      clearInterval(ufoMoveInterval)
      return;
    }
    
    ufo.move();  // Move the UFO

    // Stop moving ufo and remove it when it goes off the top or bottom of the screen.
    if (ufo.y > window.innerHeight || ufo.y < -ufo.size) {
      clearInterval(ufoMoveInterval);  // Stop movement
      ufo.remove();  // Remove UFO from the screen
      ufo = null;  // Reset ufo to null once the UFO is removed
    }
  }, 20); // Move UFO every 20ms (smooth movement)
}

// Optional: Stop spawning UFOs after game over
function stopUFOs() {
  clearTimeout(ufoInterval);
  if (ufoMoveInterval) {
    clearInterval(ufoMoveInterval);
    ufoMoveInterval = null;
  }
}

// Display current score.
function displayScore() {
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text(`Score: ${score}`, 20, 30);

  // Display high score
  textAlign(RIGHT);
  text(`High Score: ${highScore}`, width - 20, 30);
  
  // Position the reset button below the high score
  resetHighScoreButton.position(width - 110, 40); 
}

// After the game ends, compare score with highScore. Update highScore
// if the current score is higher. Store the new highScore in localStorage.
function updateHighScore() {
  if (score > highScore) {
    highScore = score;  
    localStorage.setItem(highScoreID, highScore);  
  }  
}

function resetHighScore() {
  if (confirm('Are you sure you want to reset the high score?')) {
    highScore = 0;
    localStorage.removeItem(highScoreID);
    resetHighScoreButton.hide();
  }
}

function createStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }    
}
