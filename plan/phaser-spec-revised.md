# Prototype 1: Core Survival Loop Specification Document (Phaser)

## Overview
This document outlines the technical specifications for implementing Prototype 1 of the TDETest game using Phaser 3. This prototype focuses on validating the core combat and wave survival mechanics with simplified visuals.

## Goals and Exit Criteria
**Primary Goal**: Validate that the "kiting while shooting" gameplay feels satisfying.
**Exit Criteria**: Players can effectively navigate around enemies while shooting, creating a tense but manageable combat experience.

## Technical Implementation

### 1. Game Setup

#### Canvas and Rendering
```javascript
// Initialize Phaser with a 1280x720 resolution
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [MainScene]
};

// Create new Phaser Game instance
const game = new Phaser.Game(config);

// Set camera to follow player in MainScene
this.cameras.main.startFollow(this.player);

// Implement a simple grid background for spatial awareness
this.add.grid(0, 0, this.game.config.width * 2, this.game.config.height * 2, 32, 32, 0x000000, 0, 0x222222, 0.2);

// Support multiple screen resolutions with appropriate scaling
this.scale.setGameSize(1280, 720);
this.scale.scaleMode = Phaser.Scale.FIT;
this.scale.refresh();
```

#### Game Loop
```javascript
// Use Phaser's built-in game loop with proper delta time handling
this.update = function(time, delta) {
  // Game update logic here
};

// Implement pause functionality
this.input.keyboard.on('keydown-ESC', () => {
  this.scene.pause();
  this.scene.launch('PauseScene');
});

// Create simple restart mechanism on player death
this.events.on('player-death', () => {
  this.time.delayedCall(3000, () => {
    this.scene.restart();
  });
});

// Include debug speed controls (0.5x, 1x, 2x) for testing
this.input.keyboard.on('keydown-ONE', () => { this.time.timeScale = 0.5; });
this.input.keyboard.on('keydown-TWO', () => { this.time.timeScale = 1.0; });
this.input.keyboard.on('keydown-THREE', () => { this.time.timeScale = 2.0; });
```

### 2. Player Character (Blue Cube)

#### Visual Representation
```javascript
// Create a blue rectangle (16x16 pixels)
this.player = this.add.rectangle(400, 300, 16, 16, 0x0000FF);
this.physics.add.existing(this.player);

// Add rotation to face mouse cursor or auto-targeted enemy
this.update = function(time, delta) {
  if (this.autoTarget && this.currentTarget) {
    // Face current target
    this.player.rotation = Phaser.Math.Angle.Between(
      this.player.x, this.player.y,
      this.currentTarget.x, this.currentTarget.y
    );
  } else {
    // Face mouse cursor
    const pointer = this.input.activePointer;
    this.player.rotation = Phaser.Math.Angle.Between(
      this.player.x, this.player.y,
      pointer.worldX, pointer.worldY
    );
  }
};

// Optional: Add subtle "pulse" effect when shooting
this.pulseEffect = () => {
  this.tweens.add({
    targets: this.player,
    scaleX: 1.2,
    scaleY: 1.2,
    duration: 50,
    yoyo: true
  });
};
```

#### Movement System
```javascript
// Create cursor keys for WASD movement
this.cursors = this.input.keyboard.addKeys({
  up: Phaser.Input.Keyboard.KeyCodes.W,
  down: Phaser.Input.Keyboard.KeyCodes.S,
  left: Phaser.Input.Keyboard.KeyCodes.A,
  right: Phaser.Input.Keyboard.KeyCodes.D
});

// Set physics properties
this.player.body.setCollideWorldBounds(true);
this.player.body.maxVelocity.set(160);
this.player.body.drag.set(800); // For deceleration

// Implement movement in update function
this.update = function(time, delta) {
  // Reset velocity each frame
  this.player.body.setVelocity(0);
  
  // Apply velocity based on input
  if (this.cursors.left.isDown) {
    this.player.body.velocity.x = -160;
  } else if (this.cursors.right.isDown) {
    this.player.body.velocity.x = 160;
  }
  
  if (this.cursors.up.isDown) {
    this.player.body.velocity.y = -160;
  } else if (this.cursors.down.isDown) {
    this.player.body.velocity.y = 160;
  }
  
  // Normalize diagonal movement
  this.player.body.velocity.normalize().scale(160);
};
```

