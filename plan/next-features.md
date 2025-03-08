# Next Features Implementation Plan

## 1. Player Health System

1. Add health property to player object
    - Set initial health to 3 (hitpoints)
    - Create visual health display (hearts or health bar)

2. Create damage handling function
    - Add hit detection logic
    - Implement health reduction
    - Create feedback effect (screen flash or player blink)

3. Add invincibility frames
    - Set temporary invulnerable state after hit
    - Create visual indicator (blinking effect)
    - Add game over trigger when health reaches zero

## 2. Weapon System

1. Set up bullet pool using Phaser's group system
    - Create reusable bullet objects
    - Configure bullet properties (speed, damage, lifespan)

2. Implement auto-targeting
    - Create targeting radius detection
    - Add target acquisition logic
    - Implement target priority system (nearest enemy)

3. Create shooting mechanics
    - Set up firing rate timer
    - Add bullet movement toward target
    - Implement bullet collision and destruction

## 3. Enemy System

1. Create basic enemy visual and properties
    - Generate red square graphics (16x16 pixels)
    - Add health and movement speed properties
    - Implement hit reaction

2. Set up enemy spawning system
    - Create timed spawn events
    - Implement wave-based progression
    - Add spawn position logic (offscreen spawning)

3. Add enemy movement AI
    - Implement seek behavior toward player
    - Add optional randomization or patterns
    - Create collision avoidance between enemies

## 4. Combat System

1. Implement collision detection
    - Set up player-enemy overlap detection
    - Configure bullet-enemy collision

2. Create damage application
    - Add enemy health reduction logic
    - Implement player damage when touching enemies

3. Add combat feedback effects
    - Create hit animations
    - Add destruction effects for enemies
    - Implement screen shake on major events