let mic, recorder, soundFile;
let state = 0;
let recordButton, playButton, pauseButton, stopButton;
let progressBarWidth = 0;

function setup() {
  setupCanvas();
  setupAudio();
  setupButtons();
}

function draw() {
  background(0);

  displayText();
  if ((state === 2 || state === 3) && soundFile.isLoaded()) {
    drawWaveform();
    drawPlaybackCursor();
  } else {
    drawProgressBar();
  }

  if (state === 1) {
    drawMicLevelBar();
  }
}

function setupCanvas() {
  createCanvas(500, 400);
}

function setupAudio() {
  mic = new p5.AudioIn();
  mic.start();

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  soundFile = new p5.SoundFile();
}

function setupButtons() {
  recordButton = createButton('');
  configureButton(recordButton, 10, 10, 'record.png', startRecording);

  playButton = createButton('');
  configureButton(playButton, 70, 10, 'play.png', startPlayback);
  disableButton(playButton);

  pauseButton = createButton('');
  configureButton(pauseButton, 130, 10, 'pause.png', pausePlayback);
  disableButton(pauseButton);

  stopButton = createButton('');
  configureButton(stopButton, 190, 10, 'stop.png', stopPlayback);
  disableButton(stopButton);
}

function configureButton(button, x, y, icon, action) {
  button.position(x, y);
  button.size(50, 50);
  button.style('background-image', `url("${icon}")`);
  button.style('background-size', 'contain');
  button.mousePressed(action);
  button.style('opacity', '0.5'); // Inizia disabilitato
}

function displayText() {
  fill(255);
  textSize(16);
  text("Version number 3.0", 10, height - 10);
}

function drawWaveform() {
  let waveform = soundFile.getPeaks();
  noFill();
  beginShape();
  stroke(255);
  strokeWeight(1);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
}

function drawMicLevelBar() {
  clear(); // Cancella la traccia precedente
  background(0); // Ripristina lo sfondo
  let micLevel = mic.getLevel();
  let amplifiedLevel = pow(micLevel, 2) * height * 2;
  let barHeight = map(amplifiedLevel, 0, 1, 0, height * 0.75);
  fill(0, 255, 0);
  noStroke();
  rect((frameCount % width), height / 2, 1, -barHeight);
}

function drawPlaybackCursor() {
  let currentTime = soundFile.currentTime();
  let duration = soundFile.duration();
  let cursorX = map(currentTime, 0, duration, 0, width);

  stroke(255, 0, 0);
  strokeWeight(2);
  line(cursorX, 0, cursorX, height);
}

function drawProgressBar() {
  if ((state === 2 || state === 3) && soundFile.duration() > 0) {
    progressBarWidth = (soundFile.currentTime() / soundFile.duration()) * width;
  } else {
    progressBarWidth = 0;
  }

  fill(255);
  rect(0, height - 20, progressBarWidth, 20);
}

function startRecording() {
  initializeAudioContext();
  soundFile = new p5.SoundFile();
  recorder.record(soundFile);
  disableButton(recordButton);
  disableButton(playButton);
  disableButton(pauseButton);
  enableButton(stopButton);
  state = 1;
}

function stopPlayback() {
  if (state === 1) {
    recorder.stop();
    state = soundFile.buffer && soundFile.buffer.length > 0 ? 2 : 0;
  } else if (state === 2 || state === 3) {
    soundFile.stop();
    state = 0;
  }
  enableButton(recordButton);
  enableButton(playButton);
  disableButton(pauseButton);
  disableButton(stopButton);
}

function startPlayback() {
  if (soundFile.isLoaded() && soundFile.buffer && soundFile.buffer.length > 0) {
    soundFile.loop();
    disableButton(recordButton);
    disableButton(playButton);
    enableButton(pauseButton);
    enableButton(stopButton);
    state = 2;
  }
}

function pausePlayback() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
    state = 3;
  } else if (soundFile.isPaused()) {
    soundFile.play();
    state = 2;
  }
}

function preload() {
  soundFile = new p5.SoundFile();
}

function initializeAudioContext() {
  let context = getAudioContext();
  if (context.state !== 'running') {
    context.resume();
  }
}

function disableButton(button) {
  button.attribute('disabled', 'true');
  button.style('opacity', '0.5');
}

function enableButton(button) {
  button.removeAttribute('disabled');
  button.style('opacity', '1');
}
