# Prototype 1: Core Survival Loop Specification Document

## Overview
This document outlines the technical specifications for implementing Prototype 1 of the TDETest game using LittleJS. This prototype focuses on validating the core combat and wave survival mechanics with simplified visuals.

## Goals and Exit Criteria
**Primary Goal**: Validate that the "kiting while shooting" gameplay feels satisfying.
**Exit Criteria**: Players can effectively navigate around enemies while shooting, creating a tense but manageable combat experience.

## Technical Implementation

### 1. Game Setup

#### Canvas and Rendering
      // Initialize the LittleJS canvas at 1280x720 resolution
      // Set camera to center on player
      // Implement a simple grid background for spatial awareness
      // Support multiple screen resolutions with appropriate scaling

#### Game Loop
      // Use LittleJS gameLoop with proper delta time handling
      // Implement pause functionality
      // Create simple restart mechanism on player death
      // Include debug speed controls (0.5x, 1x, 2x) for testing

### 2. Player Character (Blue Cube)

#### Visual Representation
      // Create a blue rectangle (16x16 pixels)
      // Add simple rotation to face mouse cursor or auto-targeted enemy
      // Optional: Add subtle "pulse" effect when shooting

#### Movement System
      // Implement WASD keyboard control scheme
      // Target movement speed: 160 pixels per second
      // Add acceleration/deceleration (0.1s to reach full speed)
      // Use delta time for frame-independent movement
      // Implement collision detection with screen boundaries

#### Shooting Mechanics
      // Support two firing modes:
      //   - Manual aim: Mouse cursor determines direction
      //   - Auto-aim: Automatically targets closest enemy within radius
      // Create "Pulse Rifle" weapon with properties:
      //   - Fire rate: 4 shots per second
      //   - Bullet speed: 400 pixels per second
      //   - Damage: 1 hit point per bullet
      //   - Range: 500 pixels before despawning
      //   - Targeting radius: 300 pixels for auto-aim
      // Auto-fire when mouse button held down or valid target in range (auto mode)

### 3. Enemy System (Red Cubes)

#### Enemy Properties
      // Create red square enemies (16x16 pixels)
      // Health: 2 hit points
      // Movement speed: 100 pixels per second
      // Collision damage to player: 1 hit point
      // Store properties in data-driven configuration for easy balancing

#### AI Behavior
      // Simple chase behavior (always move toward player)
      // No pathfinding in Prototype 1 - direct movement only
      // Basic collision avoidance between enemies (optional)

#### Spawning System
      // Implement object pooling for performance
      // Use LittleJS RandomGenerator for consistent random spawning
      // Create wave-based spawning system:
      //   - Wave 1: 5 enemies
      //   - Wave 2: 10 enemies
      //   - Wave 3+: +5 enemies per wave
      // Spawn positions: Random locations at screen edges using seeded random

### 4. Combat System

#### Collision Detection
      // Implement efficient collision detection using LittleJS built-in physics
      // Use circle colliders for smoother interactions
      // Implement simple spatial partitioning grid for improved performance
      // Prioritize performance for multiple enemy scenarios

#### Damage Application
      // Player bullets reduce enemy health by 1
      // Enemy collision reduces player health by 1
      // Add 0.5 second invincibility after player takes damage

#### Health System
      // Player health: 3 hit points
      // Visual indicator for current health
      // Death state triggers game restart

### 5. UI Elements

#### Minimal HUD
      // Display current wave number
      // Show player health (3 simple squares)
      // Display kills counter
      // Timer showing survival duration
      // FPS counter for performance monitoring
      // Toggle for displaying debug information
      // Visual indicator for auto-aim vs. manual aim mode

#### Game States
      // Start screen with simple instructions
      // Playing state for main gameplay
      // Debug state with speed controls and metrics display
      // Game Over screen showing final statistics
      // Transition effects between states

### 6. Audio (Optional for Prototype 1)

#### Sound Effects
      // Simple shooting sound
      // Enemy hit/death sound
      // Player damage sound
      // Wave completion sound

### 7. Performance Considerations

#### Optimization
      // Implement object pooling for bullets and enemies
      // Limit max on-screen enemies to 50
      // Use spatial partitioning for collision optimization
      // Ensure consistent 60 FPS target
      // Add performance metrics tracking and display

### 8. Input System Architecture

#### Input Manager
      // Create a centralized input manager
      // Track current key states (pressed/released)
      // Store mouse position in world coordinates
      // No input buffering in prototype 1

#### Control Mapping
      // Default controls:
      //   - W/Up Arrow: Move Up
      //   - S/Down Arrow: Move Down
      //   - A/Left Arrow: Move Left
      //   - D/Right Arrow: Move Right
      //   - Left Mouse Button: Fire weapon
      //   - T: Toggle between manual aiming and auto-targeting
      //   - R: Restart game (when dead)
      //   - Esc: Pause game
      //   - F9: Toggle debug display
      //   - F10: Save game state
      //   - F11: Load game state

### 9. Bullet System Implementation

#### Bullet Pool
      // Create object pool of 100 bullets
      // Recycle bullets when they hit targets or exceed range
      // Initialize bullets with zero velocity when inactive

#### Bullet Behavior
      // Linear movement along firing direction
      // No gravity or bullet drop in Prototype 1
      // No penetration - destroy on first hit
      // Visual: small white rectangle (8x4 pixels)
      // Optional: simple particle effect on impact

### 10. Wave Management

#### Wave Controller
      // Track current wave number
      // Manage wave progression timing:
      //   - 5 second delay between waves
      //   - Visual/audio cue when new wave starts
      // Store enemy count and spawn locations for each wave

