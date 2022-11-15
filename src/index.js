
let houseAsset2;
let houseAsset3;
let houseAsset4;
let houseAsset5;

// some value that makes sure the assets are displayed in reasonable size within the window
let windowRatio = window.innerWidth / (window.innerWidth / 2);

function preload () {
	houseAsset2 = loadImage('src/assets/2.png');
	houseAsset3 = loadImage('src/assets/3.png');
	houseAsset4 = loadImage('src/assets/4.png');
	houseAsset5 = loadImage('src/assets/5.png');
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

class House {
	constructor(config) {
		this.desiredScale = config.desiredScale || 0.5;
		this.asset = config.asset || houseAsset2;
		this.xOnLayer = config.xOnLayer || 0.5; // position horizontally within layer of houses
		this.layerY = config.layerY || 1; // position vertically 
	}
	drawHouse() {
		push();
		// position
		translate(
			// in the middle
			window.innerWidth * this.xOnLayer, 
			// at the very bottom
			window.innerHeight)
		scale(this.desiredScale);
		translate(
			// origin in the middle horizontally of image
			-(this.asset.width / 2), 
			// origin at the very bottom of image
			-(this.asset.height));
		// render image
		image(this.asset, 0, 0);
		pop();
	}
}

let houses;

function setup() {
	wholeCanvas = createCanvas(window.innerWidth, window.innerHeight);
	// gets done only once: search for better function other than mouseOver
	// wholeCanvas.mouseOver(mouseInputActions);
	houses = [
		new House({
			desiredScale: 0.3,
			asset: houseAsset4,
			xOnLayer: 0.3,
		}),
		new House({
			desiredScale: 0.6,
			asset: houseAsset3,
			xOnLayer: 0.15,
		}),
		new House({
			desiredScale: 0.45,
			asset: houseAsset5,
			xOnLayer: 0.7,
		}),
	];

}

function draw() {
	background(23, 20, 29);
	let mouseInputActions = map(mouseX, 0, window.innerWidth, 0.1, 0.5);
	houses.forEach(house => {
		house.drawHouse();
	});
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