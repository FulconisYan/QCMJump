let direction = {
	DROITE: 1,
	GAUCHE: -1
};

let etat = {
	DEBOUT: { min: 0, max: 1, temps: 30 },
	COURIR: { min: 2, max: 9, temps: 5 },
	SAUT: { min: 10, max: 10, temps: 30 }
};

class Personnage extends Case {

	constructor(_x, _y, _w, _h){
		super(_x, _y, _w, _h, null, "black", "orange");
		this.oldY = _y;
		this.jumping = false;
		this.speedX = 7;
		this.speedY = 0;
		this.direction = direction.DROITE;
		this.etat = etat.DEBOUT;

		this.spriteInd = 0;
		this.spriteNumber = 0;
		this.spriteWidth = 64;
		this.spriteHeight = 68;

		this.jumpHeight = -18;
		this.gravity = 0.9;
	}

	draw(ctx){
		ctx.save();
        ctx.translate(this.x, this.y);
		//est que l'image à été chargé ?
        if(this.img != undefined){
			//Oui alors dessine
			if(this.direction === direction.GAUCHE){
				ctx.translate(this.w, 0);
				ctx.scale(this.direction, 1);
			}			
			//Source: https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/drawImage
			/*context.drawImage(img, sx, sy,
				swidth, sheight,
				x, y,
				width, height);
			*/
			ctx.drawImage(this.img, (this.etat.min + this.spriteInd)*this.spriteWidth, 0,
				this.spriteWidth, this.spriteHeight,
				0, 0,
				this.w, this.h);
		} else {
			//Non alors rectangle supsitu
            ctx.fillStyle = this.bc;
            ctx.fillRect(0, 0, this.w, this.h);
        }
		ctx.restore();

		if(this.spriteNumber >= this.etat.temps){
			if(this.spriteInd >= (this.etat.max - this.etat.min))
				this.spriteInd = 0;
			else
				this.spriteInd++;
			this.spriteNumber = 0;
		} else
			this.spriteNumber++;
	}

	changerEtat(e){
		if(e.min != this.etat.min
		|| e.max != this.etat.max){
			this.etat = e;
			this.spriteNumber = 0;
			this.spriteInd = 0;
		}
	}

	move(keyInput, frameRate){
		for(let i=0; i<=frameRate; i++){
			let inC = 0;

			if(this.jumping)
				this.speedY += this.gravity;
			else {
				if(keyInput.ArrowLeft || keyInput.KeyA){
					inC = -this.speedX;
					this.direction = direction.GAUCHE;
					this.changerEtat(etat.COURIR);
				}
				
				if(keyInput.ArrowRight || keyInput.KeyD){
					inC = this.speedX;
					this.direction = direction.DROITE;
					this.changerEtat(etat.COURIR);
				}

				if(keyInput.ArrowUp || keyInput.KeyW){
					this.jumping = true;
					this.speedY = this.jumpHeight;
					this.changerEtat(etat.SAUT);
				}
			}

			if(this.jumping === false){
				if(inC === 0)
					this.changerEtat(etat.DEBOUT);
				else
					createExplosion(this.x+this.w/2, this.y+this.h, "#DDDDDD", 10);
			}

			this.x += inC;
			this.y += this.speedY;

			switch(checkCollisionPersonnage()){

				case 1: //Case
					this.y -= this.speedY;
					this.speedY = 0;
					inC = 0;
				break;

				case 2: //Sol (plateforme)
					this.jumping = false;
					this.y = this.oldY;
					this.speedY = 0;
					this.changerEtat(etat.DEBOUT);
				break;

				case 3: //Bords de l'écran
					//this.x -= inC;
					//New protection
					this.x = inC >= 0 ? w-this.w : 1;
				break;
			}
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
					for(k in keyInput) keyInput[k] = false;
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