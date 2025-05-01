class Enemy extends Phaser.Physics.Arcade.Sprite {
    // Speed of enemy bullets
    E_bullet_speed = 3; 
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

        // Track last time enemy fired
        this.lastFired = 0;
        this.fireRate = 2000; // Fire every 2 seconds
    }

    Shoot() {
        const currentTime = this.scene.time.now;
        
        // Check fire rate
        if (currentTime - this.lastFired < this.fireRate) return;
        
        // Create bullet
        const bullet = this.scene.physics.add.sprite(this.x, this.y + 20, 'bullets', 2);
        bullet.setScale(1.5);
        bullet.body.setSize(14, 14);
        
        // Add to enemy projectile group
        this.scene.enemyProjectileGroup.add(bullet);
        
        // If player exists, calculate angle to player
        if (this.scene.player && this.scene.player.active) {
            const angle = Phaser.Math.Angle.Between(
                this.x, 
                this.y, 
                this.scene.player.x, 
                this.scene.player.y
            );
            
            // Set bullet velocity towards player
            const speed = 100;
            this.scene.physics.velocityFromRotation(angle, speed, bullet.body.velocity);
        } else {
            // If no player, shoot straight down
            bullet.setVelocityY(this.E_bullet_speed * 60);
        }
        
        // Store bullet reference
        this.scene.enemyProjectiles.push(bullet);
        
        // Update last fired time
        this.lastFired = currentTime;
    }

    moveInFormation(speedX = 0, speedY = this.EnemySpeed) {
        this.y += speedY;
        this.x += speedX;
    }

    
}