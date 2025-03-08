import { GameConfig } from "../config/GameConfig";

/**
 * Manages the time scale of the game scene, allowing the player to adjust the game speed.
 * Provides keyboard controls to set the time scale to different values (0, 0.5, 1, 2).
 * Updates the time scale of the Phaser time system and physics world accordingly.
 * Displays the current game speed as a text overlay.
 */
export class TimeScaleManager {
    constructor(scene) {
        this.scene = scene;
        this.timeScale = 1;
        
        const { x, y, style } = GameConfig.ui.timeScaleText;
        
        // Create text display with config values
        this.timeScaleText = scene.add.text(x, y, 'Speed: 1x', style);
        this.timeScaleText.setDepth(1000);
        
        // Setup controls
        this.setupControls();
    }
    
    /**
     * Sets up the keyboard controls to adjust the time scale of the game scene.
     * Listens for keydown events on the ONE, TWO, THREE, and FOUR keys, and calls the `setTimeScale` method with the corresponding time scale value (0, 0.5, 1, 2).
     */
    setupControls() {
        this.scene.input.keyboard.on('keydown-ONE', () => this.setTimeScale(0));
        this.scene.input.keyboard.on('keydown-TWO', () => this.setTimeScale(0.5));
        this.scene.input.keyboard.on('keydown-THREE', () => this.setTimeScale(1));
        this.scene.input.keyboard.on('keydown-FOUR', () => this.setTimeScale(2));
    }
    
    /**
     * Sets the time scale of the game scene, updating the Phaser time system and physics world accordingly.
     * Also updates the text overlay to display the current game speed.
     * @param {number} scale - The new time scale value (0, 0.5, 1, 2).
     */
    setTimeScale(scale) {
        this.timeScale = scale;
        
        // Apply to the Phaser time system
        this.scene.time.timeScale = scale;
        
        // Also apply to physics for consistent behavior
        this.scene.physics.world.timeScale = scale === 0 ? 0.0001 : 1 / scale;
        
        // Update the indicator text
        let speedLabel = scale === 0 ? 'PAUSED' : `${scale}x`;
        this.timeScaleText.setText(`Speed: ${speedLabel}`);
    }
    
    /**
     * Gets the delta time scaled by the current time scale.
     * @param {number} delta - The delta time value to be scaled.
     * @returns {number} The scaled delta time value.
     */
    getScaledDelta(delta) {
        return delta * this.timeScale;
    }
}
