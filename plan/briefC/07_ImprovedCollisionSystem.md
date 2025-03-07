## Improved Collision System

```javascript:littlejs/proto1/collisionSystem.js
class CollisionSystem {
    constructor(cellSize = 128) {
        this.grid = {};
        this.cellSize = cellSize; // pixels per cell
    }
    
    getCellKey(position) {
        const cellX = Math.floor(position.x / (this.cellSize / G.tileSize));
        const cellY = Math.floor(position.y / (this.cellSize / G.tileSize));
        return `${cellX},${cellY}`;
    }
    
    addToGrid(entity) {
        const key = this.getCellKey(entity.pos);
        if (!this.grid[key]) this.grid[key] = [];
        
        // Prevent duplicates
        if (!this.grid[key].includes(entity)) {
            this.grid[key].push(entity);
            entity.lastCellKey = key;
        }
    }
    
    removeFromGrid(entity) {
        if (!entity.lastCellKey) return;
        
        const key = entity.lastCellKey;
        if (this.grid[key]) {
            const index = this.grid[key].indexOf(entity);
            if (index !== -1) {
                this.grid[key].splice(index, 1);
            }
        }
    }
    
    updateEntityPosition(entity) {
        const newKey = this.getCellKey(entity.pos);
        
        if (entity.lastCellKey !== newKey) {
            this.removeFromGrid(entity);
            this.addToGrid(entity);
        }
    }
    
    getNearbyEntities(position, radius, entityType = null) {
        const cellRadius = Math.ceil(radius * G.tileSize / this.cellSize);
        const baseCellX = Math.floor(position.x / (this.cellSize / G.tileSize));
        const baseCellY = Math.floor(position.y / (this.cellSize / G.tileSize));
        let entities = [];
        
        for (let x = -cellRadius; x <= cellRadius; x++) {
            for (let y = -cellRadius; y <= cellRadius; y++) {
                const key = `${baseCellX + x},${baseCellY + y}`;
                
                if (this.grid[key]) {
                    for (const entity of this.grid[key]) {
    if (entity.active && 
                            (!entityType || entity instanceof entityType) &&
                            entity.pos.distance(position) <= radius) {
                            entities.push(entity);
                        }
                    }
                }
            }
        }
        
        return entities;
    }
    
    findClosestEntity(position, radius, entityType = null) {
        const entities = this.getNearbyEntities(position, radius, entityType);
        
        if (!entities.length) return null;
        
        let closest = null;
        let closestDistSq = radius * radius;
        
        for (const entity of entities) {
            const distSq = entity.pos.distanceSquared(position);
            if (distSq < closestDistSq) {
                closest = entity;
                closestDistSq = distSq;
            }
        }
        
        return closest;
    }
    
    checkCollisions() {
        // Check player-enemy collisions
        const playerSize = G.player.size.x * 0.8; // Slightly smaller hitbox for better feel
        const nearbyEnemies = this.getNearbyEntities(G.player.pos, playerSize * 2, Enemy);
        
        for (const enemy of nearbyEnemies) {
            if (enemy.pos.distance(G.player.pos) < playerSize + enemy.size.x * 0.8) {
                G.player.takeDamage();
            }
        }
        
        // Bullets are handled via their collideWithObject method
        // which is automatically called by the engine
    }
}
```


