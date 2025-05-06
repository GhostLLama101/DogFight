class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
    }
  
    preload() {
        // Set the path to your assets folder
        this.load.setPath("./assets/");
        
        // Load the sprite atlas if not already loaded
        this.load.spritesheet("player", "ships.png", { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        
        this.load.spritesheet("bullets", "tiles.png", {
            frameWidth: 16,
            frameHeight: 16
        });
  
        this.load.spritesheet("clouds","Clouds V2.png", {
              frameWidth: 67,
              frameHeight: 50
        });
    }
  
    create() {
        // Create clouds first so they appear in the background
        this.cameras.main.setBackgroundColor('#4dadde');
        
        this.createBackgroundClouds();
        
        // Title text
        this.add.text(this.scale.width / 2, 100, 'DOGFIGHT', {
            fontFamily: 'midFont',
            fontSize: '40px',
            fill: '#ffffff'
        }).setOrigin(0.5);
  
        // Add player ship for decoration
        const playerShip = this.add.sprite(this.scale.width / 2, 200, 'player', 10);
        playerShip.setScale(3);
        
        // Add enemy ship for decoration
        const enemyShip = this.add.sprite(this.scale.width / 2, 300, 'player', 9);
        enemyShip.setScale(2);
        enemyShip.flipY = true;
  
        // Controls section
        this.add.text(this.scale.width / 2, 380, 'CONTROLS', {
            fontFamily: 'midFont',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
  
        // Movement controls
        this.add.text(this.scale.width / 2, 430, 'A - Move Left', {
            fontFamily: 'midFont',
            fontSize: '18px',
            fill: '#ffffff'
        }).setOrigin(0.5);
  
        this.add.text(this.scale.width / 2, 460, 'D - Move Right', {
            fontFamily: 'midFont',
            fontSize: '18px',
            fill: '#ffffff'
        }).setOrigin(0.5);
  
        this.add.text(this.scale.width / 2, 490, 'SPACE - Shoot', {
            fontFamily: 'midFont',
            fontSize: '18px',
            fill: '#ffffff'
        }).setOrigin(0.5);
  
        // Start game instruction
        const startText = this.add.text(this.scale.width / 2, 550, 'Press SPACE to Start', {
            fontFamily: 'midFont',
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);
  
        // Add blinking effect to the start text
        this.tweens.add({
            targets: startText,
            alpha: 0.2,
            duration: 800,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });
  
        // Space key to start the game
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
  
    createBackgroundClouds() {
        // Create a container for clouds
        this.cloudsContainer = this.add.container(0, 0);
        
        // Create a group of clouds with different sizes and speeds
        this.clouds = [];
        
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(0, this.scale.height);
            const scale = Phaser.Math.FloatBetween(1.0, 3.0);
            const speed = Phaser.Math.FloatBetween(0.3, 1.0);
            const frame = Phaser.Math.Between(0, 5); // Assuming there are frames 0-5 in the spritesheet
            
            // Create cloud sprite
            const cloud = this.add.sprite(x, y, "clouds", frame);
            cloud.setScale(scale);
            cloud.setAlpha(0.5); // Make clouds semi-transparent
            
            // Add cloud to the container
            this.cloudsContainer.add(cloud);
            
            this.clouds.push({
                obj: cloud,
                speed: speed
            });
        }
        
        // Move the container to the back
        this.cloudsContainer.setDepth(-1);
    }
  
    update() {
        // Check if space key was pressed to start the game
        if (this.spaceKey.isDown) {
            this.scene.start('GameScene');
        }
        
        // Update the clouds movement
        for (const cloud of this.clouds) {
            cloud.obj.y += cloud.speed;
            
            // If cloud goes off screen, reset to top
            if (cloud.obj.y > this.scale.height) {
                cloud.obj.y = -50; // Start just above the top of the screen
                cloud.obj.x = Phaser.Math.Between(0, this.scale.width);
            }
        }
    }
  }