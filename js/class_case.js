class Case {

    constructor(_x, _y, _w, _h, _n){
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
        this.n = _n;
    }

    draw(ctx){
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillStyle = "red";
		ctx.fillRect(0, 0, this.w, this.h);
        ctx.fillStyle = 'blue';
        ctx.fillText(this.n, this.w/3, this.h/3);
		ctx.restore();
    }
}