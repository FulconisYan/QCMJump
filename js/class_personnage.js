class Personnage
{
	constructor(x, y, w, h)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.direction = 1; // 0: left, 1: right
		/*this.img = new Image();
		this.img.src = img;*/
		this.speed = 5;
		this.jumping = false;
		this.speedX = 0;
		this.speedY = 0;
		this.jumpHeight = 25;
		this.jumpSpeed = 2;
	}

	draw(ctx)
	{
		//ctx.drawImage(this.img, this.x, this.y);
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillStyle = "orange";
		ctx.fillRect(0, 0, this.w, this.h);
		ctx.restore();
	}

	move(keys)
	{
		this.speedX = 0;

		if(keys.ArrowLeft){
			this.direction = 0;
			this.speedX = -this.speed;
		}
		
		if(keys.ArrowRight){
			this.direction = 1;
			this.speedX = this.speed;
		}
		

		if(this.jumping){
			this.speedY += this.jumpSpeed;
			if(this.speedY > this.jumpHeight){
			}			
		} else 
			if(keys.ArrowUp){
				this.jumping = true;
				this.speedY = -this.jumpHeight;
			}

		if(!checkCollisionX(this.speedX)){
			this.x += this.speedX;
		}
		switch(checkCollisionY(this.speedY)){

			//case 1:

			//break;

			case 2:
				this.jumping = false;
				this.speedY = 0;
			break;

			default:
				this.y += this.speedY;
			break;
		}
	}
}