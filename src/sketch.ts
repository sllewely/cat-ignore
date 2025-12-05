import p5 from "p5";

import { PLAYER_1, SYSTEM } from "@rcade/plugin-input-classic";

// Rcade game dimensions
const WIDTH = 336;
const HEIGHT = 262;

let spritesheet: p5.Image;


const sketch = (p: p5) => {
    let x: number;
    let y: number;
    const speed = 4;
    const ballSize = 20;
    let gameStarted = false;

    p.preload = () => {
        // let explode_sprite_sheet = loadSpriteSheet('../assets/Catthwap.png', 64, 64, 4);
        spritesheet = p.loadImage('../assets/Catthwap.png');
    };

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
        x = WIDTH / 2;
        y = HEIGHT / 2;
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

        // Handle input from arcade controls
        if (PLAYER_1.DPAD.up) {
            y -= speed;
        }
        if (PLAYER_1.DPAD.down) {
            y += speed;
        }
        if (PLAYER_1.DPAD.left) {
            x -= speed;
        }
        if (PLAYER_1.DPAD.right) {
            x += speed;
        }

        // Keep ball in bounds
        x = p.constrain(x, ballSize / 2, WIDTH - ballSize / 2);
        y = p.constrain(y, ballSize / 2, HEIGHT - ballSize / 2);

        // Draw ball (change color when A is pressed)
        if (PLAYER_1.A) {
            p.fill(255, 100, 100);
        } else if (PLAYER_1.B) {
            p.fill(100, 255, 100);
        } else {
            p.fill(100, 200, 255);
        }
        p.noStroke();
        p.ellipse(x, y, ballSize, ballSize);
    };
};

new p5(sketch, document.getElementById("sketch")!);
