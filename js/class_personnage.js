class Personnage
{
	constructor(img,x, y, w, h)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.img = new Image();
		this.img.src = img;
		this.direction = 1; // 0: left, 1: right
		this.speed = 5;
		this.jumping = false;
		this.speedX = 0;
		this.speedY = 0;
		this.jumpHeight = 24;
		this.jumpSpeed = 2;
	}

	draw(ctx)
	{
		//ctx.drawImage(this.img, this.x, this.y);
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillStyle = "orange";
		ctx.fillRect(0, 0, this.w, this.h);
		ctx.translate(this.w/2 + (this.direction === 0 ? -1 : 1) * this.w/4, this.h/3);
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, this.w/8, this.h/8);
		ctx.restore();
	}

	move(keyInput)
	{
		this.speedX = 0;

		if(this.jumping)
			this.speedY += this.jumpSpeed;		
		else {

			if(keyInput.ArrowLeft){
				this.direction = 0;
				this.speedX = -this.speed;
			}
			
			if(keyInput.ArrowRight){
				this.direction = 1;
				this.speedX = this.speed;
			}

			if(keyInput.ArrowUp){
				this.jumping = true;
				this.speedY = -this.jumpHeight;
			}
		}

		this.x += this.speedX;
		this.y += this.speedY;

		switch(checkCollision()){

			case 1:
				this.x -= this.speedX;
				this.y -= this.speedY;
				this.speedY = this.jumpSpeed;
				this.speedX = 0;
			break;

			case 2:
				this.jumping = false;
				//TODO: find better solution
				this.y = 375-this.h;
				//this.y -= this.speedY;
				this.speedY = 0;
			break;

			case 3:
				this.x -= this.speedX;
			break;
		}
	}
}