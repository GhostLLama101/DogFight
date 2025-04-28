import GameScene from "./Scenes/Sprite.js";

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 500,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [GameScene],
    fps: { forceSetTimeOut: true, target: 60 }
    
}

// Global variable to hold sprites
var my = {sprite: {}};

const game = new Phaser.Game(config);
