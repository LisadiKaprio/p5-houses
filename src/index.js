
let houseAsset2;
let houseAsset3;
let houseAsset4;
let houseAsset5;
let gradientLeft;
let gradientRight;
let mapAsset;

// some value that makes sure the assets are displayed in reasonable size within the window
let windowRatio = window.innerWidth / (window.innerWidth / 2);


function preload () {
	houseAsset2 = loadImage('src/assets/2.png');
	houseAsset3 = loadImage('src/assets/3.png');
	houseAsset4 = loadImage('src/assets/4.png');
	houseAsset5 = loadImage('src/assets/5.png');
	gradientLeft = loadImage('src/assets/gradient_left.png');
	gradientRight = loadImage('src/assets/gradient_right.png');
	gradientTop = loadImage('src/assets/gradient_top.png');
	gradientBottom = loadImage('src/assets/gradient_bottom.png');
	mapAsset = loadImage('src/assets/map-1.png');
}

let cameraPositionX // = mapAsset.width / 2;
let cameraPositionY // = mapAsset.height / 2;
// let cameraBoundsX = mapAsset.width / 2;
// let cameraBoundsY = mapAsset.height / 2;
let cameraBoundsLeft = 0;
let cameraBoundsRight // = mapAsset.width;
let cameraBoundsTop = 0;
let cameraBoundsBottom // = mapAsset.width;

// to make it responsive
function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	cameraBoundsRight = mapAsset.width - window.innerWidth;
	cameraBoundsBottom = mapAsset.height - window.innerHeight;
	// if on smaller screen and portrait, don't use bg image 
	// if (window.innerHeight > window.innerWidth*1.3 && window.innerWidth < 1000) {
	//   background(10);
	// } else {
	//   image(img, -window.innerWidth/2, -window.innerHeight/2, window.innerWidth, window.innerHeight);
	// }
}

let isMouseInsideBrowser;
let cursorRadius = 15;
class Cursor {
	constructor() {
		this.radius = cursorRadius;
	}
  
	changeIcon(newImage) {
		this.currentImage = newImage;
	}
  
	display() {
		noCursor();
		noStroke();
		fill(115, 120, 98, 50);
		circle(mouseX+ (mouseX*0.03), mouseY+ (mouseY*0.03), cursorRadius+10)
		fill(115, 120, 98);
		circle(mouseX, mouseY, cursorRadius+10);
		if (this.currentImage) {
			image(this.currentImage, mouseX, mouseY, cursorRadius+5, cursorRadius+5);
		}
	}
  }

let cursor = new Cursor();

class ScrollerUI_X {
	constructor(config) {
		// how fast the camera will move
		this.scrollSpeed = config.scrollSpeed || 1;
		// how much of the screen on each side recognizes the cursor hovering over it
		// and tells the camera to move
		// a number between 0 and 1
		this.width = config.width || 0.2;
		this.positionX = config.positionX || 0;
		this.asset = config.asset || gradientLeft;
		this.trigger;
	}
	isMouseOver() {
	  if (
		mouseX > this.positionX &&
		mouseX < this.positionX + (window.innerWidth * this.width) &&
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
			(window.innerWidth * this.width),
			window.innerHeight
			);
		this.asset.resize(
			(window.innerWidth * this.width),
			window.innerHeight);
		if (cameraPositionX <= cameraBoundsLeft){
			cameraPositionX += this.scrollSpeed;
		}
	}
	scrollRight() {
		this.trigger = image(
			this.asset,
			this.positionX,
			0,
			(window.innerWidth * this.width),
			window.innerHeight
			);
		this.asset.resize(
				(window.innerWidth * this.width),
				window.innerHeight);
		if (cameraPositionX >= -cameraBoundsRight){
			cameraPositionX -= this.scrollSpeed;
		}
	}
}

