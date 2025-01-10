import Boid from "./Boid.js"


let flock = []
window.setup = function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    for (let i = 0; i < 150; i++) {
        flock.push(new Boid(random(0, windowWidth), random(0, windowHeight)))
    }
}

window.draw = function draw() {
    background(255);
    for (const boid of flock) {
        boid.seek(createVector(mouseX, mouseY))
        boid.update(flock)
        boid.move()
        boid.show()
    }
    
}

function rad(deg) {
    return deg * Math.PI / 180
}

//class Boid {
//     /* 
//     angle of 0 is rightward
//     positive angles go clockwise
//     */
//     constructor(x=0, y=0, a=0, v=0) {
//         this.x = x
//         this.y = y
//         this.angle = a // in degrees
//         this.velocity = v
//         this.sight = 300 // neighborhood range
//     }

//     moveForward(amount) {
//         this.x += amount * Math.cos(rad(this.angle))
//         this.y += amount * Math.sin(rad(this.angle))
//     }

//     turnLeft(amount) {
//         this.angle -= amount
//     }

//     turnRight(amount) {
//         this.angle += amount
//     }

//     show() {
//         fill(0)
//         push()
//         translate(this.x, this.y)
//         rotate(this.angle)
//         triangle(-5, -5, -5, 5, 10, 0)
//         pop()
//     }
// }

// does not work right now
// positive negative loop
// let x = mouseX - boid.x
// let y = mouseY - boid.y
// let a = atan2(y, x)
// if (a > boid.angle) boid.turnRight(6)
// else if (a < boid.angle) boid.turnLeft(6)
// console.log(a, boid.angle)
// boid.moveForward(3)