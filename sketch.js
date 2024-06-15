let mic, recorder, soundFile;
let state = 0;
let recordButton, playButton, pauseButton, stopButton;
let progressBarWidth = 0;

function setup() {
  createCanvas(500, 400);
  background(0);

  mic = new p5.AudioIn();
  mic.start();

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  soundFile = new p5.SoundFile();

  recordButton = createButton('');
  recordButton.position(10, 10);
  recordButton.size(50, 50);
  recordButton.style('background-image', 'url("record.png")');
  recordButton.style('background-size', 'contain');
  recordButton.mousePressed(startRecording);

  playButton = createButton('');
  playButton.position(70, 10);
  playButton.size(50, 50);
  playButton.style('background-image', 'url("play.png")');
  playButton.style('background-size', 'contain');
  playButton.mousePressed(startPlayback);
  playButton.attribute('disabled', '');

  pauseButton = createButton('');
  pauseButton.position(130, 10);
  pauseButton.size(50, 50);
  pauseButton.style('background-image', 'url("pause.png")');
  pauseButton.style('background-size', 'contain');
  pauseButton.mousePressed(pausePlayback);
  pauseButton.attribute('disabled', '');

  stopButton = createButton('');
  stopButton.position(190, 10);
  stopButton.size(50, 50);
  stopButton.style('background-image', 'url("stop.png")');
  stopButton.style('background-size', 'contain');
  stopButton.mousePressed(stopPlayback);
  stopButton.attribute('disabled', '');
}

function draw() {
  if (state !== 1) {
    background(0);
  }

  fill(255);
  textSize(16);
  text("Version number 3.0", 10, height - 10);

  if ((state === 2 || state === 3) && soundFile.isLoaded()) {
    drawWaveform();
    if (state === 2 || state === 3) {
      drawPlaybackCursor();
    }
  } else {
    if ((state === 2 || state === 3) && soundFile.duration() > 0) {
      progressBarWidth = (soundFile.currentTime() / soundFile.duration()) * width;
    } else {
      progressBarWidth = 0;
    }

    fill(255);
    rect(0, height - 20, progressBarWidth, 20);
  }

  if (state === 1) {
    drawMicLevelBar();
  }
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

function startRecording() {
  initializeAudioContext();
  soundFile = new p5.SoundFile();
  recorder.record(soundFile);
  recordButton.attribute('disabled', 'true');
  playButton.attribute('disabled', 'true');
  pauseButton.attribute('disabled', 'true');
  stopButton.removeAttribute('disabled');
  state = 1;
}

function stopPlayback() {
  if (state === 1) {
    recorder.stop();
    if (soundFile.buffer && soundFile.buffer.length > 0) {
      state = 2;
    } else {
      state = 0;
    }
  } else if (state === 2 || state === 3) {
    soundFile.stop();
    state = 0;
  }
  recordButton.removeAttribute('disabled');
  playButton.removeAttribute('disabled');
  pauseButton.attribute('disabled', 'true');
  stopButton.attribute('disabled', 'true');
}

function startPlayback() {
  if (soundFile.isLoaded() && soundFile.buffer && soundFile.buffer.length > 0) {
    soundFile.loop();
    recordButton.attribute('disabled', 'true');
    playButton.attribute('disabled', 'true');
    pauseButton.removeAttribute('disabled');
    stopButton.removeAttribute('disabled');
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