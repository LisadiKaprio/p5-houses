
// TODO: story progression

// let numberOfWindowsSeen
// => player checks windows one by one, the number increases
// => after each window, there's a subtle front gradient on the sides (animated?) layer
// and it keeps expanding
// if numberOfWindowsSeen === windows.length {
//   create button saying 'what could possibly happen now?'	
// } 
// clicking the button triggers a white flash
// camera automatically pans to the house where the rocket hit
// changes:
//   content of windows
//   sprites of assets, sprite of map


let houseAsset2;
let houseAsset3;
let houseAsset4;
let houseAsset5;
let mapAsset;
let w1HoverAsset;
let w1SeenAsset;
let w2HoverAsset;
let w2SeenAsset;
let w3HoverAsset;
let w3SeenAsset;
let w4HoverAsset;
let w4SeenAsset;
let w5HoverAsset;
let w5SeenAsset;
let w6HoverAsset;
let w6SeenAsset;
let w7HoverAsset;
let w7SeenAsset;
let selection1Asset;
let selection2Asset;
let selection3Asset;

function preload () {
	houseAsset2 = loadImage('src/assets/2.png');
	houseAsset3 = loadImage('src/assets/3.png');
	houseAsset4 = loadImage('src/assets/4.png');
	houseAsset5 = loadImage('src/assets/5.png');
	mapAsset = loadImage('src/assets/map-1.jpg');
	w1HoverAsset = loadImage('src/assets/w1-hover.jpg');
	w1SeenAsset = loadImage('src/assets/w1-seen.jpg');
	w2HoverAsset = loadImage('src/assets/w2-hover.jpg');
	w2SeenAsset = loadImage('src/assets/w2-seen.jpg');
	w3HoverAsset = loadImage('src/assets/w3-hover.jpg');
	w3SeenAsset = loadImage('src/assets/w3-seen.jpg');
	w4HoverAsset = loadImage('src/assets/w4-hover.jpg');
	w4SeenAsset = loadImage('src/assets/w4-seen.jpg');
	w5HoverAsset = loadImage('src/assets/w5-hover.jpg');
	w5SeenAsset = loadImage('src/assets/w5-seen.jpg');
	w6HoverAsset = loadImage('src/assets/w6-hover.jpg');
	w6SeenAsset = loadImage('src/assets/w6-seen.jpg');
	w7HoverAsset = loadImage('src/assets/w7-hover.jpg');
	w7SeenAsset = loadImage('src/assets/w7-seen.jpg');
	selection1Asset = loadImage('src/assets/selection1.png');
	selection2Asset = loadImage('src/assets/selection2.png');
	selection3Asset = loadImage('src/assets/selection3.png');
}

// some value that makes sure the assets are displayed in reasonable size within the window
let windowRatio = window.innerWidth / (window.innerWidth / 2);

let cameraPositionX // = mapAsset.width / 2;
let cameraPositionY // = mapAsset.height / 2;
// let cameraBoundsX = mapAsset.width / 2;
// let cameraBoundsY = mapAsset.height / 2;
let cameraBoundsLeft = 0;
let cameraBoundsRight // = mapAsset.width;
let cameraBoundsTop = 0;
let cameraBoundsBottom // = mapAsset.width;

let isMouseOnCanvas;
let cursorRadius = 15;

let windowDescription;

let eventWindowNeededAmount = 0;
let eventWindowSeenAmount = 0;

let scrollingEnabled = true;
let scrollVelocity = 1.2;
let scrollDrag = 4;

let targetCameraPositionX = 0;
let targetCameraPositionY = 0;
let difX = 0;
let difY = 0;

// to make it responsive
function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	setHorizontalCameraBounds();
	// if on smaller screen and portrait, don't use bg image 
	// if (window.innerHeight > window.innerWidth*1.3 && window.innerWidth < 1000) {
	//   background(10);
	// } else {
	//   image(img, -window.innerWidth/2, -window.innerHeight/2, window.innerWidth, window.innerHeight);
	// }
}
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
		fill(9, 8, 7, 50);
		circle(mouseX+ (mouseX*-0.03), mouseY+ (mouseY*-0.03), cursorRadius+10)
		fill(9, 8, 7);
		circle(mouseX, mouseY, cursorRadius+10);
		if (this.currentImage) {
			image(this.currentImage, mouseX, mouseY, cursorRadius+5, cursorRadius+5);
		}
	}
  }

