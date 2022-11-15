
let house2;
let house3;
let house4;
let house5;

// some value that makes sure the assets are displayed in reasonable size within the window
let windowRatio = window.innerWidth / (window.innerWidth / 2);

function preload () {
	house2 = loadImage('src/assets/2.png');
	house3 = loadImage('src/assets/3.png');
	house4 = loadImage('src/assets/4.png');
	house5 = loadImage('src/assets/5.png');
}

// to make it responsive
function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	// if on smaller screen and portrait, don't use bg image 
	// if (window.innerHeight > window.innerWidth*1.3 && window.innerWidth < 1000) {
	//   background(10);
	// } else {
	//   image(img, -window.innerWidth/2, -window.innerHeight/2, window.innerWidth, window.innerHeight);
	// }
}

function setup() {
	wholeCanvas = createCanvas(window.innerWidth, window.innerHeight);
	// gets done only once: search for better function other than mouseOver
	// wholeCanvas.mouseOver(mouseInputActions);
}


function draw() {
	background(23, 20, 29);
	let mouseInputActions = map(mouseX, 0, window.innerWidth, 0.1, 0.5);
	push();
	placeHouse(house4, 0.5, 0.5);
	pop();
	push();
	placeHouse(house2, mouseInputActions, 0.3);
	pop();
}

function placeHouse(asset, desiredScale, positionHorizontally) {
	translate(
		// in the middle
		window.innerWidth * positionHorizontally, 
		// at the very bottom
		window.innerHeight)
	scale(desiredScale);
	translate(
		// origin in the middle horizontally of image
		-(asset.width / 2), 
		// origin at the very bottom of image
		-(asset.height));
	image(
		asset, 
		// in the middle
		0, 
		// at the very bottom
		0,
		);

}