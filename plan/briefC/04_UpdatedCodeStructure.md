## 🎮 UPDATED CODE STRUCTURE

### Global Game Object
```javascript
// Central game constants and shared state
const G = {
    // Game dimensions
    width: 1280, 
    height: 720,
    tileSize: 16,
    
    // Resources
    tiles: ['tiles.png'],
    
    // Colors
    cols: {
        player: new Color(0, 0, 1, 1),   // Blue
        enemy: new Color(1, 0, 0, 1),    // Red
        bullet: new Color(1, 1, 1, 1),   // White
        background: new Color(.1, .1, .1, 1)  // Dark gray
    },
    
    // Sound effects
    sfx: {
        shoot: new Sound([.2,,1000,.04,.3,.6,1,.3,,,,,.01,,,,.1,.7,.01]),
        hit: new Sound([2.1,,156,.01,.01,.3,2,.6,,,,,,1.3,,.2,.14,.45,.01]),
        playerHit: new Sound([1.2,,300,.04,.3,.7,1,.5,,,,,.01,,,,.1,.9,.03]),
    },
    
    // Game state
    gameState: 'TITLE',  // 'TITLE', 'PLAYING', 'WAVE_TRANSITION', 'GAME_OVER'
    waveNumber: 0,
    killCount: 0,
    survivalTime: 0,
    debug: false,
    
    // Object references (set during init)
    player: null,
    enemyPool: null,
    bulletPool: null,
    collisionSystem: null,
}
```

### Core Engine Setup

```javascript
function gameInit() {
    // Set game dimensions
    const gameSize = vec2(G.width, G.height);
    setCanvasFixedSize(gameSize);
    
    // Calculate size in tiles
    G.size = vec2(G.width / G.tileSize, G.height / G.tileSize);
    G.center = vec2(G.size.x/2, G.size.y/2);
    
    // Position camera and set scale
    setCameraPos(G.center);
    cameraScale = G.tileSize;
    
    // Create collision system
    G.collisionSystem = new CollisionSystem(128); // 128px cells
    
    // Create player
    G.player = new Player();
    
    // Create object pools
    G.enemyPool = new ObjectPool(Enemy, 50);
    G.bulletPool = new ObjectPool(Bullet, 100);
    
    // Initialize wave manager
    G.waveManager = new WaveManager(5); // Base enemies per wave
    
    // Reset game state
    G.gameState = 'TITLE';
    G.waveNumber = 0;
    G.killCount = 0;
    G.survivalTime = 0;
}

function gameUpdate() {
    // Update based on game state
    switch (G.gameState) {
        case 'TITLE':
            if (mouseWasPressed(0) || keyWasPressed('Space')) {
                startGame();
            }
            break;
            
        case 'PLAYING':
        case 'WAVE_TRANSITION':
            updateGameplay();
            break;
            
        case 'GAME_OVER':
            if (mouseWasPressed(0) || keyWasPressed('Space')) {
                gameInit(); // Restart game
            }
            break;
    }
    
    // Debug toggle
    if (keyWasPressed('F9')) {
        G.debug = !G.debug;
    }
}

function updateGameplay() {
    // Update survival time
    G.survivalTime += timeDelta;
    
    // Toggle auto-targeting
    if (keyWasPressed('KeyT')) {
        G.player.targetMode = !G.player.targetMode;
    }
    
    // Update wave manager
    G.waveManager.update();
    
    // Center camera on player
    cameraPos = G.player.pos;
}

function gameRender() {
    // Clear screen with background color
    drawRect(G.center, G.size, G.cols.background);
    
    // Draw grid for spatial awareness
    if (G.debug) {
        drawGrid();
    }
    
    // Render based on game state
    switch (G.gameState) {
        case 'TITLE':
            drawTitleScreen();
            break;
            
        case 'PLAYING':
        case 'WAVE_TRANSITION':
            // Game objects render automatically
            drawGameplayUI();
            break;
            
        case 'GAME_OVER':
            drawGameOverScreen();
            break;
    }
}

// Initialize engine with our callbacks
engineInit(
    gameInit,
    gameUpdate, gameUpdatePost,
    gameRender, gameRenderPost,
    G.tiles
);
```

### Player Class - Improved with Ski Game Patterns

