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
        // Create texture if needed
        Player.createPlayerTexture(scene);
        
        super(scene, x, y, 'playerSprite');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configure physics
        this.setCollideWorldBounds(true);
        this.setDamping(true);
        this.setDrag(0.9);
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
        const { maxSpeed, accelFactor } = GameConfig.player;
        const scaledAccelFactor = accelFactor * dt * 60;
        
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