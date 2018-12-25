class Case {

    constructor(_x, _y, _w, _h, _t, _tc, _bc){
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
        this.t = _t;
        this.tc = _tc ? _tc : "blue";
        this.bc = _bc ? _bc : "red";
		//pas d'image pour l'instant
        this.img = undefined;
        this.texteX = this.w/10;
        this.texteY = this.h/2;
    }

    draw(ctx){
		ctx.save();
        ctx.translate(this.x, this.y);
		//est que l'image à été chargé ?
        if(this.img != undefined)
            //Oui alors dessine
            ctx.drawImage(this.img, 0, 0, this.w, this.h);
        else {
			//Non alors rectangle supsitu
            ctx.fillStyle = this.bc;
            ctx.fillRect(0, 0, this.w, this.h);
        }
        if(this.t != undefined){
            ctx.translate(this.texteX, this.texteY);
            ctx.fillStyle = this.tc;
            ctx.fillText(this.t, 0, 0);
        }
		ctx.restore();
    }
}

function calcDistanceFromSpeed(delta, speed) {
    return delta/(1/6*100) * speed;
}