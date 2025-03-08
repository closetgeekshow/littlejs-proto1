import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { InputController } from "../controllers/InputController";
import { TimeScaleManager } from "../managers/TimeScaleManager";
import { GameConfig } from "../config/GameConfig";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  preload() {
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js",
      true
    );
  }

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