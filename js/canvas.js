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
	let x = w/2 - 150; // Yan : C'est quoi le w ? Ce ne serait pas par hasard la largeur du canvas ? 
	let y = -30;
	tableauButton = new Array(tabNames.length).fill(0).map(function(e, i) {
		return new button(x, y += 100, 250, 50, tabNames[i]);
	});

	/*************************************************************/

	canvas.onclick = mouseClickHandler;
	canvas.onmousemove = mouseOverHandler;

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

/****************************************************************************/

function mainloop()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//drawJoueur();
	//creation button du bas 

	tableauButton.forEach(function(e) {
		e.draw(ctx);

		e.checkOver(mOver);//vérfier avec la souris les positions du bloc

		if(mClick != null){
			if(e.checkClick(mClick) == true){
				//changer écran
				console.log("TODO: "+e.texte);
			}
		}
	});

	mClick = null;

	requestAnimationFrame(mainloop);
}
/************************************************************************/

/*****************************************************************************/


/**************************************************************************/


