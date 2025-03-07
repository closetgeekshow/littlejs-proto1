# LittleJS Prototype 1 Implementation Task List

## Day 1 (Thursday) - Core Systems

### 1. Project Setup & Engine Initialization

- [X] Initialize LittleJS project
  - [X] Set up HTML file with LittleJS imports
  - [X] Configure canvas at safe mobile portrait resolution
  - [X] Set up basic engine initialization with callbacks
  - [X] Implement simple grid background for spatial awareness
  - [X] Test that engine runs at 60 FPS

### 2. Player Character Implementation

- [ ] Create player entity
  - [ ] Blue rectangle (16x16 pixels)
  - [ ] Set up player health (3 hit points)
  - [ ] Center camera on player
  - [ ] Implement screen edge detection
- [ ] Implement movement system
  - [ ] WASD keyboard input handling
  - [ ] Movement speed: 160 pixels per second
  - [ ] Add acceleration/deceleration
  - [ ] Implement rotation to face mouse cursor

### 3. Basic Enemy System

- [ ] Create enemy entity
  - [ ] Red square (16x16 pixels)
  - [ ] Set up health system (2 hit points)
  - [ ] Movement speed: 100 pixels per second
- [ ] Implement enemy pooling
  - [ ] Create object pool for enemies
  - [ ] Create spawn positions at screen edges

### 4. Collision Detection Framework

- [ ] Set up collision groups
  - [ ] Player collision
  - [ ] Enemy collision
  - [ ] Define hitboxes
- [ ] Implement spatial partitioning
  - [ ] Create grid-based partitioning (128x128 pixel cells)
  - [ ] Assign entities to grid cells
  - [ ] Update assignments when entities move

## Day 2 (Friday) - Game Mechanics & UI

### 5. Shooting System

- [ ] Create bullet system
  - [ ] White rectangle bullets (8x4 pixels)
  - [ ] Set up bullet properties (speed: 400px/sec, range: 500px)
  - [ ] Implement bullet pooling (100 bullets)
- [ ] Implement firing logic
  - [ ] Fire rate: 4 shots per second
  - [ ] Auto-fire when mouse button held
  - [ ] Collision detection with enemies
  - [ ] Damage application (1 HP per hit)

### 6. Auto-targeting System

- [ ] Implement target acquisition
  - [ ] Scan for enemies within 300px radius
  - [ ] Select closest enemy as target
  - [ ] Update target selection each frame
- [ ] Create targeting mode toggle (T key)
  - [ ] Manual aim with mouse
  - [ ] Auto-aim toward nearest enemy

### 7. Wave Management

- [ ] Create wave controller
  - [ ] Track current wave number
  - [ ] Implement wave progression (5 enemies first wave, +5 per wave)
  - [ ] Add 5-second delay between waves
- [ ] Implement enemy spawning per wave
  - [ ] Random positions at screen edges
  - [ ] Proper wave scaling

### 8. Health & Damage System

- [ ] Implement damage application
  - [ ] Enemy collision damages player (1 HP)
  - [ ] Add 0.5 second player invincibility after hit
  - [ ] Visual feedback on damage
- [ ] Create hit reactions
  - [ ] Enemy flash when hit
  - [ ] Simple explosion effect on enemy death
  - [ ] Screen flash when player is hit

### 9. Game States & UI

- [ ] Implement basic state machine
  - [ ] TITLE, PLAYING, GAME_OVER states
  - [ ] State transitions
- [ ] Create minimal HUD
  - [ ] Wave number display
  - [ ] Player health indicator
  - [ ] Kill counter
  - [ ] Survival timer
  - [ ] Auto-aim indicator

### 10. Final Integration & Testing

- [ ] Connect all systems
  - [ ] Ensure proper event flow between systems
  - [ ] Verify game loop integrity
- [ ] Performance optimization
  - [ ] Test with maximum enemies (50)
  - [ ] Verify 60 FPS performance
  - [ ] Implement FPS counter
- [ ] Debug features
  - [ ] Add debug toggle (F9)
  - [ ] Enable hitbox visualization option
  - [ ] Implement game speed controls

## Extras (If Time Permits)

