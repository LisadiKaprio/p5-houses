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
let bombAsset;
let trashAsset;
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

function preload() {
    houseAsset2 = loadImage('src/assets/2.png');
    houseAsset3 = loadImage('src/assets/3.png');
    houseAsset4 = loadImage('src/assets/4.png');
    houseAsset5 = loadImage('src/assets/5.png');
    bombAsset = loadImage('src/assets/bomb1.gif');
    trashAsset = loadImage('src/assets/raindrop.png');
    mapAsset = loadImage('src/assets/map-1.jpg');
    mapAssetChanged = loadImage('src/assets/map-3.jpg');
    w1HoverAsset = loadImage('src/assets/w1-hover.png');
    w2HoverAsset = loadImage('src/assets/w2-hover.png');
    w3HoverAsset = loadImage('src/assets/w4-hover.png');
    w4HoverAsset = loadImage('src/assets/w3-hover.png');
    w5HoverAsset = loadImage('src/assets/w5-hover.png');
    w1SeenAsset = loadImage('src/assets/w1-read.png');
    w2SeenAsset = loadImage('src/assets/w2-read.png');
    w3SeenAsset = loadImage('src/assets/w4-read.png');
    w4SeenAsset = loadImage('src/assets/w3-read.png');
    w5SeenAsset = loadImage('src/assets/w5-read.png');
    selection1Asset = loadImage('src/assets/selection1.png');
    selection2Asset = loadImage('src/assets/selection2.png');
    selection3Asset = loadImage('src/assets/selection3.png');
    gradient1 = loadImage('src/assets/gradient1.png');
    gradient2 = loadImage('src/assets/gradient2.png');
    gradient3 = loadImage('src/assets/gradient3.png');
    gradient4 = loadImage('src/assets/gradient4.png');
    rauch1 = loadImage('src/assets/rauch1.png');
    rauch2 = loadImage('src/assets/rauch2.png');
}

// some value that makes sure the assets are displayed in reasonable size within the window
let windowRatio = window.innerWidth / (window.innerWidth / 2);

let cameraPositionX; // = mapAsset.width / 2;
let cameraPositionY; // = mapAsset.height / 2;
// let cameraBoundsX = mapAsset.width / 2;
// let cameraBoundsY = mapAsset.height / 2;
let cameraBoundsLeft = 0;
let cameraBoundsRight; // = mapAsset.width;
let cameraBoundsTop = 0;
let cameraBoundsBottom; // = mapAsset.width;

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

let stateBegin = 'stateBegin';
let stateAlert = 'stateAlert';
let stateDestruction = 'stateDestruction';
let currentState = stateBegin;
let canClickWindows = true;
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

        if (currentState === stateAlert || currentState === stateDestruction) {
            strokeWeight(
                random(this.strokeWeight - 0.5, this.strokeWeight + 0.5)
            );
            circle(
                mouseX + random(-1, 1),
                mouseY + random(-1, 1),
                this.radius + 10
            );
        } else {
            strokeWeight(this.strokeWeight);
            circle(mouseX, mouseY, this.radius + 10);
        }

        if (this.currentImage) {
            image(
                this.currentImage,
                mouseX,
                mouseY,
                this.radius + 5,
                this.radius + 5
            );
        }
    }
}

let cursorInstance = new Cursor();

class Firefly {
    constructor(x, y, r, color) {
        this.startPosition = createVector(x, y);
        this.position = createVector(x, y);

        this.velocity = createVector();
        this.target = createVector(
            random(x - 50, x + 50),
            random(y - 50, y + 50)
        );
        this.acceleration = createVector();
        this.maxSpeed = 3;
        this.maxForce = 0.75;
        this.maxDistance = 50;

        this.r = r;
        this.color = color;
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
        if (
            dist(
                this.position.x,
                this.position.y,
                this.target.x,
                this.target.y
            ) < 5
        ) {
            // If so, choose a new target within the specified zone
            this.target = createVector(
                random(
                    this.startPosition.x - this.maxDistance,
                    this.startPosition.x + this.maxDistance
                ),
                random(
                    this.startPosition.y - this.maxDistance,
                    this.startPosition.y + this.maxDistance
                )
            );
        }
    }

    display() {
        this.update();
        fill(this.color, this.color, this.color);
        circle(this.position.x, this.position.y, this.r);
    }
}

