import { Scene } from 'phaser';
import { TextureGenerator } from '../utils/TextureGenerator';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    /**
     * Initializes the preloader scene, setting up a background image and a simple progress bar to display the loading progress.
     * The progress bar is updated using the 'progress' event emitted by the LoaderPlugin.
     */
    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    /**
     * Preloads the assets for the game, including setting the asset path and loading an image named 'logo.png'.
     */
    preload ()
    {
        // Load the assets for the game
        this.load.setPath('assets');
        this.load.image('logo', 'logo.png');
        
        // Generate all textures
        TextureGenerator.generateAllTextures(this);
    }

    /**
     * Performs any necessary setup after all assets have been loaded, such as creating global objects that can be used throughout the game. Then transitions to the MainMenu scene.
     */
    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}