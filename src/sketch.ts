import p5 from "p5";

import { PLAYER_1, SYSTEM } from "@rcade/plugin-input-classic";

import cat1 from '/00_Catthwap.png';
import cat2 from '/01_Catthwap.png';
import cat3 from '/02_Catthwap.png';
import cat4 from '/03_Catthwap.png';

// Rcade game dimensions
const WIDTH = 336;
const HEIGHT = 262;

// Cat animation constants
const CAT_ANIMATION_DURATION = 300;
const ANIMATION_FRAMES = 10;
const MIN_BUBBLE_COUNT = 3;

// Bubble constants
const BUBBLE_ANIMATION_DURATION = 200;
const BUBBLE_WIDTH = 120;
const BUBBLE_HEIGHT = 40;
const BUBBLE_X_OFFSET = 40;

let sittingcat: p5.Image;
let thwap1: p5.Image;
let thwap2: p5.Image;
let thwap3: p5.Image;

const cat_pos = { x: (WIDTH / 2), y: (HEIGHT / 2) - 32 };

const drawBubble = (p: p5, x: number, y: number, text: string) => {
    // press a button
    // display the speech bubble
    // it persists for a short amount of time

    // draw rect bubble
    p.fill(255);
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(x, y, BUBBLE_WIDTH, BUBBLE_HEIGHT, 20);

    // draw triangle pointer
    if (x > WIDTH / 2) {
        p.triangle(
            x + BUBBLE_X_OFFSET - 10,
            y + BUBBLE_HEIGHT,
            x + BUBBLE_X_OFFSET + 10,
            y + BUBBLE_HEIGHT,
            x + BUBBLE_WIDTH - 20,
            y + BUBBLE_HEIGHT * 2);
    } else {
        p.triangle(
            x + BUBBLE_X_OFFSET - 10,
            y + BUBBLE_HEIGHT,
            x + BUBBLE_X_OFFSET + 10,
            y + BUBBLE_HEIGHT,
            x - 20,
            y + BUBBLE_HEIGHT * 2);
    }

    // draw text
    p.fill(0);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(text, x + 60, y + 20);
};

const sketch = (p: p5) => {
    let animated : boolean;
    let currentFrame = 0;
    let frameCount = 0;
    let catAnimationTime = 0;
    let bubbleCount = 0;
    // detect key presses
    let upActive = false;
    let leftActive = false;
    let rightActive = false;
    let downActive = false;

    let gameStarted = false;

    p.preload = () => {
        sittingcat = p.loadImage(cat1);
        thwap1 = p.loadImage(cat2);
        thwap2 = p.loadImage(cat3);
        thwap3 = p.loadImage(cat4);
    };

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
        animated = false;
    };

    let upBubble = {
        durationRemaining: 0,
        text: "I love you cat",
        draw: drawBubble,
    };

    let leftBubble = {
        durationRemaining: 0,
        text: "Hi Sauce baby",
        draw: drawBubble,
    };

    let rightBubble = {
        durationRemaining: 0,
        text: "You're the best cat",
        draw: drawBubble,
    };

    let downBubble = {
        durationRemaining: 0,
        text: "Don't ignore me :(",
        draw: drawBubble,
    };

    p.draw = () => {
        p.background(200, 240, 120);

        if (!gameStarted) {
            // Show start screen
            p.fill(255);
            p.textSize(18);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Press 1P START", WIDTH / 2, HEIGHT / 2);
            p.textSize(12);
            p.text("Use D-PAD to move", WIDTH / 2, HEIGHT / 2 + 30);

            if (SYSTEM.ONE_PLAYER) {
                gameStarted = true;
            }
            return;
        }

        // Choose cat image
        let currentCatImage = sittingcat;
        if (animated) {
            frameCount++;
            if (frameCount == ANIMATION_FRAMES) {
                currentFrame = (currentFrame + 1) % 4;
                frameCount = 0;
            }
            switch (currentFrame) {
                case 0:
                    currentCatImage = sittingcat;
                    break;
                case 1:
                    currentCatImage = thwap1;
                    break; 
                case 2:
                    currentCatImage = thwap2;
                    break;
                case 3:
                    currentCatImage = thwap3;
                    break;
            }
        }

        // Draw bubble when pressing up
        if (PLAYER_1.DPAD.up) {
            upBubble.durationRemaining = BUBBLE_ANIMATION_DURATION;
            upActive = true
        } else {
            // release the key
            if (upActive) {
                bubbleCount++;
                if (bubbleCount >= MIN_BUBBLE_COUNT) {
                    bubbleCount = 0;
                    
                }
                upActive = false
            }
        }

        // Draw bubble when pressing left
        if (PLAYER_1.DPAD.left) {
            leftBubble.durationRemaining = BUBBLE_ANIMATION_DURATION;
            leftActive = true
        } else {
            // release the key
            if (leftActive) {
                bubbleCount++;
                if (bubbleCount >= MIN_BUBBLE_COUNT) {
                    bubbleCount = 0;
                    catAnimationTime = CAT_ANIMATION_DURATION;
                }
                leftActive = false
            }
        }

        // Draw bubble when pressing right
        if (PLAYER_1.DPAD.right) {
            rightBubble.durationRemaining = BUBBLE_ANIMATION_DURATION;
            rightActive = true
        } else {
            // release the key
            if (rightActive) {
                bubbleCount++;
                if (bubbleCount >= MIN_BUBBLE_COUNT) {
                    catAnimationTime = CAT_ANIMATION_DURATION;
                    bubbleCount = 0;
                }
                rightActive = false
            }
        }

        // Draw bubble when pressing down
        if (PLAYER_1.DPAD.down) {
            downBubble.durationRemaining = BUBBLE_ANIMATION_DURATION;
            downActive = true
        } else {
            // release the key
            if (downActive) {
                bubbleCount++;
                if (bubbleCount >= MIN_BUBBLE_COUNT) {
                    catAnimationTime = CAT_ANIMATION_DURATION;
                    bubbleCount = 0;
                }
                downActive = false
            }
        }

        // Cat Animation
        if (catAnimationTime > 0) {
            animated = true;
            catAnimationTime--;
        } else {
            frameCount = 0;
            animated = false
        }

        // Draw cat
        p.image(currentCatImage,
            cat_pos.x - currentCatImage.width / 2,
            cat_pos.y - currentCatImage.height / 2);

        // Draw rectangle under the cat
        p.fill(100, 200, 100);
        p.noStroke();
        p.rect(0, cat_pos.y + 32, WIDTH, HEIGHT - (cat_pos.y + 32));


        // Draw bubbles
        if (upBubble.durationRemaining > 0) {
            upBubble.draw(p, 40, 40, upBubble.text);
            upBubble.durationRemaining--;
        }

        if (leftBubble.durationRemaining > 0) {
            leftBubble.draw(p, 20, 140, leftBubble.text);
            leftBubble.durationRemaining--;
        }

        if (rightBubble.durationRemaining > 0) {
            rightBubble.draw(p, 200, 140, rightBubble.text);
            rightBubble.durationRemaining--;
        }

        if (downBubble.durationRemaining > 0) {
            downBubble.draw(p, 200, 60, downBubble.text);
            downBubble.durationRemaining--;
        }
    };
};

new p5(sketch, document.getElementById("sketch")!);
