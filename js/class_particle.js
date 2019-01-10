"use strict";

let tabFusee = [];
let tabParticule = [];

class Fusee {
    constructor(_x, _y, _ang){
        this.x = _x;
        this.y = _y;
        this.h = 20;
        this.w = 70;
        this.lonArrow = 10;
        this.ang = _ang;
        this.minAng = _ang-90; if(this.minAng < 0)   this.minAng +=360;
        this.maxAng = _ang+90; if(this.maxArg > 360) this.maxArg = this.maxAng%360;
        this.rad = _ang * Math.PI / 180;
        var speed = 500;
        this.velocityX = speed * Math.cos(this.rad);
        this.velocityY = speed * Math.sin(this.rad);
        this.color = 'white';
    }
      
    update(ms, w, h){
        
        // moving away from explosion center
        var tX = this.x+this.lonArrow;
        var tY = this.y+this.h/2;
        this.color = "rgb("+random(255)+","+random(255)+","+random(255)+")";
        createExplosion(tX, tY, this.color, 1, this.minAng, this.maxAng);
        this.x += calcVelocityFromDelta(ms, this.velocityX);
        this.y += calcVelocityFromDelta(ms, this.velocityY);

        var vX = this.x+this.w/2;
        var vY = this.y+this.w/2;
        if(vX < 0 || vY < 0 || vX > w || vY > h)
            removeFromArray(tabFusee, this);
    }
		
    draw(ctx){
        ctx.save();
        ctx.translate(this.x+this.lonArrow, this.y+this.h/2);
        ctx.rotate(this.rad);
        
        ctx.beginPath();
        
        ctx.lineTo(-this.w/2, -this.lonArrow);
        ctx.lineTo(  -this.h,              0);
        ctx.lineTo(-this.w/2,  this.lonArrow);
        ctx.lineTo(   this.h,  this.lonArrow);
        ctx.lineTo( this.w/2,              0);
        ctx.lineTo(   this.h, -this.lonArrow);
        ctx.lineTo(  -this.h, -this.lonArrow);
        
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    }
}
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
	
/*Advanced Explosion effect
* Each particle has a different size, move speed and scale speed.
* 
* Parameters:
* 	x, y - explosion center
* 	color - particles' color
*/
function createExplosion(x, y, color, count, minAngle, maxAngle){
    
    for(let i=0; i<count; i++){
        var p = new Particle(x, y, color);
        
        // size of particle
        p.radius = randomFloat(1, 3);
        
        // life time, the higher the value the faster particle 
        // will die
        p.scaleSpeed = randomFloat(0.3, 0.5);
        
        // use gravity
        p.useGravity = true;
        
        var speed = randomFloat(60.0, 200.0);
        var angle = randomFloat(minAngle, maxAngle);
        
        p.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
        p.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
        
        tabParticule.push(p);
    }
}

function createRainbowFusee(sX, sY ,ang){
    tabFusee.push(new Fusee(sX, sY, ang));
}

// Delta = time between two consecutive frames,
// for time-based animation
function updateAndDrawParticules(ctx, delta, w, h) {
    tabFusee.concat(tabParticule).forEach(e => {
       e.update(delta, w, h);
       e.draw(ctx);
   });
}

function calcVelocityFromDelta(delta, speed){
    return calcGravityFromDelta(delta, speed) / 100;
    //return speed * delta / 1000;
}

function calcGravityFromDelta(delta, speed){
    return speed * delta / 10;
}

function random(min, max){
    return Math.floor(randomFloat(min, max));
}

function randomFloat(min, max){
    if(max == undefined){
        max = min;
        min = 0;
    }
    return min + Math.random() * (max - min);
}

function removeFromArray(t, o) {
    let i = t.indexOf(o);
    if (i !== -1)
        t.splice(i, 1);
    
    return t;
}