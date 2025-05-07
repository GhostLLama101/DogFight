class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene) {
        super(scene, scene.scale.width/2, scene.scale.height - 100, 'player', 10);
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.playerHealth = 100; // Set player health

        // Set scale and hitbox size
        this.setScale(2);
        this.body.setSize(25, 15);

        // fast bullet is 15
        this.p_bullet_speed = 15;
        this.playerSpeed = 7;
        
    }
    MoveLeft(){
        this.x -= this.playerSpeed;
        if (this.x <= 0) this.x = 0;
    }
    
    MoveRight(){
        this.x += this.playerSpeed;
        if (this.x >= this.scene.scale.width - 30) this.x = this.scene.scale.width - 30; 
    }

    Shoot() {
        const bullet = this.scene.physics.add.sprite(this.x, this.y - 50, "bullets", 1);
        bullet.setScale(1.5); 
        bullet.body.setSize(14, 14);
        this.scene.projectileGroup.add(bullet);
        this.scene.projectiles.push(bullet);

        this.scene.sound.play('bulletSound', { 
            mute: false,
            volume: 0.3,
            rate: 1,
            detune: 0,
            seek: 1.2,
            loop: false,
            delay: 0,
         });
        console.log("Bullet created at position:", bullet.x, bullet.y);
    }

    HealthCheck() {
        if (this.playerHealth <= 0) {
            console.log("Player is dead!");
            this.scene.gameOver = true; // Set game over state
        } else {
            console.log("Player health:", this.playerHealth);
        }
    }
    
}