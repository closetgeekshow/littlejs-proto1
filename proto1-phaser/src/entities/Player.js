import { GameConfig } from "../config/GameConfig";

export class Player extends Phaser.Physics.Arcade.Sprite {
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