/**
 * The Boot scene is responsible for loading any assets required for the Preloader scene, such as a game logo or background image.
 * It also handles orientation changes, adjusting the UI for portrait mode or displaying a "please rotate" message for landscape mode.
 */
import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
    }

    /**
     * Handles the creation of the Boot scene, including starting the Preloader scene and adjusting the UI based on device orientation.
     * If the device is in portrait mode, the default layout is used. If the device is in landscape mode, a "please rotate" message is displayed.
     */
    create ()
    {
        this.scene.start('Preloader');

        // Handle orientation changes
        this.scale.on('orientationchange', (orientation) => {
            if (orientation === Phaser.Scale.PORTRAIT) {
                // Adjust UI for portrait mode
                // This is your default layout
            } else {
                // Show a "please rotate" message or adjust UI for landscape
                this.add.text(this.scale.width/2, this.scale.height/2, 
                    'Please rotate your device to portrait mode', 
                    { fontSize: '24px', fill: '#fff' })
                    .setOrigin(0.5);
            }
        });
    }
}
