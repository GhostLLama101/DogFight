class GameScene extends Phaser.Scene {
    //points = []; // this is to make the pass for the enemy dive movement
    flybyActive;
    counterfordive = 0;

    enemyTriggeredZone = false;
    
    constructor() {
        super("Sprite");
        this.startX = 400; // Default X position
        this.startY = 750; // Default Y position
        this.lastFired = 0; // Track last fired time
        this.fireRate = 250; // Fire rate in milliseconds
        
        this.enemyLastFired = 0;
        this.enemyFireRate = 500;
        this.enemyFireSpeed = 5;
        this.enemyMoveSpeed = 2; // Speed of enemy movement
        //this.enemyMoveDirection = 1; // 1 for right, -1 for left
        this.enemySpeeds = {
            enemy: 4,
            enemy1: 4,
            enemy2: 4,
            enemy3: 4
        };

        this.flybyActive = true; // Flag to control flyby movement
        this.currentWave = 1; // Track the current wave of enemies
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

        this.enemy.setPosition(this.enemyX + 50, this.enemyY -150);
        this.enemy1.setPosition(this.enemyX, this.enemyY-200);
        this.enemy2.setPosition(this.enemyX + 100, this.enemyY-200);
        this.enemy3.setPosition(this.enemyX + 150 , this.enemyY - 250);
        
        
       
        // Add to enemy group
        this.enemyGroup.add(this.enemy);
        this.enemyGroup.add(this.enemy1);
        this.enemyGroup.add(this.enemy2);
        this.enemyGroup.add(this.enemy3);
        

        //_________________________________________________________________________________//
        // Set up keyboard input
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Create dive trigger zone
        this.diveTrigger = this.add.zone(this.scale.width / 2, 316, this.scale.width, 10);
        this.physics.world.enable(this.diveTrigger); // Enable physics on the zone
        this.diveTrigger.body.setAllowGravity(false);
        this.diveTrigger.body.moves = false;
        
        // Add overlap detection between enemy3 and dive trigger
        this.physics.add.overlap(
            this.enemy3,
            this.diveTrigger,
            this.handleDiveTrigger,
            null,
            this
        );

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
    handleDiveTrigger() {
        if(!this.enemyTriggeredZone) {
            this.counterfordive += 1;
            this.enemyTriggeredZone = true;

            console.log("enemy3 x position: " + this.enemy3.x);
            console.log("enemy3 y position: " + this.enemy3.y);
            console.log("Counter for dive: " + this.counterfordive);

            if(this.counterfordive >= 3) {
                this.counterfordive = 0;
                this.flybyActive = false; // Stop flyby movement
            }
        }
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
    
    flyby(){        
        // Move the enemy twards the player
        this.enemy.y += this.enemySpeeds.enemy;
        this.enemy1.y += this.enemySpeeds.enemy1;
        this.enemy2.y += this.enemySpeeds.enemy2;
        this.enemy3.y += this.enemySpeeds.enemy3;
        
        
        if (!this.enemy.active && !this.enemy1.active && !this.enemy2.active && !this.enemy3.active) {
            // All enemies are inactive, stop the flyby movement
            this.currentWave = 2; // Switch to V formation
            this.flybyActive = false; // Stop flyby movement
            console.log("All enemies are inactive, stopping flyby movement.");

            return;
        }
        // Handle enemy movement bounds
        const checkBounds = (enemy, speedKey) => {
        if (enemy.y >= this.scale.height) {
            enemy.flipY = false;
            this.enemySpeeds[speedKey] = -Math.abs(this.enemySpeeds[speedKey]);

            if (enemy === this.enemy3) {
                this.enemyTriggeredZone = false;
            }
        }
        if (enemy.y <= 10) {
            enemy.flipY = true;
            this.enemySpeeds[speedKey] = Math.abs(this.enemySpeeds[speedKey]);

            if (enemy === this.enemy3) {
                this.enemyTriggeredZone = false;
            }
        }
    };

        // Check bounds for each enemy
        checkBounds(this.enemy, 'enemy');
        checkBounds(this.enemy1, 'enemy1');
        checkBounds(this.enemy2, 'enemy2');
        checkBounds(this.enemy3, 'enemy3');
    }
    createVFormations() {
        //first V formation
        this.v1enemy1 = new Enemy(this);
        this.v1enemy2 = new Enemy(this);
        this.v1enemy3 = new Enemy(this);

        //Second V formation
        this.v2enemy1 = new Enemy(this);
        this.v2enemy2 = new Enemy(this);
        this.v2enemy3 = new Enemy(this);


        this.v3enemy1 = new Enemy(this);
        this.v3enemy2 = new Enemy(this);
        this.v3enemy3 = new Enemy(this);

        this.v1enemy1.setPosition(this.scale.width/4, -50); // Lead enemy
        this.v1enemy2.setPosition(this.scale.width/4 - 50, -100); // Left wing
        this.v1enemy3.setPosition(this.scale.width/4 + 50, -100); // Right wing
        
        // Position second V formation
        this.v2enemy1.setPosition(this.scale.width * 3/4, -150); // Lead enemy
        this.v2enemy2.setPosition(this.scale.width * 3/4 - 50, -200); // Left wing
        this.v2enemy3.setPosition(this.scale.width * 3/4 + 50, -200); // Right wing
        
        this.v3enemy1.setPosition(this.scale.width/2, -50); // Lead enemy
        this.v3enemy2.setPosition(this.scale.width/2 - 50, -100); // Left wing
        this.v3enemy3.setPosition(this.scale.width/2 + 50, -100); // Right wing
        // Add all new enemies to the enemy group
        this.enemyGroup.add(this.v1enemy1);
        this.enemyGroup.add(this.v1enemy2);
        this.enemyGroup.add(this.v1enemy3);
        this.enemyGroup.add(this.v2enemy1);
        this.enemyGroup.add(this.v2enemy2);
        this.enemyGroup.add(this.v2enemy3);
        this.enemyGroup.add(this.v3enemy1);
        this.enemyGroup.add(this.v3enemy2);
        this.enemyGroup.add(this.v3enemy3);

        this.enemySpeeds = {
            v1enemy1: 3,
            v1enemy2: 3,
            v1enemy3: 3,
            v2enemy1: 3,
            v2enemy2: 3,
            v2enemy3: 3,
            v3enemy1: 3,
            v3enemy2: 3,
            v3enemy3: 3
        };

    }
    vFormationFlyby() {
        // Move the enemies in a V formation towards the player
        this.v1enemy1.y += this.enemySpeeds.v1enemy1;
        this.v1enemy2.y += this.enemySpeeds.v1enemy2;
        this.v1enemy3.y += this.enemySpeeds.v1enemy3;
        
        this.v2enemy1.y += this.enemySpeeds.v2enemy1;
        this.v2enemy2.y += this.enemySpeeds.v2enemy2;
        this.v2enemy3.y += this.enemySpeeds.v2enemy3;

        this.v3enemy1.y += this.enemySpeeds.v3enemy1;
        this.v3enemy2.y += this.enemySpeeds.v3enemy2;
        this.v3enemy3.y += this.enemySpeeds.v3enemy3;

        // Check bounds for each enemy in the V formation
        const checkBounds = (enemy, speedKey) => {
            if (enemy.y >= this.scale.height) {
                enemy.flipY = false;
                this.enemySpeeds[speedKey] = -Math.abs(this.enemySpeeds[speedKey]);
            } 
            if (enemy.y <= 10) {
                enemy.destroy(); // Destroy the enemy if it goes off-screen
            }
        };

        // Check bounds for each enemy in the V formation
        checkBounds(this.v1enemy1, 'v1enemy1');
        checkBounds(this.v1enemy2, 'v1enemy2');
        checkBounds(this.v1enemy3, 'v1enemy3');
        
        checkBounds(this.v2enemy1, 'v2enemy1');
        checkBounds(this.v2enemy2, 'v2enemy2');
        checkBounds(this.v2enemy3, 'v2enemy3');

        checkBounds(this.v3enemy1, 'v3enemy1');
        checkBounds(this.v3enemy2, 'v3enemy2');
        checkBounds(this.v3enemy3, 'v3enemy3');
    }
    
    // make the enemy dive down and shoot at the player
    dive() {

        // add to check if the enemy is active
        if (!this.enemy3.active) {
            this.flybyActive = true; 
            return;
        }

        if(this.enemy3.y < this.scale.height + 100) {
            this.enemy3.y += this.enemyMoveSpeed * 2; 
            this.enemy3.x -= this.enemyMoveSpeed; 
            
            if (this.time.now - this.enemyLastFired >= this.enemyFireRate) {
                this.enemy3.Shoot();
                this.enemyLastFired = this.time.now;
            }
            console.log("enemy3 diving diagonally");
        }

        // add code to return the enemy by flying it in from the top of the screen to its original position

        // Check if the enemy is off-screen
        if (this.enemy3.y > this.scale.height) {
            this.enemy3.destroy(); 
            this.flybyActive = true; 
        }

    }

    update() {

        if(this.flybyActive) {
            if(this.currentWave === 1) {
                this.flyby();
            } 
        } else {
            this.dive();
        }
        
        if(this.currentWave === 2) {
            if (!this.v1enemy1) {
                this.createVFormations();
            }
            else {
                this.vFormationFlyby();
            }
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
    }
}