#### Shooting Mechanics
```javascript
// Setup weapon configuration
this.weapon = {
  fireRate: 250, // 4 shots per second
  bulletSpeed: 400,
  damage: 1,
  range: 500,
  targetingRadius: 300,
  lastFired: 0
};

// Create bullet group with physics
this.bullets = this.physics.add.group({
  classType: Phaser.GameObjects.Rectangle,
  defaultKey: null,
  defaultFrame: null,
  active: true,
  maxSize: 100,
  runChildUpdate: true
});

// Implement firing function
this.fireBullet = function(time) {
  if (time - this.weapon.lastFired < this.weapon.fireRate) {
    return; // Too soon to fire again
  }
  
  // Calculate firing direction
  let directionX, directionY;
  if (this.autoTarget && this.currentTarget) {
    // Auto aim at current target
    const angle = Phaser.Math.Angle.Between(
      this.player.x, this.player.y,
      this.currentTarget.x, this.currentTarget.y
    );
    directionX = Math.cos(angle);
    directionY = Math.sin(angle);
  } else {
    // Aim at mouse cursor
    const pointer = this.input.activePointer;
    const angle = Phaser.Math.Angle.Between(
      this.player.x, this.player.y,
      pointer.worldX, pointer.worldY
    );
    directionX = Math.cos(angle);
    directionY = Math.sin(angle);
  }
  
  // Create bullet
  const bullet = this.bullets.get(this.player.x, this.player.y);
  if (bullet) {
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.setSize(8, 4);
    bullet.setFillStyle(0xFFFFFF);
    bullet.depth = 5;
    bullet.lifespan = this.weapon.range / this.weapon.bulletSpeed * 1000; // Convert to milliseconds
    bullet.creationTime = time;
    
    // Set velocity
    bullet.body.velocity.x = directionX * this.weapon.bulletSpeed;
    bullet.body.velocity.y = directionY * this.weapon.bulletSpeed;
    
    // Update last fired time
    this.weapon.lastFired = time;
    
    // Play pulse effect
    this.pulseEffect();
  }
};

// Check for input and auto-fire in update loop
this.update = function(time, delta) {
  // Fire on mouse down or when auto-targeting
  if (this.input.activePointer.isDown || 
      (this.autoTarget && this.currentTarget)) {
    this.fireBullet(time);
  }
  
  // Update bullets lifespan
  this.bullets.getChildren().forEach(bullet => {
    if (time - bullet.creationTime > bullet.lifespan) {
      bullet.setActive(false);
      bullet.setVisible(false);
      this.bullets.killAndHide(bullet);
    }
  });
};
```

### 3. Enemy System (Red Cubes)

#### Enemy Properties
```javascript
// Create enemy class
class Enemy extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, 16, 16, 0xFF0000);
    this.scene = scene;
    this.health = 2;
    this.moveSpeed = 100;
    this.damage = 1;
    
    // Setup physics body
    scene.physics.world.enable(this);
    scene.add.existing(this);
  }
  
  takeDamage(amount) {
    this.health -= amount;
    
    // Flash white when hit
    this.scene.tweens.add({
      targets: this,
      fillColor: 0xFFFFFF,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        this.setFillStyle(0xFF0000);
      }
    });
    
    if (this.health <= 0) {
      this.destroy();
      return true; // Return true if enemy died
    }
    return false;
  }
  
  update(time, delta) {
    // Move toward player
    const player = this.scene.player;
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      player.x, player.y
    );
    
    this.body.velocity.x = Math.cos(angle) * this.moveSpeed;
    this.body.velocity.y = Math.sin(angle) * this.moveSpeed;
  }
}

// Create enemy group
this.enemies = this.physics.add.group({
  classType: Enemy,
  runChildUpdate: true
});
```

