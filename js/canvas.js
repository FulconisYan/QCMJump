window.onload = init;

let canvas, ctx, w, h;
//let joueur;

let ecranJeu = "selection";
let categorie = "aucune";

let tableauButton;
let buttonRetour;

let jsonFile;

function init() {
  

	canvas = document.querySelector("canvas#myCanvas");

	ctx = canvas.getContext("2d");

	w = canvas.width;
	h = canvas.height;

	ctx.font = "15pt Calibri";

	/**********************************************************/

	fetch("resources/questions.json").then((res) => {
		return res.json();
	})
	.then((jsonRes) => {
		jsonFile = jsonRes;
	});

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
		return new Button(x, y += 100, 250, 50, tabNames[i]);
	});

	/*************************************************************/

	buttonRetour = new Button(30, 30, 100, 40, "Retour");

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
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//drawJoueur();
	//creation button du bas 

	switch(ecranJeu){
		case "selection":
			tableauButton.forEach(function(e) {
				e.draw(ctx);

				e.checkOver(mOver);//vérfier avec la souris les positions du bloc

				if(mClick != null){
					if(e.checkClick(mClick) == true){
						//changer écran
						ecranJeu = "QCM";
						categorie = e.texte;
					}
				}
			});
		break;

		case "QCM":
			buttonRetour.draw(ctx);

			//ctx.save();
			ctx.fillStyle = 'blue';
			ctx.fillRect(180, 70, 130, 70);
			ctx.fillStyle = 'red';
			ctx.fillText("Catégorie: "+categorie, 200, 100);
			//ctx.restore();

			buttonRetour.checkOver(mOver);
			if(mClick != null){
				if(buttonRetour.checkClick(mClick) == true){
					//changer écran
					ecranJeu = "selection";
					categorie = "aucune";
				}
			}
		break;

		case "resultatQCM":
			//TODO
		break;

		case "resultatTotal":
			//TODO
		break;

		default:
			console.log("ERREUR DANS LA VARIABLE ecranJeu !!!");
		break;
	}

	mClick = null;

	requestAnimationFrame(mainloop);
}
/************************************************************************/