"use strict";

//le clique de la souris sur le canvas
let mClick;
function mouseClickHandler(event){
	var rect = canvas.getBoundingClientRect();
	mClick = {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
		w: 0,
		h: 0
	};
}
// la souris est sur le canvas
let mOver = { x:0, y:0, w:0, h:0 };
function mouseOverHandler(event){
	var rect = canvas.getBoundingClientRect();
	mOver.x = event.clientX - rect.left;
	mOver.y = event.clientY - rect.top;
}
/************************************************/
//Le navigateur reconnait les touches en QWERTY mais nous utilisons comme un AZERTY
let keyInput = {
	//Gauche
	"ArrowLeft": false, "KeyA": false,
	//Droite
	"ArrowRight": false, "KeyD": false,
	//Saut
	"ArrowUp": false, "KeyW": false, "Space": false
};
function keyDownHandler(event){
	if(keyInput.hasOwnProperty(event.code))
		keyInput[event.code] = true;
}
function keyUpHandler(event){
	if(keyInput.hasOwnProperty(event.code))
		keyInput[event.code] = false;
}