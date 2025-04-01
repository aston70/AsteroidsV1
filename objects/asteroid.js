class Asteroid {
  constructor(x, y, r = random(30, 60)) {
    this.pos = createVector(x || random(width), y || random(height));
    this.vel = p5.Vector.random2D();
    this.r = r;
    this.rotation = 0;  // Rotation angle for the asteroid
    this.rotationSpeed = map(this.r, 30, 60, 0.002, 0.01); 
    this.points = [];
    this.generatePoints();
  }

  generatePoints() {
    let angleOff = random(TWO_PI);
    let numPoints = int(random(6, 12));
    let offset = random(10, 20);

    for (let i = 0; i < numPoints; i++) {
      let angle = map(i, 0, numPoints, 0, TWO_PI) + angleOff;
      let rad = this.r + random(-offset, offset);
      let x = rad * cos(angle);
      let y = rad * sin(angle);
      this.points.push(createVector(x, y));
    }
  }

  update() {
    this.pos.add(this.vel);
    this.rotation += this.rotationSpeed;
    this.edges();
  }

  show() {
    fill(200);
    stroke(255);
    push();  // Save the current transformation matrix
    translate(this.pos.x, this.pos.y);  // Move the origin to the asteroid's position
    rotate(this.rotation);  // Apply the rotation
    beginShape();
    for (let point of this.points) {
      vertex(point.x, point.y);  // Draw each point relative to the rotated position
    }
    endShape(CLOSE);
    pop();  // Restore the transformation matrix
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  breakup() {
    playSound(asteroidHitSound);   
    
    // Award points based on asteroid size
    if (this.r > 40) {
      score += 100;  // Large asteroids
    } else if (this.r > 20) {
      score += 50;   // Medium asteroids
    } else {
      score += 25;    // Small asteroids
    }    
    
    if (this.r > 20) {
      asteroids.push(new Asteroid(this.pos.x, this.pos.y, this.r / 2));
      asteroids.push(new Asteroid(this.pos.x, this.pos.y, this.r / 2));
    }
  }
}