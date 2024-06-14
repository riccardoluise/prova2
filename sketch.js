let button;
let clicked = false;

function setup() {
  createCanvas(400, 400);
  button = createButton('click here');
  button.position(150, 180);
  button.size(100, 40);
  button.style('background-color', '#0088FF'); // Colore iniziale del bottone
  button.style('color', '#FFFFFF');
  button.style('font-size', '16px'); // Testo più grande
  button.mousePressed(changeTextAndColor);
}

function draw() {
  if (clicked) {
    background('#0088FF'); // Colore di sfondo quando cliccato
    button.style('background-color', '#FF88ff'); // Colore del bottone quando cliccato
  } else {
    background('#FF8800'); // Colore di sfondo iniziale
    button.style('background-color', '#0088FF'); // Colore del bottone iniziale
  }
}

function changeTextAndColor() {
  if (!clicked) {
    button.html('clicked');
    clicked = true;
  } else {
    button.html('click here');
    clicked = false;
  }
}
