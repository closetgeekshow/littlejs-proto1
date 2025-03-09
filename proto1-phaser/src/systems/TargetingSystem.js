import { GameConfig } from "../config/GameConfig";

export class TargetingSystem {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.debugMode = options.debugMode || false;
    this.range = options.range || GameConfig.weapon.range;
    this.currentTarget = null;
    this.targetGroup = options.targetGroup || null;
    
    // Debug graphics
    if (this.debugMode) {
      this.debugGraphics = scene.add.graphics();
    }
  }

  /**
   * Gets the current target or acquires a new one if needed
   * @param {number} x - Player x position
   * @param {number} y - Player y position
   * @returns {object|null} The current target or null if none found
   */
  getCurrentTarget(x, y) {
    // Check if current target is still valid
    if (!this.isTargetValid(x, y)) {
      // Target is invalid, find a new one
      this.currentTarget = this.findClosestTarget(x, y);
      
      // If using target group but no targets found, return null
      if (this.targetGroup && this.targetGroup.getChildren().length === 0) {
        return null;
      }
    }
    
    return this.currentTarget;
  }
  
  /**
   * Checks if the current target is still valid (alive and in range)
   * @param {number} x - Player x position
   * @param {number} y - Player y position
   * @returns {boolean} Whether the target is valid
   */
  isTargetValid(x, y) {
    if (!this.currentTarget) return false;
    
    // For real enemy objects
    if (this.currentTarget.active !== undefined) {
      // Check if target is still active
      if (!this.currentTarget.active) return false;
      
      // Check if target is still in range
      const distance = Phaser.Math.Distance.Between(
        x, y, this.currentTarget.x, this.currentTarget.y
      );
      
      return distance <= this.range;
    }
    
    // For simulated targets, always return false to get a new target
    return false;
  }
  
  /**
   * Finds the closest target from the target group
   * @param {number} x - Player x position
   * @param {number} y - Player y position
   * @returns {object|null} The closest target or null if none found
   */
  findClosestTarget(x, y) {
    if (this.targetGroup && this.targetGroup.getChildren().length > 0) {
      // Use actual game objects if a target group is provided
      return this.findClosestRealTarget(x, y);
    } else {
      // Generate a simulated target when no real targets exist
      return this.generateSimulatedTarget(x, y);
    }
  }
  
  /**
   * Finds the closest real target from the target group
   * @param {number} x - Player x position
   * @param {number} y - Player y position
   * @returns {object|null} The closest target or null if none found
   */
  findClosestRealTarget(x, y) {
    let closestTarget = null;
    let closestDistance = Infinity;
    
    this.targetGroup.getChildren().forEach(target => {
      if (target.active) {
        const distance = Phaser.Math.Distance.Between(x, y, target.x, target.y);
        
        if (distance <= this.range && distance < closestDistance) {
          closestDistance = distance;
          closestTarget = target;
        }
      }
    });
    
    return closestTarget;
  }
  
  /**
   * Generates a simulated target position for testing when no real targets exist
   * @param {number} x - Player x position
   * @param {number} y - Player y position
   * @returns {object} A simulated target object with x,y coordinates
   */
  generateSimulatedTarget(x, y) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const distance = this.range * 0.8; // Use 80% of range for simulation
    const targetX = x + distance * Math.cos(angle);
    const targetY = y + distance * Math.sin(angle);
    
    return { x: targetX, y: targetY };
  }
  
  /**
   * Forces the targeting system to clear its current target
   */
  clearTarget() {
    this.currentTarget = null;
  }
  
  /**
   * Renders debug visualizations for the targeting system
   * @param {number} x - Player x position
   * @param {number} y - Player y position
   */
  debugRender(x, y) {
    if (!this.debugMode || !this.debugGraphics) return;
    
    // Clear previous graphics
    this.debugGraphics.clear();
    
    // Draw targeting radius
    this.debugGraphics.lineStyle(2, 0x00ff00, 0.5);
    this.debugGraphics.strokeCircle(x, y, this.range);
    
    // Draw line to current target if one exists
    if (this.currentTarget) {
      this.debugGraphics.lineStyle(2, 0xff0000, 0.8);
      this.debugGraphics.lineBetween(
        x, y, 
        this.currentTarget.x, this.currentTarget.y
      );
    }
  }
}
