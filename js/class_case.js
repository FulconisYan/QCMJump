class Case {

    constructor(_x, _y, _w, _h, _n, _c, _bc){
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
        this.n = _n;
        this.c = _c ? _c : "blue";
        this.bc = _bc ? _bc : "red";
        this.img = undefined;
        this.posX = this.w/10;
        this.posY = this.h/2;
    }

    draw(ctx){
		ctx.save();
        ctx.translate(this.x, this.y);
        if(this.img){
			//Oui alors dessine
            ctx.drawImage(this.img, 0, 0, this.w, this.h);
        } else {
            ctx.fillStyle = this.bc;
            ctx.fillRect(0, 0, this.w, this.h);
        }
        ctx.fillStyle = this.c;
        ctx.fillText(this.n, this.posX, this.posY);
		ctx.restore();
    }
}