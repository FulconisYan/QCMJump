"use strict";

class Case {

    constructor(_x, _y, _w, _h, _t, _tc, _bc){
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
        this.t = _t;
        this.tc = _tc ? _tc : "white";
        this.bc = _bc ? _bc : "rgba(48, 134, 159, 0.3)";
		//pas d'image pour l'instant
        this.img = undefined;
        this.texteX = this.w/2;
        this.texteY = this.h/5*3;
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

		    ctx.strokeStyle = "white";
		    ctx.strokeRect(0, 0, this.w, this.h);
        }
        if(this.t != undefined){
            ctx.translate(this.texteX, this.texteY);
            ctx.fillStyle = this.tc;
            ctx.fillText(this.t, 0, 0);
        }
		ctx.restore();
    }
}

class roundCase extends Case {
    constructor(_x, _y, _w, _h, _t, _tc, _bc){
        super(_x, _y, _w, _h, _t, _tc, _bc);
    }

	draw(ctx){
		ctx.save();
        ctx.translate(this.x+this.w/2, this.y+this.h/2);
		ctx.beginPath();
        ctx.arc(0, 0, this.w/2, 0, 2 * Math.PI);
        ctx.closePath();
		ctx.fillStyle = this.bc;
        ctx.fill();
		ctx.strokeStyle = "white";
        ctx.stroke();
        
        if(this.t != undefined){
            ctx.translate(-this.w/2+this.texteX, -this.h/2+this.texteY);
            ctx.fillStyle = this.tc;
            ctx.fillText(this.t, 0, 0);
        }
		ctx.restore();
	}
}