import { GameConfig } from "../config/GameConfig";

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
    
    setupControls() {
        this.scene.input.keyboard.on('keydown-ONE', () => this.setTimeScale(0));
        this.scene.input.keyboard.on('keydown-TWO', () => this.setTimeScale(0.5));
        this.scene.input.keyboard.on('keydown-THREE', () => this.setTimeScale(1));
        this.scene.input.keyboard.on('keydown-FOUR', () => this.setTimeScale(2));
    }
    
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
    
    getScaledDelta(delta) {
        return delta * this.timeScale;
    }
}
