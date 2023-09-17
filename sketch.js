const N_BOIDS = 80;
let Boids = [];

function drawPieChart() {
  let rocks = 0;
  let papers = 0;
  let scissors = 0;
  let total = 0;
  Boids.forEach((boid) => {
    if (boid.Type == 0) {
      rocks++;
    }
    if (boid.Type == 1) {
      papers++;
    }
    if (boid.Type == 2) {
      scissors++;
    }
    total++;
  });
  let rockPerc = rocks / total;
  let paperPerc = papers / total;
  let scissorsPerc = scissors / total;

  let radius = 100;
  let aplha = 100;
  let x = width - radius;
  let y = height - radius;
  let lastAngle = 0;
  let rockAngle = rockPerc * 2 * PI;
  let paperAngle = paperPerc * 2 * PI;
  let scissorsAngle = scissorsPerc * 2 * PI;
  fill(200, 200, 200, aplha);
  arc(x, y, radius, radius, lastAngle, lastAngle + rockAngle);
  lastAngle += rockAngle;
  fill(243, 238, 248, aplha);
  arc(x, y, radius, radius, lastAngle, lastAngle + paperAngle);
  lastAngle += paperAngle;
  fill(243, 48, 46, aplha);
  arc(x, y, radius, radius, lastAngle, lastAngle + scissorsAngle);
  lastAngle += scissorsAngle;
}

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
  Boids.forEach((boid) => boid.checkCollisions(Boids));
  drawPieChart();
  Boids.forEach((boid) => boid.draw());
}
