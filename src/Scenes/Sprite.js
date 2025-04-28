import Player from "../objects/player"; // Adjust the path if necessary

export default class GameScene extends Phaser.Scene {
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

        const player = new Player(this);
        this.playerSprite = player.sprite; // Reference to the player sprite

        // Create projectile group for collision detection
        this.projectileGroup = this.physics.add.group();
        
        // Track emitted projectiles
        this.projectiles = [];

        // Create enemy group to track all enemies
        this.enemyGroup = this.physics.add.group();
        
        // Create row of enemies
        for(let i = 0; i < 400; i += 50 ) {
            let enemy = this.physics.add.sprite(this.E_startX - i, this.E_startY, "player", 9);
            enemy.flipY = true;
            enemy.setScale(2);
            enemy.body.setSize(25, 20);
            
            // Add to enemy group
            this.enemyGroup.add(enemy);
            console.log("enemy created");
        }


        // Set up keyboard input
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //collision handling
        this.projectileGroup = this.physics.add.group();

        // Add overlap between projectiles and enemy
        this.physics.add.overlap(this.projectileGroup, this.enemyGroup, this.hitEnemy, null, this);

        this.physics.add.overlap(this.playerSprite, this.enemyGroup, this.playerHitEnemy, null, this);


        
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
            this.player.moveLeft();
        }

        // Handle "D" key (right movement)
        if (this.dKey.isDown) {
            this.player.moveRight();
        }

        // Fire projectile when space is pressed
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.player.shoot();
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
