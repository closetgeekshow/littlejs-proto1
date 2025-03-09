import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { InputController } from "../controllers/InputController";
import { TimeScaleManager } from "../managers/TimeScaleManager";
import { GameConfig } from "../config/GameConfig";
import { Bullet } from "../entities/Bullet";
import { TargetingSystem } from "../systems/TargetingSystem";
import { EnemySpawner } from "../systems/EnemySpawner";
import { Enemy } from "../entities/Enemy";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  /**
   * Preloads the "rexvirtualjoystickplugin" plugin from the specified URL.
   * This plugin is likely used to handle virtual joystick input for the game.
   */
  preload() {
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js",
      true
    );
  }

  /**
   * Initializes the game scene, setting up the background, input controller, time scale manager, player, pause functionality, and bullet group.
   * This method is called when the game scene is created.
   */
  create() {
    this.cameras.main.setBackgroundColor(GameConfig.backgroundColor);
    this.inputController = new InputController(this);
    this.timeScaleManager = new TimeScaleManager(this);
    this.player = new Player(
      this,
      GameConfig.player.startX,
      GameConfig.player.startY
    );

    this.input.keyboard.on("keydown-P", () => {
      this.scene.pause();
      this.scene.launch("Pause");
    });

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: false
    });

    this.enemySpawner = new EnemySpawner(this, this.enemies);

    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 30,
      runChildUpdate: true,
    });

    this.playerTargeting = new TargetingSystem(this, {
      range: GameConfig.player.weaponRange,
      targetGroup: this.enemies,
      debugMode: GameConfig.core.debugMode || false,
    });

    this.player.setWeaponSystem(this.playerTargeting, this.bullets);
    this.lastFiredTime = 0;

    this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
    this.physics.add.collider(this.bullets, this.enemies, this.handleBulletEnemyCollision, null, this);

    this.time.delayedCall(2000, () => {
      this.enemySpawner.startNextWave();
    });
  }
  /**
   * Handles the collision between the player and an enemy.
   * If the player takes damage, applies a knockback force to the player based on the angle between the player and the enemy.
   * @param {Phaser.GameObjects.GameObject} player - The player game object.
   * @param {Phaser.GameObjects.GameObject} enemy - The enemy game object.
   */
  handlePlayerEnemyCollision(player, enemy) {
    player.takeDamage(enemy.damage || GameConfig.enemy.damage);
    
    const angle = Phaser.Math.Angle.Between(
      enemy.x, enemy.y, player.x, player.y
    );
    const knockbackForce = GameConfig.mechanics.knockback.force;
    player.body.velocity.x = Math.cos(angle) * knockbackForce;
    player.body.velocity.y = Math.sin(angle) * knockbackForce;
  }

  handleBulletEnemyCollision(bullet, enemy) {
    if (enemy.takeDamage(bullet.damage || GameConfig.weapon.damage)) {
      if (enemy.health <= 0) {
        this.enemySpawner.enemyDestroyed();
      }
    }
    
    bullet.setActive(false);
    bullet.setVisible(false);
  }

  /**
   * Updates the game state, including the player's actions.
   * This method is called every frame by the Phaser game loop.
   * It first scales the delta time to account for the game's time scale,
   * then checks if the player is active and updates the player's state.
   * @param {number} time - The current game time in milliseconds.
   * @param {number} delta - The time in milliseconds since the last frame.
   */
  update(time, delta) {
    const scaledDelta = this.timeScaleManager.getScaledDelta(delta);
    const dt = scaledDelta / 1000;
    
    if (this.player && this.player.active) {
      this.player.update(dt, time);
      
      // Add this line to render debug targeting info
      if (this.playerTargeting) {
        this.playerTargeting.debugRender(this.player.x, this.player.y);
      }
      
      this.enemies.getChildren().forEach(enemy => {
        if (enemy.active) {
          enemy.update(time, delta, this.player.x, this.player.y);
        }
      });
    }
  }
}