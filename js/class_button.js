class Button {

	constructor(x, y, l, h, texte)
	{
		this.texte = texte;
		this.x = x;
		this.y = y;
		this.l=l;
		this.h=h;
		this.colour = 'rgb(128,0,0)';
	}

	draw(ctx){
		ctx.save();
		ctx.translate(this.x, this.y);
		/*Pourquoi on ne peut pas directement écrire
		"ctx.fillRect(x,y,this.l,this.h)" ?? */ 
		ctx.fillStyle = this.colour;
		ctx.fillRect(0,0,this.l,this.h);
		//rajouter le texte au centre
		ctx.fillStyle = "white";
		ctx.translate(this.l/4, this.h/2);
		ctx.fillText(this.texte,0,0);
		ctx.restore();
	}

	checkOver(mPos){
		if(mPos.x > this.x
		&& mPos.y > this.y
		&& mPos.x < this.x+this.l
		&& mPos.y < this.y+this.h)
			this.colour = 'blue';
		else 
			this.colour = 'red';

	}

	checkClick(mPos){
		if(mPos.x > this.x
		&& mPos.y > this.y
		&& mPos.x < this.x+this.l
		&& mPos.y < this.y+this.h)
			return true;

		return false;
	}
}