let fireflies = [
    new Firefly(60, 467, 1, 255),
    new Firefly(108, 488, 1, 250),
    new Firefly(48, 560, 1, 255),
    new Firefly(378, 1556, 1, 253),
    new Firefly(390, 1545, 1, 245),
    new Firefly(850, 690, 1, 253),
    new Firefly(843, 680, 1, 251),
    new Firefly(844, 709, 1, 248),
    new Firefly(1390, 901, 1, 254),
    new Firefly(1358, 905, 1, 251),
];

let darkFireflies = [
    new Firefly(60, 90, 2, 5),
    new Firefly(180, 150, 2, 0),
    new Firefly(150, 1666, 2, 5),
    new Firefly(280, 1715, 2, 3),
    new Firefly(18, 1744, 2, 5),
    new Firefly(2080, 1740, 2, 3),
    new Firefly(1971, 1589, 2, 1),
    new Firefly(1980, 2001, 2, 8),
    new Firefly(1955, 2021, 2, 1),
];

class Siren {
    constructor(config) {
        this.startx = config.startx || window.innerWidth / 2;
        this.starty = config.starty || -30;
        this.startRadiusOffset = config.startRadiusOffset || -30;
        this.startRadiusi = config.startRadiusi || [
            60, 45, 30, 15, 0, -15, -30, -45, -60,
        ];
        this.x = this.startx;
        this.y = this.starty;
        this.radiusOffset = this.startRadiusOffset;
        this.radiusi = this.startRadiusi;
        this.s = config.s || 100;
        this.maxSize = config.maxSize || 444444; // window.innerWidth * 0.9;
        this.maxTransparency = 255;
        this.myColorR = config.myColorR || 9;
        this.myColorG = config.myColorG || 8;
        this.myColorB = config.myColorB || 7;
        this.randomnessStep = config.randomnessStep || 1;

        this.frames = 0;
    }
    resetMe() {
        this.x = this.startx;
        this.y = this.starty;
        this.radiusOffset = this.startRadiusOffset;
        this.radiusi = this.startRadiusi;
    }
    draw() {
        this.frames += 1;
        noFill();
        if (this.frames % 150 == 0) {
            this.resetMe();
        }
        for (let radius of this.radiusi) {
            radius += this.radiusOffset;
            if (radius < 0 || radius > this.maxSize) continue;
            let c = map(
                abs(this.s - radius),
                0,
                this.s,
                this.maxTransparency,
                0
            );
            stroke(this.myColorR, this.myColorG, this.myColorB, c);
            strokeWeight(5);
            ellipse(
                this.x + random(this.randomnessStep),
                this.y + random(this.randomnessStep),
                radius * 2,
                radius * 2
            );
        }
        this.radiusOffset += 2;
    }
}

let sirenOne = new Siren({ startx: 63, starty: 419 });
let sirenTwo = new Siren({ startx: 102, starty: 422 });
let sirenThree = new Siren({ startx: 349, starty: 1505 });
let sirenFour = new Siren({ startx: 394, starty: 1500 });
let sirenFive = new Siren({ startx: 1896, starty: 1010 });
let sirenSix = new Siren({ startx: 1954, starty: 1015 });

class Flash {
    constructor(color, time, duration) {
        this.color = color;
        this.time = time;
        this.duration = duration;
        this.lifetime = 0;
        this.imageLifetime = 0;
        this.fadeLengthOut = time * 2;
        this.fadeLength = time * 0.75;
        this.enabled = false;

        this.imageSizeX = 100;
        this.imageSizeY = 100;
        this.imageX = window.innerWidth / 2 - this.imageSizeX / 2;
        this.imageY = window.innerHeight / 2 - this.imageSizeY / 2;
        this.renderedImage;
    }

    update() {
        this.lifetime += 1;
    }

