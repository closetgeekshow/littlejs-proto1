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