#### AI Behavior
```javascript
// Simple chase behavior is implemented in the Enemy class update method
// For enemy collision avoidance, you can add:
this.physics.add.collider(this.enemies, this.enemies, (enemy1, enemy2) => {
  // Apply small repulsion force
  const angle = Phaser.Math.Angle.Between(enemy1.x, enemy1.y, enemy2.x, enemy2.y);
  const repulsionForce = 20;
  
  enemy1.body.velocity.x -= Math.cos(angle) * repulsionForce;
  enemy1.body.velocity.y -= Math.sin(angle) * repulsionForce;
  
  enemy2.body.velocity.x += Math.cos(angle) * repulsionForce;
  enemy2.body.velocity.y += Math.sin(angle) * repulsionForce;
});
```

#### Spawning System
```javascript
// Implement wave-based spawning system
this.waveManager = {
  currentWave: 0,
  enemiesPerWave: (wave) => Math.min(5 + (wave - 1) * 5, 50), // +5 enemies per wave, max 50
  spawnDelay: 5000, // 5 seconds between waves
  spawnEnemy: (scene, x, y) => {
    const enemy = new Enemy(scene, x, y);
    scene.enemies.add(enemy);
    return enemy;
  },
  startNextWave: function(scene) {
    this.currentWave++;
    const enemyCount = this.enemiesPerWave(this.currentWave);
    
    // Display wave text
    const waveText = scene.add.text(
      scene.cameras.main.centerX, 
      scene.cameras.main.centerY,
      `WAVE ${this.currentWave}`,
      { fontSize: '32px', color: '#ffffff' }
    ).setOrigin(0.5);
    
    scene.tweens.add({
      targets: waveText,
      alpha: { from: 1, to: 0 },
      duration: 2000,
      onComplete: () => waveText.destroy()
    });
    
    // Spawn enemies at screen edges
    for (let i = 0; i < enemyCount; i++) {
      const side = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left
      let x, y;
      
      switch (side) {
        case 0: // top
          x = Phaser.Math.Between(0, scene.game.config.width);
          y = -20;
          break;
        case 1: // right
          x = scene.game.config.width + 20;
          y = Phaser.Math.Between(0, scene.game.config.height);
          break;
        case 2: // bottom
          x = Phaser.Math.Between(0, scene.game.config.width);
          y = scene.game.config.height + 20;
          break;
        case 3: // left
          x = -20;
          y = Phaser.Math.Between(0, scene.game.config.height);
          break;
      }
      
      this.spawnEnemy(scene, x, y);
    }
  },
  checkWaveComplete: function(scene) {
    if (scene.enemies.countActive() === 0) {
      scene.time.delayedCall(this.spawnDelay, () => {
        this.startNextWave(scene);
      });
    }
  }
};

// Start first wave
this.waveManager.startNextWave(this);
```

### 4. Combat System

#### Collision Detection
```javascript
// Setup collision detection using Phaser's Arcade Physics
this.physics.add.collider(this.player, this.enemies, this.playerEnemyCollision, null, this);
this.physics.add.collider(this.bullets, this.enemies, this.bulletEnemyCollision, null, this);

// Handler for player-enemy collision
this.playerEnemyCollision = function(player, enemy) {
  if (!this.player.invincible) {
    this.playerHealth--;
    this.updateHealthDisplay();
    
    // Create invincibility period
    this.player.invincible = true;
    this.player.alpha = 0.5;
    
    // Screen flash effect
    const flashEffect = this.add.rectangle(0, 0, 
      this.game.config.width, this.game.config.height, 
      0xff0000, 0.3)
      .setOrigin(0)
      .setScrollFactor(0);
      
    this.tweens.add({
      targets: flashEffect,
      alpha: 0,
      duration: 300,
      onComplete: () => flashEffect.destroy()
    });
    
    // End invincibility after delay
    this.time.delayedCall(500, () => {
      this.player.invincible = false;
      this.player.alpha = 1;
    });
    
    // Check for player death
    if (this.playerHealth <= 0) {
      this.gameOver();
    }
  }
};

// Handler for bullet-enemy collision
this.bulletEnemyCollision = function(bullet, enemy) {
  // Disable the bullet
  bullet.setActive(false);
  bullet.setVisible(false);
  
  // Apply damage to enemy
  const killed = enemy.takeDamage(1);
  
  if (killed) {
    // Update kill count
    this.kills++;
    this.killText.setText(`Kills: ${this.kills}`);
    
    // Create explosion effect
    this.createExplosion(enemy.x, enemy.y);
    
    // Check if wave is complete
    this.waveManager.checkWaveComplete(this);
  }
};

// Create simple explosion effect
this.createExplosion = function(x, y) {
  const particles = this.add.particles(x, y, 'particle', {
    speed: { min: 50, max: 100 },
    scale: { start: 1, end: 0 },
    quantity: 4,
    lifespan: 300,
    emitting: false
  });
  
  particles.explode();
  
  // Remove particle emitter after animation completes
  this.time.delayedCall(300, () => {
    particles.destroy();
  });
};
```

