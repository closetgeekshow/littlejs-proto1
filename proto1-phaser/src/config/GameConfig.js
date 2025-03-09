/**
 * Game configuration object that contains all settings for the Phaser game.
 * @typedef {Object} GameConfig
 *
 */
export const GameConfig = {
  /**
   * @property {Object} core - Core Phaser engine settings
   * @property {string} core.type - The rendering type (Phaser.AUTO, Phaser.CANVAS, Phaser.WEBGL)
   * @property {string} core.parent - DOM element ID that will contain the game canvas
   * @property {string} core.backgroundColor - Background color of the game canvas
   */
  core: {
    type: Phaser.AUTO,
    parent: "game-container",
    backgroundColor: "#028af8",
  },

  /**
   * @property {Object} scale - Game scaling settings
   * @property {string} scale.mode - Scaling mode for the game canvas
   * @property {string} scale.autoCenter - How to center the game canvas
   * @property {number} scale.width - Initial width of the game canvas in pixels
   * @property {number} scale.height - Initial height of the game canvas in pixels
   * @property {Object} scale.min - Minimum allowed dimensions
   * @property {number} scale.min.width - Minimum width in pixels
   * @property {number} scale.min.height - Minimum height in pixels
   * @property {Object} scale.max - Maximum allowed dimensions
   * @property {number} scale.max.width - Maximum width in pixels
   * @property {number} scale.max.height - Maximum height in pixels
   * @property {string} scale.orientation - Game orientation (portrait or landscape)
   * {@tutorial https://docs.phaser.io/phaser/concepts/scale-manager|Concepts}
   * {@link https://docs.phaser.io/api-documentation/namespace/scale|API docs}
   */
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 900,
    height: 1600,
    min: {
      width: 270,
      height: 480,
    },
    max: {
      width: 1800,
      height: 3200,
    },
    orientation: Phaser.Scale.PORTRAIT,
  },

  /**
   * @property {Object} physics - Physics engine settings
   * @property {string} physics.default - Default physics system to use
   * @property {Object} physics.arcade - Arcade physics specific settings
   * @property {Object} physics.arcade.gravity - Gravity settings
   * @property {number} physics.arcade.gravity.y - Vertical gravity
   * @property {boolean} physics.arcade.debug - Whether to enable physics debugging
   * {@tutorial https://docs.phaser.io/phaser/concepts/physics/arcade|docs}
   * {@link https://docs.phaser.io/api-documentation/class/physics-arcade-arcadephysics|API Docs}
   */
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },

  /**
   * @property {Object} mechanics - Gameplay mechanics settings
   * @property {Object} mechanics.damage - Damage values for different interactions
   * @property {number} mechanics.damage.enemyToPlayer - Damage when enemy touches player
   * @property {number} mechanics.damage.playerToEnemy - Damage when bullet hits enemy
   * @property {Object} mechanics.knockback - Settings for knockback mechanics
   * @property {number} mechanics.knockback.force - Force applied when player is hit
   * @property {Object} mechanics.timers - Various timing values for game events
   * @property {number} mechanics.timers.deathDelay - Delay before game over after death
   */
  mechanics: {
    damage: {
      enemyToPlayer: 1, // Damage when enemy touches player
      playerToEnemy: 1, // Damage when bullet hits enemy
    },
    knockback: {
      force: 150, // Force applied when player is hit
    },
    timers: {
      deathDelay: 1000, // Delay before game over after death
    },
  },

  /**
   * Configures camera effects
   * @property {Object} camera - Camera effect settings
   * @property {Object} camera.shake - Camera shake effect settings
   * @property {number} camera.shake.duration - Duration of shake effect in ms
   * @property {number} camera.shake.intensity - Intensity of shake effect
   * @property {Object} camera.flash - Camera flash effect settings
   * @property {number} camera.flash.duration - Duration of flash effect in ms
   * @property {Object} camera.flash.color - Color of the flash effect
   * @property {number} camera.flash.color.r - Red component (0-255)
   * @property {number} camera.flash.color.g - Green component (0-255)
   * @property {number} camera.flash.color.b - Blue component (0-255)
   */
  camera: {
    shake: {
      duration: 100, // Duration of shake effect in ms
      intensity: 0.01, // Intensity of shake effect
    },
    flash: {
      duration: 500, // Duration of flash effect in ms
      color: { r: 255, g: 0, b: 0 }, // Color of flash (red)
    },
  },

  /**
     * Configures visual effects
    * @property {Object} fx - Visual effects settings
    * @property {Object} fx.hitFlash - Enemy flash effect when hit
    * @property {number} fx.hitFlash.duration - Duration of enemy flash on hit
    * @property {number} fx.hitFlash.color - Color to flash (hexadecimal)
    
     */
  fx: {
    hitFlash: {
      duration: 100, // Duration of enemy flash on hit
      color: 0xffffff, // Color to flash (white)
    },
  },

  // Add this to the existing GameConfig object
  /**
   * Targeting system configuration
   * @property {Object} targeting - Targeting system settings
   * @property {number} targeting.defaultRange - Default targeting range
   * @property {boolean} targeting.preferClosest - Whether to prefer closest targets
   */
  targeting: {
    defaultRange: 800,
    preferClosest: true,
  },

  /**
   * Player configuration
   * @property {Object} player - Player entity settings
   * @property {number} player.startX - Starting X position
   * @property {number} player.startY - Starting Y position
   * @property {number} player.size - Player size in pixels
   * @property {number} player.innerSize - Inner size in pixels
   * @property {number} player.maxSpeed - Maximum movement speed
   * @property {number} player.accelFactor - Acceleration factor
   * @property {number} player.health - Initial health value
   * @property {Object} player.invulnerability - Invulnerability settings after taking damage
   * @property {number} player.invulnerability.duration - Duration player is invulnerable after hit
   * @property {number} player.invulnerability.blinkDuration - Duration of each blink
   * @property {number} player.invulnerability.blinkCount - Number of blinks during invulnerability
   * @property {Object} player.colors - Player colors
   * @property {number} player.colors.border - Border color (hexadecimal)
   * @property {number} player.colors.fill - Fill color (hexadecimal)
   *
   */
  player: {
    startX: 450,
    startY: 800,
    size: 90,
    innerSize: 72,
    maxSpeed: 500,
    accelFactor: 10,
    health: 3,

    // Add detailed invulnerability settings
    invulnerability: {
      duration: 1000, // Duration player is invulnerable after hit
      blinkDuration: 100, // Duration of each blink
      blinkCount: 10, // Number of blinks during invulnerability
    },

    /**
     * Configures the colors for the player entity.
     * @property {number} border - The hexadecimal color value for the player's border.
     * @property {number} fill - The hexadecimal color value for the player's fill.
     */
    colors: {
      border: 0x000000,
      fill: 0x0000ff,
    },
  },

  /**
   * Configures the settings for the player's weapon.
   * @property {number} fireRate - Time between shots in milliseconds.
   * @property {number} bulletSpeed - Speed of the bullets.
   * @property {number} bulletSize - Size of the bullets.
   * @property {number} damage - Amount of damage the bullets deal.
   * @property {number} range - How far the bullets travel before disappearing.
   * @property {number} color - Color of the bullets (hexadecimal).
   */
  weapon: {
    fireRate: 250, // Time between shots in milliseconds
    bulletSpeed: 400,
    bulletSize: 20,
    damage: 1,
    range: 500, // How far bullets travel before disappearing
    color: 0xff0000, // Red bullets
  },
  /**
   * Configures the settings for the on-screen joystick control.
   * @property {Object} joystick - On-screen joystick settings
   * @property {number} joystick.x - X-coordinate position
   * @property {number} joystick.y - Y-coordinate position
   * @property {number} joystick.radius - Joystick radius
   * @property {number} joystick.baseRadius - Base circle radius
   * @property {number} joystick.thumbRadius - Thumb circle radius
   * @property {number} joystick.baseColor - Base color (hexadecimal)
   * @property {number} joystick.thumbColor - Thumb color (hexadecimal)
   * @property {number} joystick.forceMin - Minimum force to register input
   * {@link https://rexrainbow.github.io/phaser3-rex-notes/docs/site/virtualjoystick/|API Docs}
   */
  joystick: {
    x: 450,
    y: 1400,
    radius: 140,
    baseRadius: 140,
    thumbRadius: 70,
    baseColor: 0x888888,
    thumbColor: 0xcccccc,
    forceMin: 20,
  },

  /**
   * UI configuration
   * @property {Object} ui - User interface settings
 * @property {Object} ui.timeScaleText - Time scale display settings
 * @property {number} ui.timeScaleText.x - X position of time scale text
 * @property {number} ui.timeScaleText.y - Y position of time scale text
 * @property {Object} ui.timeScaleText.style - Text style settings
 * @property {string} ui.timeScaleText.style.fontFamily - Font family
 * @property {string} ui.timeScaleText.style.fontSize - Font size
 * @property {string} ui.timeScaleText.style.color - Text color
 * @property {Object} ui.healthDisplay - Health display settings
 * @property {number} ui.healthDisplay.x - Starting X position
 * @property {number} ui.healthDisplay.y - Y position
 * @property {number} ui.healthDisplay.size - Size of each heart
 * @property {number} ui.healthDisplay.spacing - Spacing between hearts
 * @property {Object} ui.healthDisplay.colors - Health display colors
 * @property {number} ui.healthDisplay.colors.active - Color of active health unit
 * @property {number} ui.healthDisplay.colors.inactive - Color of depleted health unit
 
   */
  ui: {
    timeScaleText: {
      x: 460,
      y: 20,
      style: {
        fontFamily: "Arial",
        fontSize: "3rem",
        color: "#000000",
      },
    },

    // Add health display settings
    healthDisplay: {
      x: 20, // Starting X position
      y: 20, // Y position
      size: 20, // Size of each heart
      spacing: 30, // Spacing between hearts
      colors: {
        active: 0xff0000, // Color of active health unit
        inactive: 0x555555, // Color of depleted health unit
      },
    },
  },

  /**
   * @property {string} backgroundColor - Global background color
   */
  backgroundColor: "#F8FAFC",
};
