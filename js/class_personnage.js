class Personnage extends Case {

	constructor(_x, _y, _w, _h){
		super(_x, _y, _w, _h, null, "black", "orange");
		this.oldY = _y;
		this.speed = 7;
		this.jumping = false;
		this.speedX = 0;
		this.speedY = 0;
		this.jumpHeight = -18;
		this.gravity = 0.9;
	}

	move(keyInput, delta){
		this.speedX = 0;

		if(this.jumping)
			this.speedY += this.gravity;
		else {
			if(keyInput.ArrowLeft || keyInput.KeyA)
				this.speedX = -this.speed;
			
			if(keyInput.ArrowRight || keyInput.KeyD)
				this.speedX = this.speed;

			if(keyInput.ArrowUp || keyInput.KeyW){
				this.jumping = true;
				this.speedY = this.jumpHeight;
			}
		}

		this.x += calcDistanceFromSpeed(delta, this.speedX);
		this.y += this.speedY;

		switch(checkCollisionPersonnage()){

			case 1: //Case
				this.y -= this.speedY;
				this.speedY = 0;
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

function checkCollisionPersonnage(){
	
	let toucheCase = tabBrick.reduce((n, e) => {
		if(!n)
			if(collision(joueur, e)){
				n = true;
				e.tap();
				repondreQuestion(e.t, () => {
					//reset joueur position + cases
					tabBrick.forEach(e => {
						e.y = e.oldY;
						e.tapped = false;
						e.speedY = 0;
					});
					joueur.y = joueur.oldY;
					joueur.jumping = false;
					joueur.speedY = 0;
				});
			}
		return n;
	}, false);

	if(toucheCase)
		return 1;

	if(collision(joueur, platforme))
		return 2;

	if(joueur.x < 0
	|| joueur.x+joueur.w > w)
		return 3;

	return 0;
}