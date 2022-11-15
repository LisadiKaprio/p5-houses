
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
		this.xOnLayer = config.xOnLayer?? 1; // position horizontally within layer of houses
		this.layerY = config.layerY || 1; // position vertically 
	}
	drawHouse(layerScale, layerOnY) {
		push();
		// position
		translate(
			window.innerWidth * this.xOnLayer, 
			window.innerHeight + layerOnY);
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

class LayerOfHouses {
	constructor(config) {
		this.housesArray = config.housesArray || [];
		this.currentLayer = config.currentLayer || 1;
		this.layerOnY = config.layerOnY || 1;
		this.layerScale = config.layerScale || 1;
	}
	drawLayerOfHouses() {
		push();
		translate((window.innerWidth / 2), 0);
		scale(this.layerScale);
		this.housesArray.forEach(house => {
			house.drawHouse(this.layerScale, this.layerOnY);
		});
		pop();
	}
}

let housesFront;
let housesMiddle;
let housesBack;
let mouseInputActions;

function setup() {
	wholeCanvas = createCanvas(window.innerWidth, window.innerHeight);
	// gets done only once: search for better function other than mouseOver
	// wholeCanvas.mouseOver(mouseInputActions);
	housesFront = new LayerOfHouses({
		housesArray: [
			new House({
				desiredScale: 0.65,
				asset: houseAsset4,
				xOnLayer: -0.3,
			}),
			new House({
				desiredScale: 0.6,
				asset: houseAsset3,
				xOnLayer: 0,
			}),
			new House({
				desiredScale: 0.45,
				asset: houseAsset5,
				xOnLayer: 0.3,
			}),
			new House({
				desiredScale: 0.3,
				asset: houseAsset2,
				xOnLayer: 0.5,
			}),
			new House({
				desiredScale: 0.3,
				asset: houseAsset2,
				xOnLayer: -0.5,
			}),
		],
	});
	housesMiddle = new LayerOfHouses({
		housesArray: [
			new House({
				desiredScale: 0.3,
				asset: houseAsset4,
				xOnLayer: -0.3,
			}),
			new House({
				desiredScale: 0.4,
				asset: houseAsset2,
				xOnLayer: -0.2,
			}),
			new House({
				desiredScale: 0.3,
				asset: houseAsset5,
				xOnLayer: -0.1,
			}),
			new House({
				desiredScale: 0.6,
				asset: houseAsset3,
				xOnLayer: 0.1,
			}),
			new House({
				desiredScale: 0.3,
				asset: houseAsset4,
				xOnLayer: 0.3,
			}),

		]
	});
	housesBack = new LayerOfHouses({
		housesArray: [
			new House({
				desiredScale: 0.65,
				asset: houseAsset4,
				xOnLayer: -0.3,
			}),
			new House({
				desiredScale: 0.6,
				asset: houseAsset3,
				xOnLayer: 0,
			}),
			new House({
				desiredScale: 0.45,
				asset: houseAsset5,
				xOnLayer: 0.3,
			}),
			new House({
				desiredScale: 0.3,
				asset: houseAsset2,
				xOnLayer: 0.5,
			}),
			new House({
				desiredScale: 0.3,
				asset: houseAsset2,
				xOnLayer: -0.5,
			}),
		],
	});

}

function draw() {
	background(23, 20, 29);
	housesBack.layerScale = map(mouseY, 0, window.innerHeight, 1, 1.2);
	housesBack.layerOnY = map(mouseY, 0, (window.innerHeight * 2), -(window.innerHeight * 0.4), (window.innerHeight / 10));
	
	housesMiddle.layerScale = map(mouseY, 0, window.innerHeight, 1, 1.6);
	housesMiddle.layerOnY = map(mouseY, 0, (window.innerHeight * 2), -(window.innerHeight * 0.4), (window.innerHeight / 6));
	
	housesFront.layerScale = map(mouseY, 0, window.innerHeight, 0.8, 1.9);
	housesFront.layerOnY = map(mouseY, 0, (window.innerHeight * 2), -(window.innerHeight * 0.2), (window.innerHeight / 2));
	
	housesBack.drawLayerOfHouses();
	housesMiddle.drawLayerOfHouses();
	housesFront.drawLayerOfHouses();
}