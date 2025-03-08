import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  /**
   * Handles the creation of the game over scene, including displaying the "Game Over" text and adding interactive buttons for restarting the game or returning to the main menu.
   */
  create() {
    this.cameras.main.setBackgroundColor(0xff0000);

    // Game Over text
    this.add
      .text(this.scale.width / 2, this.scale.height / 3, "Game Over", {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    // Restart button
    const restartButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 100, "Play Again", {
        fontFamily: "Arial",
        fontSize: 36,
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: {
          left: 20,
          right: 20,
          top: 10,
          bottom: 10,
        },
      })
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on("pointerdown", () => {
      this.scene.start("Game");
    });

    // Main Menu button
    const menuButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 200, "Main Menu", {
        fontFamily: "Arial",
        fontSize: 36,
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: {
          left: 20,
          right: 20,
          top: 10,
          bottom: 10,
        },
      })
      .setOrigin(0.5)
      .setInteractive();

    menuButton.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }
}
