/**
 * The main entry point for the Phaser game application.
 * This file sets up the game configuration, including the game scenes, physics, and scaling options.
 * The game is configured to run in Phaser's AUTO mode, which automatically determines the best rendering method (WebGL or Canvas).
 * The game is centered in the parent container with a portrait orientation and a fixed size of 900x1600 pixels.
 * The game scenes included are Boot, Preloader, MainMenu, Game, GameOver, and Pause.
 * The physics system is set to the default 'arcade' mode with no gravity.
 */
import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Pause } from './scenes/Pause';
import { GameConfig } from './config/GameConfig';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
/**
 * The game configuration object that sets up the Phaser game instance.
 * This configuration includes the game type, parent container, background color, scaling options, physics settings, and the list of game scenes to be loaded.
 */
const config = {
    type: GameConfig.core.type,
    parent: GameConfig.core.parent,
    backgroundColor: GameConfig.core.backgroundColor,
    scale: GameConfig.scale,
    physics: GameConfig.physics,
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        GameOver,
        Pause
    ]
};

export default new Phaser.Game(config);