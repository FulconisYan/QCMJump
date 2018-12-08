class Button extends Case {

	constructor(_x, _y, _w, _h, _t, _clickBC){
		super(_x, _y, _w, _h, _t, "white", "red");
		this.clickBC = _clickBC;
		this.texteX = this.w/4;
	}

	checkOver(mPos){
		this.bc =
		(  mPos.x > this.x
		&& mPos.y > this.y
		&& mPos.x < this.x+this.w
		&& mPos.y < this.y+this.h) ? "blue" : "red";
	}

	checkClick(mPos){
		if(mPos.x > this.x
		&& mPos.y > this.y
		&& mPos.x < this.x+this.w
		&& mPos.y < this.y+this.h)
			this.clickBC();
	}
}