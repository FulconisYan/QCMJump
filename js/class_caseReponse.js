class CaseReponse {

    constructor(_x, _y, _wh, _n){
        this.x = _x;
        this.y = _y;
        this.wh = _wh;
        this.n = _n;
        this.c = "red";
    }

    draw(ctx){
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillStyle = this.c;
		ctx.fillRect(0, 0, this.wh, this.wh);
        ctx.fillStyle = 'blue';
        ctx.fillText(this.n, this.wh/3, this.wh/3);
		ctx.restore();
    }
}