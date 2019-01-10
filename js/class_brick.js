"use strict";

class Brick extends textCase {

    constructor(_x, _y, _w, _h, _t){
        super(_x, _y, _w, _h, _t, "yellow", "SaddleBrown");
        this.oldY = _y;
        this.jumpHeight = 8;//200;
        this.speedY = 0;
        this.gravity = 1;//10;
        this.tapped = false;
    }

    tap(reponse){
        this.tapped = true;
        this.speedY = -this.jumpHeight;
        switch(reponse){
            case 0:
                this.tc = "red";
            break;

            case 1:
                this.tc = "green";
            break;

            //case -1:
            default:
                this.tc = "orange";
            break;
        }
        createExplosion(this.x+this.w/2, this.y-this.h, this.tc, 20, 180, 360);
    }

    move(ms){
        if(this.tapped){

            this.speedY += this.gravity;

            this.y += this.speedY;//calcVelocityFromDelta(ms, this.speedY);

            if(this.speedY >= this.jumpHeight){
                this.tapped = false;
                this.y = this.oldY;
                this.tc = "yellow";
            }
        }
    }
}