"use strict";

//le clique de la souris sur le canvas
let mClick;
function mouseClickHandler(event){
	let rect = canvas.getBoundingClientRect();
	mClick = {};// Ceci est un objet "vide" en JSON (en gros)
	mClick.x = event.clientX - rect.left;
	mClick.y = event.clientY - rect.top;
}
// la souris est sur le canvas
let mOver = { x:0, y:0 };
function mouseOverHandler(event){
	let rect = canvas.getBoundingClientRect();
	mOver = {};
	mOver.x = event.clientX - rect.left;
	mOver.y = event.clientY - rect.top;
}
/************************************************/
let keyInput = {
	"ArrowLeft": false,
	"ArrowRight": false,
	"ArrowUp": false,
	"KeyA": false, //Le navigateur reconnait les touches en QWERTY ?
	"KeyD": false,
	"KeyW": false
};
function keyDownHandler(event){
	if(keyInput.hasOwnProperty(event.code))
		keyInput[event.code] = true;
}
function keyUpHandler(event){
	if(keyInput.hasOwnProperty(event.code))
		keyInput[event.code] = false;
}