```javascript
class Player extends EngineObject {
    constructor() {
        // Create player at center with blue color
        super(G.center, vec2(1, 1));
        this.color = G.cols.player;
        
        // Player properties
        this.health = 3;
        this.maxHealth = 3;
        this.speed = 160;
        this.accelRate = 8;
        
        // Targeting system
        this.targetMode = false;
        this.currentTarget = null;
        
        // Visual and gameplay state
        this.invincibilityTimer = new Timer();
        this.fireTimer = new Timer();
        this.fireRate = 4; // shots per second
        
        // Set up collision
        this.setCollision(true, true, false, false);
    }
    
    update() {
        super.update();
        
        // Skip updates if game not playing
        if (G.gameState !== 'PLAYING') return;
        
        this.handleMovement();
        this.handleRotation();
        this.handleShooting();
        this.findTarget(300); // 300px target radius
        this.checkScreenBounds();
    }
    
    handleMovement() {
        // Get input direction from WASD/arrows
        const inputX = (keyIsDown('KeyD') || keyIsDown('ArrowRight')) - 
                    (keyIsDown('KeyA') || keyIsDown('ArrowLeft'));
        const inputY = (keyIsDown('KeyS') || keyIsDown('ArrowDown')) - 
                    (keyIsDown('KeyW') || keyIsDown('ArrowUp'));
        
        const inputVector = vec2(inputX, inputY).normalize();
        
        // Apply smooth acceleration
        this.velocity = this.velocity.lerp(
            inputVector.scale(this.speed),
            this.accelRate * timeDelta
        );
        
        // Apply velocity
        this.pos = this.pos.add(this.velocity.scale(timeDelta));
    }
    
    handleRotation() {
        if (this.targetMode && this.currentTarget) {
            // Auto-aim toward target
            const targetDir = this.currentTarget.pos.subtract(this.pos);
            this.angle = targetDir.angle();
        } else {
            // Aim toward mouse
            const mouseDir = mousePos.subtract(this.pos);
            this.angle = mouseDir.angle();
        }
    }
    
    handleShooting() {
        // Fire when mouse clicked or held
        if ((mouseIsDown(0) || touchIsDown()) && !this.fireTimer.active()) {
            this.fire();
            this.fireTimer.set(1 / this.fireRate);
        }
    }
    
    fire() {
        const bullet = G.bulletPool.getInactive();
        if (bullet) {
            // Calculate spawn position (front of player)
            const spawnOffset = vec2(Math.cos(this.angle), Math.sin(this.angle))
                .scale(this.size.x);
            const spawnPos = this.pos.add(spawnOffset);
            
            // Fire bullet
            bullet.fire(spawnPos, this.angle);
            
            // Play sound effect
            G.sfx.shoot.play(this.pos);
            
            // Create particles for visual feedback
            this.createMuzzleFlash();
        }
    }
    
    findTarget(radius) {
        if (!this.targetMode) {
            this.currentTarget = null;
            return null;
        }
        
        // Find closest enemy using collision system
        this.currentTarget = G.collisionSystem.findClosestEntity(
            this.pos, radius, Enemy
        );
        
        return this.currentTarget;
    }
    
    takeDamage() {
        if (!this.invincibilityTimer.active()) {
            this.health--;
            this.invincibilityTimer.set(0.5); // 0.5 seconds invincibility
            
            // Visual feedback
            this.createDamageEffect();
            G.sfx.playerHit.play(this.pos);
            
            // Check for game over
            if (this.health <= 0) {
                G.gameState = 'GAME_OVER';
            }
        }
    }
    
    createMuzzleFlash() {
        // Create particles for muzzle flash
        const flashPos = this.pos.add(
            vec2(Math.cos(this.angle), Math.sin(this.angle)).scale(this.size.x * 0.7)
        );
        
        new ParticleEmitter(
            flashPos, this.angle,
            0, .1, 10, 1,
            null, // No tile info
            new Color(1, 1, 0, 1), new Color(1, .5, 0, 1),
            new Color(1, 0, 0, 0), new Color(.5, 0, 0, 0),
            .2, .5, .1, 3, 0,
            .95, 1, 0, .5,
            .1, .2, 0, 1
        );
    }
    
    createDamageEffect() {
        // Visual feedback for taking damage
        new ParticleEmitter(
            this.pos, 0,
            1, .2, 20, 2*Math.PI,
            null, // No tile info
            G.cols.player, new Color(1, 1, 1, 1),
            G.cols.player.scale(1, 0), new Color(1, 1, 1, 0),
            .5, .5, .1, 2, 10,
            .95, .95, 0, 2*Math.PI,
            .1, .5, 0, 0
        );
    }
    
    render() {
        // Flash when invincible
        if (this.invincibilityTimer.active() && Math.sin(time * 20) > 0) {
            this.additiveColor = new Color(.5, .5, .5, 0);
        } else {
            this.additiveColor = new Color(0, 0, 0, 0);
        }
        
        // Draw targeting line if auto-targeting
        if (this.targetMode && this.currentTarget) {
            drawLine(
                this.pos, 
                this.currentTarget.pos, 
                0.05, 
                new Color(0, 1, 0, 0.5)
            );
        }
        
        // Let engine handle actual rendering
        super.render();
    }
}

class Enemy extends EngineObject {
    constructor() {
        // Create enemy with red color
        super(vec2(0, 0), vec2(1, 1));
        this.color = G.cols.enemy;
        
        // Enemy properties
        this.health = 2;
        this.maxHealth = 2;
        this.speed = 120;
        this.active = false;
        this.flashTimer = new Timer();
        
        // Set up collision
        this.setCollision(true, true, false, false);
    }
    
    activate(position, health = 2) {
        this.pos = position.copy();
        this.health = health;
        this.maxHealth = health;
        this.active = true;
        this.flashTimer.set(0);
        
        // Add to collision system
        G.collisionSystem.addToGrid(this);
    }
    
    update() {
        if (!this.active) return;
        
        super.update();
        
        // Move toward player
        const dirToPlayer = G.player.pos.subtract(this.pos).normalize();
        this.velocity = dirToPlayer.scale(this.speed);
        this.pos = this.pos.add(this.velocity.scale(timeDelta));
        
        // Update position in collision grid
        G.collisionSystem.updateEntityPosition(this);
        
        // Check for screen bounds
        this.checkScreenBounds();
    }
    
    checkScreenBounds() {
        // Get screen bounds with margin
        const margin = 50;
        const cameraSize = vec2(G.width, G.height).scale(1/G.tileSize);
        const minX = cameraPos.x - cameraSize.x/2 - margin;
        const maxX = cameraPos.x + cameraSize.x/2 + margin;
        const minY = cameraPos.y - cameraSize.y/2 - margin;
        const maxY = cameraPos.y + cameraSize.y/2 + margin;
        
        // Destroy if out of bounds by a large margin
        if (this.pos.x < minX || this.pos.x > maxX || 
            this.pos.y < minY || this.pos.y > maxY) {
            this.destroy();
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        this.flashTimer.set(0.1); // Flash for 0.1 seconds
        
        if (this.health <= 0) {
            this.destroy();
            G.killCount++;
            this.createDeathEffect();
            G.sfx.hit.play(this.pos);
        }
    }
    
    createDeathEffect() {
        // Visual explosion when enemy dies
        new ParticleEmitter(
            this.pos, 0,
            0, .2, 15, 2*Math.PI,
            null, // No tile info
            G.cols.enemy, new Color(1, .5, .5, 1),
            G.cols.enemy.scale(1, 0), new Color(1, .5, .5, 0),
            .5, .5, .1, 3, 10,
            .95, .95, 0, 2*Math.PI,
            .1, .5, 0, 0
        );
    }
    
    destroy() {
        this.active = false;
        G.collisionSystem.removeFromGrid(this);
    }
    
    render() {
        if (!this.active) return;
        
        // Flash white when hit
        if (this.flashTimer.active()) {
            this.additiveColor = new Color(.5, .5, .5, 0);
        } else {
            this.additiveColor = new Color(0, 0, 0, 0);
        }
        
        // Draw health bar if damaged
        if (this.health < this.maxHealth) {
            const healthPercent = this.health / this.maxHealth;
            const barWidth = this.size.x * 1.2;
            const barHeight = 0.1;
            const barPos = this.pos.add(vec2(0, -this.size.y * 0.7));
            
            // Bar background
            drawRect(barPos, vec2(barWidth, barHeight), new Color(0, 0, 0, 0.7));
            // Health remaining
            drawRect(
                barPos.add(vec2((healthPercent - 1) * barWidth / 2, 0)), 
                vec2(barWidth * healthPercent, barHeight), 
                new Color(1, 0, 0, 0.7)
            );
        }
        
        super.render();
    }
    
    collideWithObject(obj) {
        if (!this.active) return;
        
        if (obj === G.player) {
            // Handle player collision in player's takeDamage method
        }
        
        if (obj.constructor.name === 'Bullet') {
            this.takeDamage(1);
            obj.deactivate();
        }
    }
}
```


