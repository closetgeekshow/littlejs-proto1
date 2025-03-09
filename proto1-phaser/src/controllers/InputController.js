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
        
        // Get joystick settings from config
        const { radius, baseRadius, thumbRadius, baseColor, thumbColor, forceMin } = GameConfig.joystick;
        
        // Create invisible base and thumb for the joystick
        const baseGameObject = scene.add.circle(0, 0, baseRadius, baseColor, 0.5);
        const thumbGameObject = scene.add.circle(0, 0, thumbRadius, thumbColor, 0.8);
        
        // Make them invisible initially
        baseGameObject.setVisible(false);
        thumbGameObject.setVisible(false);
        
        // Create the joystick but don't set fixed position
        this.joyStick = scene.plugins.get('rexvirtualjoystickplugin').add(scene, {
            radius: radius,
            base: baseGameObject,
            thumb: thumbGameObject,
            dir: "4way",
            forceMin: forceMin,
            fixed: false, // Not fixed position
            enable: false, // Disabled initially
        });
        
        // Add touch start event listener to the scene
        scene.input.on('pointerdown', (pointer) => {
            // Position joystick where the pointer is
            this.joyStick.x = pointer.x;
            this.joyStick.y = pointer.y;
            
            // Make joystick visible
            baseGameObject.setVisible(true);
            thumbGameObject.setVisible(true);
            
            // Enable the joystick
            this.joyStick.setEnable(true);
        });
        
        // Hide joystick when touch ends
        scene.input.on('pointerup', () => {
            baseGameObject.setVisible(false);
            thumbGameObject.setVisible(false);
            this.joyStick.setEnable(false);
        });
        
        // Add global pointer up listeners to handle edge cases
        scene.input.on('gameout', this.handlePointerUp, this);
        scene.input.on('mouseleave', this.handlePointerUp, this);
        scene.input.on('pointerleave', this.handlePointerUp, this);
        
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
        // Hide and disable joystick
        if (this.joyStick) {
            this.joyStick.base.setVisible(false);
            this.joyStick.thumb.setVisible(false);
            this.joyStick.setEnable(false);
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
                x: this.joyStick.forceX,
                y: this.joyStick.forceY,
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