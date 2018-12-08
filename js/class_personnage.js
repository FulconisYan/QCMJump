class Personnage extends Case {

	constructor(_x, _y, _w, _h){
		super(_x, _y, _w, _h, null, "black", "orange");
		this.oldY = _y;
		this.speed = 5;
		this.jumping = false;
		this.speedX = 0;
		this.speedY = 0;
		this.jumpHeight = 24;
		this.jumpSpeed = 2;
	}

	move(keyInput){
		this.speedX = 0;

		if(this.jumping)
			this.speedY += this.jumpSpeed;
		else {

			if(keyInput.ArrowLeft)
				this.speedX = -this.speed;
			
			if(keyInput.ArrowRight)
				this.speedX = this.speed;

			if(keyInput.ArrowUp){
				this.jumping = true;
				this.speedY = -this.jumpHeight;
			}
		}

		this.x += this.speedX;
		this.y += this.speedY;

		switch(checkCollision()){

			case 1: //Case
				this.x -= this.speedX;
				this.y -= this.speedY;
				this.speedY = this.jumpSpeed;
				this.speedX = 0;
			break;

			case 2: //Sol (plateforme)
				this.jumping = false;
				this.y = this.oldY;
				this.speedY = 0;
			break;

			case 3: //Bords de l'écran
				this.x -= this.speedX;
			break;
		}
	}
}