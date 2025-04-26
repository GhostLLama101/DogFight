class player extends Phaser.Scene {
    constructor() {
        super("Sprite");
        this.startX = 400; // Default X position
        this.startY = 750; // Default Y position

        //enemy start position
        this.E_startX = 400;
        this.E_startY = 100;
    }
    
    preload() {
        // Set the path to your assets folder
        this.load.setPath("./assets/");
        // Load the sprite atlas
        this.load.spritesheet("player" ,"ships.png", { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet("bullets", "tiles.png", {
            framwWidth: 16,
            frameWidth: 16
        });
    }

    create() {
        // Create the player sprite at the specified starting position
        this.playerSprite = this.add.sprite(this.startX, this.startY, "player", 10);
        this.physics.add.existing(this.playerSprite);
        this.playerSprite.setScale(2);
        this.playerSprite.body.setSize(15,15);

        //create the enemey.
        this.enemySprite = this.add.sprite(this.E_startX,this.E_startY, "player", 9);
        this.enemySprite.flipY = true;
        this.physics.add.existing(this.enemySprite);
        this.enemySprite.setScale(2);
        this.enemySprite.body.setSize(25,20);


        // Set up keyboard input
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);



        //collision handling
        this.projectileGroup = this.physics.add.group();

        // Add overlap between projectiles and enemy
        this.physics.add.overlap(this.projectileGroup, this.enemySprite, this.hitEnemy, null, this);

        this.physics.add.overlap(this.playerSprite, this.enemySprite, this.playerHitEnemy, null, this);

        this.p_bullet_speed = 10; // fast bullet is 15

        // Track emitted projectiles
        this.projectiles = [];

        this.physics.world.createDebugGraphic();

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
        
        // Here you could also:
        // - Decrease enemy health
        // - Play a hit animation
        // - Add score
        // - Destroy the enemy if health reaches zero
    }

     // Function to handle player hitting enemy
     playerHitEnemy(enemy, player) {
        console.log("Player collided with enemy!");
        enemy.destroy();
        player.destroy();
        
    }

    update() {
        // Handle "A" key (left movement)
        if (this.aKey.isDown) {
            this.playerSprite.x -= 3;
            if (this.playerSprite.x <= 0) this.playerSprite.x = 10; // Prevent moving out of bounds
        }
        
        // Handle "D" key (right movement)
        if (this.dKey.isDown) {
            this.playerSprite.x += 3;
            if (this.playerSprite.x >= 450) this.playerSprite.x = 470; // Adjust for world bounds
        }

        // Optional: Make enemy move toward player
        // Uncomment to enable enemy following player
        // if (this.playerSprite.x < this.enemySprite.x) {
        //     this.enemySprite.x -= 1;
            
        // } else if (this.playerSprite.x > this.enemySprite.x) {
        //     this.enemySprite.x += 1;
            
        // }
        // else {
        //     this.enemySprite.y +=1;
        // }

        // Fire projectile when space is pressed
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            let emitted = this.physics.add.sprite(this.playerSprite.x, this.playerSprite.y - 50, "bullets", 1);
            emitted.setScale(1.5); // Scale projectiles
            
            // Set projectile hitbox size
            emitted.body.setSize(14, 14);
            
            // Add to projectile group for collision detection
            this.projectileGroup.add(emitted);
            
            // Store reference in our array for movement updates
            this.projectiles.push(emitted);
        }
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].y -= this.p_bullet_speed;
            
            // Remove projectiles that go off screen
            if (this.projectiles[i].y < 0) {
                this.projectiles[i].destroy();
                this.projectiles.splice(i, 1);
                console.log("player bullet destroyed");
            }
        }
    }
}
