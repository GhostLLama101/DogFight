class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene) {
        super(scene, scene.scale.width/2, scene.scale.height - 32, 'player', 10);
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        

        // Set scale and hitbox size
        this.setScale(2);
        this.body.setSize(15, 15);

        this.p_bullet_speed = 10; // fast bullet is 15
        
    }
    MoveLeft(){
        this.x -= 3;
        if (this.x <= 0) this.x = 10; // Prevent moving out of bounds
    }
    
    MoveRight(){
        this.x += 3;
        if (this.x >= this.scene.scale.width - 30) this.x = this.scene.scale.width - 30; // Adjust for world bounds
    }

    // Fire projectile when space is pressed
    Shoot() {
        const bullet = this.scene.physics.add.sprite(this.x, this.y - 50, "bullets", 1);
        bullet.setScale(1.5); // Scale projectiles
        bullet.body.setSize(14, 14);
        
        // Add to projectile group for collision detection
        this.scene.projectileGroup.add(bullet);
        
        // Store reference in our array for movement updates
        this.scene.projectiles.push(bullet);

        console.log("Bullet created at position:", bullet.x, bullet.y);
    }
}