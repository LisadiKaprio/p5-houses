let house1;

function preload () {
	house1 = loadImage('src/assets/4.png');
}

// to make it responsive
function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	// if on smaller screen and portrait, don't use bg image 
	if (window.innerHeight > window.innerWidth*1.3 && window.innerWidth < 1000) {
	  background(10);
	} else {
	  // image(img, -window.innerWidth/2, -window.innerHeight/2, window.innerWidth, window.innerHeight);
	}
  }

function setup() {
	createCanvas(windowWidth, windowHeight);
	// put setup code here
}

function draw() {
	background(23, 20, 29);
	image(house1, 1, 1);	
}
