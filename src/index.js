
let houseAsset2;
let houseAsset3;
let houseAsset4;
let houseAsset5;
let gradientLeft;
let gradientRight;

// some value that makes sure the assets are displayed in reasonable size within the window
let windowRatio = window.innerWidth / (window.innerWidth / 2);

let cameraPositionX = 0;
let cameraBoundsX = window.innerWidth / 2;

function preload () {
	houseAsset2 = loadImage('src/assets/2.png');
	houseAsset3 = loadImage('src/assets/3.png');
	houseAsset4 = loadImage('src/assets/4.png');
	houseAsset5 = loadImage('src/assets/5.png');
	gradientLeft = loadImage('src/assets/gradient_left.png');
	gradientRight = loadImage('src/assets/gradient_right.png');
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

let isMouseInsideBrowser;

class ScrollerUI {
	constructor(config) {
		// how fast the camera will move
		this.scrollSpeed = config.scrollSpeed || 1;
		// how much of the screen on each side recognizes the cursor hovering over it
		// and tells the camera to move
		// a number between 0 and 1
		this.widthY = config.widthY || 0.2;
		this.positionX = config.positionX || 0;
		this.asset = config.asset || gradientLeft;
		this.trigger;
	}
	isMouseOver() {
	  if (
		mouseX > this.positionX &&
		mouseX < this.positionX + (window.innerWidth * this.widthY) &&
		mouseY > 0 &&
		mouseY < 0 + window.innerHeight
	  ) {
		return true;
	  } else {
		return false;
	  }
	}
	scrollLeft() {
		this.trigger = image(
			this.asset,
			this.positionX,
			0,
			(window.innerWidth * this.widthY),
			window.innerHeight
			);
		if (cameraPositionX <= cameraBoundsX){
			cameraPositionX += this.scrollSpeed;
		}
	}
	scrollRight() {
		this.trigger = image(
			this.asset,
			this.positionX,
			0,
			(window.innerWidth * this.widthY),
			window.innerHeight
			);
		if (cameraPositionX >= -cameraBoundsX){
			cameraPositionX -= this.scrollSpeed;
		}
	}

}

let leftScrollerUI;
let rightScrollerUI;

let divelem;
// div construction: useful for ui later???
		//
		// divelem = createDiv("This is a div element");
    	// divelem.position(this.positionX, this.positionY);
    	// divelem.size(this.sizeX, this.sizeY);
    	// divelem.style("border: 2px dashed");
		// divelem.mouseOver(() => {console.log('hover')});

// TODO: import Transformer
// TODO: every class should be extended from Transformer

		class Interactable {
	constructor(config) {
		this.sizeX = config.sizeX || 0;
		this.sizeY = config.sizeY || 0;
		this.positionX = config.positionX || 0;
		this.positionY = config.positionY || 0;
		// current x y w h
		this.asset;

		this.isHoveredOver;
	}
	isMouseOver() {
	  if (
		mouseX > this.positionX &&
		mouseX < this.positionX + this.sizeX && 
		mouseY > this.positionY &&
		mouseY < this.positionY + this.sizeY 
	  ) {
		return true;
	  } else {
		return false;
	  }
	}
	draw() {
		// this.asset = rect(this.positionX, this.positionY, this.sizeX, this.sizeY);

		
	}
}

class Window extends Interactable {

}

let window1;

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
			window.innerHeight);
		scale(this.desiredScale);
		translate(
			// origin in the middle horizontally of image
			-(this.asset.width / 2), 
			// origin at the very bottom of image
			-(this.asset.height));
		// render image
		image(this.asset, 0, 0);

		window1 = new Window({
			sizeX: 50,
			sizeY: 69,
			positionX: 69,
			positionY: 69,
		});
		if (window1.isMouseOver) {
			// console.log(window1.sizeX);
			// console.log(window1.sizeY);
			// console.log(window1.positionX);
			// console.log(window1.positionY);
			fill(0, 153, 204);
		}
		window1.draw();
		
		

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
		// ensure the centered houses remain centered on screen
		translate((window.innerWidth / 2), 0);
		// apply scaling based on layer
		scale(this.layerScale);
		// move whole layer on X
		translate(
			map(cameraPositionX, -cameraBoundsX, cameraBoundsX, -cameraBoundsX, cameraBoundsX)
			,0);
		this.housesArray.forEach(house => {
			house.drawHouse(this.layerScale, this.layerOnY);
		});
		pop();
	}
}

let housesFront;
let housesMiddle;
let housesBack;

function setup() {
	wholeCanvas = createCanvas(window.innerWidth, window.innerHeight);
	// check if mouse in inside
	wholeCanvas.mouseOver(() => { isMouseInsideBrowser = true});
	wholeCanvas.mouseOut(() => { isMouseInsideBrowser = false});
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

	background(242, 244, 243);
	housesBack.layerScale = map(mouseY, window.innerHeight, 0, 0.8, 1.2);
	housesBack.layerOnY = map(mouseY, (window.innerHeight * 2), 0, -(window.innerHeight * 0.4), (window.innerHeight / 10));
	
	housesMiddle.layerScale = map(mouseY, window.innerHeight, 0, 0.8, 1.6);
	housesMiddle.layerOnY = map(mouseY, (window.innerHeight * 2), 0, -(window.innerHeight * 0.4), (window.innerHeight / 6));
	
	housesFront.layerScale = map(mouseY, window.innerHeight, 0, 0.8, 1.9);
	housesFront.layerOnY = map(mouseY, (window.innerHeight * 2), 0, -(window.innerHeight * 0.2), (window.innerHeight / 2));
	
	housesBack.drawLayerOfHouses();
	housesMiddle.drawLayerOfHouses();
	housesFront.drawLayerOfHouses();

	leftScrollerUI = new ScrollerUI({
		scrollSpeed: 5,
		widthY: 0.2,
		positionX: 0,
		asset: gradientLeft
	});
	rightScrollerUI = new ScrollerUI({
		scrollSpeed: 5,
		widthY: 0.2,
		positionX: window.innerWidth - (window.innerWidth * 0.2),
		asset: gradientRight
	});
	// for each houseLayer.house.window => handleInteraction(x, y, w, h);
	if (isMouseInsideBrowser) {
		if (leftScrollerUI.isMouseOver()) {
			leftScrollerUI.scrollLeft();
		}
		if (rightScrollerUI.isMouseOver()) {
			rightScrollerUI.scrollRight();
		}
	}
	
}