class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 3);
    this.speed = random(0.1, 0.5);  // Adding some speed for moving stars
  }

  display() {
    fill(255, 255, 255, 150);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }

  move() {
    // Move stars down slowly
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0; // Reset the star to the top once it moves out of view
    }
  }
}