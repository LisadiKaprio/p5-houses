
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
let mapAssetChanged;
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
let gradient1;
let gradient2;
let gradient3;
let gradient4;

function preload () {
	houseAsset2 = loadImage('src/assets/2.png');
	houseAsset3 = loadImage('src/assets/3.png');
	houseAsset4 = loadImage('src/assets/4.png');
	houseAsset5 = loadImage('src/assets/5.png');
	mapAsset = loadImage('src/assets/map-1.jpg');
	mapAssetChanged = loadImage('src/assets/map-3.jpg');
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
	gradient1 = loadImage('src/assets/gradient1.png');
	gradient2 = loadImage('src/assets/gradient2.png');
	gradient3 = loadImage('src/assets/gradient3.png');
	gradient4 = loadImage('src/assets/gradient4.png');
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
let cursorRadius = 30;
let isCursorPointer = false;

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

class Cursor {
	constructor() {
		this.radius = cursorRadius;
	}
	changeIcon(newImage) {
		this.currentImage = newImage;
	}
	display() {
		// noCursor();
		if (isMouseHoveringOnInteractable()) cursor('pointer');
		else cursor('grab');

		// fill(0, 0, 0, 0);
		// stroke(9, 8, 7, 50);
		// strokeWeight(4);
		// circle(mouseX+ (mouseX*-0.03), mouseY+ (mouseY*-0.03), cursorRadius+10)

		fill(0, 0, 0, 0);
		stroke(255, 255, 255, 50);
		strokeWeight(3);
		circle(mouseX, mouseY, this.radius+10);

		if (this.currentImage) {
			image(this.currentImage, mouseX, mouseY, this.radius+5, this.radius+5);
		}
	}
  }

let cursorInstance = new Cursor();

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
	}
	
	drawFrame(animation) {
		if (animation.length) {
			let frameTime = 10;
			let frame = floor((frameCount % (animation.length * frameTime)) / frameTime);
			this.renderedImage = image(animation[frame], this.positionX, this.positionY);
		} else {
			this.renderedImage = image(animation, this.positionX, this.positionY);
		}
	}

	draw() {
		push();
		this.checkMouseOver();
		if (this.isHoveredOver) {
			this.drawFrame(this.asset)
		} else if (this.isSeen) {
			this.drawFrame(this.assetSeen);
		}
		pop();
	}
}

class Window extends Interactable {
	constructor(config) {
		super(config);
		this.story1 = config.story1 || 'Person, 27.';
		this.story2 = config.story2 || 'Sleeps.';
		this.story3 = config.story3 || 'Calm.';
		this.bgFile = config.bgFile || 'wohnung-1.jpeg';
		this.iconFrameOneFile = config.iconFrameOneFile || 'icon-b1.png';
		this.iconFrameTwoFile = config.iconFrameTwoFile || 'icon-a2.png';
	}
}

