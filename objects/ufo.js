class UFO {
    
  constructor(ship, bulletSound) {
    this.ship = ship;
    this.x = Math.random() * window.innerWidth; // Random horizontal position
    this.y = -50; // Start off the top of the screen
    this.size = 50; // UFO size
    this.speed = Math.random() * 0.8 + 0.4; // Slower speed between 0.4 and 1.2
    this.direction = Math.random() > 0.5 ? 1 : -1; // UFO moves left or right
    this.active = true;
    this.element = document.createElement('div');
    this.element.classList.add('ufo');
    this.color = color(0, 255, 0);  // Green color
    this.shipCollision = false;
    this.bulletSound = bulletSound;
    
    document.body.appendChild(this.element);

    this.updatePosition();
    
    this.ufoBullets = []; 

    this.startFiringBurst();   
  }

  updatePosition() {
    //this.element.style.left = `${this.x}px`;
    //this.element.style.top = `${this.y}px`;
    
    this.x += this.speed;
    if (this.x > width + this.size) {  // If the UFO moves off the screen, reset its position
      this.x = -this.size;
      this.y = random(height);  // Randomize y position to make it move up/down
    }    
    
    
  }

  move() {
    if (!this.active) return;

    this.y += this.speed;
    this.x += this.speed * this.direction;

    // Bounce horizontally within the canvas
    if (this.x < 0 || this.x > window.innerWidth - this.size) {
      this.direction *= -1;
    }

    this.updatePosition();
  }

  display() {
    push();
    translate(this.x, this.y); // Move to the UFO's position
    
    // Light blue glow effect around UFO
    fill(0, 216, 230, 50);
    ellipse(0, 0, this.size * 1.4, this.size / 1.5);
    
    // Main UFO shape (saucer)
    fill(0, 255, 0);  // Solid green for the UFO
    ellipse(0, 0, this.size, this.size / 2);  // Main UFO shape (saucer)
    
    // Canopy Top (smaller dome on top of the UFO)
    fill(0, 128, 255);  // Light blue for the canopy
    ellipse(0, -this.size / 4, this.size * 0.7, this.size / 3);  // Canopy dome
    
    pop();
  }

  
  // Start firing a burst of bullets at random intervals between 3 and 5 seconds
  startFiringBurst() {
    const fireBurst = () => {
      if (!this.active) return; // Don't fire if UFO is inactive

      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          if (this.active) this.fireBulletAtShip(); // Fire only if active
        }, i * 200); // Delay bullets by 200ms each
      }
    };

    // Clear any previous intervals
    if (this.firingInterval) {
      clearInterval(this.firingInterval);
    }

    // Call fireBurst periodically between 3 and 5 seconds
    this.firingInterval = setInterval(() => {
      if (this.active) {
        fireBurst();
      }
    }, Math.random() * 2000 + 3000); // Random interval between 3 and 5 seconds
  }

  fireBulletAtShip() {
    
    if(gameOver){
      this.destroy();
      return;
    }
    
    const shipX = this.ship.pos.x;
    const shipY = this.ship.pos.y;
    
    // Calculate angle to ship
    const angle = Math.atan2(shipY - this.y, shipX - this.x);

    // Create a bullet directed at the ship
    const brightBlue = [0, 191, 255];
    const bullet = new Bullet(createVector(this.x, this.y), angle + HALF_PI, brightBlue);
    this.ufoBullets.push(bullet);
    
    if(this.active && this.bulletSound) {
      this.bulletSound.play();
    }
    
  }

  handleUFObullets() {
    for (let i = this.ufoBullets.length - 1; i >= 0; i--) {
      this.ufoBullets[i].update();
      this.ufoBullets[i].show();

      if (this.ufoBullets[i].offscreen()) {
        if (this.bulletSound && this.bulletSound.isPlaying()) {
          this.bulletSound.stop();  // Stop lingering sound
        }        
        this.ufoBullets.splice(i, 1);
      } else {
        this.checkBulletCollisions(i);  // Call method on the same object
      }
    }
  }

  checkBulletCollisions(i) {
    if (this.ufoBullets[i].hits(this.ship)) {
      this.ship.takeDamage(10);
        if (this.bulletSound && this.bulletSound.isPlaying()) {
          this.bulletSound.stop();  // Stop lingering sound
        }           
      this.ufoBullets.splice(i, 1);
    }
  }

  destroy() {
    if (!this.active) return;

    this.active = false;

    // Stop UFO bullet sounds
    if (this.bulletSound && this.bulletSound.isPlaying()) {
      this.bulletSound.stop();
    }

    // Clean up UFO bullets and their sounds
    for (let bullet of this.ufoBullets) {
      if (bullet.sound && bullet.sound.isPlaying()) {
        bullet.sound.stop();
      }
    }
    this.ufoBullets = [];

    this.remove();
  }

  remove() {
    if (this.element) {
      this.element.remove(); 
    }

    if (this.firingInterval) {
      clearInterval(this.firingInterval);
    }
    
  }
}
