import { GameConfig } from "../config/GameConfig";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bulletSprite');
    this.damage = GameConfig.weapon.damage;
    this.lifespan = 0;
    this.maxLifespan = GameConfig.weapon.range / GameConfig.weapon.bulletSpeed * 1000;
  }

  /**
   * Fires the bullet from the given position towards the target position.
   * @param {number} x - The x-coordinate of the bullet's starting position.
   * @param {number} y - The y-coordinate of the bullet's starting position.
   * @param {number} targetX - The x-coordinate of the target position.
   * @param {number} targetY - The y-coordinate of the target position.
   */
  fire(x, y, targetX, targetY) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);

    // Calculate angle to target
    const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);

    // Set bullet velocity based on angle
    this.scene.physics.velocityFromRotation(
      angle,
      GameConfig.weapon.bulletSpeed,
      this.body.velocity
    );

    this.setRotation(angle);
    this.lifespan = 0;

    //console.log(`Bullet fired from (${x}, ${y}) to (${targetX}, ${targetY}) with angle ${angle}`);
  }

  /**
   * Updates the bullet's lifespan and deactivates the bullet when it exceeds the maximum lifespan.
   * @param {number} time - The current game time.
   * @param {number} delta - The time elapsed since the last frame.
   */
  update(time, delta) {
    this.lifespan += delta;

    // Deactivate bullet when it exceeds maximum lifespan
    if (this.lifespan >= this.maxLifespan) {
      this.setActive(false);
      this.setVisible(false);
      //console.log("Bullet deactivated due to lifespan expiration");
    }
  }
}