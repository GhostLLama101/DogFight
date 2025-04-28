class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene) {
        super(scene, scene.scale.width/2, scene.scale.height - 32, 'player', 0);
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        

        // Set scale and hitbox size
        this.setScale(2);
        this.body.setSize(15, 15);

        // this.playerSprite = this;

        // // Track emitted projectiles
        // this.projectiles = [];
        this.p_bullet_speed = 10; // fast bullet is 15


        
    }
    MoveLeft(){
        this.x -= 3;
        if (this.x <= 0) this.x = 10; // Prevent moving out of bounds
    }
    
    MoveRight(){
        this.x += 3;
        if (this.x >= 450) this.x = 470; // Adjust for world bounds
    }

    // Fire projectile when space is pressed
    Shoot() {
        const bullet = this.physics.add.sprite(this.x, this.y - 50, "bullets", 1);
        bullet.setScale(1.5); // Scale projectiles
        bullet.body.setSize(14, 14);
        
        // Add to projectile group for collision detection
        this.scene.projectileGroup.add(bullet);
        
        // Store reference in our array for movement updates
        this.scene.projectiles.push(bullet);
    }
    // Update() {
    //     // Update projectiles
    //     for (let i = this.projectiles.length - 1; i >= 0; i--) {
    //         this.projectiles[i].y -= this.p_bullet_speed;
            
    //         // Remove projectiles that go off screen
    //         if (this.projectiles[i].y < 0) {
    //             this.projectiles[i].destroy();
    //             this.projectiles.splice(i, 1);
    //             console.log("player bullet destroyed");
    //         }
    //     }
    // }
}