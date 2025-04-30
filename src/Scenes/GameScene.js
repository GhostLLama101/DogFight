class GameScene extends Phaser.Scene {
    points = []; // this is to make the pass for the enemy dive movement
    flybyActive;
    counterfordive = 0; // Counter for the dive movement
    constructor() {
        super("Sprite");
        this.startX = 400; // Default X position
        this.startY = 750; // Default Y position
        this.lastFired = 0; // Track last fired time
        this.fireRate = 250; // Fire rate in milliseconds
        
        this.enemyLastFired = 0;
        this.enemyFireRate = 2000;
        this.enemyFireSpeed = 5;
        
        //this.enemyMoveDirection = 1; // 1 for right, -1 for left
        this.enemySpeeds = {
            enemy: 4,
            enemy1: 4,
            enemy2: 4,
            enemy3: 4
        };

        this.flybyActive = true; // Flag to control flyby movement
        
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


         // Enemy formation configuration
        const formation = [
            { x: 50, y: 50 },
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 150, y: -50 }
        ];

        // Create enemies using loop
        formation.forEach(pos => {
            const enemy = new Enemy(this);
            enemy.setPosition(this.enemyX + pos.x, this.enemyY + pos.y);
            this.enemyGroup.add(enemy);
        });
        
        
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

    flyby() {
        this.enemyGroup.getChildren().forEach((enemy, index) => {
            enemy.y += this.enemySpeeds.enemy;
            
            // Handle bounds
            if (enemy.y >= this.scale.height - 30) {
                enemy.flipY = false;
                this.enemySpeeds.enemy = -Math.abs(this.enemySpeeds.enemy);
            }
            if (enemy.y <= this.scale.height / 10) {
                enemy.flipY = true;
                this.enemySpeeds.enemy = Math.abs(this.enemySpeeds.enemy);
            }
        });
    }

    // this is the dive movement for the enemy
    // us the code from create path to make the dive movement
    dive() {
        // Create enemyShip as a follower type of sprite
        this.enemy3 = this.add.follower(this.curve, 10, 10, "enemyShip");

        // In the update method, when R key is pressed and runMode is activated:
        if(this.curve.points.length > 0) {
            this.runMode = true;
            this.enemy3.setPosition(this.curve.points[0].x, this.curve.points[0].y);
            this.enemy3.visible = true;
            this.enemy3.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: 2000,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: false,
                rotateToPath: true,
                rotationOffset: -90
            });
        }
    }


    update() {
        // start the dive of enemy2
        if(this.flybyActive) {
            this.flyby();
            
            // Check if any enemy has reached the trigger point
            this.enemyGroup.getChildren().forEach(enemy => {
                if(enemy.y >= 316) {
                    this.counterfordive += 1;
                    
                    if(this.counterfordive >= 3) {
                        this.counterfordive = 0;
                        this.flybyActive = false;
                        this.dive();
                    }
                }
            });
        }
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
