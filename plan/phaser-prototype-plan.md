# Phaser Adaptation of High-Level Porting Plan

## 1. Input System
- **Keyboard Input:**  
  - Use Phaser's input manager to track movement keys.

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ w: 'W', a: 'A', s: 'S', d: 'D' });

- **Mouse Input:**  
  - Track mouse position for aiming.

    this.input.on('pointermove', function (pointer) {
        this.aimX = pointer.x;
        this.aimY = pointer.y;
    });

- **Touch Joystick:**
  - Implement virtual joystick for mobile using Acquati's touchscreen-joystick-for-phaser-3.

    // In preload function:
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/Acquati/touchscreen-joystick-for-phaser-3/master/dist/rexvirtualjoystickplugin.min.js', true);
    
    // In create function:
    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
        x: 450,
        y: 1400,
        radius: 60,
        base: this.add.circle(0, 0, 70, 0x888888, 0.5),
        thumb: this.add.circle(0, 0, 35, 0xcccccc, 0.8),
        dir: '8dir',
        forceMin: 16,
        fixed: true
    });

- **Abstraction Layer:**  
  - Wrap input handling inside a helper function that handles both keyboard and joystick.

    function getMovementVector() {
        // First check joystick input
        if (this.joyStick && this.joyStick.force > 0) {
            return {
                x: this.joyStick.forceX * speed,
                y: this.joyStick.forceY * speed
            };
        }
        
        // Fall back to keyboard
        return {
            x: (this.wasd.d.isDown - this.wasd.a.isDown) * speed,
            y: (this.wasd.s.isDown - this.wasd.w.isDown) * speed
        };
    }

## 2. Character Controller
- **Movement & Collision:**  
  - Use Phaser's physics system for movement.

    this.physics.add.existing(player);
    player.body.setVelocity(getMovementVector().x, getMovementVector().y);

- **Health & Damage:**  
  - Add a property for health and implement damage logic.

    player.health = 100;
    function takeDamage(amount) {
        player.health -= amount;
        if (player.health <= 0) {
            player.destroy();
        }
    }

- **Auto-Targeting Integration:**  
  - Use Phaser's physics groups to track nearby enemies.

    let nearestEnemy = this.physics.closest(player, enemies.getChildren());

## 3. Weapon System
- **Auto-Shooting:**  
  - Create a loop to continuously fire bullets.

    this.time.addEvent({
        delay: 100,
        loop: true,
        callback: function () {
            let bullet = bullets.create(player.x, player.y, 'bullet');
            this.physics.moveTo(bullet, nearestEnemy.x, nearestEnemy.y, 300);
        }
    });

- **Bullet Pooling:**  
  - Reuse bullets using physics groups.

    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 20,
        runChildUpdate: true
    });

## 4. Enemy AI & Spawning
- **Basic AI Behavior:**  
  - Move enemies toward the player.

    this.physics.add.overlap(enemies, player, function (enemy) {
        enemy.setVelocity(player.x - enemy.x, player.y - enemy.y);
    });

- **Spawning System:**  
  - Use timed events to spawn enemies.

    this.time.addEvent({
        delay: 2000,
        loop: true,
        callback: function () {
            let enemy = enemies.create(Math.random() * 900, -50, 'enemy');
            this.physics.add.existing(enemy);
        }
    });
