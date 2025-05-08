class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }
    preload() {
        this.load.setPath("./assets/");
    }
    create() {
        this.add.text(this.scale.width / 2, 300, 'GAME OVER', {
            fontFamily: 'midFont',
            fontSize: '30px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        let finalScore = this.registry.get('finalScore') || 0;
    
        // Add score display
        this.add.text(this.scale.width / 2, 340, 'Score: ' + finalScore, {
            fontFamily: 'midFont',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 410, 'CREDITS', {
            fontFamily: 'midFont',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const rightMargin = this.scale.width - 400; // 20px from the right edge
        
        this.add.text(rightMargin, 450, 'Author by: SD', {
            fontFamily: 'midFont',
            fontSize: '10px',
            fill: '#ffffff'
        }).setOrigin(0, 1);

        this.add.text(rightMargin, 475, 'Assets by: Kenny and Artisan', {
            fontFamily: 'midFont',
            fontSize: '10px',
            fill: '#ffffff'
        }).setOrigin(0, 1);

        this.add.text(rightMargin, 500, 'Sounds by: Pixabay', {
            fontFamily: 'midFont',
            fontSize: '10px',
            fill: '#ffffff'
        }).setOrigin(0, 1);

        const startText = this.add.text(this.scale.width / 2, 550, 'Press SPACE to Restart', {
            fontFamily: 'midFont',
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);
  
        this.tweens.add({
            targets: startText,
            alpha: 0.2,
            duration: 800,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });
        
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }
    update() {
        if (this.spaceKey.isDown) {
            // Reset any global game state
            this.registry.set('finalScore', 0);
            // Start fresh GameScene
            this.scene.start('GameScene');
        }
    }

    HS(){
        //high score micanicks needs to be added eventualy.
    }
}