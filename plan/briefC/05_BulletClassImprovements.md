## Bullet Class Improvements

```javascript:littlejs/proto1/bullet.js
class Bullet extends EngineObject {
    constructor() {
        super(vec2(0, 0), vec2(0.3, 0.1));
        this.color = G.cols.bullet;
        this.speed = 400;
        this.range = 500;
        this.distanceTraveled = 0;
        this.active = false;
        
        // Set up collision
        this.setCollision(true, false, false, false);
    }
    
    fire(position, angle) {
        this.pos = position.copy();
        this.angle = angle;
        this.velocity = vec2(Math.cos(angle), Math.sin(angle)).scale(this.speed);
        this.distanceTraveled = 0;
        this.active = true;
        
        this.createFireEffect();
    }
    
    update() {
        if (!this.active) return;
        
        super.update();
        
        const movement = this.velocity.scale(timeDelta);
        this.distanceTraveled += movement.length();
        this.pos = this.pos.add(movement);
        
        // Deactivate when range exceeded
        if (this.distanceTraveled >= this.range) {
            this.deactivate();
            return;
        }
        
        // Deactivate if far from screen
        const screenDistance = this.pos.distance(cameraPos);
        if (screenDistance > G.width / G.tileSize) {
            this.deactivate();
        }
    }
    
    deactivate() {
        this.active = false;
    }
    
    createFireEffect() {
        // Trailing particle effect
        new ParticleEmitter(
            this.pos, this.angle + Math.PI,
            0, .05, 5, 0.3,
            null, // No tile info
            new Color(1, 1, 0, 1), new Color(1, .5, 0, 1),
            new Color(1, 0, 0, 0), new Color(.5, 0, 0, 0),
            .2, .2, .05, 1, 0,
            .95, 1, 0, .5,
            .1, .1, 0, 1
        );
    }
    
    render() {
        if (!this.active) return;
        super.render();
    }
}
```


