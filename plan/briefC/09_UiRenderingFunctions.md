## UI Rendering Functions 

```javascript:littlejs/proto1/ui.js
function drawTitleScreen() {
    // Draw title
    drawTextScreen('TDETest', 
        vec2(G.width/2, G.height/3), 
        10, G.cols.player, 2);
    
    // Draw instructions
    drawTextScreen('WASD/Arrows to Move | Mouse to Aim | Click to Shoot', 
        vec2(G.width/2, G.height/2), 
        4, new Color(1, 1, 1, 1), 1);
    
    drawTextScreen('Press SPACE to Start', 
        vec2(G.width/2, G.height*2/3), 
        5, new Color(1, 1, 1, Math.sin(time*5)*.5+.5), 1);
}

function drawGameplayUI() {
    // Display health
    for (let i = 0; i < G.player.maxHealth; i++) {
        const filled = i < G.player.health;
        const color = filled ? new Color(1, 0, 0, 1) : new Color(.3, 0, 0, .5);
        
        drawRect(
            vec2(10 + i * 15, 10), 
            vec2(10, 10), 
            color,
            0, 0, 
            filled ? null : new Color(1, 0, 0, 1)
        );
    }
    
    // Display wave number
    drawTextScreen(`WAVE ${G.waveNumber}`, 
        vec2(G.width/2, 20), 
        5, new Color(1, 1, 1, 1), 1);
    
    // Display kill count and time
    drawTextScreen(`KILLS: ${G.killCount}`, 
        vec2(G.width - 100, 20), 
        4, new Color(1, 1, 1, 1), 1);
    
    const minutes = Math.floor(G.survivalTime / 60);
    const seconds = Math.floor(G.survivalTime % 60);
    drawTextScreen(`TIME: ${minutes}:${seconds.toString().padStart(2, '0')}`, 
        vec2(G.width - 100, 50), 
        4, new Color(1, 1, 1, 1), 1);
    
    // Wave transition countdown
    if (G.gameState === 'WAVE_TRANSITION') {
        const timeRemaining = Math.ceil(G.waveManager.waveDelayTimer.get());
        
        drawTextScreen(`NEXT WAVE IN ${timeRemaining}`, 
            vec2(G.width/2, G.height/2), 
            6, new Color(1, 1, 0, Math.sin(time*5)*.5+.5), 1);
        
        drawTextScreen(`GET READY!`, 
            vec2(G.width/2, G.height/2 + 40), 
            5, new Color(1, 1, 1, Math.sin(time*3)*.5+.5), 1);
    }
    
    // Auto-target indicator
    if (G.player.targetMode) {
        drawTextScreen('AUTO-TARGET: ON', 
            vec2(G.width/2, G.height - 30), 
            4, new Color(0, 1, 0, .7), 1);
    }
}

function drawGameOverScreen() {
    // Game over text
    drawTextScreen('GAME OVER', 
        vec2(G.width/2, G.height/3), 
        10, new Color(1, 0, 0, 1), 2);
    
    // Stats
    drawTextScreen(`SURVIVED: WAVE ${G.waveNumber}`, 
        vec2(G.width/2, G.height/2 - 20), 
        5, new Color(1, 1, 1, 1), 1);
    
    drawTextScreen(`KILLS: ${G.killCount}`, 
        vec2(G.width/2, G.height/2 + 20), 
        5, new Color(1, 1, 1, 1), 1);
    
    const minutes = Math.floor(G.survivalTime / 60);
    const seconds = Math.floor(G.survivalTime % 60);
    drawTextScreen(`TIME: ${minutes}:${seconds.toString().padStart(2, '0')}`, 
        vec2(G.width/2, G.height/2 + 60), 
        5, new Color(1, 1, 1, 1), 1);
    
    // Restart prompt
    drawTextScreen('Press SPACE to Restart', 
        vec2(G.width/2, G.height*2/3 + 30), 
        5, new Color(1, 1, 1, Math.sin(time*5)*.5+.5), 1);
}

function drawGrid() {
    // Draw a grid for better spatial awareness
    const gridSize = 10;
    const gridColor = new Color(.2, .2, .2, .5);
    
    const startX = Math.floor(cameraPos.x - G.width/G.tileSize/2);
    const endX = Math.ceil(cameraPos.x + G.width/G.tileSize/2);
    const startY = Math.floor(cameraPos.y - G.height/G.tileSize/2);
    const endY = Math.ceil(cameraPos.y + G.height/G.tileSize/2);
    
    for (let x = startX - (startX % gridSize); x <= endX; x += gridSize) {
        drawLine(vec2(x, startY), vec2(x, endY), 0.1, gridColor);
    }
    
    for (let y = startY - (startY % gridSize); y <= endY; y += gridSize) {
        drawLine(vec2(startX, y), vec2(endX, y), 0.1, gridColor);
    }
}

function drawDebugInfo() {
    // FPS counter
    drawTextScreen(`FPS: ${fps}`, 
        vec2(100, G.height - 20), 
        4, new Color(1, 1, 0, 1), 1);
    
    // Object counts
    drawTextScreen(`Active Enemies: ${G.enemyPool.countActive()}`, 
        vec2(100, G.height - 50), 
        4, new Color(1, 1, 0, 1), 1);
    
    drawTextScreen(`Active Bullets: ${G.bulletPool.countActive()}`, 
        vec2(100, G.height - 80), 
        4, new Color(1, 1, 0, 1), 1);
}
```