    draw() {
        if (this.enabled) {
            this.update();
            let alpha;
            let imageAlpha;
            // when fully opaque
            if (
                this.lifetime > this.time &&
                this.lifetime < this.duration + this.time
            ) {
                alpha = 255;
                imageAlpha = map(
                    abs(this.lifetime - this.time) * 0.05,
                    0,
                    this.time,
                    255,
                    0
                );
                myMap.switchMapContentDestruction();
            }
            // when getting opaque
            else if (this.lifetime <= this.time) {
                alpha = map(
                    abs(this.lifetime - this.time),
                    0,
                    this.fadeLengthOut,
                    255,
                    0
                );
                imageAlpha = alpha;
            }
            // when getting transparent again
            else {
                canClickWindows = true;
                alpha = map(
                    abs(this.lifetime - (this.time + this.duration)),
                    0,
                    this.fadeLength,
                    255,
                    0
                );
                imageAlpha = 0;
            }
            this.color.setAlpha(alpha);
            fill(this.color);
            rect(0, 0, window.innerWidth, window.innerHeight);
            tint(255, imageAlpha);
            image(
                bombAsset,
                this.imageX,
                this.imageY,
                this.imageSizeX,
                this.imageSizeY
            );
        }
    }
}

let flash = new Flash(color(248, 249, 250), 25, 175);

class Rain {
    constructor(config) {
        this.maxSpeed = config.maxSpeed || 10;
        this.drop = [];
        for (var i = 0; i < 25; i++) {
            this.drop[i] = new Drop(this.maxSpeed, 3);
        }
    }

    show() {
        for (var i = 0; i < this.drop.length; i++) {
            this.drop[i].fall();
            this.drop[i].show();
        }
    }
}

let rain;

class Drop {
    constructor(maxSpeed, angle) {
        this.maxSpeed = maxSpeed;
        this.angle = angle;
        this.x = random(mapAsset.width / 3, mapAsset.width);
        this.y = random(-500, -50);
        this.z = random(0, 150);
        this.len = map(this.z, 0, 20, 10, 17);
        this.xspeed = map(this.z, 0, 20, 1, this.maxSpeed / 4);
        this.yspeed = map(this.z, 0, 20, 1, this.maxSpeed);
        this.img = trashAsset;
        this.rotationAngle = random(0, 360);
    }

    fall() {
        this.x = this.x + this.angle * this.xspeed;
        this.y = this.y + this.yspeed;
        var grav = map(this.z, 0, 20, 0, 0.2);
        this.yspeed = this.yspeed + grav;

        if (this.y > mapAsset.height) {
            this.x = random(-window.innerWidth / 6, mapAsset.width);
            this.y = random(-200, -100);
            this.yspeed = map(this.z, 0, 20, 4, this.maxSpeed);
        }
    }

    show() {
        image(this.img, this.x, this.y, this.len, this.len);
    }
}
class ScrollingText {
    constructor(text, y) {
        this.text = text;
        this.textWidth = textWidth(this.text);
        this.startX = 0;
        this.x = this.startX;
        // this.startXClone = this.x+this.textWidth;
        this.xClone = window.innerWidth;
        this.moveX = true;
        this.moveXClone = false;
        this.textSize = 20;
        this.y = y;
    }

    display() {
        noStroke();
        textSize(this.textSize);
        textStyle(BOLD);
        fill(200);
        text(this.text, this.x, this.y - this.textSize);
        fill(170);
        text(this.text, this.xClone, this.y - this.textSize);

        if (this.moveX) {
            this.x -= 1;
        }
        if (this.moveXClone) {
            this.xClone -= 1;
        }

        // if the right edge of line is visible,
        // then start moving clone line
        if (this.x + textWidth(this.text) < window.innerWidth)
            this.moveXClone = true;
        if (this.xClone + textWidth(this.text) < window.innerWidth)
            this.moveX = true;

        // if any line no longer visible, it teleports to very right
        if (this.x < this.startX - textWidth(this.text)) {
            this.x = window.innerWidth;
            this.moveX = false;
        }
        if (this.xClone < this.startX - textWidth(this.text)) {
            this.xClone = window.innerWidth;
            this.moveXClone = false;
        }
    }
}

let scrollingText;

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
        this.assetSeen = config.assetSeen || this.asset;
        this.isHoveredOver = false;
        this.isSeen = false;
        this.frameTime = config.frameTime || 10;
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
        if (!this.isSeen) {
            eventWindowSeenAmount += 1;
            this.isSeen = true;
        }
    }

    drawFrame(animation) {
        if (animation.length) {
            let frameTime = this.frameTime;
            let frame = floor(
                (frameCount % (animation.length * frameTime)) / frameTime
            );
            this.renderedImage = image(
                animation[frame],
                this.positionX,
                this.positionY
            );
        } else {
            this.renderedImage = image(
                animation,
                this.positionX,
                this.positionY
            );
        }
    }

    draw() {
        push();
        this.checkMouseOver();
        if (this.isHoveredOver) {
            this.drawFrame(this.asset);
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
        this.sceneAsset = config.sceneAsset || 'A1.png';
    }
}

