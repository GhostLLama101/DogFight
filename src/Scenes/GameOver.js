class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }
    preload() {
        this.load.setPath("./assets/");
    }
    creat() {
        this.add.text(this.scale.width / 2, 380, 'GAME OVER', {
            fontFamily: 'midFont',
            fontSize: '24px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 420, 'Score', {
            fontFamily: 'midFont',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        //add score text to update

        this.add.text(this.scale.width / 2, 450, 'CREDITS', {
            fontFamily: 'midFont',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 480, 'Author: SD', {
            fontFamily: 'midFont',
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        //add the credis stuff like author SD 
        //

        // Start game instruction
        const startText = this.add.text(this.scale.width / 2, 550, 'Press SPACE to Start', {
            fontFamily: 'midFont',
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);
  
        // Add blinking effect to the start text
        this.tweens.add({
            targets: startText,
            alpha: 0.2,
            duration: 800,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });
  
        // Space key to start the game
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }
    update() {
        if (this.spaceKey.isDown) {
            this.scene.start('GameScene');
        }
    }

    HS(){
        //high score micanicks needs to be added eventualy.
    }
}