class button{

	constructor(texte,x,y,l,h){
		this.texte = texte;
		this.x = x;
		this.y = y;
		this.l=l;
		this.h=h;
	}

	draw(ctx)
	{
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillStyle = 'rgb(128,0,0)';
		ctx.fillRect(0,0,this.l,this.h);
		//rajouter le texte au centre
		ctx.translate(this.l/4, this.h/2);
		ctx.font = "15pt Calibri";
		ctx.fillStyle = "white";
		ctx.fillText(this.texte,0,0);
		ctx.restore();
	}

	checkClick(mousePos){
		if(mousePos.x > this.x
		&& mousePos.y > this.y
		&& mousePos.x < this.x+this.l
		&& mousePos.y < this.y+this.h)
			return true;

		return false;
	}
}