class Map {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.x || 0;
    }
    setup() {
        this.currentMap = mapAsset;
        this.windowArray = [
            (this.window1 = new Window({
                sizeX: w1HoverAsset.width,
                sizeY: w1HoverAsset.height,
                positionX: 448,
                positionY: 478,
                asset: w1HoverAsset,
                assetSeen: w1SeenAsset,
                bgFile: 'wohnung-5.jpg',
                sceneAsset: 'A1.png',
                story3: storyA1en,
            })),
            (this.window2 = new Window({
                sizeX: w2HoverAsset.width,
                sizeY: w2HoverAsset.height,
                positionX: 1377,
                positionY: 360,
                asset: w2HoverAsset,
                assetSeen: w2SeenAsset,
                bgFile: 'wohnung-4.jpg',
                sceneAsset: 'B1.png',
                story3: storyB1en,
            })),
            (this.window3 = new Window({
                sizeX: w3HoverAsset.width,
                sizeY: w3HoverAsset.height,
                positionX: 453,
                positionY: 1219,
                asset: w3HoverAsset,
                assetSeen: w3SeenAsset,
                sceneAsset: 'C1.png',
                story3: storyC1en,
            })),
            (this.window4 = new Window({
                sizeX: w4HoverAsset.width,
                sizeY: w4HoverAsset.height,
                positionX: 350,
                positionY: 973,
                asset: w4HoverAsset,
                assetSeen: w4SeenAsset,
                sceneAsset: 'D1.png',
                story3: storyD1en,
            })),
            (this.window5 = new Window({
                sizeX: w5HoverAsset.width,
                sizeY: w5HoverAsset.height,
                positionX: 883,
                positionY: 1392,
                asset: w5HoverAsset,
                assetSeen: w5SeenAsset,
                sceneAsset: 'E1.png',
                story3: storyE1en,
            })),
            // this.window6 = new Window({
            // 		sizeX: w6HoverAsset.width,
            // 		sizeY: w6HoverAsset.height,
            // 		positionX: 1225,
            // 		positionY: 1442,
            // 		asset: w6HoverAsset,
            // 		assetSeen: w6SeenAsset,
            // 	}),
            // fix position/asset first
            // this.window7 = new Window({
            // 		sizeX: w7HoverAsset.width,
            // 		sizeY: w7HoverAsset.height,
            // 		positionX: 1307,
            // 		positionY: 1441,
            // 		asset: w7HoverAsset,
            // 		assetSeen: w7SeenAsset,
            // 	}),
            // this.window8 = new Window({
            // 		sizeX: w8HoverAsset.width,
            // 		sizeY: w8HoverAsset.height,
            // 		positionX: 1868,
            // 		positionY: 1444,
            // 		asset: w8HoverAsset,
            // 		assetSeen: w8SeenAsset,
            // 	}),
        ];
    }
    changeState(state) {
        if (state === stateDestruction) {
            flash.enabled = true;

            // make sure no window description shows
            canClickWindows = false;
            windowDescription.removeClass('window-description');
            windowDescription.class('window-description-hidden');
            scrollingEnabled = true;

            this.rauch = new Interactable({
                sizeX: rauch1.width,
                sizeY: rauch1.height,
                positionX: 612,
                positionY: 0,
                asset: [rauch1, rauch2],
                frameTime: 25,
            });
        }
        currentState = state;
        if (state === stateAlert) {
            eventWindowSeenAmount = 0;
            this.windowArray.forEach((windowChild) => {
                windowChild.isSeen = false;
            });
            this.window1.story3 = storyA2en;
            this.window2.story3 = storyB2en;
            this.window3.story3 = storyC2en;
            this.window4.story3 = storyD2en;
            this.window5.story3 = storyE2en;
            this.window1.sceneAsset = 'A2.png';
            this.window2.sceneAsset = 'B2.png';
            this.window3.sceneAsset = 'C2.png';
            this.window4.sceneAsset = 'D2.png';
            this.window5.sceneAsset = 'E2.png';
            fireflies.forEach((fireflyChild) => {
                fireflyChild.maxSpeed = 9;
                fireflyChild.maxForce = 4;
                fireflyChild.maxDistance = 10;
            });
        }
    }
    switchMapContentDestruction() {
        this.currentMap = mapAssetChanged;
        eventWindowSeenAmount = 0;
        this.windowArray.forEach((windowChild) => {
            windowChild.isSeen = false;
        });
        this.window1.story3 = storyA3en;
        this.window2.story3 = storyB3en;
        this.window3.story3 = storyC3en;
        this.window4.story3 = storyD3en;
        this.window5.story3 = storyE3en;
        this.window1.sceneAsset = 'A3.png';
        this.window2.sceneAsset = 'B3.png';
        this.window3.sceneAsset = '';
        this.window4.sceneAsset = '';
        this.window5.sceneAsset = 'E3.png';
    }
    drawGradient(gradient) {
        image(gradient, 0, 0);
        gradient.resize(window.innerWidth, window.innerHeight);
    }
    drawFireflies(flyGroup) {
        flyGroup.forEach((firefly) => {
            firefly.display();
        });
    }
    draw() {
        // draggable elements
        push();

        if (shouldCanvasScaleUp()) {
            scale(canvasScaling());
        }
        translate(-cameraPositionX, -cameraPositionY);
        image(this.currentMap, this.x, this.y);
        this.windowArray.forEach((window) => {
            window.currentPositionX = window.positionX - cameraPositionX;
            window.currentPositionY = window.positionY - cameraPositionY;
            if (shouldCanvasScaleUp()) {
                window.currentPositionX *= canvasScaling();
                window.currentPositionY *= canvasScaling();
            }
            window.draw();
        });

        if (currentState !== stateDestruction) {
            this.drawFireflies(fireflies);
        } else if (currentState === stateDestruction) {
            this.drawFireflies(darkFireflies);
            rain.show();
            this.rauch.draw();
        }

        if (currentState === stateAlert) {
            sirenOne.draw();
            sirenTwo.draw();
            sirenThree.draw();
            sirenFour.draw();
            sirenFive.draw();
            sirenSix.draw();
        }

        pop();

        // static elements
        push();
        const aa = 0;
        const ab = 2;
        const ac = 4;
        const ad = 6;
        const ae = 7;
        if (currentState === stateDestruction) {
            flash.draw();
        }
        if (currentState !== stateDestruction) {
            if (eventWindowSeenAmount >= aa && eventWindowSeenAmount <= ab) {
                this.drawGradient(gradient1);
            } else if (
                eventWindowSeenAmount >= ab + 1 &&
                eventWindowSeenAmount <= ac
            ) {
                this.drawGradient(gradient2);
            } else if (
                eventWindowSeenAmount >= ac + 1 &&
                eventWindowSeenAmount <= ad
            ) {
                this.drawGradient(gradient3);
            } else if (
                eventWindowSeenAmount >= ad + 1 &&
                eventWindowSeenAmount <= ae
            ) {
                this.drawGradient(gradient4);
            } else {
                this.drawGradient(gradient4);
            }
        }
        if (currentState === stateAlert) scrollingText.display();
        pop();
    }
}

