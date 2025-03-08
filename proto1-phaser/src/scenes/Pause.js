import { Scene } from 'phaser';

export class Pause extends Scene {
    constructor() {
        super('Pause');
    }

    create() {
        // Semi-transparent background
        this.add.rectangle(450, 800, 900, 1600, 0x000000, 0.7);
        
        // Pause title
        this.add.text(450, 700, 'PAUSED', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Resume button
        const resumeButton = this.add.text(450, 850, 'Resume', {
            fontFamily: 'Arial',
            fontSize: 36,
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setInteractive();
        
        resumeButton.on('pointerdown', () => {
            this.scene.resume('Game');
            this.scene.stop();
        });
        
        // Main Menu button
        const menuButton = this.add.text(450, 950, 'Main Menu', {
            fontFamily: 'Arial',
            fontSize: 36,
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setInteractive();
        
        menuButton.on('pointerdown', () => {
            this.scene.stop('Game');
            this.scene.start('MainMenu');
        });
        
        // Also listen for P key to resume
        this.input.keyboard.on('keydown-P', () => {
            this.scene.resume('Game');
            this.scene.stop();
        });
    }
}