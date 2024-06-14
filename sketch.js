let mic, recorder, soundFile;
let state = 0; // 0: stop, 1: recording, 2: playback
let button;
let progressBarWidth = 0;

function setup() {
  createCanvas(400, 400);
  background(220);

  // Create an audio input
  mic = new p5.AudioIn();
  
  // Start the audio input
  mic.start(startRecording);

  // Create a sound recorder
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  // Create an empty sound file
  soundFile = new p5.SoundFile();

  // Create a button to start/stop recording and playback
  button = createButton('Start Recording');
  button.position(10, 10);
  button.mousePressed(toggleRecording);
}

function draw() {
  background(220);

  // Draw the progress bar
  if (state === 2 && soundFile.isPlaying()) {
    progressBarWidth = (soundFile.currentTime() / soundFile.duration()) * width;
  } else {
    progressBarWidth = 0;
  }
  
  fill(0, 255, 0);
  rect(0, height - 20, progressBarWidth, 20);
}

function toggleRecording() {
  if (state === 0) {
    // Start recording
    console.log("Starting recording...");
    mic.start();
    recorder.record(soundFile);
    button.html('Stop Recording');
    state = 1;
  } else if (state === 1) {
    // Stop recording
    console.log("Stopping recording...");
    recorder.stop();
    mic.stop();
    button.html('Play');
    state = 2;
  } else if (state === 2) {
    // Play the sound file in a loop
    console.log("Starting playback...");
    soundFile.loop();
    button.html('Stop Playback');
    state = 3;
  } else if (state === 3) {
    // Stop playback
    console.log("Stopping playback...");
    soundFile.stop();
    button.html('Play');
    state = 2;
  }
}

function startRecording() {
  console.log("Microphone is ready to use.");
  // You can place additional setup code here
}