#### Damage Application
```javascript
// Player health setup
this.playerHealth = 3;

// Health display creation
this.healthDisplay = [];
for (let i = 0; i < this.playerHealth; i++) {
  const healthSquare = this.add.rectangle(
    20 + i * 20, 20, 
    16, 16, 
    0x00FF00
  ).setScrollFactor(0);
  
  this.healthDisplay.push(healthSquare);
}

// Update health display function
this.updateHealthDisplay = function() {
  for (let i = 0; i < this.healthDisplay.length; i++) {
    this.healthDisplay[i].setFillStyle(
      i < this.playerHealth ? 0x00FF00 : 0x333333
    );
  }
};
```

### 5. UI Elements

#### Minimal HUD
```javascript
// Create HUD elements
this.createHUD = function() {
  // Create wave text
  this.waveText = this.add.text(
    10, 10, 
    `Wave: ${this.waveManager.currentWave}`, 
    { fontSize: '16px', color: '#ffffff' }
  ).setScrollFactor(0);
  
  // Create kill counter
  this.kills = 0;
  this.killText = this.add.text(
    10, 30,
    `Kills: ${this.kills}`,
    { fontSize: '16px', color: '#ffffff' }
  ).setScrollFactor(0);
  
  // Create timer
  this.startTime = this.time.now;
  this.timerText = this.add.text(
    10, 50,
    'Time: 0:00',
    { fontSize: '16px', color: '#ffffff' }
  ).setScrollFactor(0);
  
  // Create FPS counter
  this.fpsText = this.add.text(
    this.game.config.width - 70, 10,
    'FPS: 60',
    { fontSize: '16px', color: '#ffffff' }
  ).setScrollFactor(0);
  
  // Create targeting mode indicator
  this.targetingText = this.add.text(
    10, 70,
    'Mode: Manual',
    { fontSize: '16px', color: '#ffffff' }
  ).setScrollFactor(0);
};

// Update HUD in game loop
this.updateHUD = function(time, delta) {
  // Update wave text
  this.waveText.setText(`Wave: ${this.waveManager.currentWave}`);
  
  // Update timer
  const elapsed = Math.floor((time - this.startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
  
  // Update FPS counter (every half second)
  if (time - this.lastFpsUpdate > 500) {
    this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
    this.lastFpsUpdate = time;
  }
  
  // Update targeting mode text
  this.targetingText.setText(`Mode: ${this.autoTarget ? 'Auto' : 'Manual'}`);
};
```

#### Game States
```javascript
// Create separate scenes for different game states
// MainScene (main gameplay)
// TitleScene (start screen)
// GameOverScene (end screen)
// PauseScene (pause menu)

// Example game over function
this.gameOver = function() {
  // Save final stats
  this.registry.set('finalWave', this.waveManager.currentWave);
  this.registry.set('finalKills', this.kills);
  this.registry.set('finalTime', this.time.now - this.startTime);
  
  // Transition to game over scene
  this.scene.start('GameOverScene');
};

// Example of scene transition from game over back to title
// In GameOverScene
this.time.delayedCall(3000, () => {
  this.scene.start('TitleScene');
});
```

### 6. Audio (Optional for Prototype 1)

