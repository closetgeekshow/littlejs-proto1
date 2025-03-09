import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { InputController } from "../controllers/InputController";
import { TimeScaleManager } from "../managers/TimeScaleManager";
import { GameConfig } from "../config/GameConfig";
import { Bullet } from "../entities/Bullet";
import { TargetingSystem } from "../systems/TargetingSystem";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  /**
   * Preloads the "rexvirtualjoystickplugin" plugin from the specified URL.
   * This plugin is likely used to handle virtual joystick input for the game.
   */
  preload() {
    //console.log("Preloading assets...");
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
    //console.log("Creating game scene...");
    this.cameras.main.setBackgroundColor(GameConfig.backgroundColor);
    this.inputController = new InputController(this);
    this.timeScaleManager = new TimeScaleManager(this);
    this.player = new Player(
      this,
      GameConfig.player.startX,
      GameConfig.player.startY
    );

    // Pause game functionality
    this.input.keyboard.on("keydown-P", () => {
      //console.log("Game paused");
      this.scene.pause();
      this.scene.launch("Pause");
    });

    // Create bullet group for pooling
    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 30,
      runChildUpdate: true,
    });

    this.playerTargeting = new TargetingSystem(this, {
      targetType: 'enemy',
      range: GameConfig.weapon.range * 1.5,
    });

    this.player.setWeaponSystem(this.playerTargeting, this.bullets);
    this.lastFiredTime = 0;

    //console.log("Game scene created successfully.");
  }

  /**
   * Handles the collision between the player and an enemy.
   * If the player takes damage, applies a knockback force to the player based on the angle between the player and the enemy.
   * @param {Phaser.GameObjects.GameObject} player - The player game object.
   * @param {Phaser.GameObjects.GameObject} enemy - The enemy game object.
   */
  handlePlayerEnemyCollision(player, enemy) {
    if (player.takeDamage(GameConfig.mechanics.damage.enemyToPlayer)) {
      const angle = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        player.x,
        player.y
      );
      const knockbackForce = GameConfig.mechanics.knockback.force;
      player.body.velocity.x = Math.cos(angle) * knockbackForce;
      player.body.velocity.y = Math.sin(angle) * knockbackForce;
    }
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
      //console.log("Updating player...");
      this.player.update(dt, time);
    }
  }

  /**
   * Generates the coordinates of a random position on the edge of the game screen.
   * This is used to spawn new enemies at random positions around the game area.
   * @returns {Object} An object with `x` and `y` properties representing the generated coordinates.
   */
  getNearestEnemy() {
    const side = Phaser.Math.Between(0, 3);
    let x, y;

    switch (side) {
      case 0: // top
        x = Phaser.Math.Between(0, this.game.config.width);
        y = -50;
        break;
      case 1: // right
        x = this.game.config.width + 50;
        y = Phaser.Math.Between(0, this.game.config.height);
        break;
      case 2: // bottom
        x = Phaser.Math.Between(0, this.game.config.width);
        y = this.game.config.height + 50;
        break;
      case 3: // left
        x = -50;
        y = Phaser.Math.Between(0, this.game.config.height);
        break;
    }

    return { x, y };
  }

  /**
   * Handles the collision between a bullet and an enemy.
   * Sets the bullet to be inactive and invisible.
   * @param {Phaser.GameObjects.Sprite} bullet - The bullet object.
   * @param {Phaser.GameObjects.Sprite} enemy - The enemy object.
   */
  handleBulletEnemyCollision(bullet, enemy) {
    bullet.setActive(false);
    bullet.setVisible(false);
  }
}