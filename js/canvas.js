window.onload = init;

let canvas, ctx, w, h;
let joueur;

let tableauButton;

function init() {
  

	canvas = document.querySelector("canvas#myCanvas");

	ctx = canvas.getContext("2d");

	w = canvas.width;
	h = canvas.height;


	/**********************************************************/
	//inserer le fond de notre canvas 
	/*imageFond = new Image();


	imageFond.onload = function(){
		ctx.drawImage(imageFond,0,0);
	};

	imageFond.src = "images/fond.jpg";*/


	/*************************************************************/
	let tabNames = ["Sport", "Histoire", "Culture", "Sciences"];
	tableauButton = new Array(tabNames.length).fill(0);
	let x = w/2 - 150;
	let y = -30;
	tableauButton = tableauButton.map(function(e, i) {
		return new button(tabNames[i], x, y += 100, 250, 50);
	});

	/*************************************************************/

	canvas.onclick = mouseHandler;

	requestAnimationFrame(mainloop);

}
/***********************************************************/
/*function drawJoueur()
{
		ctx.beginPath();
		joueur = new Image();


		joueur.onload = function()
			{
				ctx.drawImage(joueur,50,400);
			};

		joueur.src = "images/player.png";


}*/
/********************************************************************/

	//animer le joueur
		//animer le joueur
	

/****************************************************************************/
let mousePos;
function mouseHandler(event){
	console.log("hello");
	mousePos = { x: event.clientX, y: event.clientY };
}

/****************************************************************************/

function mainloop()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//drawJoueur();
	//creation button du bas 
	
	tableauButton.forEach(function(e) {
		e.draw(ctx);

		if(mousePos != null)
			if(e.checkClick(mousePos) == true){
				console.log(e.texte);
				mousePos = null;
			}
	});



	requestAnimationFrame(mainloop);
}
/************************************************************************/

/*****************************************************************************/


/**************************************************************************/


