export default class Boid {
    constructor(x=0, y=0) {
        this._position = createVector(x, y)
        this._velocity = createVector(0, 0)
        this.acceleration = createVector(0, 0)
        this.maxSpeed = 3
        this.maxForce = 0.05
        this.neighborhood = 30

        this.sepMultiplier = 1.5
        this.aliMultiplier = 1.25
        this.cohMultiplier = 1
    }

    get position() {
        return this._position
    }
    get velocity() {
        return this._velocity
    }
    set position(pos) {
        this._position = pos
    }
    set velocity(vel) {
        this._velocity = vel
    }
    
    seek(target, multiplier) {
        let desiredVelocity = p5.Vector.sub(target, this.position)
        desiredVelocity.normalize()
        desiredVelocity.mult(this.maxSpeed)

        let force = p5.Vector.sub(desiredVelocity, this.velocity)
        force.limit(this.maxForce)
        if (multiplier) force.mult(multiplier)
        this.acceleration.add(force)
    }

    update(flock) {
        this.separate(flock)
        this.align(flock)
        this.cohesion(flock)
    }

    move() {
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
        this.position.add(this.velocity)

        this.acceleration.mult(0)
    }

    show() {
        fill(0)
        push()
        translate(this.position.x, this.position.y)
        rotate(atan2(this.velocity.y, this.velocity.x))
        triangle(-5, -5, -5, 5, 10, 0)
        pop()
    }

    getNeighbors(flock) {
        const res = []
        for (const boid of flock) {
            let dist = p5.Vector.dist(boid.position, this.position)
            if (dist <= this.neighborhood) {
                res.push(boid)
            }
        }
        return res
    }

    findCenter(flock) {
        const neighbors = this.getNeighbors(flock)
        const res = createVector(0, 0)
        for (const boid of neighbors) {
            res.add(boid.position)
        }
        if (neighbors.length > 0) res.div(neighbors.length)
        return res
    }

    separate(flock) {
        const desiredSeparation = 30
        let count = 0
        let force = createVector(0, 0)
        const neighbors = this.getNeighbors(flock)
        for (const neighbor of neighbors) {
            let dist = p5.Vector.dist(neighbor.position, this.position)
            if (dist > 0 && dist < desiredSeparation) {
                let diff = p5.Vector.sub(this.position, neighbor.position)
                diff.normalize()
                diff.div(dist)
                force.add(diff)
                count++
            }
        }
        if (count > 0) force.div(count)
        if (force.mag() > 0) {
            force.normalize()
            force.mult(this.maxSpeed)
            force.sub(this.velocity)
            force.limit(this.maxForce)
            force.mult(this.sepMultiplier)
            this.acceleration.add(force)
        }
    }

    align(flock) {
        const neighbors = this.getNeighbors(flock)
        const force = createVector(0, 0)
        for (const neighbor of neighbors) {
            force.add(neighbor.velocity)
        }
        if (neighbors.length > 0) force.div(neighbors.length)

        force.normalize()
        force.mult(this.maxSpeed)
        force.sub(this.velocity)
        force.limit(this.maxForce)
        force.mult(this.aliMultiplier)
        this.acceleration.add(force)
    }

    cohesion(flock) {
        const center = this.findCenter(flock)
        this.seek(center, this.cohMultiplier)
    }
}