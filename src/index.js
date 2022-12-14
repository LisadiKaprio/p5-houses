
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

// import gsap from "gsap";
// const gsap = require("./gsap");

new p5();

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
	w8HoverAsset = loadImage('src/assets/w8-hover.jpg');
	w8SeenAsset = loadImage('src/assets/w8-seen.jpg');
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
let cursorStrokeWeight = 3;
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
		this.strokeWeight = cursorStrokeWeight;
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
		strokeWeight(this.strokeWeight);
		circle(mouseX, mouseY, this.radius+10);

		if (this.currentImage) {
			image(this.currentImage, mouseX, mouseY, this.radius+5, this.radius+5);
		}
	}
  }

let cursorInstance = new Cursor();

  class Firefly {
	constructor(x, y) {
	  this.startPosition = createVector(x, y);
	  this.position = createVector(x, y);
	  this.velocity = createVector();
	  this.target = createVector(random(x - 50, x + 50), random(y - 50, y + 50));
	  this.acceleration = createVector();
	  this.maxSpeed = 3;
	  this.maxForce = 0.75;
	  this.r = 1;
	}
  
	update() {
	  // Calculate the desired velocity
	  let desired = p5.Vector.sub(this.target, this.position);
	  desired.setMag(this.maxSpeed);
  
	  // Calculate the steering force
	  let steer = p5.Vector.sub(desired, this.velocity);
	  steer.limit(this.maxForce);
  
	  // Apply the steering force to the acceleration
	  this.acceleration.add(steer);
  
	  // Update the velocity and position
	  this.velocity.add(this.acceleration);
	  this.velocity.limit(this.maxSpeed);
	  this.position.add(this.velocity);
	  this.acceleration.mult(0);
  
	  // Check if the firefly has reached its target
	  if (dist(this.position.x, this.position.y, this.target.x, this.target.y) < 5) {
		// If so, choose a new target within the specified zone
		this.target = createVector(random(this.startPosition.x - 50, this.startPosition.x + 50), random(this.startPosition.y - 50, this.startPosition.y + 50));
	  }
	}
  
	display() {
		this.update();
	  fill(255);
	  circle(this.position.x, this.position.y, this.r);
	}
  }

  let fireflies = [
	new Firefly(60, 467),
	new Firefly(108, 488),
	new Firefly(48, 560),
	new Firefly(378, 1556),
	new Firefly(390, 1545),
	new Firefly(850, 690),
	new Firefly(843, 680),
	new Firefly(844, 709),
	new Firefly(1390, 901),
	new Firefly(1358, 905),
  ]
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
		this.story2 = config.story2 || '';
		this.story3 = config.story3 || 'Calm.';
		this.bgFile = config.bgFile || 'wohnung-5.jpg';
		this.personOneAsset = config.personOneAsset || 'person1.png';
		this.personTwoAsset = config.personTwoAsset || '';
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
					asset: w1SeenAsset,
					assetSeen: w1SeenAsset,
					bgFile: 'wohnung-5.jpg',
					personOneAsset: 'person1.png',
					story1: "Literature Teacher, 25",
					story2: "",
					story3: "She had a late night grading papers and preparing lessons for her third grade class, and is having a hard time waking up. She hits the snooze button a few times before dragging herself out of bed and into the shower. As she gets dressed, she thinks about the pile of papers on her desk that still need to be graded and sighs. She makes herself a cup of coffee and a slice of toast before sitting down at the kitchen table to check her email and plan out her day. She has a meeting with the principal at 9:30, followed by back-to-back classes all day. She remembers that she also promised to help out with the school's bake sale on Friday and groans at the thought of having to come up with something to bake. As she finishes her breakfast, she reminds herself that she loves her job and that it's all worth it in the end."
				}),
			this.window2 = new Window({
					sizeX: w2HoverAsset.width,
					sizeY: w2HoverAsset.height,
					positionX: 1366,
					positionY: 626,
					asset: w2HoverAsset,
					assetSeen: w2SeenAsset,
					bgFile: 'wohnung-4.jpg',
					personOneAsset: 'person2.png',
					story1: "Engineer, 35",
					story2: "",
					story3: "He had a great time out with friends last night and is in a good mood. He gets out of bed and stretches before heading to the kitchen to start his morning routine. He puts on a pot of coffee and goes for a quick jog around the neighborhood to clear his head. When he gets back, he takes a shower and gets dressed for work, feeling refreshed and ready to take on the day. As he packs his lunch and gathers his things, he hums a tune to himself happily. Later in the day, he has a meeting with his boss to discuss a potential promotion to director of engineering, which has him feeling a bit anxious but also excited. He's been working hard and feels ready for the next step in his career. He just hopes that he can nail the meeting and impress his boss. As he heads out the door, he reminds himself to stay calm and confident."
				}),
			this.window3 = new Window({
					sizeX: w3HoverAsset.width,
					sizeY: w3HoverAsset.height,
					positionX: 1601,
					positionY: 126,
					asset: w3HoverAsset,
					assetSeen: w3SeenAsset,
					personOneAsset: 'person3.png',
					personTwoAsset: 'person4.png',
					story1: "Nurse, 35",
					story2: "",
					story3: "She had a long and stressful shift at the hospital yesterday and is having a hard time shaking off the fatigue. She gets out of bed and stretches before heading to the kitchen to start her morning routine. She puts on a pot of coffee and sits down at the kitchen table to have a cup of tea and think about her day. She thinks about her teenage daughter who is struggling in school and wonders how she can help her. She knows that her daughter is feeling overwhelmed and stressed, and Sara wishes she could take some of that burden off her shoulders. Sara remembers that she promised to attend a parent-teacher conference later in the week and makes a mental note to clear her schedule for that. Later in the week, Sara has a doctor's appointment to discuss some nagging health concerns, which has her feeling a bit worried. She's been having some stomach issues and fatigue, and is hoping that the doctor can help her figure out what's going on. As she finishes her tea and gets ready to head out the door, she reminds herself to stay positive and take care of herself."
				}),
			this.window4 = new Window({
					sizeX: w4HoverAsset.width,
					sizeY: w4HoverAsset.height,
					positionX: 129,
					positionY: 1183,
					asset: w4HoverAsset,
					assetSeen: w4SeenAsset,
				}),
			this.window5 = new Window({
					sizeX: w5HoverAsset.width,
					sizeY: w5HoverAsset.height,
					positionX: 414,
					positionY: 1338,
					asset: w5HoverAsset,
					assetSeen: w5SeenAsset,
				}),
			this.window6 = new Window({
					sizeX: w6HoverAsset.width,
					sizeY: w6HoverAsset.height,
					positionX: 1225,
					positionY: 1442,
					asset: w6HoverAsset,
					assetSeen: w6SeenAsset,
				}),
				// fix position/asset first
			// this.window7 = new Window({
			// 		sizeX: w7HoverAsset.width,
			// 		sizeY: w7HoverAsset.height,
			// 		positionX: 1307,
			// 		positionY: 1441,
			// 		asset: w7HoverAsset,
			// 		assetSeen: w7SeenAsset,
			// 	}),
			this.window8 = new Window({
					sizeX: w8HoverAsset.width,
					sizeY: w8HoverAsset.height,
					positionX: 1868,
					positionY: 1444,
					asset: w8HoverAsset,
					assetSeen: w8SeenAsset,
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
		
		if (shouldCanvasScaleUp()) {
			scale(canvasScaling());
		}
		translate(-cameraPositionX, -cameraPositionY);
		image(this.currentMap, this.x, this.y);
		this.windowArray.forEach(window => {
			window.currentPositionX = window.positionX - cameraPositionX;
			window.currentPositionY = window.positionY - cameraPositionY;
			if (shouldCanvasScaleUp()) {
				window.currentPositionX *= (canvasScaling());
				window.currentPositionY *= (canvasScaling());
			}
			window.draw();
		})

		fireflies.forEach(firefly => {
			firefly.display();
		});

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

	targetCameraPositionX = stayInBoundsX(targetCameraPositionX);
	targetCameraPositionY = stayInBoundsY(targetCameraPositionY);
	// if on smaller screen and portrait, don't use bg image 
	// if (window.innerHeight > window.innerWidth*1.3 && window.innerWidth < 1000) {
	//   background(10);
	// } else {
	//   image(img, -window.innerWidth/2, -window.innerHeight/2, window.innerWidth, window.innerHeight);
	// }
}

function canvasScaling() {
	return window.innerWidth/mapAsset.width;
}

function shouldCanvasScaleUp() {
	return window.innerWidth > mapAsset.width;
}

function setHorizontalCameraBounds() {
	cameraBoundsRight = mapAsset.width - window.innerWidth;
	cameraBoundsBottom = mapAsset.height - window.innerHeight;
	if (shouldCanvasScaleUp()) {
		cameraBoundsRight *= canvasScaling();
		cameraBoundsBottom *= canvasScaling();
	}
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
	map.windowArray.forEach(selectedWindow => {
		if(selectedWindow.isHoveredOver) {
			gsap.from('.stagger-animation', {
			  duration: 1,
			  opacity: 0,
			  y: 15,
			  ease: 'power4',
			  stagger: 0.1
			});
			select('.first-text').html(selectedWindow.story1);
			select('.second-text').html(selectedWindow.story2);
			select('.third-text').html(selectedWindow.story3);
			let descriptionPositionX = mouseX;
			let descriptionPositionY = mouseY;
			if (mouseX > (window.innerWidth * 0.6)) {
				descriptionPositionX *= 0.45;
			}
			if (mouseY > (window.innerHeight * 0.6)) {
				descriptionPositionY *= 0.45;
			}
			windowDescription.position(descriptionPositionX, descriptionPositionY);

			windowDescription.class("window-description");
			const bgColor = 'rgba(9,8,7,0.95)' 
			const bgColorBottom = 'rgba(9,8,7,0.85)' 
			windowDescription.style(`background-image: linear-gradient(0deg, ${bgColorBottom}, ${bgColor}), url('./src/assets/${selectedWindow.bgFile}');`)
			// select('.person-one').style(`background-image: url('./src/assets/${window.personOneAsset}');`)
			// select('.person-two').style(`background-image: url('./src/assets/${window.personTwoAsset}');`)
			// select('.frame-two').style(`background-image: url('./src/assets/${window.personTwoAsset}');`)
			scrollingEnabled = false;
			// windowDescription.mouseOver(() => {console.log(window.currentPositionX)});
			selectedWindow.changeStateChecked();
		}
	})
	return false;
}

function mouseDragged() {
	if (scrollingEnabled) {
		cursorInstance.radius = cursorRadius - 10;
		cursorInstance.strokeWeight = cursorStrokeWeight + 1;

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
	cursorInstance.strokeWeight = cursorStrokeWeight;
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
