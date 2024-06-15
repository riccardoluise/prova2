let mic, recorder, soundFile;
let state = 0; // 0: stop, 1: recording, 2: playback, 3: paused
let recordButton, playButton, pauseButton, stopButton;
let progressBarWidth = 0;

function setup() {
  createCanvas(500, 400);
  background(0);

  mic = new p5.AudioIn();
  mic.start(() => {
    console.log("Microphone permission granted.");
  }, () => {
    console.log("Microphone permission denied.");
  });
  console.log("Mic created:", mic);

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  console.log("Recorder created:", recorder);

  soundFile = new p5.SoundFile();
  console.log("SoundFile created:", soundFile);

  recordButton = createButton('Record');
  recordButton.position(10, 10);
  recordButton.style('background-color', 'white');
  recordButton.style('color', 'black');
  recordButton.mousePressed(startRecording);

  playButton = createButton('Play');
  playButton.position(90, 10);
  playButton.style('background-color', 'white');
  playButton.style('color', 'black');
  playButton.mousePressed(startPlayback);
  playButton.attribute('disabled', '');

  pauseButton = createButton('Pause');
  pauseButton.position(150, 10);
  pauseButton.style('background-color', 'white');
  pauseButton.style('color', 'black');
  pauseButton.mousePressed(pausePlayback);
  pauseButton.attribute('disabled', '');

  stopButton = createButton('Stop');
  stopButton.position(220, 10);
  stopButton.style('background-color', 'white');
  stopButton.style('color', 'black');
  stopButton.mousePressed(stopPlayback);
  stopButton.attribute('disabled', '');
}

function draw() {
  if (state !== 1) {
    background(0);
  }

  fill(255);
  textSize(16);
  text("Version number 3.0", 10, height - 10); // Draw version number

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
  console.log("Starting recording...");
  soundFile = new p5.SoundFile();
  console.log("New SoundFile created for recording:", soundFile);
  recorder.record(soundFile);
  recordButton.attribute('disabled', 'true');
  playButton.attribute('disabled', 'true');
  pauseButton.attribute('disabled', 'true');
  stopButton.removeAttribute('disabled');
  state = 1;
  console.log("Recording started");
}

function stopPlayback() {
  console.log("Stopping playback or recording...");
  if (state === 1) {
    recorder.stop();
    if (soundFile.buffer && soundFile.buffer.length > 0) {
      console.log("Recording stopped with buffer length:", soundFile.buffer.length);
      state = 2;
    } else {
      console.log("Recording stopped but buffer is empty or not loaded.");
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
  console.log("Playback or recording stopped");
}

function startPlayback() {
  console.log("Starting playback...");
  if (soundFile.isLoaded() && soundFile.buffer && soundFile.buffer.length > 0) {
    console.log("SoundFile details:", soundFile);
    soundFile.loop();
    recordButton.attribute('disabled', 'true');
    playButton.attribute('disabled', 'true');
    pauseButton.removeAttribute('disabled');
    stopButton.removeAttribute('disabled');
    state = 2;
    console.log("Playback started");
  } else {
    console.log("Sound file not loaded yet or is empty");
  }
}

function pausePlayback() {
  console.log("Pausing playback...");
  if (soundFile.isPlaying()) {
    soundFile.pause();
    state = 3;
    console.log("Playback paused");
  } else if (soundFile.isPaused()) {
    soundFile.play();
    state = 2;
    console.log("Playback resumed");
  }
}

function preload() {
  soundFile = new p5.SoundFile();
  console.log("Preload: Created empty p5.SoundFile");
}

function initializeAudioContext() {
  let context = getAudioContext();
  if (context.state !== 'running') {
    context.resume().then(() => {
      console.log('Audio context resumed successfully.');
    });
  }
}

function initializeAudioContext() {
  let context = getAudioContext();
  if (context.state !== 'running') {
    context.resume().then(() => {
      console.log('Audio context resumed successfully.');
    });
  }
}