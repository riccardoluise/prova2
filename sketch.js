let mic, recorder, soundFile;
let state = 0; // 0: stop, 1: recording, 2: playback, 3: paused
let recordButton, playButton, pauseButton, stopButton;
let progressBarWidth = 0;

function setup() {
  createCanvas(500, 400);
  background(220);

  // Create an audio input
  mic = new p5.AudioIn();
  
  // Start the audio input
  mic.start();

  // Create a sound recorder
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  // Create an empty sound file
  soundFile = new p5.SoundFile();

  // Create buttons
  recordButton = createButton('Record');
  recordButton.position(10, 10);
  recordButton.mousePressed(startRecording);

  playButton = createButton('Play');
  playButton.position(90, 10);
  playButton.mousePressed(startPlayback);
  playButton.attribute('disabled', '');

  pauseButton = createButton('Pause');
  pauseButton.position(150, 10);
  pauseButton.mousePressed(pausePlayback);
  pauseButton.attribute('disabled', '');

  stopButton = createButton('Stop');
  stopButton.position(220, 10);
  stopButton.mousePressed(stopPlayback);
  stopButton.attribute('disabled', '');
}

function draw() {
  background(220);

  // Draw the waveform
  if ((state === 2 || state === 3) && soundFile.isLoaded()) {
    drawWaveform();
  } else {
    // Draw the progress bar
    if ((state === 2 || state === 3) && soundFile.duration() > 0) {
      progressBarWidth = (soundFile.currentTime() / soundFile.duration()) * width;
    } else {
      progressBarWidth = 0;
    }

    fill(0, 255, 0);
    rect(0, height - 20, progressBarWidth, 20);
  }
}

function drawWaveform() {
  let waveform = soundFile.getPeaks(); // Get the audio waveform peaks
  noFill();
  beginShape();
  stroke(0, 255, 0); // Green color for the waveform
  strokeWeight(1);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
}

function startRecording() {
  console.log("Starting recording...");
  soundFile = new p5.SoundFile(); // Reset soundFile to ensure it's empty
  recorder.record(soundFile);
  recordButton.attribute('disabled', '');
  playButton.attribute('disabled', '');
  pauseButton.attribute('disabled', '');
  stopButton.removeAttribute('disabled');
  state = 1;
  console.log("Recording started");
}

function stopPlayback() {
  console.log("Stopping playback or recording...");
  if (state === 1) {
    recorder.stop();
    state = 2;
  } else if (state === 2 || state === 3) {
    soundFile.stop();
    state = 0;
  }
  recordButton.removeAttribute('disabled');
  playButton.removeAttribute('disabled');
  pauseButton.attribute('disabled', '');
  stopButton.attribute('disabled', '');
  console.log("Playback or recording stopped");
}

function startPlayback() {
  console.log("Starting playback...");
  if (soundFile.isLoaded() && soundFile.buffer && soundFile.buffer.length > 0) {
    soundFile.loop();
    recordButton.attribute('disabled', '');
    playButton.attribute('disabled', '');
    pauseButton.removeAttribute('disabled');
    stopButton.removeAttribute('disabled');
    state = 2;
    console.log("Playback started");
  } else {
    console.log("Sound file not loaded yet");
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
  // Ensure soundFile buffer is ready before starting playback
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
