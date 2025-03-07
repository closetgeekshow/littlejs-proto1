# CT.js Adaptation of High-Level Porting Plan

## 1. Input System
- **Keyboard Input:**  
  - Use ct.js' built-in keyboard API to map movement keys (WASD).
  - Create an input module for easy modification.
  
    ct.inputs.addKey('w');
    ct.inputs.addKey('a');
    ct.inputs.addKey('s');
    ct.inputs.addKey('d');

- **Mouse Input:**  
  - Capture mouse position for aiming and translate it into direction vectors.
  
    let aimX = ct.mouse.x;
    let aimY = ct.mouse.y;

- **Abstraction Layer:**  
  - Wrap input handling inside a function to match TDE’s structure.
  
    function getMovementVector() {
        return {
            x: (ct.inputs.down('d') - ct.inputs.down('a')) * speed,
            y: (ct.inputs.down('s') - ct.inputs.down('w')) * speed
        };
    }

## 2. Character Controller
- **Movement & Collision:**  
  - Use ct.place to detect collision and restrict movement.
  
    this.speed = 4;
    this.x += getMovementVector().x;
    this.y += getMovementVector().y;

- **Health & Damage:**  
  - Add a custom property for health and implement damage logic.
  
    this.health = 100;
    function takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }

- **Auto-Targeting Integration:**  
  - Scan for nearby enemies and select the closest one.

    let nearest = ct.place.nearest(this, 'Enemy', 200);

## 3. Weapon System
- **Auto-Shooting:**  
  - Create an interval to continuously fire bullets.

    function shoot() {
        if (nearest) {
            ct.emit.particle('Bullet', this.x, this.y, {direction: angleTo(nearest.x, nearest.y)});
        }
    }
    ct.timers.add(10, shoot);

- **Bullet Pooling:**  
  - Use ct.place for collision and reuse bullets.

    if (ct.place.meet(this, 'Enemy')) {
        this.destroy();
    }

## 4. Enemy AI & Spawning
- **Basic AI Behavior:**  
  - Make enemies move toward the player.
  
    this.speed = 2;
    let angle = Math.atan2(player.y - this.y, player.x - this.x);
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;

- **Spawning System:**  
  - Use ct.spawn to create enemies dynamically.

    function spawnEnemy() {
        ct.spawn('Enemy', randomX(), randomY());
    }
    ct.timers.add(60, spawnEnemy, -1);

## 5. Base Defense Mechanics
- **Base Object:**  
  - Give the base a health system.

    this.health = 500;
    function takeBaseDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            gameOver();
        }
    }

- **Turret Functionality:**  
  - Create a turret that shoots automatically.

    function turretShoot() {
        let target = ct.place.nearest(this, 'Enemy', 300);
        if (target) {
            ct.emit.particle('Bullet', this.x, this.y, {direction: angleTo(target.x, target.y)});
        }
    }
    ct.timers.add(20, turretShoot, -1);

# End of CT.js Adaptation