let cursor = new Cursor();

class Interactable {
	constructor(config) {
		// super();
		this.sizeX = config.sizeX || 0;
		this.sizeY = config.sizeY || 0;
		this.positionX = config.positionX || 0;
		this.positionY = config.positionY || 0;
		this.currentPositionX = this.positionX;
		this.currentPositionY = this.positionY;
		this.renderedImage;
		this.asset = config.asset || selection1Asset;
		this.assetSeen = config.assetSeen || selection1Asset;
		this.isHoveredOver = false;
		this.isSeen = false;
	}
	checkMouseOver() {
	  if (
		mouseX > this.currentPositionX &&
		mouseX < this.currentPositionX + this.sizeX && 
		mouseY > this.currentPositionY &&
		mouseY < this.currentPositionY + this.sizeY 
	  ) {
		this.isHoveredOver = true;
	  } else {
		this.isHoveredOver = false;
	  }
	}
	changeStateChecked() {
		if(!this.isSeen) {
			eventWindowSeenAmount += 1;
			this.isSeen = true;
		}
		console.log(eventWindowNeededAmount);
		console.log(eventWindowSeenAmount);
	}
	draw() {
		push();
		this.checkMouseOver();
		if (this.isHoveredOver) {
			this.renderedImage = image(this.asset, this.positionX, this.positionY);
		} else if (this.isSeen) {
			this.renderedImage = image(this.assetSeen, this.positionX, this.positionY);
		}
		pop();
	}
}

class Window extends Interactable {
	constructor(config) {
		super(config);
		this.story = config.story || 'Noone lives here. You can see empty rooms through the window.';
	}
}

class Map {
	constructor(config) {
		this.x = config.x || 0; 
		this.y = config.x || 0;
	}
	setup() {
		this.windowArray = [
			this.window1 = new Window({
					sizeX: w1HoverAsset.width,
					sizeY: w1HoverAsset.height,
					positionX: 558,
					positionY: 477,
					asset: w1HoverAsset,
					assetSeen: w1SeenAsset,
					story: "<b>Who:</b> Biology Teacher, 32 <br><br><b>Currently:</b> Getting ready for the work day. <br><br><b>Mood:</b> He feels stressed after he had a heated argument with his daughter over the phone yesterday. He regrets some of the things he said, and wants to apologize to her later this evening."
				}),
			this.window2 = new Window({
					sizeX: w2HoverAsset.width,
					sizeY: w2HoverAsset.height,
					positionX: 1305,
					positionY: 595,
					asset: w2HoverAsset,
					assetSeen: w2SeenAsset,
					story: "<b>Who:</b> Engineer, 28 <br><br><b>Currently:</b> Cooking breakfast: noodles and fried sausages with tomato sauce. His vacation started this Monday. <br><br><b>Mood:</b> Calmer than usual. Lightly excited, as he remembers his plans for this evening - going to a dress shop to see his future wife try the new bride dress on."
				}),
			this.window3 = new Window({
					sizeX: w3HoverAsset.width,
					sizeY: w3HoverAsset.height,
					positionX: 1544,
					positionY: 100,
					asset: w3HoverAsset,
					assetSeen: w3SeenAsset,
					story: "<b>Who:</b> Freelance Illustrator, 24 <br><br><b>Currently:</b> Sleeping after staying up working until 4am. <br><br><b>Mood:</b> Deep sleep."
				}),
			this.window4 = new Window({
					sizeX: w4HoverAsset.width,
					sizeY: w4HoverAsset.height,
					positionX: 141,
					positionY: 1189,
					asset: w4HoverAsset,
					assetSeen: w4SeenAsset,
					story: "<b>Who:</b> - <br><br><b>Currently:</b> - <br><br><b>Mood:</b> -"
				}),
			this.window5 = new Window({
					sizeX: w5HoverAsset.width,
					sizeY: w5HoverAsset.height,
					positionX: 448,
					positionY: 1344,
					asset: w5HoverAsset,
					assetSeen: w5SeenAsset,
					story: "<b>Who:</b> - <br><br><b>Currently:</b> - <br><br><b>Mood:</b> -"
				}),
			this.window6 = new Window({
					sizeX: w6HoverAsset.width,
					sizeY: w6HoverAsset.height,
					positionX: 1229,
					positionY: 1415,
					asset: w6HoverAsset,
					assetSeen: w6SeenAsset,
					story: "<b>Who:</b> - <br><br><b>Currently:</b> - <br><br><b>Mood:</b> -"
				}),
			this.window7 = new Window({
					sizeX: w7HoverAsset.width,
					sizeY: w7HoverAsset.height,
					positionX: 1870,
					positionY: 1446,
					asset: w7HoverAsset,
					assetSeen: w7SeenAsset,
					story: "<b>Who:</b> - <br><br><b>Currently:</b> - <br><br><b>Mood:</b> -"
				}),
		]
	};
	draw() {
		push();
		translate(-cameraPositionX, -cameraPositionY);
		image(mapAsset, this.x, this.y);
		this.windowArray.forEach(window => {
			window.currentPositionX = window.positionX - cameraPositionX;
			window.currentPositionY = window.positionY - cameraPositionY;
			window.draw();
		})
		pop();
	}
}

