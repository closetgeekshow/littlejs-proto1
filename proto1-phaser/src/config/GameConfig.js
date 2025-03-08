export const GameConfig = {
  
    /**
     * Configures the core settings for the Phaser game instance.
     * - `type`: Sets the rendering type to Phaser.AUTO, which allows Phaser to choose the best renderer (WebGL or Canvas).
     * - `parent`: Specifies the DOM element that will contain the game canvas.
     * - `backgroundColor`: Sets the background color of the game canvas.
     */
    core: {
        type: Phaser.AUTO,
        parent: 'game-container',
        backgroundColor: '#028af8',
    },
   
    /**
     * Configures the scaling settings for the Phaser game instance.
     * - `mode`: Sets the scaling mode to Phaser.Scale.FIT, which scales the game to fit the parent container while maintaining the aspect ratio.
     * - `autoCenter`: Centers the game canvas both horizontally and vertically within the parent container.
     * - `width`: Sets the initial width of the game canvas to 900 pixels.
     * - `height`: Sets the initial height of the game canvas to 1600 pixels.
     * - `min`: Specifies the minimum allowed size for the game canvas, with a width of 270 pixels and a height of 480 pixels.
     * - `max`: Specifies the maximum allowed size for the game canvas, with a width of 1800 pixels and a height of 3200 pixels.
     * - `orientation`: Sets the orientation of the game to Phaser.Scale.PORTRAIT, which means the game will be displayed in a portrait orientation.
     *  {@tutorial https://docs.phaser.io/phaser/concepts/scale-manager|Concepts}
     *  {@link https://docs.phaser.io/api-documentation/namespace/scale|API docs}
     */
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 900,
        height: 1600,
        min: {
            width: 270,
            height: 480
        },
        max: {
            width: 1800,
            height: 3200
        },
        orientation: Phaser.Scale.PORTRAIT
    },
    
    /**
     * Configures the physics settings for the Phaser game instance.
     * - `default`: Sets the default physics system to 'arcade', which is a lightweight 2D physics system.
     * - `arcade`: Configures the Arcade physics system:
     *   - `gravity`: Sets the gravity to 0 on the y-axis, effectively disabling gravity.
     *   - `debug`: Disables physics debugging, which can improve performance.
     * {@tutorial https://docs.phaser.io/phaser/concepts/physics/arcade|docs}
     * {@link https://docs.phaser.io/api-documentation/class/physics-arcade-arcadephysics|API Docs}
     */
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    
    /**
     * Configures the player settings for the game.
     * - `startX`: The initial x-coordinate of the player's position.
     * - `startY`: The initial y-coordinate of the player's position.
     * - `size`: The size of the player's sprite.
     * - `innerSize`: The size of the player's inner sprite.
     * - `maxSpeed`: The maximum speed the player can move at.
     * - `accelFactor`: The acceleration factor applied to the player's movement.
     * - `colors`: An object containing the border and fill colors for the player's sprite.
     */
    player: {
        startX: 450,
        startY: 800,
        size: 90,
        innerSize: 72,
        maxSpeed: 120,
        accelFactor: 0.25,
        colors: {
            border: 0x000000,
            fill: 0x0000ff
        }
    },

    /**
     * Configures the settings for the on-screen joystick control.
     * - `x`: The x-coordinate of the joystick's position.
     * - `y`: The y-coordinate of the joystick's position.
     * - `radius`: The radius of the joystick's thumb.
     * - `baseRadius`: The radius of the joystick's base.
     * - `thumbRadius`: The radius of the joystick's thumb.
     * - `baseColor`: The color of the joystick's base.
     * - `thumbColor`: The color of the joystick's thumb.
     * - `forceMin`: The minimum force required to register input from the joystick.
     * {@link https://rexrainbow.github.io/phaser3-rex-notes/docs/site/virtualjoystick/|API Docs}
     */
    joystick: {
        x: 450,
        y: 1400,
        radius: 60,
        baseRadius: 140,
        thumbRadius: 70,
        baseColor: 0x888888,
        thumbColor: 0xcccccc,
        forceMin: 70
    },
    
    ui: {
        timeScaleText: {
            x: 20,
            y: 20,
            style: {
                fontFamily: 'Arial',
                fontSize: '3rem',
                color: '#ffffff'
            }
        }
    },
    backgroundColor: '#F8FAFC'
}