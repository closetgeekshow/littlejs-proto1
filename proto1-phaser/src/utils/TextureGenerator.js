import { GameConfig } from "../config/GameConfig";

export class TextureGenerator {
  /**
   * Creates all game textures at once
   * @param {Phaser.Scene} scene - The scene to generate textures in
   */
  static generateAllTextures(scene) {
    this.createPlayerTexture(scene);
    this.createBulletTexture(scene);
    // Add more texture generation methods as needed
  }

  /**
   * Creates a texture for the player sprite
   * @param {Phaser.Scene} scene - The scene to generate the texture in
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
    graphics.clear();
  }

  /**
   * Creates a texture for bullets
   * @param {Phaser.Scene} scene - The scene to generate the texture in
   */
  static createBulletTexture(scene) {
    if (scene.textures.exists('bulletSprite')) return;
    
    const graphics = scene.make.graphics();
    graphics.fillStyle(GameConfig.weapon.color);
    graphics.fillRect(0, 0, GameConfig.weapon.bulletSize, GameConfig.weapon.bulletSize/2);
    graphics.generateTexture('bulletSprite', GameConfig.weapon.bulletSize, GameConfig.weapon.bulletSize/2);
    graphics.clear();
  }
}
