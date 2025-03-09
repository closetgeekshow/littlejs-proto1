import { GameConfig } from "../config/GameConfig";

export class TextureGenerator {
  /**
   * Creates all game textures at once
   * @param {Phaser.Scene} scene - The scene to generate textures in
   */
  static generateAllTextures(scene) {
    this.createPlayerTexture(scene);
    this.createBulletTexture(scene);
    this.createEnemyTexture(scene);
    // Add more texture generation methods as needed
  }

  /**
   * Creates a texture for the player sprite
   * @param {Phaser.Scene} scene - The scene to generate the texture in
   */
  static createPlayerTexture(scene) {
    if (scene.textures.exists('playerSprite')) return;
    
    const { size, color } = GameConfig.player;
    const innerSize = size - ((size/10)*2);
    const graphics = scene.make.graphics();
    
    // Draw border
    graphics.fillStyle(0x000000);
    graphics.fillRect(0, 0, size, size);
    
    // Calculate inner square position for consistent border
    const borderWidth =  (size - innerSize)/2;

    
    
    // Draw inner square
    graphics.fillStyle(color);
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

  /**
   * Creates a texture for enemy sprites
   * @param {Phaser.Scene} scene - The scene to generate the texture in
   */
  static createEnemyTexture(scene) {
    if (scene.textures.exists('enemySprite')) return;
    
    const { size, color } = GameConfig.enemy;
    const innerSize = size - ((size/10)*2);
    const graphics = scene.make.graphics();
    
    // Draw border
    graphics.fillStyle(0x000000);
    graphics.fillRect(0, 0, size, size);
    
    // Calculate inner square position for consistent border
    const borderWidth =  (size - innerSize)/2;

    // Draw inner square
    graphics.fillStyle(color);
    graphics.fillRect(borderWidth, borderWidth, innerSize, innerSize);
    
    graphics.generateTexture('enemySprite', size, size);
    graphics.clear();
  }
}