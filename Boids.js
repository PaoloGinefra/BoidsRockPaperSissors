const Types = {
  Rock: 0,
  Paper: 1,
  Scissors: 2,
};

class Boid {
  static SEPARATION_RADIUS = 30;
  static VIEW_RADIUS = 100;
  static COLLISION_RADIUS = 10;
  static SPEED = 2;

  static SEPARATION_WEIGHT = 0.05;
  static ALIGNMENT_WEIGHT = 0.01;
  static COHESION_WEIGHT = 0.04;

  static SHOW_RADIA = false;

  static Emojis = ["🗿", "📄", "✂️"];

  constructor(
    position,
    velocity = createVector(1, 0).setHeading(random(TWO_PI)),
    Type = floor(random(3))
  ) {
    this.position = position;
    this.velocity = velocity;
    this.Type = Type;
  }

  draw() {
    push();
    fill(255, 255);
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading() + PI / 2);
    //triangle(0, -5, 0, 5, 15, 0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(Boid.Emojis[this.Type], 0, 0);

    if (!Boid.SHOW_RADIA) {
      pop();
      return;
    }

    // Draw view radius
    noFill();
    stroke(255);
    circle(0, 0, Boid.VIEW_RADIUS * 2);

    // Draw separation radius
    stroke(255, 0, 0);
    circle(0, 0, Boid.SEPARATION_RADIUS * 2);

    // Draw collision radius
    stroke(0, 255, 0);
    circle(0, 0, Boid.COLLISION_RADIUS * 2);

    pop();
  }

  isWeakToMe(other) {
    return (this.Type + 2) % 3 == other.Type;
  }

  isStrongToMe(other) {
    return (this.Type + 1) % 3 == other.Type;
  }

  updatePosition() {
    this.position.add(p5.Vector.mult(this.velocity, Boid.SPEED));
    this.position.x = (this.position.x + width) % width;
    this.position.y = (this.position.y + height) % height;
  }

  computeSeparation(boids) {
    let avoidance = createVector(0, 0);
    boids.forEach((boid) => {
      if (
        !this.isWeakToMe(boid) &&
        p5.Vector.dist(this.position, boid.position) < Boid.SEPARATION_RADIUS
      ) {
        let diff = p5.Vector.sub(this.position, boid.position);
        let len = diff.mag();
        diff.setMag(Boid.SEPARATION_RADIUS - len);
        avoidance.add(diff);
      }
    });
    return avoidance.normalize().mult(Boid.SEPARATION_WEIGHT);
  }

  computeAlignment(boids) {
    let alignment = createVector(0, 0);
    let n = 0;
    boids.forEach((boid) => {
      if (
        this.Type == boid.Type &&
        p5.Vector.dist(this.position, boid.position) < Boid.VIEW_RADIUS
      ) {
        alignment.add(boid.velocity);
        n++;
      }
    });
    if (n > 0) {
      alignment.div(n);
    }
    return alignment.normalize().mult(Boid.ALIGNMENT_WEIGHT);
  }

  computeCohesion(boids) {
    let centerOfMass = createVector(0, 0);
    let n = 0;
    boids.forEach((boid) => {
      if (
        !this.isStrongToMe(boid) &&
        p5.Vector.dist(this.position, boid.position) < Boid.VIEW_RADIUS
      ) {
        centerOfMass.add(boid.position);
        n++;
      }
    });
    if (n > 0) {
      centerOfMass.div(n);
    }
    return p5.Vector.sub(centerOfMass, this.position)
      .normalize()
      .mult(Boid.COHESION_WEIGHT);
  }

  updateVelocity(boids) {
    this.velocity.add(this.computeSeparation(boids));
    this.velocity.add(this.computeAlignment(boids));
    this.velocity.add(this.computeCohesion(boids));
    this.velocity.normalize();
  }

  checkCollisions(boids) {
    boids.forEach((boid) => {
      if (
        this.isStrongToMe(boid) &&
        p5.Vector.dist(this.position, boid.position) < Boid.COLLISION_RADIUS * 2
      ) {
        this.Type = boid.Type;
      }
    });
  }
}
