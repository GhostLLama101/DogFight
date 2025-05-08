class enemyBomber extends Phaser.Physics.Arcade.Sprite {
    E_bullet_speed = 3; 
    EnemySpeed = 1; // Speed of enemy movement

    constructor(scene, health = 1000) {
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
        this.fireRate = 50; // Fire every 2 seconds

        this.maxHealth = health;
        this.currentHealth = health; 

    }

    takeDamage(Amount){
        this.currentHealth -=  Amount;

        if(this.currentHealth <= 0 ) {
            return true;
        }
        return false;

    }
    Shoot() {
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastFired < this.fireRate) return;
        const bullet = this.scene.physics.add.sprite(this.x, this.y + 20, 'bullets', 2);
        bullet.setScale(1.5);
        bullet.body.setSize(14, 14);
        this.scene.enemyProjectileGroup.add(bullet);
        
        // If player exists, calculate angle to player
        if (this.scene.player && this.scene.player.active) {
            const angle = Phaser.Math.Angle.Between(
                this.x, 
                this.y, 
                this.scene.player.x, 
                this.scene.player.y
            );
            const speed = 100;
            this.scene.physics.velocityFromRotation(angle, speed, bullet.body.velocity);
        } else {
            bullet.setVelocityY(this.E_bullet_speed * 60);
        }
        this.scene.enemyProjectiles.push(bullet);
        this.lastFired = currentTime;
    }
    //shootspead() {}
}