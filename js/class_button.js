class Button extends Case {

	constructor(_x, _y, _w, _h, _t, _bc, _tc, _clickBC){
		super(_x, _y, _w, _h, _t, _bc, _tc);
		this.clickBC = _clickBC;
		this.texteX = this.w/4;
	}

	checkOver(mPos){
		this.bc =
		(  mPos.x > this.x
		&& mPos.y > this.y
		&& mPos.x < this.x+this.w
		&& mPos.y < this.y+this.h) ? "orange" : "red";
	}

	checkClick(mPos){
		if(mPos.x > this.x
		&& mPos.y > this.y
		&& mPos.x < this.x+this.w
		&& mPos.y < this.y+this.h)
			this.clickBC(this);
	}
}