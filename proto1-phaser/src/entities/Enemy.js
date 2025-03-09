import { GameConfig } from "../config/GameConfig";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "enemySprite");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set properties from GameConfig
    this.health = GameConfig.enemy.health;
    this.maxHealth = GameConfig.enemy.health;
    this.speed = GameConfig.enemy.speed;
    this.damage = GameConfig.enemy.damage;

    // Configure physics properties
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);

    // Track hit state
    this.isHit = false;
  }

  static createEnemyTexture(scene) {
    if (scene.textures.exists("enemySprite")) return;

    const { size, colors } = GameConfig.enemy;
    const graphics = scene.make.graphics();

    // Draw enemy shape (red rectangle)
    graphics.fillStyle(colors.fill);
    graphics.fillRect(0, 0, size, size);

    graphics.generateTexture("enemySprite", size, size);
  }

  takeDamage(amount) {
    this.health -= amount;

    // Show hit feedback animation
    if (!this.isHit) {
      this.isHit = true;
      this.setTint(GameConfig.fx.hitFlash.color);

      this.scene.time.delayedCall(GameConfig.fx.hitFlash.duration, () => {
        this.clearTint();
        this.isHit = false;
      });
    }

    // Check if enemy died
    if (this.health <= 0) {
      this.die();
    }

    return true;
  }

  die() {
    // Create explosion effect before destroying
    this.createExplosionEffect();
    this.destroy();
  }

  createExplosionEffect() {
    // Modern approach - direct emitter creation
    const emitter = this.scene.add.particles(this.x, this.y, "enemySprite", {
      speed: 100,
      scale: { start: 0.5, end: 0 },
      blendMode: "ADD",
      lifespan: 300,
      quantity: 10,
      emitting: false,
    });

    // Explode once and then auto-destroy
    emitter.explode();

    // Automatically destroy the emitter after animation completes
    this.scene.time.delayedCall(300, () => {
      emitter.destroy();
    });
  }

  update(time, delta, playerX, playerY) {
    if (!this.active) return;

    // Chase player behavior
    this.chasePlayer(playerX, playerY, delta);
  }

  chasePlayer(playerX, playerY, delta) {
    // Calculate direction to player
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const angle = Math.atan2(dy, dx);

    const normalizedDelta = delta / 1000;
    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
  }
}
