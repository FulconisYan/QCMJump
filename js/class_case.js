"use strict";

class Case {
    constructor(_x, _y, _w, _h, _c){
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
        this.c = _c||"rgba(48, 134, 159, 0.3)";
		//pas d'image pour l'instant
        this.img = undefined;
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
            ctx.fillStyle = this.c;
            ctx.fillRect(0, 0, this.w, this.h);

		    ctx.strokeStyle = "white";
		    ctx.strokeRect(0, 0, this.w, this.h);
        }
		ctx.restore();
    }
}

class textCase extends Case {
    constructor(_x, _y, _w, _h, _t, _tc, _bc){
        super(_x, _y, _w, _h, _bc);

        this.t = _t;
        this.tc = _tc||"white";

        this.texteX = this.w/2;
        this.texteY = this.h/5*3;
    }

    draw(ctx){
        super.draw(ctx);
        ctx.save();
        ctx.translate(this.x+this.texteX, this.y+this.texteY);
        ctx.fillStyle = this.tc;
        ctx.fillText(this.t, 0, 0);
        ctx.restore();
    }
}

class roundCase extends textCase {
    constructor(_x, _y, _w, _h, _t, _tc, _bc){
        super(_x, _y, _w, _h, _t, _tc, _bc);
    }

	draw(ctx){
		ctx.save();
        ctx.translate(this.x+this.w/2, this.y+this.h/2);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.w/2, 0, 2 * Math.PI);
        ctx.closePath();
        
        ctx.fillStyle = this.c;
        ctx.fill();
        
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.translate(-this.w/2+this.texteX, -this.h/2+this.texteY);
        ctx.fillStyle = this.tc;
        ctx.fillText(this.t, 0, 0);
        
		ctx.restore();
	}
}