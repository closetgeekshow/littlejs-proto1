import { GameConfig } from "../config/GameConfig";

export class InputController {
    constructor(scene) {
        this.scene = scene;
        
        // Keyboard input
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({ 
            w: 'W', a: 'A', s: 'S', d: 'D' 
        });
        
        // Virtual joystick with config values
        const { x, y, radius, baseRadius, thumbRadius, baseColor, thumbColor, forceMin } = GameConfig.joystick;
        
        this.joyStick = scene.plugins.get('rexvirtualjoystickplugin').add(scene, {
            x: x,
            y: y,
            radius: radius,
            base: scene.add.circle(0, 0, baseRadius, baseColor, 0.5),
            thumb: scene.add.circle(0, 0, thumbRadius, thumbColor, 0.8),
            dir: '8dir',
            forceMin: forceMin,
            fixed: true,
        });
    }
    
    getMovementVector() {
        const speed = GameConfig.player.maxSpeed;
        let x = 0;
        let y = 0;
        
        // First check joystick input
        if (this.joyStick && this.joyStick.force > 0) {
            return {
                x: this.joyStick.forceX * 0.7,
                y: this.joyStick.forceY * 0.7,
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