const imageModelURL = 'https://teachablemachine.withgoogle.com/models/4lcy7E8if/';

let classifier;
let video;
let label = 'Loading model...';
let confidence = 0;

const ignoredClasses = ['Me'];

const colors = {
  // Map class labels (as you named them in Teachable Machine) to background colors.
  // Any class not listed here falls back to defaultColor.
};
const defaultColor = '#222';

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

function draw() {
  const isIgnored = ignoredClasses.includes(label);
  const displayLabel = isIgnored ? '—' : label;

  background(isIgnored ? defaultColor : (colors[label] || defaultColor));
  image(video, 0, 0, 640, 480);

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
