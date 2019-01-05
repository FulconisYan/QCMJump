"use strict";

let tabParticule = [];
	
// A single explosion particle
class Particle {

    constructor(_x, _y, _color){
		this.scale = 1.0;
		this.x = _x||0;
		this.y = _y||0;
		this.radius = 20;
		this.color = _color||'#000';
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;
		this.useGravity = false;
    }
      
    update(ms){
        // shrinking
        this.scale -= calcVelocityFromDelta(ms, this.scaleSpeed);

        if (this.scale <= 0)
            // particle is dead, remove it
            removeFromArray(tabParticule, this);   
        
        // moving away from explosion center
        this.x += calcVelocityFromDelta(ms, this.velocityX);
        this.y += calcVelocityFromDelta(ms, this.velocityY);
    
        // and then later come downwards when our
        // gravity is added to it. We should add parameters 
        // for the values that fake the gravity
        if(this.useGravity)
            this.velocityY += Math.random()*4 +4;
    }
		
    draw(ctx){
        // translating the 2D context to the particle coordinates
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        
        // drawing a filled circle in the particle's local space
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
        //ctx.closePath();
        
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.restore();
    }
}

function calcVelocityFromDelta(delta, speed){
    return speed * delta / 1000;
}
	
/*Advanced Explosion effect
* Each particle has a different size, move speed and scale speed.
* 
* Parameters:
* 	x, y - explosion center
* 	color - particles' color
*/
function createExplosion(x, y, color, count, minAngle, maxAngle){

    let minSpeed = 60.0;
    let maxSpeed = 200.0;
    
    for(let i=0; i<count; i++){
        let p = new Particle(x, y, color);
        
        // size of particle
        p.radius = randomFloat(1, 3);
        
        // life time, the higher the value the faster particle 
        // will die
        p.scaleSpeed = randomFloat(0.3, 0.5);
        
        // use gravity
        p.useGravity = true;
        
        let speed = randomFloat(minSpeed, maxSpeed);
        let angle = randomFloat(minAngle, maxAngle);
        
        p.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
        p.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
        
        tabParticule.push(p);
    }
}

// Delta = time between two consecutive frames,
// for time-based animation
function updateAndDrawParticules(ctx, delta) {
    tabParticule.forEach(e => {
       e.update(delta);
       e.draw(ctx);
   });
}

function randomFloat (min, max){
    return min + Math.random() * (max - min);
}

function removeFromArray(t, o) {
    let i = t.indexOf(o);
    if (i !== -1)
        t.splice(i, 1);
    
    return t;
}