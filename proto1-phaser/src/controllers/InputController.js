import { GameConfig } from "../config/GameConfig";

/**
 * Handles input control for the game scene, including keyboard and virtual joystick.
 * Provides a `getMovementVector()` method to retrieve the player's movement direction and speed.
 */
export class InputController {
    /**
     * Initializes the input controller for the game scene, setting up keyboard and virtual joystick controls.
     * The keyboard controls are mapped to the cursor keys and WASD keys.
     * The virtual joystick is configured with the settings from the `GameConfig.joystick` object.
     * Additionally, global pointer up listeners are added to handle edge cases for the virtual joystick.
     * @param {Phaser.Scene} scene - The current game scene.
     */
    constructor(scene) {
        this.scene = scene;
        
        // Keyboard input
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({ 
            w: 'W', a: 'A', s: 'S', d: 'D' 
        });
        
        // Virtual joystick with config values
        const { x, y, radius, baseRadius, thumbRadius, baseColor, thumbColor, forceMin } = GameConfig.joystick;
        
        this.joyStick = scene.plugins.get('rexvirtualjoystickplugin').add(scene, {
            x: x,
            y: y,
            radius: radius,
            base: scene.add.circle(0, 0, baseRadius, baseColor, 0.5),
            thumb: scene.add.circle(0, 0, thumbRadius, thumbColor, 0.8),
            dir: '8dir',
            forceMin: forceMin,
            fixed: true,
        });
        
        // Add global pointer up listeners to handle edge cases
        scene.input.on('gameout', this.handlePointerUp, this);
        scene.input.on('mouseleave', this.handlePointerUp, this);
        scene.input.on('pointerleave', this.handlePointerUp, this);
        
        // For cases where the pointer goes outside the browser window
        window.addEventListener('mouseup', this.handlePointerUp.bind(this));
        window.addEventListener('touchend', this.handlePointerUp.bind(this));
    }

    destroy() {
        window.removeEventListener('mouseup', this.handlePointerUp.bind(this));
        window.removeEventListener('touchend', this.handlePointerUp.bind(this));
    }    
    /**
     * Handles the pointer up event, manually resetting the joystick force if needed.
     * This is used to handle edge cases where the pointer is released outside the game area.
     */
    handlePointerUp() {
        // Manually reset joystick if needed
        if (this.joyStick && this.joyStick.force > 0) {
            this.joyStick.resetForce();
        }
    }
    
    /**
     * Retrieves the player's movement vector based on the current input state, including keyboard and virtual joystick.
     * The movement vector is normalized and scaled by the player's maximum speed.
     * @returns {Object} An object with `x` and `y` properties representing the player's movement direction and speed.
     */
    getMovementVector() {
        const speed = GameConfig.player.maxSpeed;
        let x = 0;
        let y = 0;
        
        // First check joystick input
        if (this.joyStick && this.joyStick.force > 0) {
            return {
                x: this.joyStick.forceX * 0.7,
                y: this.joyStick.forceY * 0.7,
            };
        } else {
            // Keyboard input
            x = (this.wasd.d.isDown || this.cursors.right.isDown) - 
                (this.wasd.a.isDown || this.cursors.left.isDown);
            y = (this.wasd.s.isDown || this.cursors.down.isDown) - 
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
}