class personnage
{
	constructor(x,y,vitesseMarche,img)
	{
		this.x = x;
		this.y = y;
		this.direction = 0;
		this.vitesseMarche = vitesseMarche;
		this.img = new Image();
		this.img.src = img;
		this.incrementX = 0;
		this.incrementY = 0;
	}

	draw(ctx)
	{
		ctx.drawImage(this.img, this.x, this.y);
	}

	move()
	{
		this.x += (x*this.vitesseMarche);
		this.y += (y*this.vitesseMarche);
	}



}