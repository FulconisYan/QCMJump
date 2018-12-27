let tabParticule = [];
	
// A single explosion particle
class Particle {

    constructor(){
		this.scale = 1.0;
		this.x = 0;
		this.y = 0;
		this.radius = 20;
		this.color = "#000";
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;
		this.useGravity = false;
    }
      
    update(ms){
        // shrinking
        this.scale -= this.scaleSpeed * ms / 1000.0;
        
        if (this.scale <= 0)
            // particle is dead, remove it
            removeFromArray(tabParticule, this);   
        
		
        // moving away from explosion center
        this.x += this.velocityX * ms/1000.0;
        this.y += this.velocityY * ms/1000.0;
    
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
function createExplosion(x, y, color, count){

    var minSpeed = 60.0;
    var maxSpeed = 200.0;
    
    for(let angle=180; angle<360; angle += Math.round(360/count)){
        let p = new Particle();
        
        p.x = x;
        p.y = y;
        
        // size of particle
        p.radius = randomFloat(1, 3);
        
        p.color = color;
        
        // life time, the higher the value the faster particle 
        // will die
        p.scaleSpeed = randomFloat(0.3, 0.5);
        
        // use gravity
        p.useGravity = true;
        
        let speed = randomFloat(minSpeed, maxSpeed);
        
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

/*
function animationLoop (time){
    // number of ms since last frame draw
    delta = timer(time);
    
    // Clear canvas
    context2D.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move and draw tabParticule
    updateAndDrawParticules(delta);
    
    
    // call again the animation loop at 60f/s, i.e in about 16,6ms
    requestAnimationFrame(animationLoop);
}*/