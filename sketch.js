const imageModelURL = 'https://teachablemachine.withgoogle.com/models/4lcy7E8if/';

let classifier;
let video;
let label = 'Loading model...';
let confidence = 0;

const ignoredClasses = ['Me'];

let particles = [];
const bookWords = ['ink', 'page', 'word', 'story', 'read', 'verse', 'chapter', 'line', 'paper', 'spine'];

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(640, 520);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  classifyVideo();
}

function classifyVideo() {
  classifier.classify(video, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  confidence = results[0].confidence;
  classifyVideo();
}

function spawnParticles(activeLabel) {
  if (activeLabel === 'Water') {
    if (frameCount % 14 === 0) {
      particles.push({
        type: 'ripple',
        x: random(width),
        y: random(0, 480),
        r: 4,
        life: 1
      });
    }
  } else if (activeLabel === 'Spray') {
    for (let i = 0; i < 3; i++) {
      particles.push({
        type: 'mist',
        x: random(width),
        y: random(360, 480),
        vx: random(-0.4, 0.4),
        vy: random(-1.2, -0.3),
        size: random(20, 55),
        life: 1
      });
    }
  } else if (activeLabel === 'Cheetos') {
    for (let i = 0; i < 4; i++) {
      particles.push({
        type: 'dust',
        x: random(width),
        y: -random(20),
        vx: random(-0.6, 0.6),
        vy: random(2, 4),
        size: random(3, 8),
        life: 1
      });
    }
  } else if (activeLabel === 'Book') {
    if (frameCount % 7 === 0) {
      particles.push({
        type: 'word',
        x: random(width),
        y: 480,
        vy: random(-1.6, -0.8),
        text: random(bookWords),
        life: 1
      });
    }
  }
}

function updateAndDrawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    if (p.type === 'ripple') {
      p.r += 2.4;
      p.life -= 0.012;
      noFill();
      stroke(120, 200, 255, p.life * 220);
      strokeWeight(2);
      ellipse(p.x, p.y, p.r * 2);
    } else if (p.type === 'mist') {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.012;
      noStroke();
      fill(220, 240, 255, p.life * 90);
      ellipse(p.x, p.y, p.size);
    } else if (p.type === 'dust') {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.life -= 0.005;
      noStroke();
      fill(255, 140, 30, p.life * 230);
      ellipse(p.x, p.y, p.size);
      if (p.y > 480) p.life = 0;
    } else if (p.type === 'word') {
      p.y += p.vy;
      p.life -= 0.008;
      noStroke();
      fill(255, 240, 220, p.life * 230);
      textSize(16);
      textAlign(CENTER, CENTER);
      text(p.text, p.x, p.y);
    }

    if (p.life <= 0) particles.splice(i, 1);
  }
}

function draw() {
  const isIgnored = ignoredClasses.includes(label);
  const displayLabel = isIgnored ? '—' : label;

  background('#111');
  image(video, 0, 0, 640, 480);

  if (!isIgnored) spawnParticles(label);
  updateAndDrawParticles();

  noStroke();
  fill(0, 0, 0, 160);
  rect(0, 480, width, 40);

  fill(255);
  textSize(20);
  textAlign(LEFT, CENTER);
  text(displayLabel, 12, 500);

  if (!isIgnored) {
    textAlign(RIGHT, CENTER);
    text(nf(confidence * 100, 1, 1) + '%', width - 12, 500);
  }
}
