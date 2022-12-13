
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
let gradientLeft;
let gradientTop;
let gradientBottom;
let gradientRight;
let mapAsset;
let selection1Asset;
let selection2Asset;
let selection3Asset;

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
	selection1Asset = loadImage('src/assets/selection1.png');
	selection2Asset = loadImage('src/assets/selection2.png');
	selection3Asset = loadImage('src/assets/selection3.png');
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

let isMouseOnCanvas;
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

class Interactable {
	constructor(config) {
		// super();
		this.sizeX = config.sizeX || 0;
		this.sizeY = config.sizeY || 0;
		this.positionX = config.positionX || 0;
		this.positionY = config.positionY || 0;
		this.currentPositionX = this.positionX;
		this.currentPositionY = this.positionY;
		this.imageOnHover;
		this.asset = config.asset || selection1Asset;
		this.isHoveredOver = false;
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
	draw() {
		push();
		this.checkMouseOver();
		if(this.isHoveredOver){
			this.imageOnHover = image(this.asset, this.positionX, this.positionY);
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
					sizeX: selection1Asset.width,
					sizeY: selection1Asset.height,
					positionX: 752,
					positionY: 136,
					asset: selection1Asset,
					story: "<b>Who:</b> Biology Teacher, 32 <br><br><b>Currently:</b> Getting ready for the work day. <br><br><b>Mood:</b> He feels stressed after he had a heated argument with his daughter over the phone yesterday. He regrets some of the things he said, and wants to apologize to her later this evening."
				}),
			this.window2 = new Window({
					sizeX: selection2Asset.width,
					sizeY: selection2Asset.height,
					positionX: 836,
					positionY: 999,
					asset: selection2Asset,
					story: "<b>Who:</b> Engineer, 28 <br><br><b>Currently:</b> Cooking breakfast: noodles and fried sausages with tomato sauce. His vacation started this Monday. <br><br><b>Mood:</b> Calmer than usual. Lightly excited, as he remembers his plans for this evening - going to a dress shop to see his future wife try the new bride dress on."
				}),
			this.window3 = new Window({
					sizeX: selection3Asset.width,
					sizeY: selection3Asset.height,
					positionX: 830,
					positionY: 1097,
					asset: selection3Asset,
					story: "<b>Who:</b> Freelance Illustrator, 24 <br><br><b>Currently:</b> Sleeping after staying up working until 4am. <br><br><b>Mood:</b> Deep sleep."
				}),
		]
	};
	draw() {
		push();
		translate(cameraPositionX, cameraPositionY);
		image(mapAsset, this.x, this.y);
		this.windowArray.forEach(window => {
			window.currentPositionX = window.positionX + cameraPositionX;
			window.currentPositionY = window.positionY + cameraPositionY;
			window.draw();
		})
		pop();
	}
}

let map = new Map({});

let windowDescription;
let scrollingEnabled = true;

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
		}
	})
}

function setup() {
	wholeCanvas = createCanvas(window.innerWidth, window.innerHeight);
	// check if mouse in inside
	wholeCanvas.mouseOver(() => { isMouseOnCanvas = true});
	wholeCanvas.mouseOut(() => { isMouseOnCanvas = false});

	cameraPositionX = -mapAsset.width / 2  + (window.innerWidth / 2);
	cameraPositionY = -mapAsset.height / 2 + (window.innerHeight / 2);
	// let cameraBoundsX = mapAsset.width / 2;
	// let cameraBoundsY = mapAsset.height / 2;
	cameraBoundsLeft = 0;
	cameraBoundsRight = mapAsset.width - window.innerWidth;
	cameraBoundsTop = 0;
	cameraBoundsBottom = mapAsset.height - window.innerHeight;
}

let defaultScrollSpeed = 6;
let defaultScrollerWidth = 0.15;

function draw() {

	background(212, 163, 115);
	map.setup();
	map.draw();

	// only active when no window description on screen
	if(scrollingEnabled){
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
		if (isMouseOnCanvas) {
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

	}
	
	cursor.display();
}