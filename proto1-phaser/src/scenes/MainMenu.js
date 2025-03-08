import { Scene } from 'phaser';

/**
 * Represents the main menu scene of the game.
 * Initializes the scene by adding a background image, a logo image, and a centered text label for the main menu.
 * Listens for a single pointer down event to start the 'Game' scene.
 */
export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    /**
     * Initializes the main menu scene.
     * Adds a background image, a logo image, and a centered text label for the main menu.
     * Listens for a single pointer down event to start the 'Game' scene.
     */
    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.image(512, 300, 'logo');

        this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
