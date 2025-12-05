import p5 from "p5";

import { PLAYER_1, SYSTEM } from "@rcade/plugin-input-classic";

// Rcade game dimensions
const WIDTH = 336;
const HEIGHT = 262;

const CAT_ANIMATION_DURATION = 300;
const ANIMATION_FRAMES = 10;
const MIN_BUBBLE_COUNT = 3;

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
    p.rect(x, y, 80, 40, 20);

    // draw arrow
    p.triangle(x + 40 - 10, y + 40, x + 40 + 10, y + 40, x - 20, y + 80);

    // draw text
    p.fill(0);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(text, x + 40, y + 20);
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
        sittingcat = p.loadImage('../assets/00_Catthwap.png');
        thwap1 = p.loadImage('../assets/01_Catthwap.png');
        thwap2 = p.loadImage('../assets/02_Catthwap.png');
        thwap3 = p.loadImage('../assets/03_Catthwap.png');
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

        // Draw cat
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

        p.image(currentCatImage,
            cat_pos.x - currentCatImage.width / 2,
            cat_pos.y - currentCatImage.height / 2);

        // Draw bubble when pressing up
        if (PLAYER_1.DPAD.up) {
            upBubble.durationRemaining = 200;
            upActive = true
        } else {
            // release the key
            if (upActive) {
                bubbleCount++;
                if (bubbleCount >= MIN_BUBBLE_COUNT) {
                    bubbleCount = 0;
                    catAnimationTime = CAT_ANIMATION_DURATION;
                }
                upActive = false
            }
        }

        if (upBubble.durationRemaining > 0) {
            upBubble.draw(p, 40, 40, upBubble.text);
            upBubble.durationRemaining--;
        }

        // Draw bubble when pressing left
        if (PLAYER_1.DPAD.left) {
            leftBubble.durationRemaining = 200;
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

        if (leftBubble.durationRemaining > 0) {
            leftBubble.draw(p, 20, 140, leftBubble.text);
            leftBubble.durationRemaining--;
        }

        if (catAnimationTime > 0) {
            animated = true;
            catAnimationTime--;
        } else {
            frameCount = 0;
            animated = false
        }
    };
};

new p5(sketch, document.getElementById("sketch")!);
