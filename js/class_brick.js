class Brick {

    constructor(_x, _y, _w, _h, _t, _tc){
        this.x = _x;
        this.y = _y;
        this.oldY = _y;
        this.w = _w;
        this.h = _h;
        this.t = _t;
        this.tc = _tc ? _tc : "yellow";
        this.img = undefined;
        this.posX = this.w/2;
        this.posY = this.h/2;
        this.jumpHeight = 8;
        this.speedY = 0;
        this.jumpSpeed = 1;
        this.tapped = false;
    }

    addImg(_img){
        this.img = _img;
    }

    tap(){
        this.jumpCumu = 0;
        this.tapped = true;
        this.speedY = -this.jumpHeight;
    }

    draw(ctx){
        if(this.tapped){

            this.y += this.speedY;

            this.speedY += this.jumpSpeed;
            if(this.speedY >= this.jumpHeight){
                this.tapped = false;
                this.y = this.oldY;
            }
        }
		ctx.save();
        ctx.translate(this.x, this.y);
        if(this.img)
			//Oui alors dessine
            ctx.drawImage(this.img, 0, 0, this.w, this.h);
        else {
            ctx.fillStyle = "brown";
            ctx.fillRect(0, 0, this.w, this.h);
        }
        ctx.fillStyle = this.tc;
        ctx.fillText(this.t, this.posX, this.posY);
		ctx.restore();
    }
}