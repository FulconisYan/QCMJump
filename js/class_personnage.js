"use strict";

const direction = {
	DROITE: 1,
	GAUCHE: -1
};

const etat = {
	DEBOUT: { min: 0, max: 1, temps: 500 },
	COURIR: { min: 2, max: 9, temps: 100 },
	SAUT: { min: 10, max: 10, temps: 500 }
};

class Personnage extends Case {

	constructor(_x, _y, _w, _h){
		super(_x, _y, _w, _h, "red");
		this.oldY = _y;
		this.jumping = false;
		this.speedX = 400; //pixels/s
		this.speedY = 0; //pixels/s
		this.direction = direction.DROITE;
		this.etat = etat.DEBOUT;

		this.spriteInd = 0;
		this.spriteNumber = 0;
		this.spriteWidth = 64;
		this.spriteHeight = 68;

		this.jumpHeight = 800;
		this.gravity = 18; //pixels/ms
	}

	draw(ctx){
		ctx.save();
        ctx.translate(this.x, this.y);
		if(this.direction === direction.GAUCHE){
			ctx.translate(this.w, 0);
			ctx.scale(this.direction, 1);
		}		
		//est que l'image à été chargé ?
        if(this.img != undefined){
			//Oui alors dessine le sprite correspondant
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
            ctx.fillStyle = this.c;
			ctx.fillRect(0, 0, this.w, this.h);
			ctx.translate(this.w*3/4, this.h/4);
            ctx.fillStyle = "black";
			ctx.fillRect(0, 0, this.w/10, this.h/10);
        }
		ctx.restore();
	}

	changerEtat(e){
		if(e.min != this.etat.min
		|| e.max != this.etat.max){
			this.etat = e;
			this.spriteNumber = 0;
			this.spriteInd = 0;
		}
	}

	move(keyInput, ms){
		let inC = 0;

		if(this.spriteNumber >= this.etat.temps){
			if(this.spriteInd >= (this.etat.max - this.etat.min))
				this.spriteInd = 0;
			else
				this.spriteInd++;
			this.spriteNumber = 0;
		} else
			this.spriteNumber += ms;

		if(this.jumping)
			this.speedY += calcGravityFromDelta(ms, this.gravity);
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

			if(keyInput.ArrowUp || keyInput.KeyW || keyInput.Space){
				this.jumping = true;
				this.speedY = -this.jumpHeight;
				this.changerEtat(etat.SAUT);
			}
		}

		if(this.jumping === false){
			if(inC === 0)
				this.changerEtat(etat.DEBOUT);
			else
				if(this.direction === direction.DROITE)
					createExplosion(this.x+this.w/2, this.y+this.h, "#DDDDDD", 1, 180, 270);
				else
					createExplosion(this.x+this.w/2, this.y+this.h, "#DDDDDD", 1, 270, 360);
		}

		var tempVelX = calcVelocityFromDelta(ms, inC);
		var tempVelY = calcVelocityFromDelta(ms, this.speedY);

		this.x += tempVelX;
		this.y += tempVelY;

		switch(checkCollisionPersonnage()){

			case 1: //Case
				this.y -= tempVelY;
				this.speedY = 0;
			break;

			case 2: //Sol (plateforme)
				this.jumping = false;
				this.y = this.oldY;
				this.speedY = 0;
				this.changerEtat(etat.DEBOUT);
			break;

			case 3: //Bords de l'écran
				this.x -= tempVelX;
				//this.x = inC >= 0 ? w-this.w : 1;
			break;
		}
	}
}

function checkCollisionPersonnage(){
	
	if(tabBrick.some(e => {
		if(collision(joueur, e)){
			repondreQuestion(e.t, resetQCMSprite, c => e.tap(c) );
			return true;
		}
		return false;
	}))
		return 1;

	if(collision(joueur, platforme))
		return 2;

	if(joueur.x < 0
	|| joueur.x+joueur.w > w)
		return 3;

	return 0;
}