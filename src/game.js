/*
    TDETest Prototype 1 - Core Survival Loop
    - Top-down shooter with auto-targeting and auto-shooting mechanic
    - Wave-based survival gameplay
*/

'use strict';

///////////////////////////////////////////////////////////////////////////////
// Global game object to store shared state, constants, and resources
const G = {
    // Game settings
    canvasWidth: 412,
    canvasHeight: 732,

    // Grid background settings
    gridSize: 64,   // Size of grid cells
    gridColor: new Color(.5, .5, .5),

    // Performance monitoring
    showFPS: false,
    targetFPS: 60,

    // Debug settings
    debugMode: false
}


///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // Set up game canvas size
    mainCanvasSize = new Vector2(G.canvasWidth, G.canvasHeight);

    // Set up camera with default
    cameraPos = vec2(0,0);
    cameraScale = 1;

    console.log('Game initialized successfully!');
    console.log(`Canvas size: ${mainCanvas.width}x${mainCanvas.height}`);

    // Initialze game systems here in future updates
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
   // Toggle debug mode with F9 key (120)
   if (keyWasPressed('KeyF9')) {
       G.debugMode = !G.debugMode;
       G.showFPS = !G.debugMode;
   }

   // @TODO: Handle input and update game state
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
   // @TODO: Setup camera and prepare for render 
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // Draw background grid
    drawGrid();
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // Draw UI elements that appear above all objects

    // Draw title text
    drawTextScreen('TDETest Prototype 1',
        vec2(mainCanvasSize.x/2, mainCanvasSize.y/4), 36, new Color(1,1,1), 0, 0, 'center');
    
    // Draw subtitle
    drawTextScreen('Press any key to start',
        vec2(mainCanvasSize.x/2, mainCanvasSize.y/3), 24, new Color(.8,.8,.8), 0, 0, 'center');
    
    // Show FPS counter if enabled
    if (G.showFPS) {
        // @TODO replace this with built-in FPS counter feature in littlejs debug mode

        const fps = Math.round(1/timeDelta);
        const fpsColor = fps >= G.targetFPS-5 ? new Color(0,1,0) : new Color(1,0,0);
        drawTextScreen(`FPS: ${fps}`, vec2(mainCanvasSize.x-70, 30), 16, fpsColor);
   
    }

    // Show debug info when enabled 
    if (G.debugMode) {
        drawTextScreen('Debug Mode', vec2(100, 30), 16, new Color(1,.5,0));
    }
}
///////////////////////////////////////////////////////////////////////////////
// Draw background grid
function drawGrid() {
    // Calculate grid dimensions based on camera, adding extra lines to ensure full coverage
    const xCount = Math.ceil(mainCanvasSize.x / G.gridSize) + 4; // Add extra for right side
    const yCount = Math.ceil(mainCanvasSize.y / G.gridSize) + 6; // Add extra for bottom
    
    // Get the camera position in grid units
    const camX = Math.floor(cameraPos.x / G.gridSize);
    const camY = Math.floor(cameraPos.y / G.gridSize);
    
    // Calculate where the grid should start in world coordinates
    // Shift by half more to ensure we cover edges properly
    const startX = (camX - 0.5) * G.gridSize - mainCanvasSize.x/2/cameraScale;
    const startY = (camY - 0.5) * G.gridSize - mainCanvasSize.y/2/cameraScale;
    
    // Draw vertical grid lines
    for (let i = 0; i < xCount; i++) {
        const x = startX + i * G.gridSize;
        drawLineWithCamera(
            vec2(x, startY), 
            vec2(x, startY + yCount * G.gridSize), 
            1, G.gridColor
        );
    }
    
    // Draw horizontal grid lines
    for (let i = 0; i < yCount; i++) {
        const y = startY + i * G.gridSize;
        drawLineWithCamera(
            vec2(startX, y), 
            vec2(startX + xCount * G.gridSize, y), 
            1, G.gridColor
        );
    }
}

// Helper function to draw lines in world space
function drawLineWithCamera(pos1, pos2, thickness, color) {
    drawLine(pos1, pos2, thickness, color, 0, 1);
}
///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);