class ScrollerUI_Y {
	constructor(config) {
		// how fast the camera will move
		this.scrollSpeed = config.scrollSpeed || 1;
		// how much of the screen on each side recognizes the cursor hovering over it
		// and tells the camera to move
		// a number between 0 and 1
		this.width = config.width || 0.2;
		this.positionY = config.positionY || 0;
		this.asset = config.asset || gradientTop;
		this.trigger;
	}
	isMouseOver() {
	  if (
		mouseX > 0 &&
		mouseX < 0 + window.innerWidth &&
		mouseY > this.positionY &&
		mouseY < this.positionY + (window.innerHeight* this.width)
	  ) {
		return true;
	  } else {
		return false;
	  }
	}
	scrollTop() {
		this.trigger = image(
			this.asset,
			0,
			this.positionY,
			window.innerWidth,
			(window.innerHeight * this.width),
			);
		this.asset.resize(
			window.innerWidth,
			(window.innerHeight * this.width));
		if (cameraPositionY <= cameraBoundsTop){
			cameraPositionY += this.scrollSpeed;
		}
	}
	scrollBottom() {
		this.trigger = image(
			this.asset,
			0,
			this.positionY,
			window.innerWidth,
			(window.innerHeight * this.width),
			);
		this.asset.resize(
			window.innerWidth,
			(window.innerHeight * this.width));
		if (cameraPositionY >= -cameraBoundsBottom){
			cameraPositionY -= this.scrollSpeed;
		}
	}
}

let leftScrollerUI;
let rightScrollerUI;
let topScrollerUI;
let bottomScrollerUI;

let divelem;
// div construction: useful for ui later???
		//
		// divelem = createDiv("This is a div element");
    	// divelem.position(this.positionX, this.positionY);
    	// divelem.size(this.sizeX, this.sizeY);
    	// divelem.style("border: 2px dashed");
		// divelem.mouseOver(() => {console.log('hover')});

// TODO: import Transformer https://github.com/ChristerNilsson/Transformer

class Transformer {
	constructor(x2 = 0, y2 = 0, a1 = 0, s = 1, stack = []) {
	  this.x = x2;
	  this.y = y2;
	  this.a = a1;
	  this.s = s;
	  this.stack = stack;
	  this.commands = [];
	}
  
	push() {
	  push();
	  return this.stack.push([this.x, this.y, this.a, this.s]);
	}
  
	pop() {
	  pop();
	  return [this.x, this.y, this.a, this.s] = this.stack.pop();
	}
  
	rotate(da) {
	  this.commands.push(`r ${da}`);
	  rotate(da);
	  return this.a += da;
	}
  
	scale(ds) {
	  this.commands.push(`s ${ds}`);
	  scale(ds);
	  return this.s *= ds;
	}
  
	translate(dx, dy) {
	  this.commands.push(`t ${dx} ${dy}`);
	  translate(dx, dy);
	  this.x += this.s * dx * cos(this.a) - this.s * dy * sin(this.a);
	  return this.y += this.s * dy * cos(this.a) + this.s * dx * sin(this.a);
	}
  
	getCommands() {
	  return _.clone(this.commands);
	}
  
	backwards(x, y, commands) {
	  var a, arr, command, dx, dy, k, len, ref, x1, y1;
	  ref = commands.reverse();
	  for (k = 0, len = ref.length; k < len; k++) {
		command = ref[k];
		arr = command.split(' ');
		if (arr[0] === 'r') {
		  a = -arr[1];
		  x1 = x * cos(a) - y * sin(a);
		  y1 = y * cos(a) + x * sin(a);
		  [x, y] = [x1, y1];
		}
		if (command[0] === 's') {
		  x = x / arr[1];
		  y = y / arr[1];
		}
		if (command[0] === 't') {
		  dx = arr[1];
		  dy = arr[2];
		  x -= dx;
		  y -= dy;
		}
	  }
	  return [x, y];
	}
  
	dump() {
	  return console.log(this.x, this.y, this.a, this.s);
	}
  
  };

