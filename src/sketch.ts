import p5 from "p5";
import { PLAYER_1 } from "@rcade/plugin-input-classic";

import cat1 from '/00_Catthwap.png';
import cat2 from '/01_Catthwap.png';
import cat3 from '/02_Catthwap.png';
import cat4 from '/03_Catthwap.png';

type Cat =  {
    animated: boolean;
    currentFrame: number;
    frameCount: number;
    animationTime: number;
}

// Rcade game dimensions
const WIDTH = 336;
const HEIGHT = 262;

// Cat animation constants
const CAT_ANIMATION_DURATION = 300;
const ANIMATION_FRAMES = 10;
const MIN_BUBBLE_COUNT = 3;

// Cat position
const cat_pos = { x: (WIDTH / 2), y: (HEIGHT / 2) - 32 };

// Bubble constants
const BUBBLE_ANIMATION_DURATION = 200;
const BUBBLE_WIDTH = 120;
const BUBBLE_HEIGHT = 40;
const BUBBLE_X_OFFSET = 40;

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

const increaseBubbleCount = (count: number, cat: Cat) => {
    count++;
    if (count >= MIN_BUBBLE_COUNT) {
        cat.animationTime = CAT_ANIMATION_DURATION;
        count = 0;
    }

    return count;
}

const sketch = (p: p5) => {
    let sittingCat: p5.Image;
    let movingCat1: p5.Image;
    let movingCat2: p5.Image;
    let movingCat3: p5.Image;

    // Cat animation variables
    let cat : Cat = {
        animated: false,
        currentFrame: 0,
        frameCount: 0,
        animationTime: 0,
    }

    // Bubble animation variables
    let bubbleCount = 0;

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

    // Key presses variables
    let upActive = false;
    let leftActive = false;
    let rightActive = false;
    let downActive = false;

    p.preload = () => {
        sittingCat = p.loadImage(cat1);
        movingCat1 = p.loadImage(cat2);
        movingCat2 = p.loadImage(cat3);
        movingCat3 = p.loadImage(cat4);
    };

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
    };

    p.draw = () => {
        // Draw bubble when pressing up
        if (PLAYER_1.DPAD.up) {
            upBubble.durationRemaining = BUBBLE_ANIMATION_DURATION;
            upActive = true
        } else {
            // release the key
            if (upActive) {
                bubbleCount = increaseBubbleCount(bubbleCount, cat);
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
                bubbleCount = increaseBubbleCount(bubbleCount, cat);
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
                bubbleCount = increaseBubbleCount(bubbleCount, cat);
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
                bubbleCount = increaseBubbleCount(bubbleCount, cat);
                downActive = false
            }
        }

        // Cat Animation
        if (cat.animationTime > 0) {
            cat.animated = true;
            cat.animationTime--;
        } else {
            cat.frameCount = 0;
            cat.animated = false
        }

        // Choose cat image
        let currentCatImage = sittingCat;
        if (cat.animated) {
            cat.frameCount++;
            if (cat.frameCount == ANIMATION_FRAMES) {
                cat.currentFrame = (cat.currentFrame + 1) % 4;
                cat.frameCount = 0;
            }

            switch (cat.currentFrame) {
                case 0:
                    currentCatImage = sittingCat;
                    break;
                case 1:
                    currentCatImage = movingCat1;
                    break; 
                case 2:
                    currentCatImage = movingCat2;
                    break;
                case 3:
                    currentCatImage = movingCat3;
                    break;
            }
        }

        // Draw background
        p.background(200, 240, 120);

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