let map = new Map({});

function setHorizontalCameraBounds() {
	cameraBoundsRight = mapAsset.width - window.innerWidth;
	cameraBoundsBottom = mapAsset.height - window.innerHeight;
}

function mouseClicked() {
	if(windowDescription && isMouseOnCanvas){
		windowDescription.remove();
		scrollingEnabled = true;
	}
	map.windowArray.forEach(window => {
		if(window.isHoveredOver){
			windowDescription = createDiv(window.story);
			windowDescription.position(mouseX, mouseY);
			windowDescription.class("window-description");
			scrollingEnabled = false;
			windowDescription.mouseOver(() => {console.log('hover')});
			window.changeStateChecked();
		}
	})
	return false;
}

function mouseDragged() {
	if (scrollingEnabled) {
		targetCameraPositionX -= movedX * scrollVelocity;
		targetCameraPositionY -= movedY * scrollVelocity;

		targetCameraPositionX = stayInBoundsX(targetCameraPositionX);
		targetCameraPositionY = stayInBoundsY(targetCameraPositionY);
	}
	// prevent default
	return false;
}

function stayInBoundsX(inputValueX) {
	if (inputValueX <= cameraBoundsLeft) {
		return cameraBoundsLeft;
	} 
	if (inputValueX >= cameraBoundsRight) {
		return cameraBoundsRight;
	}
	return inputValueX;
}

function stayInBoundsY(inputValueY) {
	if (inputValueY <= cameraBoundsTop) {
		return cameraBoundsTop;
	} 
	if (inputValueY >= cameraBoundsBottom) {
		return cameraBoundsBottom;
	}
	return inputValueY;
}

function setup() {
	wholeCanvas = createCanvas(window.innerWidth, window.innerHeight);
	// check if mouse in inside
	wholeCanvas.mouseOver(() => { isMouseOnCanvas = true});
	wholeCanvas.mouseOut(() => { isMouseOnCanvas = false});

	cameraPositionX = mapAsset.width / 2  - (window.innerWidth / 2);
	cameraPositionY = mapAsset.height / 2 - (window.innerHeight / 2);

	targetCameraPositionX = cameraPositionX;
	targetCameraPositionY = cameraPositionY;
	// let cameraBoundsX = mapAsset.width / 2;
	// let cameraBoundsY = mapAsset.height / 2;
	cameraBoundsLeft = 0;
	cameraBoundsTop = 0;
	setHorizontalCameraBounds();

	background(9, 8, 7);

	map.setup();

	eventWindowNeededAmount = map.windowArray.length;
}

function draw() {
	// smooth drag and pan
	difX = targetCameraPositionX - cameraPositionX;
	difY = targetCameraPositionY - cameraPositionY;
	cameraPositionX += difX / scrollDrag;
	cameraPositionY += difY / scrollDrag;
	cameraPositionX = stayInBoundsX(cameraPositionX);
	cameraPositionY = stayInBoundsY(cameraPositionY);
	//

	map.draw();

	cursor.display();
}