class Map {
	constructor(config) {
		this.x = config.x || 0; 
		this.y = config.x || 0;
		this.stateChanged = false;
	}
	setup() {
		this.currentMap = mapAsset;
		this.windowArray = [
			this.window1 = new Window({
					sizeX: w1HoverAsset.width,
					sizeY: w1HoverAsset.height,
					positionX: 558,
					positionY: 477,
					asset: [w1HoverAsset, w1SeenAsset, w2HoverAsset, w2SeenAsset],
					assetSeen: [w2SeenAsset, w1SeenAsset],
					iconFrameOneFile: 'icon-a1.png',
					story1: "Biology Teacher, 32",
					story2: "Getting ready for the work day.",
					story3: "He feels stressed after he had a heated argument with his daughter over the phone yesterday. He regrets some of the things he said, and wants to apologize to her later this evening."
				}),
			this.window2 = new Window({
					sizeX: w2HoverAsset.width,
					sizeY: w2HoverAsset.height,
					positionX: 1305,
					positionY: 595,
					asset: w2HoverAsset,
					assetSeen: w2SeenAsset,
					iconFrameOneFile: 'icon-b1.png',
					story1: "Engineer, 28",
					story2: "Cooking breakfast: noodles and fried sausages with tomato sauce. His vacation started this Monday.",
					story3: "Not as stressed, as he usually feels. Lightly excited, as he remembers his plans for this evening - going to a dress shop to see his future wife try the new bride dress on."
				}),
			this.window3 = new Window({
					sizeX: w3HoverAsset.width,
					sizeY: w3HoverAsset.height,
					positionX: 1544,
					positionY: 100,
					asset: w3HoverAsset,
					assetSeen: w3SeenAsset,
					iconFrameOneFile: 'icon-c1.png',
					story1: "Freelance Illustrator, 24",
					story2: "Sleeping after staying up working until 4am.",
					story3: "Deep sleep."
				}),
			this.window4 = new Window({
					sizeX: w4HoverAsset.width,
					sizeY: w4HoverAsset.height,
					positionX: 141,
					positionY: 1189,
					asset: w4HoverAsset,
					assetSeen: w4SeenAsset,
				}),
			this.window5 = new Window({
					sizeX: w5HoverAsset.width,
					sizeY: w5HoverAsset.height,
					positionX: 448,
					positionY: 1344,
					asset: w5HoverAsset,
					assetSeen: w5SeenAsset,
				}),
			this.window6 = new Window({
					sizeX: w6HoverAsset.width,
					sizeY: w6HoverAsset.height,
					positionX: 1229,
					positionY: 1415,
					asset: w6HoverAsset,
					assetSeen: w6SeenAsset,
				}),
			this.window7 = new Window({
					sizeX: w7HoverAsset.width,
					sizeY: w7HoverAsset.height,
					positionX: 1870,
					positionY: 1446,
					asset: w7HoverAsset,
					assetSeen: w7SeenAsset,
				}),
		]
	}
	changeState() {
		this.stateChanged = true;
		this.currentMap = mapAssetChanged;
		this.windowArray = [];
	}
	drawGradient(gradient) {
		image(gradient, 0, 0);
		gradient.resize(window.innerWidth,window.innerHeight);
	}
	draw() {
		// draggable elements
		push();
		translate(-cameraPositionX, -cameraPositionY);
		image(this.currentMap, this.x, this.y);
		this.windowArray.forEach(window => {
			window.currentPositionX = window.positionX - cameraPositionX;
			window.currentPositionY = window.positionY - cameraPositionY;
			window.draw();
		})
		pop();

		// static elements
		push();
		const aa = 0;
		const ab = 2;
		const ac = 4;
		const ad = 6;
		const ae = 7;
		if (!this.stateChanged) {
			if (eventWindowSeenAmount >= aa && eventWindowSeenAmount <= ab) {
				this.drawGradient(gradient1);
			} else if (eventWindowSeenAmount >= (ab+1) && eventWindowSeenAmount <= ac) {
				this.drawGradient(gradient2);
			} else if (eventWindowSeenAmount >= (ac+1) && eventWindowSeenAmount <= ad) {
				this.drawGradient(gradient3);
			} else if (eventWindowSeenAmount >= (ad+1) && eventWindowSeenAmount <= ae) {
				this.drawGradient(gradient4);
			}else {
				this.drawGradient(gradient4);
			}
		}
		pop();
	}
}

let map = new Map({});

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

function setHorizontalCameraBounds() {
	cameraBoundsRight = mapAsset.width - window.innerWidth;
	cameraBoundsBottom = mapAsset.height - window.innerHeight;
}

function isMouseHoveringOnInteractable() {
	return map.windowArray.some(obj => {
		return obj.isHoveredOver;
	  });
}

function mouseClicked() {
	if(windowDescription.hasClass("window-description") && isMouseOnCanvas) {
		windowDescription.removeClass("window-description");
		windowDescription.class("window-description-hidden");
		scrollingEnabled = true;

		if (eventWindowSeenAmount >= eventWindowNeededAmount ) {
			map.changeState();
		}
	}
	map.windowArray.forEach(window => {
		if(window.isHoveredOver) {
			select('.first-text').html(window.story1);
			select('.second-text').html(window.story2);
			select('.third-text').html(window.story3);

			windowDescription.position(mouseX, mouseY);
			windowDescription.class("window-description");
			windowDescription.style(`background-image: url('./src/assets/${window.bgFile}');`)
			select('.frame').style(`background-image: url('./src/assets/${window.iconFrameOneFile}');`)
			// select('.frame-two').style(`background-image: url('./src/assets/${window.iconFrameTwoFile}');`)
			scrollingEnabled = false;
			// windowDescription.mouseOver(() => {console.log('hover')});
			window.changeStateChecked();
		}
	})
	return false;
}

function mouseDragged() {
	if (scrollingEnabled) {
		cursorInstance.radius = cursorRadius - 10;

		targetCameraPositionX -= movedX * scrollVelocity;
		targetCameraPositionY -= movedY * scrollVelocity;

		targetCameraPositionX = stayInBoundsX(targetCameraPositionX);
		targetCameraPositionY = stayInBoundsY(targetCameraPositionY);
	}
	// prevent default
	return false;
}

function mouseReleased() {
	cursorInstance.radius = cursorRadius;
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
	frameRate(30);
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

	windowDescription = select('.window-description-hidden');

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

	cursorInstance.display();
}
