class GameOverScene extends Phaser.Scene {
    constructor() {
      super("GameOverScene");
      this.gameOverText = "Game Over";
      this.restartText = "Press R to Restart";
      this.scoreText = "";
      this.finalScore = 0;
    }
  
    preload() {
      // Load any assets needed for the game over screen
    }
  
    init(data) {
      // Get the final score from the registry
      this.finalScore = this.registry.get('finalScore') || 0;
    }
  
    create() {
      // Set up the game over screen with proper positioning for 500x900 dimensions
      this.add.text(250, 300, this.gameOverText, { fontSize: '48px', fill: '#ff0000' }).setOrigin(0.5);
      this.add.text(250, 400, "Your Score: " + this.finalScore, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(250, 500, this.restartText, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      
      // Add input listener for restarting the game
      this.input.keyboard.once('keydown-R', () => {
        console.log("Restarting game...");
        
        // Reset game registry data
        this.registry.set('finalScore', 0);
        
        // Stop this scene
        this.scene.stop('GameOverScene');
        
        // Start the game scene fresh
        this.scene.start('GameScene');
      });
    }
  }