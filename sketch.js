const N_BOIDS = 10;
let Boids = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < N_BOIDS; i++) {
    Boids.push(new Boid(createVector(random(width), random(height))));
  }
}

function draw() {
  background(10);

  Boids.forEach((boid) => boid.updateVelocity(Boids));
  Boids.forEach((boid) => boid.updatePosition());

  Boids.forEach((boid) => boid.draw());
}