#### Sound Effects
```javascript
// Load sound effects in preload
this.load.audio('shoot', 'assets/audio/shoot.wav');
this.load.audio('hit', 'assets/audio/hit.wav');
this.load.audio('playerHit', 'assets/audio/playerHit.wav');
this.load.audio('waveComplete', 'assets/audio/waveComplete.wav');

// Create sound objects
this.sounds = {
  shoot: this.sound.add('shoot'),
  hit: this.sound.add('hit'),
  playerHit: this.sound.add('playerHit'),
  waveComplete: this.sound.add('waveComplete')
};

// Play sound when shooting
this.fireBullet = function(time) {
  // ... existing bullet creation code ...
  
  // Play shoot sound
  this.sounds.shoot.play();
};

// Play sound when enemy is hit
this.bulletEnemyCollision = function(bullet, enemy) {
  // ... existing collision code ...
  
  // Play hit sound
  this.sounds.hit.play();
  
  if (killed) {
    // ... existing code ...
  }
};

// Play sound on wave completion
this.waveManager.checkWaveComplete = function(scene) {
  if (scene.enemies.countActive() === 0) {
    // Play wave complete sound
    scene.sounds.waveComplete.play();
    
    // ... existing code ...
  }
};
```

### 7. Performance Considerations

#### Optimization
```javascript
// Object pooling for bullets is handled by Phaser's group system
// Using Arcade Physics with built-in spatial hash for efficient collision detection

// Set up max enemies
this.waveManager.enemiesPerWave = (wave) => Math.min(5 + (wave - 1) * 5, 50);

// Performance monitoring
this.performanceStats = {
  lastCheck: 0,
  frameRate: 0,
  entityCount: 0
};

// Update performance stats in game loop
this.updatePerformanceStats = function(time) {
  if (time - this.performanceStats.lastCheck > 1000) {
    this.performanceStats.frameRate = Math.round(this.game.loop.actualFps);
    this.performanceStats.entityCount = 
      1 + // player
      this.enemies.countActive() +
      this.bullets.countActive();
      
    this.performanceStats.lastCheck = time;
    
    // Update debug display if enabled
    if (this.debugDisplay) {
      this.updateDebugDisplay();
    }
  }
};
```

### 8. Input System Architecture

#### Input Manager
```javascript
// Create input manager in create method
this.setupInputManager = function() {
  // Keyboard input
  this.keys = this.input.keyboard.addKeys({
    up: 'W',
    down: 'S',
    left: 'A',
    right: 'D',
    toggleTarget: 'T',
    restart: 'R',
    pause: 'ESC',
    debugToggle: 'F9',
    save: 'F10',
    load: 'F11'
  });
  
  // Mouse position tracking
  this.input.on('pointermove', (pointer) => {
    this.mousePosition = {
      x: pointer.worldX,
      y: pointer.worldY
    };
  });
  
  // Input event handlers
  this.input.keyboard.on('keydown-T', () => {
    this.autoTarget = !this.autoTarget;
  });
  
  this.input.keyboard.on('keydown-R', () => {
    if (this.playerHealth <= 0) {
      this.scene.restart();
    }
  });
  
  this.input.keyboard.on('keydown-F9', () => {
    this.debugDisplay = !this.debugDisplay;
    this.updateDebugDisplayVisibility();
  });
  
  this.input.keyboard.on('keydown-F10', () => {
    this.saveGameState();
  });
  
  this.input.keyboard.on('keydown-F11', () => {
    this.loadGameState();
  });
};
```

#### Control Mapping
```javascript
// Input handling in update method
this.handleInput = function(time, delta) {
  // Movement is handled in player movement section
  
  // Check for auto-targeting toggle
  if (Phaser.Input.Keyboard.JustDown(this.keys.toggleTarget)) {
    this.autoTarget = !this.autoTarget;
  }
  
  // Check for pause
  if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
    this.scene.pause();
    this.scene.launch('PauseScene');
  }
};
```

### 9. Auto-Targeting Module

