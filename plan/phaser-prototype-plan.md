# Phaser Adaptation of High-Level Porting Plan

## 1. Input System
- **Keyboard Input:**  
  - Use Phaser’s input manager to track movement keys.

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ w: 'W', a: 'A', s: 'S', d: 'D' });

- **Mouse Input:**  
  - Track mouse position for aiming.

    this.input.on('pointermove', function (pointer) {
        this.aimX = pointer.x;
        this.aimY = pointer.y;
    });

- **Abstraction Layer:**  
  - Wrap input handling inside a helper function.

    function getMovementVector() {
        return {
            x: (this.wasd.d.isDown - this.wasd.a.isDown) * speed,
            y: (this.wasd.s.isDown - this.wasd.w.isDown) * speed
        };
    }

## 2. Character Controller
- **Movement & Collision:**  
  - Use Phaser’s physics system for movement.

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
  - Use Phaser’s physics groups to track nearby enemies.

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
            let enemy = enemies.create(randomX(), randomY(), 'enemy');
            this.physics.add.existing(enemy);
        }
    });

## 5. Base Defense Mechanics
- **Base Object:**  
  - Give the base health properties.

    base.health = 500;
    function takeBaseDamage(amount) {
        base.health -= amount;
        if (base.health <= 0) {
            gameOver();
        }
    }

- **Turret Functionality:**  
  - Implement a turret that auto-fires at enemies.

    this.time.addEvent({
        delay: 500,
        loop: true,
        callback: function () {
            let target = this.physics.closest(turret, enemies.getChildren());
            if (target) {
                let bullet = bullets.create(turret.x, turret.y, 'bullet');
                this.physics.moveTo(bullet, target.x, target.y, 400);
            }
        }
    });

# End of Phaser Adaptation
