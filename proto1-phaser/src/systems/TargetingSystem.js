export class TargetingSystem {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.targetType = options.targetType || 'enemy';
    this.range = options.range || Infinity;
    this.preferClosest = options.preferClosest !== false;
    this.targetGroup = options.targetGroup || null;
  }

  /**
   * Finds the nearest target to the specified position
   * @param {number} x - Origin X position
   * @param {number} y - Origin Y position
   * @returns {object|null} The closest target or null if none found
   */
  findNearestTarget(x, y) {
    if (this.targetGroup && this.targetGroup.getChildren().length > 0) {
      // Use actual game objects if a target group is provided
      return this.findNearestRealTarget(x, y);
    } else {
      // Generate a simulated target when no real targets exist
      return this.generateSimulatedTarget(x, y);
    }
  }

  /**
   * Finds the nearest real target from the target group
   */
  findNearestRealTarget(x, y) {
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
   * Generates a simulated target position using a random 360-degree angle
   */
  generateSimulatedTarget(x, y) {
    const angle = Phaser.Math.FloatBetween(0, 360);
    const distance = this.range; // Use the range as the distance for the simulated target
    const targetX = x + distance * Math.cos(Phaser.Math.DegToRad(angle));
    const targetY = y + distance * Math.sin(Phaser.Math.DegToRad(angle));

    return { x: targetX, y: targetY };
  }
}