let myMap = new Map({});

// to make it responsive
function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    setHorizontalCameraBounds();

    targetCameraPositionX = stayInBoundsX(targetCameraPositionX);
    targetCameraPositionY = stayInBoundsY(targetCameraPositionY);

    scrollingText.y = window.innerHeight;
    // if on smaller screen and portrait, don't use bg image
    // if (window.innerHeight > window.innerWidth*1.3 && window.innerWidth < 1000) {
    //   background(10);
    // } else {
    //   image(img, -window.innerWidth/2, -window.innerHeight/2, window.innerWidth, window.innerHeight);
    // }
}

function canvasScaling() {
    return window.innerWidth / mapAsset.width;
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
    return myMap.windowArray.some((obj) => {
        return obj.isHoveredOver;
    });
}

function mouseClicked() {
    if (windowDescription.hasClass('window-description') && isMouseOnCanvas) {
        windowDescription.removeClass('window-description');
        windowDescription.class('window-description-hidden');
        scrollingEnabled = true;

        if (
            eventWindowSeenAmount >= 3 /*eventWindowNeededAmount*/ &&
            currentState === stateBegin
        ) {
            myMap.changeState(stateAlert);
        } else if (
            eventWindowSeenAmount >= 2 /*(eventWindowNeededAmount/2)*/ &&
            currentState === stateAlert
        ) {
            myMap.changeState(stateDestruction);
        }
    }
    if (!canClickWindows) return;
    myMap.windowArray.forEach((selectedWindow) => {
        if (selectedWindow.isHoveredOver) {
            gsap.from('.stagger-animation', {
                duration: 1,
                opacity: 0,
                y: 15,
                ease: 'power4',
                stagger: 0.1,
            });
            // select('.first-text').html(selectedWindow.story1);
            // select('.second-text').html(selectedWindow.story2);
            select('.third-text').html(selectedWindow.story3);
            let descriptionPositionX = mouseX;
            let descriptionPositionY = mouseY;
            if (mouseX > window.innerWidth * 0.6) {
                descriptionPositionX *= 0.45;
            }
            if (mouseY > window.innerHeight * 0.6) {
                descriptionPositionY *= 0.45;
            }
            windowDescription.position(
                descriptionPositionX,
                descriptionPositionY
            );

            windowDescription.class('window-description');
            // const bgColor = 'rgba(9,8,7,0.95)'
            // const bgColorBottom = 'rgba(9,8,7,0.85)'
            windowDescription.style(
                `background-image: linear-gradient(0deg, rgba(9,8,7,0.85), rgba(9,8,7,0.95)), url('./src/assets/${selectedWindow.bgFile}');`
            );
            if (selectedWindow.sceneAsset) {
                select('.bg-scene').style(
                    `background-image: url('./src/assets/${selectedWindow.sceneAsset}');`
                );
            } else {
                select('.bg-scene').style(`background-image: none;`);
            }
            if (currentState === stateAlert) {
                select('.bg-scene').style(
                    `animation: shake 1.0s; animation-iteration-count: infinite;`
                );
            }
            if (currentState === stateDestruction) {
                select('.bg-scene').style(
                    `animation: shake 4.0s; animation-iteration-count: infinite;`
                );
            }
            // select('.person-one').style(`background-image: url('./src/assets/${selectedWindow.personOneAsset}');`)
            // select('.person-two').style(`background-image: url('./src/assets/${selectedWindow.personTwoAsset}');`)
            // select('.person-three').style(`background-image: url('./src/assets/${selectedWindow.personThreeAsset}');`)
            // select('.frame-two').style(`background-image: url('./src/assets/${selectedWindow.personTwoAsset}');`)
            scrollingEnabled = false;
            // windowDescription.mouseOver(() => {console.log(selectedWindow.currentPositionX)});
            selectedWindow.changeStateChecked();
            select('.third-text').elt.scrollTop = 0;
        }
    });
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
    scrollingText = new ScrollingText(
        'Citizens, air alert! Air alert! Air alert! Turn off the light, gas, put out the fire in the stoves. Take personal protective equipment, documents, food and water supplies. Warn the neighbors and help the sick and elderly people to go outside. As soon as possible, get to the protective structure or hide in the area. Keep calm and order. Next, listen carefully to the announcement of the Department of Civil Protection of the regional state administration. ... ... ',
        window.innerHeight
    );

    wholeCanvas = createCanvas(window.innerWidth, window.innerHeight);
    // check if mouse in inside
    wholeCanvas.mouseOver(() => {
        isMouseOnCanvas = true;
    });
    wholeCanvas.mouseOut(() => {
        isMouseOnCanvas = false;
    });

    cameraPositionX = mapAsset.width / 2 - window.innerWidth / 2;
    cameraPositionY = mapAsset.height / 2 - window.innerHeight / 2;

    targetCameraPositionX = cameraPositionX;
    targetCameraPositionY = cameraPositionY;
    // let cameraBoundsX = mapAsset.width / 2;
    // let cameraBoundsY = mapAsset.height / 2;
    cameraBoundsLeft = 0;
    cameraBoundsTop = 0;
    setHorizontalCameraBounds();

    background(9, 8, 7);

    windowDescription = select('.window-description-hidden');

    myMap.setup();

    rain = new Rain({
        maxSpeed: 1,
    });

    eventWindowNeededAmount = myMap.windowArray.length;
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

    myMap.draw();

    cursorInstance.display();
}
