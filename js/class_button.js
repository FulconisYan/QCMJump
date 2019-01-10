"use strict";

class Button extends textCase {

	constructor(_x, _y, _w, _h, _t, _clickBC){
		super(_x, _y, _w, _h, _t);
		this.clickBC = _clickBC;
	}

	checkMouse(mHover, mClick){
		this.c = collision(mHover, this) ? "rgb(48, 134, 159)" : "rgba(48, 134, 159, 0.3)";
	
		if(mClick != null)
			if(collision(mClick, this))
				this.clickBC();
	}
}