- [ ] Simple sound effects
- [ ] Particle effects for hits
- [ ] Save/load system using localStorage
- [ ] Difficulty scaling for later waves
- [ ] Performance profiler

# Implementation Details & Coding Tips

## Code Organization

### File Structure

- [ ] Create organized file structure
  - [ ] main.js - Entry point and initialization
  - [ ] player.js - Player-related logic
  - [ ] enemy.js - Enemy system implementation
  - [ ] weapons.js - Shooting and bullet mechanics
  - [ ] collision.js - Collision detection system
  - [ ] waves.js - Wave management
  - [ ] ui.js - HUD and interface elements
  - [ ] gameState.js - Game state machine

### Engine Setup Code

  // Engine initialization in main.js
  // Start up LittleJS engine with callbacks
  engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['your_tiles.png']);
  
  function gameInit() {
      // Initialize game systems
      initPlayer();
      initEnemies();
      initBullets();
      initWaves();
  }
## Key Implementation Details

### 1. Player Movement - Implementation Tips

- Use LittleJS vector system for smooth movement
- Implement acceleration with lerp for better feel:
  // In player.js
  player.velocity = player.velocity.lerp(inputVector.scale(maxSpeed), accelRate * timeDelta);

### 2. Object Pooling Framework

- Create reusable pool class for both bullets and enemies:
  // Example pooling approach
  function createPool(objectType, count) {
  const pool = [];
  for (let i = 0; i < count; i++) {
  const obj = new objectType();
  obj.active = false;
  pool.push(obj);
  }
  return pool;
  }

### 3. Spatial Partitioning Implementation

- Create a grid with fixed cell size:
  // Partition world into 128x128 pixel cells
  const CELL_SIZE = 128;
  const grid = {};

  // Get cell key from position
  function getCellKey(position) {
      const cellX = Math.floor(position.x / CELL_SIZE);
      const cellY = Math.floor(position.y / CELL_SIZE);
      return `${cellX},${cellY}`;
  }
### 4. Targeting System Logic- Implement efficient target finding:
  // Find closest enemy within radius
  function findTarget(position, radius) {
  let closest = null;
  let closestDist = radius * radius; // Compare squared distances

      // Only check enemies in nearby cells
      const nearbyEnemies = getNearbyEnemies(position, radius);

      for (const enemy of nearbyEnemies) {
          if (!enemy.active) continue;
          const distSquared = enemy.pos.distanceSquared(position);
          if (distSquared < closestDist) {
              closest = enemy;
              closestDist = distSquared;
          }
      }
      return closest;
  }
## Testing Milestones

### Day 1 Milestone Tests- [ ] Player moves correctly with WASD controls
- [ ] Camera follows player properly
- [ ] Enemies can spawn and move toward player
- [ ] Basic collision detection works


### Day 2 Milestone Tests

- [ ] Bullets fire in correct direction and speed
- [ ] Bullets damage enemies correctly
- [ ] Waves progress after enemies are defeated
- [ ] Health system works (player takes damage, has invincibility)
- [ ] Game states transition properly (start → play → game over)

## Priority Guidance

### Must-Have Features (Focus Here First)

1. Player movement and control
2. Basic enemies that chase player
3. Shooting mechanics with collision
4. Wave progression
5. Core game states (play, game over)

### Should-Have Features (Add if Time Allows)

1. Auto-targeting system
2. Visual feedback (flashes, effects)
3. Complete UI elements
4. Player invincibility after hit

### Nice-to-Have Features (Lowest Priority)

1. Sound effects
2. Advanced wave scaling
3. Debug tools
4. Save/load functionality

## Common Pitfalls to Avoid

### Performance Issues

- [ ] Avoid checking collisions between all objects
- [ ] Use object pooling consistently (don't create new objects during gameplay)
- [ ] Limit particle effects if FPS drops

### Game Feel Problems

- [ ] Ensure movement has slight acceleration for natural feel
- [ ] Make sure player remains centered on screen
- [ ] Keep auto-targeting balanced (not too powerful or weak)
- [ ] Ensure bullet speed feels right relative to enemy movement

### Code Structure Issues

- [ ] Don't mix update and render logic
- [ ] Keep systems decoupled using events when possible
- [ ] Store game constants in a central configuration file for easy tuning
