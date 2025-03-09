import { GameConfig } from "../config/GameConfig";

/**
 * Represents a player character in the game.
 * The `Player` class extends the `Phaser.Physics.Arcade.Sprite` class and
 * handles the creation and configuration of the player's sprite and physics
 * properties.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
    /**
     * Constructs a new Player instance in the given scene at the specified coordinates.
     * This method creates the player texture if it doesn't already exist, and configures
     * the player's physics properties such as collision with world bounds, damping, and drag.
     *
     * @param {Phaser.Scene} scene - The scene in which to create the player.
     * @param {number} x - The x-coordinate of the player's initial position.
     * @param {number} y - The y-coordinate of the player's initial position.
     */
    constructor(scene, x, y) {
        Player.createPlayerTexture(scene);
        
        super(scene, x, y, 'playerSprite');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configure physics
        this.setCollideWorldBounds(true);
        this.setDamping(true);
        this.setDrag(0.9);
        
        // Health system
        this.health = GameConfig.player.health || 3;
        this.maxHealth = GameConfig.player.health || 3;
        this.invulnerable = false;
        this.invulnerabilityTime = 1000; // ms
        
        // Create health display
        this.invulnerabilityTime = GameConfig.player.invulnerability.duration;
        this.createHealthDisplay();
    }
    
    createHealthDisplay() {
        const healthConfig = GameConfig.ui.healthDisplay;
        this.healthDisplay = [];
        for (let i = 0; i < this.maxHealth; i++) {
            const heart = this.scene.add.rectangle(
                healthConfig.x + (i * healthConfig.spacing), 
                healthConfig.y, 
                healthConfig.size, 
                healthConfig.size, 
                healthConfig.colors.active
            ).setScrollFactor(0);
            
            this.healthDisplay.push(heart);
        }
        this.updateHealthDisplay();
    }

    updateHealthDisplay() {
        const healthConfig = GameConfig.ui.healthDisplay;
        for (let i = 0; i < this.healthDisplay.length; i++) {
            this.healthDisplay[i].fillColor = i < this.health 
                ? healthConfig.colors.active 
                : healthConfig.colors.inactive;
        }
    }

    takeDamage(amount) {
        if (this.invulnerable) return;
        
        this.health = Math.max(0, this.health - amount);
        this.updateHealthDisplay();
        this.setInvulnerable();
        
        this.scene.cameras.main.shake(
            GameConfig.camera.shake.duration,
            GameConfig.camera.shake.intensity
        );
        
        if (this.health <= 0) {
            this.onDeath();
        }
    }

    setInvulnerable() {
        this.invulnerable = true;
        this.blinkEffect = this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: GameConfig.player.invulnerability.blinkDuration,
            yoyo: true,
            repeat: GameConfig.player.invulnerability.blinkCount
        });
        this.scene.time.delayedCall(this.invulnerabilityTime, () => {
            this.invulnerable = false;
            this.alpha = 1;
        });
    }

    onDeath() {
        const flash = GameConfig.camera.flash;
        this.scene.cameras.main.flash(
            flash.duration, 
            flash.color.r, 
            flash.color.g, 
            flash.color.b
        );

        this.scene.time.delayedCall(GameConfig.mechanics.timers.deathDelay, () => {
            // Game over logic
        });
    }
    /**
     * Creates a texture for the player sprite in the given scene.
     * The texture is generated using the player configuration from GameConfig.
     * If the 'playerSprite' texture already exists, this function will return early.
     *
     * @param {Phaser.Scene} scene - The scene in which to create the player texture.
     */
    static createPlayerTexture(scene) {
        if (scene.textures.exists('playerSprite')) return;
        
        const { size, innerSize, colors } = GameConfig.player;
        const graphics = scene.make.graphics();
        
        // Draw border
        graphics.fillStyle(colors.border);
        graphics.fillRect(0, 0, size, size);
        
        // Calculate inner square position for consistent border
        const borderWidth = (size - innerSize) / 2;
        
        // Draw inner square
        graphics.fillStyle(colors.fill);
        graphics.fillRect(borderWidth, borderWidth, innerSize, innerSize);
        
        graphics.generateTexture('playerSprite', size, size);
    }
    
    /**
     * Updates the player's velocity based on the provided movement input and time delta.
     * Clamps the player's velocity to the maximum speed defined in the game configuration.
     *
     * @param {object} movement - An object containing the x and y components of the player's movement.
     * @param {number} dt - The time delta since the last update, used to scale the acceleration.
     */
    update(movement, dt) {
        // Existing movement code...
        const { maxSpeed, accelFactor } = GameConfig.player;
        const scaledAccelFactor = accelFactor * dt * 60;
        
        // Only allow movement if player is alive
        if (this.health > 0) {
            if (movement.x !== 0 || movement.y !== 0) {
                const newVelocityX = this.body.velocity.x + 
                    (movement.x - this.body.velocity.x) * scaledAccelFactor;
                const newVelocityY = this.body.velocity.y + 
                    (movement.y - this.body.velocity.y) * scaledAccelFactor;
                
                this.setVelocity(newVelocityX, newVelocityY);
            } else {
                this.setVelocity(0, 0);
            }
            
            // Cap maximum velocity
            this.body.velocity.x = Phaser.Math.Clamp(
                this.body.velocity.x, -maxSpeed, maxSpeed);
            this.body.velocity.y = Phaser.Math.Clamp(
                this.body.velocity.y, -maxSpeed, maxSpeed);
        }
    }

    /**
     * Creates a visual health display for the player
     */
    createHealthDisplay() {
        this.healthDisplay = [];
        for (let i = 0; i < this.maxHealth; i++) {
            const heart = this.scene.add.rectangle(
                20 + (i * 30), 20, 
                20, 20, 
                0xFF0000
            ).setScrollFactor(0);
            
            this.healthDisplay.push(heart);
        }
        this.updateHealthDisplay();
    }
    
    /**
     * Updates the visual health display
     */
    updateHealthDisplay() {
        for (let i = 0; i < this.healthDisplay.length; i++) {
            this.healthDisplay[i].fillColor = i < this.health ? 0xFF0000 : 0x555555;
        }
    }
    
    /**
     * Handles player taking damage
     * @param {number} amount - Amount of damage to take
     * @returns {boolean} - Whether damage was successfully applied
     */
    takeDamage(amount) {
        if (this.invulnerable) return false;
        
        this.health -= amount;
        this.updateHealthDisplay();
        
        // Visual feedback
        this.scene.cameras.main.shake(100, 0.01);
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            yoyo: true
        });
        
        // Set invulnerability
        this.setInvulnerable();
        
        // Check for death
        if (this.health <= 0) {
            this.onDeath();
            return true;
        }
        
        return true;
    }
    
    setInvulnerable() {
        this.invulnerable = true;
        
        // Visual indicator
        this.blinkEffect = this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 10
        });
        
        // Reset invulnerability after time
        this.scene.time.delayedCall(this.invulnerabilityTime, () => {
            this.invulnerable = false;
            this.alpha = 1;
            if (this.blinkEffect) this.blinkEffect.stop();
        });
    }
    
    onDeath() {
        // Flash effect
        this.scene.cameras.main.flash(500, 255, 0, 0);
        
        // Disable player
        this.setActive(false);
        
        // Trigger game over after short delay
        this.scene.time.delayedCall(1000, () => {
            // You'll need to implement the Game Over scene or behavior
            console.log("Player died - Game Over");
            // this.scene.scene.start("GameOver");
        });
    }
}