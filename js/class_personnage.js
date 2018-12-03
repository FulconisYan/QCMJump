class Personnage
{
	constructor(x, y, w, h)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.direction = 1; // 0: left, 1: right
		this.speed = 5;
		this.jumping = false;
		this.speedX = 0;
		//pas d'image pour l'instant
		this.img = undefined;
		this.speedY = 0;
		this.jumpHeight = 24;
		this.jumpSpeed = 2;
	}

	addImg(_img){
		this.img = _img;
	}

	draw(ctx)
	{
		ctx.save();
		ctx.translate(this.x, this.y);
		//est que l'image à été chargé ?
		if(this.img){
			//Oui alors dessine
			ctx.drawImage(this.img, 0, 0, this.w, this.h);
		} else {
			//Non alors rectangle supsitu
			ctx.fillStyle = "orange";
			ctx.fillRect(0, 0, this.w, this.h);
		}
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