class GameScene extends Phaser.Scene {
    constructor() {
        super("Sprite");
        this.startX = 400; // Default X position
        this.startY = 750; // Default Y position
        this.lastFired = 0; // Track last fired time
        this.fireRate = 250; // Fire rate in milliseconds
        
        this.enemyLastFired = 0;
        this.enemyFireRate = 2000;
    }
    
    preload() {
        // Set the path to your assets folder
        this.load.setPath("./assets/");
        // Load the sprite atlas
        this.load.spritesheet("player","ships.png", { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet("bullets","tiles.png", {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {

        this.player = new Player(this);

        // Create projectile group for collision detection
        this.projectileGroup = this.physics.add.group();
        this.projectiles = [];

        // Create separate group for enemy projectiles
        this.enemyProjectileGroup = this.physics.add.group();
        this.enemyProjectiles = [];  // Track enemy projectiles
        
        // Create enemy group to track all enemies
        this.enemyGroup = this.physics.add.group();
        
        //enemy start position
        this.enemyX = this.scale.width / 3;
        this.enemyY = (this.scale.height / 10) + 100; // Adjusted Y position for enemy

        // creates the initial enemy formation
        this.enemy = new Enemy(this);
        this.enemy.setPosition(this.enemyX, this.enemyY);
        
        this.enemy.Shoot();
        // Add to enemy group
        this.enemyGroup.add(this.enemy);
        console.log("enemy created");
        
        


        // Set up keyboard input
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        // Add overlap between projectiles and enemy
        this.physics.add.overlap(
            this.projectileGroup,
            this.enemyGroup,
            this.hitEnemy,
            null, 
            this
        );

        this.physics.add.overlap(
            this.player,
            this.enemyGroup, 
            this.playerHitEnemy, 
            null, 
            this
        );

        // Add collision between enemy projectiles and player
        this.physics.add.overlap(
            this.enemyProjectileGroup,
            this.player,
            this.playerHitByBullet,
            null,
            this
        );

    }
    // Function to handle projectile hitting enemy
    hitEnemy(enemy, projectile) {
        console.log("Enemy hit by projectile!");
        // Destroy the projectile when it hits
        enemy.destroy();
        projectile.destroy();
        
        // Remove from our tracking array
        const index = this.projectiles.indexOf(projectile);
        if (index > -1) {
            this.projectiles.splice(index, 1);
        }
        
    }

    playerHitByBullet(player, bullet) {
        console.log("Player hit by enemy bullet!");
        player.destroy();
        bullet.destroy();
    }

    // Function to handle player hitting enemy
    playerHitEnemy(enemy, player) {
        console.log("Player collided with enemy!");
        enemy.destroy();
        player.destroy();
        
    }

    update() {
        // Make sure player exists before trying to control it
        if (!this.player || !this.player.active) return;
        
        // Handle "A" key (left movement)
        if (this.aKey.isDown) {
            this.player.MoveLeft();
        }

        // Handle "D" key (right movement)
        if (this.dKey.isDown) {
            this.player.MoveRight();
        }

        // fires full Auto
        if (this.spaceKey.isDown) {
            if (this.time.now - this.lastFired >= this.fireRate) {
                this.player.Shoot();
                this.lastFired = this.time.now; // Update last fired time
            }
            
        }

        if (this.enemy && this.enemy.active) {
            if (this.time.now - this.enemyLastFired >= this.enemyFireRate) {
                this.enemy.Shoot();
                this.enemyLastFired = this.time.now;
            }
        }

        // Update enemy projectiles
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            if (this.enemyProjectiles[i] && this.enemyProjectiles[i].active) {
                this.enemyProjectiles[i].y += 5; // Adjust speed as needed
                
                // Remove enemy projectiles that go off screen
                if (this.enemyProjectiles[i].y > this.scale.height) {
                    this.enemyProjectiles[i].destroy();
                    this.enemyProjectiles.splice(i, 1);
                }
            }
        }

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].y -= this.player.p_bullet_speed;
            
            // Remove projectiles that go off screen
            if (this.projectiles[i].y < 0) {
                this.projectiles[i].destroy();
                this.projectiles.splice(i, 1);
                console.log("player bullet destroyed");
            }
        }
    }
}
