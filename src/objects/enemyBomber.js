class enemyBomber extends Phaser.Physics.Arcade.Sprite {
    E_bullet_speed = 3; 
    EnemySpeed = 1; // Speed of enemy movement

    constructor(scene) {
        super(scene, scene.enemyX, scene.enemyY, 'player', 2);
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        //flip the sprite to face the player
        this.flipY = false;

        this.setScale(0.5);
        this.body.setSize(25, 20);

        // Track last time enemy fired
        this.lastFired = 0;
        this.fireRate = 2000; // Fire every 2 seconds

        this.bomberHealth = 100; // Set enemy health

    }
    shootSpread(){
        // shoot the bullets in a sprinkler pattern

    }
}