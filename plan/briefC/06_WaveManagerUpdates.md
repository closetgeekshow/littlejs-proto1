## Wave Manager Updates

```javascript:littlejs/proto1/waveManager.js
class WaveManager {
    constructor(baseEnemies = 5) {
        this.baseEnemiesPerWave = baseEnemies;
        this.waveDelayTimer = new Timer();
        this.waveTransitionTime = 3; // seconds between waves
        this.enemyHealthScaling = 1; // multiplier for enemy health each wave
    }
    
    update() {
        // Skip if not in active game state
        if (G.gameState !== 'PLAYING' && G.gameState !== 'WAVE_TRANSITION') return;
        
        // Count active enemies
        const activeEnemies = G.enemyPool.countActive();
        
        // Start wave transition when all enemies defeated
        if (activeEnemies === 0 && !this.waveDelayTimer.active() && 
            G.gameState === 'PLAYING') {
            
            G.gameState = 'WAVE_TRANSITION';
            this.waveDelayTimer.set(this.waveTransitionTime);
        }
        
        // Start next wave after delay
        if (this.waveDelayTimer.elapsed() && G.gameState === 'WAVE_TRANSITION') {
            this.startNextWave();
        }
        
        // Spawn additional enemies if below target for current wave
        if (G.gameState === 'PLAYING' && activeEnemies < this.getTargetEnemyCount() / 2) {
            this.spawnExtraEnemies(2);
        }
    }
    
    startNextWave() {
        G.waveNumber++;
        this.spawnWaveEnemies();
        G.gameState = 'PLAYING';
    }
    
    getTargetEnemyCount() {
        return this.baseEnemiesPerWave + (G.waveNumber * 2);
    }
    
    spawnWaveEnemies() {
        const enemiesToSpawn = this.getTargetEnemyCount();
        this.spawnEnemies(enemiesToSpawn);
    }
    
    spawnExtraEnemies(count) {
        this.spawnEnemies(count);
    }
    
    spawnEnemies(count) {
        // Calculate enemy health based on wave number
        const enemyHealth = Math.max(1, Math.floor(2 * 
            Math.pow(this.enemyHealthScaling, G.waveNumber - 1)));
        
        for (let i = 0; i < count; i++) {
            const enemy = G.enemyPool.getInactive();
            if (enemy) {
                const spawnPos = this.getRandomSpawnPosition();
                enemy.activate(spawnPos, enemyHealth);
            }
        }
    }
    
    getRandomSpawnPosition() {
        // Get camera bounds
        const margin = 32; // Spawn outside visible area
        const minX = cameraPos.x - G.width/G.tileSize/2 - margin;
        const maxX = cameraPos.x + G.width/G.tileSize/2 + margin;
        const minY = cameraPos.y - G.height/G.tileSize/2 - margin;
        const maxY = cameraPos.y + G.height/G.tileSize/2 + margin;
        
        // Choose a random edge to spawn from
        const edge = randInt(0, 3);
        let pos;
        
        switch (edge) {
            case 0: // Top
                pos = vec2(rand(minX, maxX), minY);
                break;
            case 1: // Right
                pos = vec2(maxX, rand(minY, maxY));
                break;
            case 2: // Bottom
                pos = vec2(rand(minX, maxX), maxY);
                break;
            case 3: // Left
                pos = vec2(minX, rand(minY, maxY));
                break;
        }
        
        return pos;
    }
}
```