#### Target Acquisition
```javascript
// Set up auto-targeting
this.autoTarget = false;
this.currentTarget = null;
this.targetingRadius = 300;

// Create targeting visual (circle)
this.targetingCircle = this.add.circle(0, 0, this.targetingRadius, 0x00FF00, 0.1);
this.targetingCircle.setVisible(false);

// Create targeting line
this.targetingLine = this.add.line(0, 0, 0, 0, 0, 0, 0x00FF00);
this.targetingLine.setVisible(false);

// Update auto-targeting in game loop
this.updateAutoTargeting = function() {
  if (this.autoTarget) {
    // Show targeting radius in debug mode
    if (this.debugDisplay) {
      this.targetingCircle.setPosition(this.player.x, this.player.y);
      this.targetingCircle.setVisible(true);
    } else {
      this.targetingCircle.setVisible(false);
    }
    
    // Find closest enemy within radius
    let closestDistance = this.targetingRadius;
    let closestEnemy = null;
    
    this.enemies.getChildren().forEach(enemy => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        enemy.x, enemy.y
      );
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = enemy;
      }
    });
    
    // Update current target
    this.currentTarget = closestEnemy;
    
    // Update targeting line
    if (this.currentTarget) {
      this.targetingLine.setVisible(true);
      this.targetingLine.setTo(
        this.player.x, this.player.y,
        this.currentTarget.x, this.currentTarget.y
      );
    } else {
      this.targetingLine.setVisible(false);
    }
  } else {
    // Hide targeting visuals
    this.targetingCircle.setVisible(false);
    this.targetingLine.setVisible(false);
    this.currentTarget = null;
  }
};
```

### 10. Wave Management

#### Wave Controller
Implementation is covered in the "Spawning System" section.

### 11. Debug Tools

#### Development Helpers
```javascript
// Create debug display
this.createDebugDisplay = function() {
  this.debugDisplay = false;
  
  // Create debug container
  this.debugContainer = this.add.container(this.game.config.width - 150, 40);
  this.debugContainer.setScrollFactor(0);
  
  // Add background
  const bg = this.add.rectangle(0, 0, 140, 120, 0x000000, 0.7);
  this.debugContainer.add(bg);
  
  // Add debug text elements
  this.debugText = {
    fps: this.add.text(-65, -50, 'FPS: 60', { fontSize: '12px', color: '#ffffff' }),
    entities: this.add.text(-65, -30, 'Entities: 0', { fontSize: '12px', color: '#ffffff' }),
    playerPos: this.add.text(-65, -10, 'Player: 0,0', { fontSize: '12px', color: '#ffffff' }),
    wave: this.add.text(-65, 10, 'Wave: 1', { fontSize: '12px', color: '#ffffff' }),
    enemies: this.add.text(-65, 30, 'Enemies: 0', { fontSize: '12px', color: '#ffffff' }),
    timeScale: this.add.text(-65, 50, 'Speed: 1.0x', { fontSize: '12px', color: '#ffffff' })
  };
  
  // Add all text elements to container
  Object.values(this.debugText).forEach(text => {
    this.debugContainer.add(text);
  });
  
  // Hide debug display initially
  this.debugContainer.setVisible(false);
};

// Toggle debug display
this.updateDebugDisplayVisibility = function() {
  this.debugContainer.setVisible(this.debugDisplay);
  
  // Show hitboxes when debug is enabled
  this.physics.world.drawDebug = this.debugDisplay;
  
  if (!this.debugDisplay) {
    this.physics.world.debugGraphic.clear();
  }
};

// Update debug information
this.updateDebugDisplay = function() {
  if (!this.debugDisplay) return;
  
  this.debugText.fps.setText(`FPS: ${this.performanceStats.frameRate}`);
  this.debugText.entities.setText(`Entities: ${this.performanceStats.entityCount}`);
  this.debugText.playerPos.setText(`Player: ${Math.floor(this.player.x)},${Math.floor(this.player.y)}`);
  this.debugText.wave.setText(`Wave: ${this.waveManager.currentWave}`);
  this.debugText.enemies.setText(`Enemies: ${this.enemies.countActive()}`);
  this.debugText.timeScale.setText(`Speed: ${this.time.timeScale.toFixed(1)}x`);
};
```

### 12. Save/Load System

#### Save/Load Implementation
```javascript
// Create save/load functions
this.saveGameState = function() {
  const saveData = {
    playerHealth: this.playerHealth,
    playerPosition: {
      x: this.player.x,
      y: this.player.y
    },
    enemies: this.enemies.getChildren().map(enemy => ({
      x: enemy.x,
      y: enemy.y,
      health: enemy.health
    })),
    wave: this.waveManager.currentWave,
    kills: this.kills,
    time: this.time.now - this.startTime
  };
  
  // Save to localStorage
  localStorage.setItem('gameState', JSON.stringify(saveData));
  
  // Show save confirmation
  const saveText = this.add.text(
    this.cameras
