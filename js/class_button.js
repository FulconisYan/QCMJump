"use strict";

class Button extends Case {

	constructor(_x, _y, _w, _h, _t, _clickBC){
		super(_x, _y, _w, _h, _t);
		this.clickBC = _clickBC;
	}

	checkMouse(mHover, mClick){
		this.bc =
		(  mHover.x > this.x
		&& mHover.y > this.y
		&& mHover.x < this.x+this.w
		&& mHover.y < this.y+this.h) ? "rgb(48, 134, 159)" : "rgba(48, 134, 159, 0.3)";
	
		if(mClick != null)
			if(mClick.x > this.x
			&& mClick.y > this.y
			&& mClick.x < this.x+this.w
			&& mClick.y < this.y+this.h)
				this.clickBC(this);
	}
}