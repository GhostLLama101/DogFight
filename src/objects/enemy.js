class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene) {
        super(scene, scene.E_startX, scene.E_startY, 'player', 9);
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        //flip the sprite to face the player
        this.flipY = true;
        this.setScale(2);
        this.body.setSize(25, 20);
    }

    update() {

    }
    // Function to handle enemy movement
}