let tf = new Transformer();

class Interactable {
	constructor(config) {
		// super();

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
	isMouseOverTF() {
	  if (
		mouseX > tf.x &&
		mouseX < tf.x + this.sizeX * tf.s && 
		mouseY > tf.y &&
		mouseY < tf.y + this.sizeY * tf.s 
	  ) {
		return true;
	  } else {
		return false;
	  }
	}
	draw() {
		tf.push();
		if(this.isMouseOverTF()){
			fill('rgba(100%,0%,100%,0.5)');
		} else {
			fill(255, 255, 255);
		}
		tf.translate(mouseX * 0.5, mouseY * 0.5);
		this.asset = rect(this.positionX, this.positionY, this.sizeX, this.sizeY);
		tf.pop();
	}
}

class Window extends Interactable {

}

let window1;

class Map {
	constructor(config) {
		this.x = config.x || 0; 
		this.y = config.x || 0; 
	}
	draw() {
		push();
		translate(cameraPositionX, cameraPositionY);
		image(mapAsset, this.x, this.y);
		pop();
	}
}
let map = new Map({});

// class House {
// 	constructor(config) {
// 		this.desiredScale = config.desiredScale || 0.5;
// 		this.asset = config.asset || houseAsset2;
// 		this.xOnLayer = config.xOnLayer?? 1; // position horizontally within layer of houses
// 		this.layerY = config.layerY || 1; // position vertically 
// 	}
// 	drawHouse(layerScale, layerOnY) {
// 		push();
// 		// position
// 		translate(
// 			window.innerWidth * this.xOnLayer, 
// 			window.innerHeight);
// 		scale(this.desiredScale);
// 		translate(
// 			// origin in the middle horizontally of image
// 			-(this.asset.width / 2), 
// 			// origin at the very bottom of image
// 			-(this.asset.height));
// 		// render image
// 		image(this.asset, 0, 0);
// 		pop();
// 	}
// }

// class LayerOfHouses {
// 	constructor(config) {
// 		this.housesArray = config.housesArray || [];
// 		this.currentLayer = config.currentLayer || 1;
// 		this.layerOnY = config.layerOnY || 1;
// 		this.layerScale = config.layerScale || 1;
// 	}
// 	drawLayerOfHouses() {
// 		push();
// 		// ensure the centered houses remain centered on screen
// 		translate((window.innerWidth / 2), 0);
// 		// apply scaling based on layer
// 		scale(this.layerScale);
// 		// move whole layer on X
// 		translate(
// 			map(cameraPositionX, -cameraBoundsX, cameraBoundsX, -cameraBoundsX, cameraBoundsX)
// 			,0);
// 		this.housesArray.forEach(house => {
// 			house.drawHouse(this.layerScale, this.layerOnY);
// 		});
// 		pop();
// 	}
// }

// let housesFront;
// let housesMiddle;
// let housesBack;

function setup() {
	wholeCanvas = createCanvas(window.innerWidth, window.innerHeight);
	// check if mouse in inside
	wholeCanvas.mouseOver(() => { isMouseInsideBrowser = true});
	wholeCanvas.mouseOut(() => { isMouseInsideBrowser = false});

	cameraPositionX = -mapAsset.width / 2  + (window.innerWidth / 2);
	cameraPositionY = -mapAsset.height / 2 + (window.innerHeight / 2);
	// let cameraBoundsX = mapAsset.width / 2;
	// let cameraBoundsY = mapAsset.height / 2;
	cameraBoundsLeft = 0;
	cameraBoundsRight = mapAsset.width - window.innerWidth;
	cameraBoundsTop = 0;
	cameraBoundsBottom = mapAsset.height - window.innerHeight;

	// // gets done only once: search for better function other than mouseOver
	// // wholeCanvas.mouseOver(mouseInputActions);
	// housesFront = new LayerOfHouses({
	// 	housesArray: [
	// 		new House({
	// 			desiredScale: 0.65,
	// 			asset: houseAsset4,
	// 			xOnLayer: -0.3,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.6,
	// 			asset: houseAsset3,
	// 			xOnLayer: 0,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.45,
	// 			asset: houseAsset5,
	// 			xOnLayer: 0.3,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.3,
	// 			asset: houseAsset2,
	// 			xOnLayer: 0.5,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.3,
	// 			asset: houseAsset2,
	// 			xOnLayer: -0.5,
	// 		}),
	// 	],
	// });
	// housesMiddle = new LayerOfHouses({
	// 	housesArray: [
	// 		new House({
	// 			desiredScale: 0.3,
	// 			asset: houseAsset4,
	// 			xOnLayer: -0.3,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.4,
	// 			asset: houseAsset2,
	// 			xOnLayer: -0.2,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.3,
	// 			asset: houseAsset5,
	// 			xOnLayer: -0.1,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.6,
	// 			asset: houseAsset3,
	// 			xOnLayer: 0.1,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.3,
	// 			asset: houseAsset4,
	// 			xOnLayer: 0.3,
	// 		}),

	// 	]
	// });
	// housesBack = new LayerOfHouses({
	// 	housesArray: [
	// 		new House({
	// 			desiredScale: 0.65,
	// 			asset: houseAsset4,
	// 			xOnLayer: -0.3,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.6,
	// 			asset: houseAsset3,
	// 			xOnLayer: 0,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.45,
	// 			asset: houseAsset5,
	// 			xOnLayer: 0.3,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.3,
	// 			asset: houseAsset2,
	// 			xOnLayer: 0.5,
	// 		}),
	// 		new House({
	// 			desiredScale: 0.3,
	// 			asset: houseAsset2,
	// 			xOnLayer: -0.5,
	// 		}),
	// 	],
	// });

}

let defaultScrollSpeed = 6;
let defaultScrollerWidth = 0.15;

function draw() {

	background(212, 163, 115);
	map.draw();
	
	// window1 = new Window({
	// 	sizeX: 50,
	// 	sizeY: 69,
	// 	positionX: 369,
	// 	positionY: 369,
	// });
	// // if (window1.isMouseOver) {
	// // 	// console.log(window1.sizeX);
	// // 	// console.log(window1.sizeY);
	// // 	// console.log(window1.positionX);
	// // 	// console.log(window1.positionY);
	// // 	fill(0, 153, 204);
	// // }
	// window1.draw();

	leftScrollerUI = new ScrollerUI_X({
		scrollSpeed: defaultScrollSpeed,
		width: defaultScrollerWidth,
		positionX: 0,
		asset: gradientLeft
	});
	rightScrollerUI = new ScrollerUI_X({
		scrollSpeed: defaultScrollSpeed,
		width: defaultScrollerWidth,
		positionX: window.innerWidth - (window.innerWidth * defaultScrollerWidth),
		asset: gradientRight
	});
	topScrollerUI = new ScrollerUI_Y({
		scrollSpeed: defaultScrollSpeed,
		width: defaultScrollerWidth,
		positionY: 0,
		asset: gradientTop
	});
	bottomScrollerUI = new ScrollerUI_Y({
		scrollSpeed: defaultScrollSpeed,
		width: defaultScrollerWidth,
		positionY: window.innerHeight - (window.innerHeight * defaultScrollerWidth),
		asset: gradientBottom
	});
	if (isMouseInsideBrowser) {
		if (leftScrollerUI.isMouseOver()) {
			leftScrollerUI.scrollLeft();
		}
		if (rightScrollerUI.isMouseOver()) {
			rightScrollerUI.scrollRight();
		}
		if (topScrollerUI.isMouseOver()) {
			topScrollerUI.scrollTop();
		}
		if (bottomScrollerUI.isMouseOver()) {
			bottomScrollerUI.scrollBottom();
		}
	}
	
	cursor.display();
}