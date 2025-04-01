class Bullet {
  
  // Default to grey.
  constructor(pos, angle, color = [169, 169, 169]) {
    this.pos = createVector(pos.x, pos.y);
    let offset = p5.Vector.fromAngle(angle - HALF_PI).mult(20);
    this.pos.add(offset);
    this.vel = p5.Vector.fromAngle(angle - HALF_PI).mult(5);
    this.color = color;
  }

  update() {
    this.pos.add(this.vel);
  }

  show() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 8, 8);
  }

  offscreen() {
    return this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0;
  }

  // General hits function to handle asteroids, UFOs, and the ship.
  // Returns true if hit.
  hits(target) {

    switch (target.constructor.name) {
        
      case 'Asteroid':
        let d = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        if (d < target.r) {
          return true;
        }
        break;

      case 'UFO':
        let ufoD = dist(this.pos.x, this.pos.y, target.x, target.y);
        let ufoRadius = target.size / 2;  // Ensure the UFO has a size property
        let bulletRadius = 8 / 2;  // Bullet size is 8px, so radius is 4px

        if (ufoD < ufoRadius + bulletRadius) {
          return true;
        }
        break;

      case 'Ship':
        let shipD = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        let shipRadius = target.size / 2;  // Assume the ship has a size property
        let bulletRadiusShip = 8 / 2;  // Bullet size is 8px, so radius is 4px

        if (shipD < shipRadius + bulletRadiusShip) {
          return true;
        }
        break;

      default:
        return false; // If the target type is unknown
    }

    return false; // Return false if no collision found
  }
  
}