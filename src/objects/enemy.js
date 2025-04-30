class Enemy extends Phaser.Physics.Arcade.Sprite {
    // Speed of enemy bullets
    E_bullet_speed = 5; 
    EnemySpeed = 4; // Speed of enemy movement
    constructor(scene) {
        super(scene, scene.enemyX, scene.enemyY, 'player', 9);
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        //flip the sprite to face the player
        this.flipY = true;

        this.setScale(2);
        this.body.setSize(25, 20);


    }

    // Fire projectile when space is pressed
    Shoot() {
        const bullet = this.scene.add.sprite(this.x, this.y, 'bullets', 0); // Use appropriate frame
        this.scene.physics.add.existing(bullet);
        this.scene.enemyProjectileGroup.add(bullet);
        this.scene.enemyProjectiles.push(bullet);
    }

    
    // Function to handle enemy movement
}