## Updated Main Game Functions

```javascript:littlejs/proto1/main.js
function startGame() {
    G.gameState = 'PLAYING';
    G.waveNumber = 0;
    G.killCount = 0;
    G.survivalTime = 0;
    
    // Reset player
    G.player.pos = G.center.copy();
    G.player.health = G.player.maxHealth;
    G.player.targetMode = false;
    
    // Clear any existing enemies and bullets
    G.enemyPool.deactivateAll();
    G.bulletPool.deactivateAll();
    
    // Start first wave
    G.waveManager.startNextWave();
}

function gameUpdatePost() {
    // Process collisions after all objects have updated
    G.collisionSystem.checkCollisions();
}

function gameRenderPost() {
    // Draw UI elements here
    switch (G.gameState) {
        case 'TITLE':
            drawTitleScreen();
            break;
            
        case 'PLAYING':
        case 'WAVE_TRANSITION':
            drawGameplayUI();
            break;
            
        case 'GAME_OVER':
            drawGameOverScreen();
            break;
    }
    
    // Draw debug info if enabled
    if (G.debug) {
        drawDebugInfo();
    }
}
```

These updates incorporate the clean structure from the ski game, especially in how objects are managed and how game state is tracked. The particle effects add visual polish, and the global game object pattern simplifies access to shared resources across all game components.
        

