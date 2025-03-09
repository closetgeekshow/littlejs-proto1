import { GameConfig } from "../config/GameConfig";
import { Enemy } from "../entities/Enemy";

export class EnemySpawner {
  constructor(scene, enemyGroup) {
    this.scene = scene;
    this.enemyGroup = enemyGroup;
    
    this.currentWave = 0;
    this.enemiesSpawned = 0;
    this.enemiesRemaining = 0;
    this.waveComplete = true;
    this.spawnTimer = null;
    
    // Initialize enemy texture
    Enemy.createEnemyTexture(scene);
  }
  
  startNextWave() {
    this.currentWave++;
    const enemiesInWave = this.calculateEnemiesForWave(this.currentWave);
    
    this.enemiesSpawned = 0;
    this.enemiesRemaining = enemiesInWave;
    this.waveComplete = false;
    
    // Start spawning enemies
    this.spawnTimer = this.scene.time.addEvent({
      delay: GameConfig.enemy.spawnRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      repeat: enemiesInWave - 1
    });
    
    console.log(`Starting wave ${this.currentWave} with ${enemiesInWave} enemies`);
  }
  
  calculateEnemiesForWave(wave) {
    // Simple formula: base enemies + wave number (can be adjusted)
    return Math.min(5 + wave, GameConfig.enemy.maxEnemies);
  }
  
  spawnEnemy() {
    if (this.waveComplete) return;
    
    // Generate spawn position at screen edge
    const spawnPosition = this.getRandomSpawnPosition();
    const enemy = new Enemy(this.scene, spawnPosition.x, spawnPosition.y);
    
    this.enemyGroup.add(enemy);
    this.enemiesSpawned++;
  }
  
  getRandomSpawnPosition() {
    const { width, height } = this.scene.scale;
    const padding = 20; // Distance from edge
    
    // Determine which edge to spawn from (0=top, 1=right, 2=bottom, 3=left)
    const edge = Phaser.Math.Between(0, 3);
    
    let x, y;
    
    switch(edge) {
      case 0: // Top
        x = Phaser.Math.Between(padding, width - padding);
        y = -padding;
        break;
      case 1: // Right
        x = width + padding;
        y = Phaser.Math.Between(padding, height - padding);
        break;
      case 2: // Bottom
        x = Phaser.Math.Between(padding, width - padding);
        y = height + padding;
        break;
      case 3: // Left
        x = -padding;
        y = Phaser.Math.Between(padding, height - padding);
        break;
    }
    
    return { x, y };
  }
  
  enemyDestroyed() {
    this.enemiesRemaining--;
    
    // Check if wave is complete
    if (this.enemiesRemaining <= 0 && this.enemiesSpawned > 0) {
      this.waveComplete = true;
      
      // Schedule next wave
      this.scene.time.delayedCall(GameConfig.enemy.waveDelay, () => {
        this.startNextWave();
      });
      
      console.log(`Wave ${this.currentWave} completed!`);
    }
  }
  
  update() {
    // Could add additional logic here if needed
  }
}
