export const GameConfig = {
    player: {
        startX: 450,
        startY: 800,
        size: 90,
        innerSize: 72,
        maxSpeed: 120,
        accelFactor: 0.25,
        colors: {
            border: 0x000000,
            fill: 0x0000ff
        }
    },
    joystick: {
        x: 450,
        y: 1400,
        radius: 60,
        baseRadius: 140,
        thumbRadius: 70,
        baseColor: 0x888888,
        thumbColor: 0xcccccc,
        forceMin: 70
    },
    ui: {
        timeScaleText: {
            x: 20,
            y: 20,
            style: {
                fontFamily: 'Arial',
                fontSize: '3rem',
                color: '#ffffff'
            }
        }
    },
    backgroundColor: '#F8FAFC'
}
