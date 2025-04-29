class GameScene extends Phaser.Scene {
    constructor() {
        super("Sprite");
        this.startX = 400; // Default X position
        this.startY = 750; // Default Y position
        this.lastFired = 0; // Track last fired time
        this.fireRate = 250; // Fire rate in milliseconds
        
        this.enemyLastFired = 0;
        this.enemyFireRate = 2000;
        this.enemyFireSpeed = 5;
        this.enemyMoveSpeed = 2; // Speed of enemy movement
        //this.enemyMoveDirection = 1; // 1 for right, -1 for left
        this.enemySpeeds = {
            enemy: 2,
            enemy1: 2,
            enemy2: 2,
            enemy3: 2
        };
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

        //_________________________________ENEMY_________________________________________//


        // creates the initial enemy formation
        this.enemy = new Enemy(this);
        this.enemy1 = new Enemy(this);
        this.enemy2 = new Enemy(this);
        this.enemy3 = new Enemy(this);
        this.enemy.setPosition(this.enemyX + 50, this.enemyY + 50);
        this.enemy1.setPosition(this.enemyX, this.enemyY);
        this.enemy2.setPosition(this.enemyX + 150 , this.enemyY - 50);
        this.enemy3.setPosition(this.enemyX + 100, this.enemyY);
        
       
        // Add to enemy group
        this.enemyGroup.add(this.enemy);
        this.enemyGroup.add(this.enemy1);
        this.enemyGroup.add(this.enemy2);
        this.enemyGroup.add(this.enemy3);
        
        
        // this.enemy.Shoot();
        // this.enemy1.Shoot();
        // this.enemy2.Shoot();
        // this.enemy3.Shoot();

        //_________________________________________________________________________________//
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

    // flyby(){
    //     // Move the enemy twards the player
    //     this.enemy.y -= this.enemyMoveSpeed;

    //     if (this.enemy.y < this.scale.height / 10) {
    //         this.enemy.y += this.enemyMoveSpeed; // Prevent moving out of bounds
    //     } else {

    //         this.enemy.x += this.enemyMoveSpeed;
    //     }

    // }
    
    flyby(){
        // Move the enemy twards the player
        this.enemy.y += this.enemySpeeds.enemy;
        this.enemy1.y += this.enemySpeeds.enemy1;
        this.enemy2.y += this.enemySpeeds.enemy2;
        this.enemy3.y += this.enemySpeeds.enemy3;
        
        // Handle enemy movement bounds
        const checkBounds = (enemy, speedKey) => {
        if (enemy.y >= this.scale.height - 30) {
            enemy.flipY = false;
            this.enemySpeeds[speedKey] = -Math.abs(this.enemySpeeds[speedKey]);
        }
        if (enemy.y <= this.scale.height / 10) {
            enemy.flipY = true;
            this.enemySpeeds[speedKey] = Math.abs(this.enemySpeeds[speedKey]);
        }
    };

        // Check bounds for each enemy
        checkBounds(this.enemy, 'enemy');
        checkBounds(this.enemy1, 'enemy1');
        checkBounds(this.enemy2, 'enemy2');
        checkBounds(this.enemy3, 'enemy3');
    }


    update() {

        this.flyby();
        
        
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
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].y -= this.player.p_bullet_speed;
            
            // Remove projectiles that go off screen
            if (this.projectiles[i].y < this.scale.height / 10) {
                this.projectiles[i].destroy();
                this.projectiles.splice(i, 1);
                console.log("player bullet destroyed");
            }
        }

        // Update enemy projectiles
        // for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
        //     this.enemyProjectiles[i].y += this.enemyFireSpeed;
            
        //     // Remove projectiles that go off screen
        //     if (this.enemyProjectiles[i].y > this.scale.height) {

        //         this.enemyProjectiles[i].destroy();
        //         this.enemyProjectiles.splice(i, 1);
        //         console.log("enemy bullet destroyed");
        //     }
        // }
    }
}
