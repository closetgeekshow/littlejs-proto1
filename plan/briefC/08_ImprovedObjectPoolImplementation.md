## Improved Object Pool Implementation

```javascript:littlejs/proto1/objectPool.js
class ObjectPool {
    constructor(ObjectClass, size) {
        this.ObjectClass = ObjectClass;
        this.objects = [];
        this.activeObjects = [];
        
        // Pre-allocate objects
        for (let i = 0; i < size; i++) {
            const obj = new ObjectClass();
            obj.active = false;
            this.objects.push(obj);
        }
    }
    
    getInactive() {
        // Find first inactive object
        for (const obj of this.objects) {
            if (!obj.active) {
                obj.active = true;
                this.activeObjects.push(obj);
                return obj;
            }
        }
        
        // All objects are active, create a new one if needed
        if (G.debug) console.log(`Object pool for ${this.ObjectClass.name} is full!`);
        return null;
    }
    
    update() {
        // Update active objects and remove inactive ones from active list
        for (let i = this.activeObjects.length - 1; i >= 0; i--) {
            const obj = this.activeObjects[i];
            if (!obj.active) {
                this.activeObjects.splice(i, 1);
            }
        }
    }
    
    countActive() {
        return this.activeObjects.length;
    }
    
    deactivateAll() {
        for (const obj of this.activeObjects) {
            obj.active = false;
        }
        this.activeObjects = [];
    }
}
```


