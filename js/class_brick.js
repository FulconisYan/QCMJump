class Brick extends Case {

    constructor(_x, _y, _w, _h, _t){
        super(_x, _y, _w, _h, _t, "yellow", "brown");
        this.oldY = _y;
        this.posX = this.w/2;
        this.posY = this.h/2;
        this.jumpHeight = 8;
        this.speedY = 0;
        this.gravity = 1;
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

    move(frameRate){
        for(let i=0; i<= frameRate; i++)
            if(this.tapped){

                this.speedY += this.gravity;

                this.y += this.speedY;

                if(this.speedY >= this.jumpHeight){
                    this.tapped = false;
                    this.y = this.oldY;
                }
            }
    }
}