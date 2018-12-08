class Brick extends Case {

    constructor(_x, _y, _w, _h, _t){
        super(_x, _y, _w, _h, _t, "yellow", "brown");
        this.oldY = _y;
        this.posX = this.w/2;
        this.posY = this.h/2;
        this.jumpHeight = 8;
        this.speedY = 0;
        this.jumpSpeed = 1;
        this.tapped = false;
    }

    tap(){
        this.tapped = true;
        this.speedY = -this.jumpHeight;
        this.tc = "red";
        setTimeout(() => {
            this.tc = "yellow";
        }, 400);
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
        super.draw(ctx);
    }
}