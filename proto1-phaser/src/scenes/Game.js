import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  preload() {
    // Load the joystick plugin if needed
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js",
      true
    );
  }

  create() {
    // Set background color using hex value
    this.cameras.main.setBackgroundColor("#F8FAFC");

    // Setup input systems
    this.setupInput();

    // Create player
    this.createPlayer();

    // Pause game functionality
    this.input.keyboard.on("keydown-P", () => {
      this.scene.pause();
      this.scene.launch("Pause");
    });

    // Initialize time scale to normal (1x)
    this.timeScale = 1;

    // Add time scale controls
    this.setupTimeScaleControls();

    // Add time scale indicator text
    this.timeScaleText = this.add.text(20, 20, "Speed: 1x", {
      fontFamily: "Arial",
      fontSize: "3rem",
      color: "#ffffff",
    });
    this.timeScaleText.setDepth(1000); // Keep it above other elements
  }

  setupInput() {
    // Keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ w: "W", a: "A", s: "S", d: "D" });

    // Virtual joystick for mobile
    this.joyStick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 450,
      y: 1400,
      radius: 60,
      base: this.add.circle(0, 0, 140, 0x888888, 0.5),
      thumb: this.add.circle(0, 0, 70, 0xcccccc, 0.8),
      dir: "8dir",
      forceMin: 70,
      fixed: true,
    });
  }

  createPlayer() {
    // Create graphics object
    const graphics = this.make.graphics();

    // Draw black border (outer square)
    graphics.fillStyle(0x000000);
    graphics.fillRect(0, 0, 90, 90);

    // Draw blue inner square (1px border)
    graphics.fillStyle(0x0000ff);
    graphics.fillRect(9, 9, 72, 72);

    // Generate texture from the graphics
    graphics.generateTexture("playerSprite", 90, 90);

    // Create player with the custom texture
    this.player = this.physics.add.sprite(450, 800, "playerSprite");
    this.player.setCollideWorldBounds(true);

    // Add dampening to player movement
    this.player.setDamping(true);
    this.player.setDrag(0.9);
  }

  getMovementVector() {
    // Reduced speed for better control
    const speed = 120;
    let x = 0;
    let y = 0;

    // First check joystick input
    if (this.joyStick && this.joyStick.force > 0) {
      // Apply a smaller multiplier to joystick for better control
      return {
        x: this.joyStick.forceX * 0.7,
        y: this.joyStick.forceY * 0.7,
      };
    } else {
      // Keyboard input
      x =
        (this.wasd.d.isDown || this.cursors.right.isDown) -
        (this.wasd.a.isDown || this.cursors.left.isDown);
      y =
        (this.wasd.s.isDown || this.cursors.down.isDown) -
        (this.wasd.w.isDown || this.cursors.up.isDown);
    }

    // Normalize the vector if it has length
    const length = Math.sqrt(x * x + y * y);
    if (length > 0) {
      x = x / length;
      y = y / length;
    }

    // Apply speed after normalization
    return {
      x: x * speed,
      y: y * speed,
    };
  }

  setupTimeScaleControls() {
    // Time scale keyboard shortcuts
    this.input.keyboard.on("keydown-ONE", () => this.setTimeScale(0)); // Pause
    this.input.keyboard.on("keydown-TWO", () => this.setTimeScale(0.5)); // Slow
    this.input.keyboard.on("keydown-THREE", () => this.setTimeScale(1)); // Normal
    this.input.keyboard.on("keydown-FOUR", () => this.setTimeScale(2)); // Fast
  }

  setTimeScale(scale) {
    // Update the internal time scale value
    this.timeScale = scale;

    // Apply to the Phaser time system
    this.time.timeScale = scale;

    // Also apply to physics for consistent behavior
    this.physics.world.timeScale = scale === 0 ? 0.0001 : 1 / scale; // Physics needs inverse scale

    // Update the indicator text
    let speedLabel = scale === 0 ? "PAUSED" : `${scale}x`;
    this.timeScaleText.setText(`Speed: ${speedLabel}`);
  }

  update(time, delta) {
    if (!this.player) return;
    // Apply time scale to delta time if your movement uses delta
    const scaledDelta = delta * this.timeScale;

    // Use scaledDelta for your calculations if needed

    // Convert delta to seconds for easier math (delta is in ms)
    const dt = scaledDelta / 1000;

    if (this.player.active) {
      // Get the desired movement direction
      const targetMovement = this.getMovementVector();

      if (targetMovement.x !== 0 || targetMovement.y !== 0) {
        // Scale acceleration by delta time (0.25 per second)
        const accelFactor = 0.25 * dt * 60; // Normalize to 60fps

        const newVelocityX =
          this.player.body.velocity.x +
          (targetMovement.x - this.player.body.velocity.x) * accelFactor;
        const newVelocityY =
          this.player.body.velocity.y +
          (targetMovement.y - this.player.body.velocity.y) * accelFactor;

        this.player.setVelocity(newVelocityX, newVelocityY);
      } else {
        // Immediate stop when no input
        this.player.setVelocity(0, 0);
      }

      // Cap maximum velocity
      const maxSpeed = 120;
      this.player.body.velocity.x = Phaser.Math.Clamp(
        this.player.body.velocity.x,
        -maxSpeed,
        maxSpeed
      );
      this.player.body.velocity.y = Phaser.Math.Clamp(
        this.player.body.velocity.y,
        -maxSpeed,
        maxSpeed
      );
    }
  }
}
