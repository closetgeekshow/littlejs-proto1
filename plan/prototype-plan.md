# High-Level Porting Plan for Prototypes 1-3

## 1. Input System
- **Keyboard Input:** 
  - Map WASD keys to movement directions.
  - Create an input manager to capture and relay input events.
- **Mouse Input:** 
  - Capture mouse position for aiming.
  - Translate mouse coordinates into aiming vectors.
- **Abstraction Layer:** 
  - Design an input module that mimics TDE’s approach, allowing easy substitution later when moving to Unity.

## 2. Character Controller
- **Movement & Collision:**
  - Implement basic movement logic and collision detection.
  - Replicate TDE character behaviors (e.g., smooth acceleration/deceleration).
- **Health & Damage:**
  - Set up health management and damage-taking logic.
  - Include death and restart mechanics.
- **Auto-Targeting Integration:**
  - Add functionality to scan for nearby enemies.
  - Integrate a system to select the nearest or most relevant target automatically.

## 3. Weapon System
- **Auto-Shooting:**
  - Implement an auto-fire mechanism with configurable fire rates and cooldown periods.
  - Ensure continuous firing when conditions (target in range, fire button held) are met.
- **Bullet Pooling:**
  - Develop a simple pooling system to manage bullet instances efficiently.
  - Reuse bullet objects to minimize performance overhead.
- **Damage Application:**
  - Port over TDE’s damage calculation logic from the weapon classes.
  - Ensure that bullets or projectiles properly register hits and apply damage.

## 4. Auto-Targeting Module
- **Target Acquisition:**
  - Create a module that periodically scans for enemies within a specified radius.
  - Use distance calculations to select the nearest valid target.
- **Integration with Weapon System:**
  - Feed the selected target’s position into the weapon system for auto-aim adjustments.
  - Enable auto-shooting when a target is locked.

## 5. Enemy AI & Spawning (Gameplay Mechanics)
- **Basic AI Behavior:**
  - Implement simple enemy movement toward the player (or base, where applicable).
  - Include logic for basic charge attacks.
- **Spawning System:**
  - Port a rudimentary version of TDE’s Pool Boss concept for enemy spawning.
  - Manage enemy lifecycle and object pooling for performance.

## 6. Resource & Upgrade Mechanics (Prototype 2)
- **Resource Drops:**
  - Implement logic for enemies to drop resources (e.g., minerals) upon death.
- **Resource Collection:**
  - Create a backend counter to track collected resources.
- **Upgrade Station:**
  - Develop a system to allow spending resources for stat upgrades (e.g., movement speed, bullet damage).
  - Connect upgrade effects to the character controller and weapon system.

## 7. Base Defense Mechanics (Prototype 3)
- **Base Object:**
  - Create a base with a health component similar to TDE’s Damageable objects.
  - Ensure the base can take damage and trigger appropriate events upon reaching critical health.
- **Enemy Prioritization:**
  - Adjust enemy AI so that, when within range, enemies target the base.
- **Turret Functionality:**
  - Implement a stationary turret that auto-targets enemies.
  - Use similar auto-shooting logic as the player’s weapon system.

## 8. Integration and Testing
- **Modular Integration:**
  - Assemble input, character, weapon, and AI systems into a cohesive gameplay loop.
  - Verify that auto-targeting and auto-shooting work seamlessly across different scenarios.
- **Iterative Testing:**
  - Test each module in isolation before full integration.
  - Focus on validating core survival (combat, resource collection, base defense) without visual or sound dependencies.

## 9. Documentation and Future Transition
- **Code Documentation:**
  - Clearly document each module’s functionality and interdependencies.
- **Abstraction for Portability:**
  - Keep gameplay logic modular to simplify future porting to Unity.
- **Plan for Extended Features:**
  - Note differences between LittleJS and Unity to ease the transition, particularly in input management and physics handling.

# Follow-up Plan for Further Refinements

## 10. Expansion for Prototype 4 (Mobile Objectives)
- **Enemy Outposts:**
  - Design a static enemy-controlled structure that spawns enemy waves at intervals.
  - Implement a health system where reducing outpost HP lowers the spawn rate.
- **Outpost Capture Mechanic:**
  - Allow player to destroy outposts, converting them into resource-generating structures.
  - Ensure persistent ownership changes affect enemy behavior and spawning logic.

## 11. Data Persistence for Prototype 5 (Meta Progression)
- **Run-Based Economy:**
  - Implement a system where a portion of resources is retained after a run.
  - Store collected resources in local storage or a lightweight database.
- **Persistent Upgrades:**
  - Introduce a meta-progression system that grants passive bonuses across multiple runs.
  - Ensure that upgrades apply correctly upon game restart.

## 12. Expanding Map and Strategy for Prototype 6 (Full Conquest Loop)
- **Multiple Outposts:**
  - Expand the game world to accommodate multiple enemy outposts.
  - Ensure outpost destruction contributes to an overall win condition.
- **Buildable Extractors/Turrets:**
  - Introduce build mechanics for placing resource extractors and defensive turrets.
  - Implement UI-based placement validation to ensure strategic positioning.

## 13. Balance Testing & Iteration
- **Game Feel Optimization:**
  - Adjust shooting, movement, and AI behaviors to ensure fluid gameplay.
- **Wave Scaling:**
  - Fine-tune enemy spawn rates and difficulty scaling over time.
- **Testing Player Strategies:**
  - Observe common player behaviors to refine core mechanics.
- **Upgrade Tuning:**
  - Ensure all upgrades provide meaningful progression and incentives.

## 14. Final Adjustments Before Unity Port
- **Code Cleanup & Optimization:**
  - Remove redundant code and improve modularity for easier transition.
- **Feature Parity Validation:**
  - Ensure all planned gameplay mechanics align with Unity’s capabilities.
- **Unity Port Strategy:**
  - Begin transition by migrating core mechanics first (input, movement, AI).
  - Reimplement UI and advanced physics last.


