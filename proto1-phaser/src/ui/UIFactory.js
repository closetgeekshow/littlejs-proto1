// THIS WAS NEVER USED
/**
 * A factory class for creating various UI elements in a Phaser.js scene.
 */
export class UIFactory {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Creates a text object with the given configuration.
     * @param {number} x - The x-coordinate of the text object.
     * @param {number} y - The y-coordinate of the text object.
     * @param {string} text - The text to be displayed.
     * @param {object} [style={}] - The style configuration for the text object.
     * @param {number} [origin=0.5] - The origin point of the text object.
     * @returns {Phaser.GameObjects.Text} The created text object.
     */
    createText(x, y, text, style = {}, origin = 0.5) {
        const textObject = this.scene.add.text(x, y, text, {
            fontFamily: style.fontFamily || 'Arial',
            fontSize: style.fontSize || '24px',
            color: style.color || '#ffffff',
            stroke: style.stroke,
            strokeThickness: style.strokeThickness || 0,
            backgroundColor: style.backgroundColor,
            padding: style.padding,
            align: style.align || 'center',
            ...style
        });
        
        textObject.setOrigin(origin);
        
        if (style.depth) textObject.setDepth(style.depth);
        
        return textObject;
    }

    /**
     * Creates a button with the given configuration.
     * @param {number} x - The x-coordinate of the button.
     * @param {number} y - The y-coordinate of the button.
     * @param {string} text - The text to be displayed on the button.
     * @param {object} [style={}] - The style configuration for the button.
     * @param {object} [callbacks={}] - The callback functions for button interactions.
     * @param {function} [callbacks.onClick] - The callback function for the button's click event.
     * @returns {Phaser.GameObjects.Text} The created button.
     */
    createButton(x, y, text, style = {}, callbacks = {}) {
        const button = this.createText(x, y, text, {
            backgroundColor: style.backgroundColor,
            padding: style.padding || { left: 20, right: 20, top: 10, bottom: 10 },
            ...style
        });
        
        button.setInteractive();
        
        // Set up hover effects
        button.on('pointerover', () => {
            button.alpha = 0.8;
        });
        
        button.on('pointerout', () => {
            button.alpha = 1;
        });
        
        // Set up callbacks
        if (callbacks.onClick) {
            button.on('pointerdown', callbacks.onClick);
        }
        
        return button;
    }

    /**
     * Creates a rectangle with the given position, size, and fill color.
     * @param {number} x - The x-coordinate of the rectangle.
     * @param {number} y - The y-coordinate of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {number} fillColor - The fill color of the rectangle.
     * @param {number} [alpha=1] - The alpha (transparency) of the rectangle.
     * @returns {Phaser.GameObjects.Rectangle} The created rectangle.
     */
    createRectangle(x, y, width, height, fillColor, alpha = 1) {
        const rect = this.scene.add.rectangle(x, y, width, height, fillColor, alpha);
        return rect;
    }

    /**
     * Creates a panel with the given position, size, and fill color.
     * @param {number} x - The x-coordinate of the panel.
     * @param {number} y - The y-coordinate of the panel.
     * @param {number} width - The width of the panel.
     * @param {number} height - The height of the panel.
     * @param {object} [config={}] - The configuration options for the panel.
     * @param {number} [config.fillColor=0x000000] - The fill color of the panel.
     * @param {number} [config.fillAlpha=0.7] - The alpha (transparency) of the panel fill.
     * @param {number} [config.strokeColor] - The color of the panel's stroke.
     * @param {number} [config.strokeWidth=1] - The width of the panel's stroke.
     * @returns {Phaser.GameObjects.Rectangle} The created panel.
     */
    createPanel(x, y, width, height, config = {}) {
        const panel = this.scene.add.rectangle(
            x, y, width, height, 
            config.fillColor || 0x000000, 
            config.fillAlpha || 0.7
        );
        
        if (config.strokeColor) {
            panel.setStrokeStyle(
                config.strokeWidth || 1, 
                config.strokeColor
            );
        }
        
        return panel;
    }

    /**
     * Creates an image with the given position, key, and optional configuration.
     * @param {number} x - The x-coordinate of the image.
     * @param {number} y - The y-coordinate of the image.
     * @param {string} key - The key of the image in the asset manager.
     * @param {object} [config={}] - The configuration options for the image.
     * @param {number} [config.origin] - The origin point of the image.
     * @param {number} [config.scale] - The scale of the image.
     * @param {number} [config.alpha] - The alpha (transparency) of the image.
     * @param {number} [config.depth] - The depth of the image.
     * @returns {Phaser.GameObjects.Image} The created image.
     */
    createImage(x, y, key, config = {}) {
        const image = this.scene.add.image(x, y, key);
        
        if (config.origin) image.setOrigin(config.origin);
        if (config.scale) image.setScale(config.scale);
        if (config.alpha) image.setAlpha(config.alpha);
        if (config.depth) image.setDepth(config.depth);
        
        return image;
    }

    /**
     * Creates a progress bar with a background and a bar that can be updated.
     * @param {number} x - The x-coordinate of the progress bar.
     * @param {number} y - The y-coordinate of the progress bar.
     * @param {number} width - The width of the progress bar.
     * @param {number} height - The height of the progress bar.
     * @param {object} [config={}] - The configuration options for the progress bar.
     * @param {number} [config.backgroundColor=0x000000] - The background color of the progress bar.
     * @param {number} [config.backgroundAlpha=0.3] - The alpha (transparency) of the progress bar background.
     * @param {boolean} [config.border] - Whether to draw a border around the progress bar.
     * @param {number} [config.borderWidth=1] - The width of the progress bar border.
     * @param {number} [config.borderColor=0xffffff] - The color of the progress bar border.
     * @param {number} [config.barColor=0xffffff] - The color of the progress bar.
     * @param {number} [config.padding=2] - The padding around the progress bar.
     * @returns {object} An object with the progress bar background, bar, and a setProgress function.
     */
    createProgressBar(x, y, width, height, config = {}) {
        const background = this.createRectangle(
            x, y, width, height, 
            config.backgroundColor || 0x000000,
            config.backgroundAlpha || 0.3
        );
        
        if (config.border) {
            background.setStrokeStyle(
                config.borderWidth || 1, 
                config.borderColor || 0xffffff
            );
        }
        
        // Create the actual progress bar
        const bar = this.createRectangle(
            x - (width / 2) + (config.padding || 2), 
            y, 
            0, // Initial width is 0
            height - (config.padding || 2) * 2, 
            config.barColor || 0xffffff
        );
        bar.setOrigin(0, 0.5); // Origin at left center
        
        return {
            background,
            bar,
            setProgress: (progress) => {
                // Progress from 0 to 1
                const maxWidth = width - (config.padding || 2) * 2;
                bar.width = maxWidth * progress;
            }
        };
    }
}
