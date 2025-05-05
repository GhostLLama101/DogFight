class GameScene extends Phaser.Scene {
    //points = []; // this is to make the pass for the enemy dive movement
    flybyActive;
    counterfordive = 0;
    VformationFlyby;
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
        this.enemySpeeds = {
            enemy: 4,
            enemy1: 4,
            enemy2: 4,
            enemy3: 4
        };

        this.flybyActive = true; 
        this.VformationFlyby = false; 
        this.wave3Initialized = false; 
        this.wave3Active = false;

        this.score = 0; 
        this.currentWave = 1;
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
       
        const w = this.scale.width /5;
        const h = this.scale.height/40;
        this.preloadtext = this.add
            .text(w, h, 'Score ' + this.score,{
                fontFamily: 'midFont',
                fontSize: '20px', 
                fill: '#ffffff', 

            })
            .setOrigin(0.5);
    
        }


    create() {

        this.player = new Player(this);
        
        this.Player1 = this.add
            .text(100, 20, '1Player',{
                fontFamily: 'midFont',
                fontSize: '20px', 
                fill: '#ffffff', 

            })
            .setOrigin(0.5);

        this.myScore = this.add
            .text(180, 40, '0',{
                fontFamily: 'midFont',
                fontSize: '20px', 
                fill: '#ffffff', 
                align: 'right',

            })
            .setOrigin(1,0); 

        this.playerHealthText = this.add
            .text(50, this.scale.height - 50, 'Fuel ' 
                + this.player.playerHealth + '%',{
                fontFamily: 'midFont',
                fontSize: '15px', 
                fill: '#ffffff', 
                align: 'left',

            })
            .setOrigin(0, 1);

        this.waveText = this.add
            .text(120, this.scale.height - 30, 'Wave ' 
                + this.currentWave,{
                fontFamily: 'midFont',
                fontSize: '10px', 
                fill: '#d01a1a', 
                align: 'right',

            })
            .setOrigin(1, 1);

        this.preloadtext.destroy(); // Destroy the preload text after creating the score text
        //see if the preload text is still there
        console.log("Preload text still there: ", this.preloadtext.active);

        //this.myScore.setText("Score: " + this.score);

        // this.player = new Player(this);

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

        // subtract 10 from the enemy health

        enemy.destroy();
        projectile.destroy();
        this.score += 100; // Increase score by 10
        console.log("Score " + this.score);
        this.myScore.setText("" +this.score);
        // Remove from our tracking array
        const index = this.projectiles.indexOf(projectile);
        if (index > -1) {
            this.projectiles.splice(index, 1);
        }
        
    }

    playerHitByBullet(player, bullet) {
        player.playerHealth -= 10;
        console.log("Player hit by enemy bullet! Health: " + player.playerHealth);
        this.playerHealthText.setText("Fuel " + player.playerHealth + "%");
        if(player.playerHealth <= 0) {
            console.log("Player is dead!");
            // Handle player death (e.g., show game over screen, restart game, etc.)
            player.destroy();
            bullet.destroy(); // Destroy the bullet

        }
        bullet.destroy(); // Destroy the bullet  
    }

    // Function to handle player sprite hitting enemy
    playerHitEnemy(player, enemy) {
        player.playerHealth -= 10;
        console.log("Player collided with enemy!");
        console.log("Player fuel: " + player.playerHealth);
        this.playerHealthText.setText("Fuel " + player.playerHealth + "%");
        if(player.playerHealth <= 0) {
            console.log("Player is dead!");
            player.destroy();
            enemy.destroy();
        }
        enemy.destroy(); // Destroy the enemy
    }

    updateCurrentWave() {
        this.waveText.setText("Wave " + ++this.currentWave);
        return this.currentWave;
    }
    
    Wave1(){        
        // Move the enemy twards the player
        this.enemy.y += this.enemySpeeds.enemy;
        this.enemy1.y += this.enemySpeeds.enemy1;
        this.enemy2.y += this.enemySpeeds.enemy2;
        this.enemy3.y += this.enemySpeeds.enemy3;
        
        
        if (!this.enemy.active && !this.enemy1.active && !this.enemy2.active && !this.enemy3.active) {
            // All enemies are inactive, stop the flyby movement
            this.updateCurrentWave(); // Update the wave number
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

    dive() {
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

 
        if (this.enemy3.y > this.scale.height) {
            this.enemy3.destroy(); 
            this.flybyActive = true; 
        }

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
            v3enemy1: 2.5,
            v3enemy2: 2.5,
            v3enemy3: 2.5
        };

    }

    Wave2() {

        if (!this.v1enemy1?.active && !this.v1enemy2?.active && !this.v1enemy3?.active 
            && !this.v2enemy1?.active && !this.v2enemy2?.active && !this.v2enemy3?.active
            && !this.v3enemy1?.active && !this.v3enemy2?.active && !this.v3enemy3?.active) {
            // call the next wave
            this.updateCurrentWave(); // Update the wave number
            console.log("ended V formation flyby");
            this.VformationFlyby = false;
            return;
        }
        console.log("V formation flyby active");
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
            // Check if enemy exists and is active
            if (!enemy || !enemy.active) return;
        
            if (enemy.y >= this.scale.height - 50) {  // Bottom bounce
                enemy.flipY = false;  // Flip sprite when going up
                this.enemySpeeds[speedKey] = -Math.abs(this.enemySpeeds[speedKey]);
            } 
        
            // Destroy when going up past top boundary
            if (enemy.y <= -100 && !enemy.flipY) {
                console.log(`${speedKey} destroyed`);
                enemy.destroy();
            }
        };

        const tryShoot = (enemy) => {
            if (!enemy || !enemy.active || !this.player || !this.player.active) return;
            
            // Random chance to shoot (adjust 0.01 to control frequency)
            if (Math.random() < 0.01) {
                enemy.Shoot(this.player.x, this.player.y);
            }
        };

        // Try shooting for each enemy
        tryShoot(this.v1enemy1);
        tryShoot(this.v1enemy2);
        tryShoot(this.v1enemy3);

        tryShoot(this.v2enemy1);
        tryShoot(this.v2enemy2);
        tryShoot(this.v2enemy3);

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
    inWave3() {
        // enemybomber class.
        this.bomber1 = new enemyBomber(this);
        this.bomber2 = new enemyBomber(this);

        // create two big enemiese that fly scale to full size in left center and right center
        this.bomber1.setPosition(this.scale.width/4, (this.scale.height/2) + 100 );
        this.bomber2.setPosition(this.scale.width * 3/4, (this.scale.height/2) + 100 );

        // add the bombers to the enemy group for collision detection
        this.enemyGroup.add(this.bomber1);
        this.enemyGroup.add(this.bomber2);

        this.tweens.add({
            targets: [this.bomber1, this.bomber2], 
            scaleX: 4.5,  
            scaleY: 4.5,  
            duration: 3000, 
            ease: 'Cubic', 
            repeat: 0,
            yoyo: false,  
        });
        console.log(`Bomber1 ${this.bomber1.x}, ${this.bomber1.y} Bomber2 created`);

        this.bomberDirection = 1; // 1 for right, -1 for left
        this.bomberSpeed = 0.5; 

        this.wave3Active = true; 
        this.wave3Initialized = true; 
    }
    Wave3() {
        // Implement the third wave logic here
        console.log("Wave 3 active");
        
        if (!this.wave3Active) return;
    
        // Check if bombers still exist
        if (!this.bomber1?.active && !this.bomber2?.active) {
            console.log("Both bombers destroyed, ending wave 3");
            this.wave3Active = false;
            this.updateCurrentWave(); // Move to next wave if needed
            return;
        }
        
        // Move bombers to target Y position first
        const moveToTargetY = () => {
            let allAtTargetY = true;
            
            if (this.bomber1?.active && this.bomber1.y > 316) {
                this.bomber1.y -= 1;
                allAtTargetY = false;
            }
            
            if (this.bomber2?.active && this.bomber2.y > 316) {
                this.bomber2.y -= 1;
                allAtTargetY = false;
            }
            
            return allAtTargetY;
        };
        
        // If bombers haven't reached target Y position, move them there 
        if (!moveToTargetY()) {
            return; 
        }
        
        // Check if either bomber hits screen edge
        let hitEdge = false;
        
        if (this.bomber1?.active) {
            this.bomber1.x += this.bomberSpeed * this.bomberDirection;
            if (this.bomber1.x <= 50 || this.bomber1.x >= this.scale.width - 50) {
                hitEdge = true;
            }
        }
        
        if (this.bomber2?.active) {
            this.bomber2.x += this.bomberSpeed * this.bomberDirection;
            if (this.bomber2.x <= 50 || this.bomber2.x >= this.scale.width - 50) {
                hitEdge = true;
            }
        }
        
        // If either bomber hit the edge, change direction for both
        if (hitEdge) {
            this.bomberDirection *= -1; // Reverse direction
            console.log("Bombers changing direction");  
        }
    }


    endscene() {
        // Handle game over or end of scene logic here
        console.log("Game Over or Scene Ended");
        this.scene.start("GameOverScene"); // Example: transition to a Game Over scene
    }
    

    update() {

        if(this.flybyActive) {
            if(this.currentWave === 1) {
                this.Wave1();
            } 
        } else {
            this.dive();
        }
        
        if(this.currentWave === 2) {
            if (!this.v1enemy1) {
                this.createVFormations();
                this.VformationFlyby = true;
                console.log("V formation created");
            }
            
            if(this.VformationFlyby) {
                this.Wave2();
            }
            
        }

        if(this.currentWave === 3) {
            // Initialize Wave 3 once when entering wave 3
            if (!this.wave3Initialized) {
                this.inWave3();
            }
            if(this.wave3Active){
                this.Wave3();
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