#### Difficulty Scaling
      // Linear scaling: +5 enemies per wave
      // Potential additional scaling (optional):
      //   - Wave 5+: Enemies move 10% faster
      //   - Wave 10+: Enemies have +1 health

### 11. Camera System

#### Camera Behavior
      // Center camera on player position
      // No dampening or offset in Prototype 1
      // Infinite play area with no boundaries

### 12. Collision Groups

#### Collision Matrix
      // Player: Collides with enemies, screen boundaries
      // Enemies: Collide with player, player bullets, other enemies (optional)
      // Bullets: Collide with enemies only
      // Use LittleJS's built-in collision system efficiently
      // Implement simple spatial partitioning grid (divide world into cells)

#### Hitbox Refinement
      // Player hitbox: Slightly smaller than visual (14x14 pixels)
      // Enemy hitbox: Match visual size (16x16 pixels)
      // Bullet hitbox: Match visual size (8x4 pixels)

### 13. Visual Feedback

#### Hit Reactions
      // Enemy hit: Brief color flash (white, 0.1s)
      // Enemy death: Simple 4-particle explosion effect
      // Player hit: Screen flash (red tint, 0.3s)

#### UI Feedback
      // Wave announcement text (centered, fade in/out)
      // Damage numbers (optional)
      // Kill counter increment animation
      // Visual indication when auto-targeting acquires a new target

### 14. Debug Tools

#### Development Helpers
      // Toggle for hitbox visualization (press H key)
      // FPS counter (top-right corner)
      // Enemy count display
      // Performance profiler for critical systems
      // Wave spawn point visualization (optional)
      // Debug speed controls (0.5x, 1x, 2x)
      // Auto-targeting radius visualization

### 15. Game States & Flow

#### State Machine
      // Implement basic game state machine:
      //   - TITLE: Initial title screen
      //   - PLAYING: Main gameplay
      //   - DEBUG: Special state with testing tools
      //   - GAME_OVER: Player death screen
      //   - WAVE_TRANSITION: Brief pause between waves

#### State Transitions
      // TITLE → PLAYING: Any key press
      // PLAYING → GAME_OVER: Player health reaches 0
      // GAME_OVER → TITLE: After 3 seconds
      // PLAYING → WAVE_TRANSITION: All enemies defeated
      // WAVE_TRANSITION → PLAYING: After 5 second countdown
      // Any state → DEBUG: Press F9

#### Save/Load System
      // Implement simple save/load functionality using localStorage
      // Save current game state (player stats, enemy positions, etc.)
      // Allow pasting saved state from clipboard into dialog
      // Include option to export save data as text

### 16. Auto-Targeting Module

#### Target Acquisition
      // Implement periodic scanning for enemies within configured radius (300px default)
      // Use spatial partitioning to efficiently query nearby enemies
      // Calculate distance to each enemy within radius
      // Select closest enemy as active target
      // Update target selection every frame or when current target is destroyed

#### Target Tracking
      // Store reference to currently targeted enemy
      // Calculate aim direction vector (normalized) from player to target
      // Update aim direction continuously while target is valid
      // Clear target when enemy moves outside targeting radius
      // Provide visual indicator connecting player to current target (optional)

#### Auto-Firing Implementation
      // When auto-targeting is active and target is acquired:
      //   - Calculate direction to target
      //   - Automatically rotate player to face target
      //   - Trigger weapon firing at configured rate
      //   - Maintain firing while target remains valid
      // Include small lead-targeting calculation to account for enemy movement

#### Targeting Configuration
      // Configurable targeting radius (300px default)
      // Toggle between manual and auto targeting modes
      // Prioritization options: closest, lowest health, highest threat
      // Cooldown between target switching (0.2s default) to prevent rapid switching

### 17. Architecture Considerations

#### Event System
      // Implement a basic event system for decoupling components
      // Support events like: PlayerDamaged, EnemyKilled, WaveComplete, TargetAcquired
      // Allow multiple listeners to subscribe to events
      // Design with future Unity/TDE porting in mind

#### Data-Driven Design
      // Store enemy properties in external configuration
      // Define weapon stats as structured data objects
      // Implement wave definitions as serializable data
      // Support runtime modification for testing
      // Store targeting parameters as configurable values

#### Logic/Rendering Separation
      // Clearly separate game logic from rendering code
      // Maintain clean interfaces between systems
      // Structure code to allow easy replacement of rendering layer
      // Keep core gameplay logic independent of visual implementation

## Implementation Plan (14 Days)

### Week 1: Core Systems

#### Day 1-2: Project Setup & Player Movement
- Initialize LittleJS project
- Implement player movement and controls
- Set up basic camera following

#### Day 3-4: Shooting & Bullets
- Create bullet pool system
- Implement firing mechanics
- Add bullet collision and damage
- Implement auto-targeting system

#### Day 5-7: Enemy System
- Implement basic enemy behavior
- Create enemy spawning system
- Set up wave progression
- Test auto-targeting with multiple enemies

### Week 2: Refinement & Polish

#### Day 8-9: UI & Feedback
- Implement health display
- Add wave counter and announcements
- Create game over screen
- Add targeting mode indicator

#### Day 10-11: Collision & Combat
- Refine collision detection
- Implement player damage and death
- Add visual feedback for hits
- Optimize auto-targeting performance

#### Day 12-14: Testing & Balancing
- Optimize performance
- Balance enemy counts and difficulty
- Fine-tune "game feel" elements
- Document findings for Prototype 2

## Technical Implementation Details

### Spatial Partitioning
- Divide game world into 128x128 pixel grid cells
- Assign entities to cells based on position
- Only check collisions between entities in same or adjacent cells
- Update entity cell assignments when they move between cells
