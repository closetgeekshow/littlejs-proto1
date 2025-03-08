import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { InputController } from "../controllers/InputController";
import { TimeScaleManager } from "../managers/TimeScaleManager";
import { GameConfig } from "../config/GameConfig";

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
   * Initializes the game scene by setting up the background color, game components, and pause functionality.
   * This method is called when the game scene is created.
   */
  create() {
    // Set background color
    this.cameras.main.setBackgroundColor(GameConfig.backgroundColor);

    // Setup game components
    this.inputController = new InputController(this);
    this.timeScaleManager = new TimeScaleManager(this);
    this.player = new Player(
      this, 
      GameConfig.player.startX, 
      GameConfig.player.startY
    );

    // Pause game functionality
    this.input.keyboard.on("keydown-P", () => {
      this.scene.pause();
      this.scene.launch("Pause");
    });
  }

  /**
   * Updates the game state during each frame.
   * Scales the delta time according to the time scale manager, then updates the player's position based on the input controller's movement vector.
   * @param {number} time - The current time in milliseconds.
   * @param {number} delta - The time in milliseconds since the last frame.
   */
  update(time, delta) {
    // Scale delta time according to time scale
    const scaledDelta = this.timeScaleManager.getScaledDelta(delta);
    const dt = scaledDelta / 1000;

    if (this.player && this.player.active) {
      const movement = this.inputController.getMovementVector();
      this.player.update(movement, dt);
    }
  }
}