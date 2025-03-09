import { GameConfig } from "../config/GameConfig";
import { InputController } from "../controllers/InputController";


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
    super(scene, x, y, "playerSprite");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.playerInput = new InputController(scene);
    this.setCollideWorldBounds(true);
    this.setDamping(true);
    this.setDrag(0.9);

    this.health = GameConfig.player.health || 3;
    this.maxHealth = GameConfig.player.health || 3;
    this.invulnerable = false;

    this.invulnerabilityTime = GameConfig.player.invulnerability.duration;
    this.createHealthDisplay();

    this.bullets = null;
    this.lastFiredTime = 0;
  }

  /**
   * * Creates the visual health display for the player. This method iterates through the player's maximum health value and creates a rectangle for each health point, positioning them based on the configuration settings. The created rectangles are stored in the `healthDisplay` array, and the `updateHealthDisplay` method is called to initially set the fill colors of the rectangles.
   */
  createHealthDisplay() {
    const healthConfig = GameConfig.ui.healthDisplay;
    this.healthDisplay = [];
    for (let i = 0; i < this.maxHealth; i++) {
      const heart = this.scene.add
        .rectangle(
          healthConfig.x + i * healthConfig.spacing,
          healthConfig.y,
          healthConfig.size,
          healthConfig.size,
          healthConfig.colors.active
        )
        .setScrollFactor(0);

      this.healthDisplay.push(heart);
    }
    this.updateHealthDisplay();
  }

  /**
   * Updates the visual health display for the player.
   * This method iterates through the player's health display elements
   * (represented as rectangles) and sets their fill color to either
   * the active or inactive color based on the player's current health.
   */
  updateHealthDisplay() {
    const healthConfig = GameConfig.ui.healthDisplay;
    for (let i = 0; i < this.healthDisplay.length; i++) {
      this.healthDisplay[i].fillColor =
        i < this.health
          ? healthConfig.colors.active
          : healthConfig.colors.inactive;
    }
  }

  /**
   * Handles the player taking damage. If the player is not invulnerable, the player's health is reduced by the given amount. The health display is updated, the player is set to invulnerable, the camera shakes, and if the player's health reaches 0, the onDeath() method is called.
   *
   * @param {number} amount - The amount of damage the player takes.
   */
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

  /**
   * Sets the player as invulnerable for a specified duration.
   * This includes a blinking effect to visually indicate the invulnerability state.
   */
  setInvulnerable() {
    this.invulnerable = true;
    this.blinkEffect = this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: GameConfig.player.invulnerability.blinkDuration,
      yoyo: true,
      repeat: GameConfig.player.invulnerability.blinkCount,
    });
    this.scene.time.delayedCall(this.invulnerabilityTime, () => {
      this.invulnerable = false;
      this.alpha = 1;
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
    if (scene.textures.exists("playerSprite")) return;

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

    graphics.generateTexture("playerSprite", size, size);
  }

  /**
   * Updates the player's movement and handles firing bullets during the game update.
   * This method is called every frame to update the player's state.
   *
   * @param {number} dt - The time delta since the last update, used to scale the movement.
   * @param {number} time - The current game time.
   */
  update(dt, time) {
    //console.log("Player update called");
    const movement = this.playerInput.getMovementVector();
    this.setVelocity(movement.x, movement.y);
    this.fireBullet(time);
  }
  
  /**
   * Handles the player's death event.
   * This method is called when the player's health reaches 0 or below.
   * It performs the following actions:
   * - Flashes the camera to indicate the player's death
   * - Disables the player by setting it as inactive
   * - Triggers a game over event after a short delay
   */
  onDeath() {
    const flash = GameConfig.camera.flash;
    this.scene.cameras.main.flash(
      flash.duration,
      flash.color.r,
      flash.color.g,
      flash.color.b
    );

    // Disable player
    this.setActive(false);

    this.scene.time.delayedCall(GameConfig.mechanics.timers.deathDelay, () => {
      // Game over logic
      //console.log("Player died - Game Over");
      this.scene.scene.start("GameOver");
    });
  }

  // Add this method to set up targeting and bullets




  setWeaponSystem(targetingSystem, bullets) {
    this.targetingSystem = targetingSystem;
    this.bullets = bullets;
  }

  // Add this new method to the Player class
  fireBullet(time) {
    if (!this.targetingSystem || !this.bullets) return;
    if (time - this.lastFiredTime < GameConfig.weapon.fireRate) return;

    // Get current target instead of finding a new one each time
    const target = this.targetingSystem.getCurrentTarget(this.x, this.y);
    if (!target) return;

    const bullet = this.bullets.get();
    if (!bullet) return;

    // Fire bullet at target
    bullet.fire(this.x, this.y, target.x, target.y);
    this.lastFiredTime = time;
  }
}
