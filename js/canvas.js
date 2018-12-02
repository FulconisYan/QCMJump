window.onload = init;

let canvas, ctx, w, h;
let joueur;

let ecranJeu = "selection";//"QCM";
let categorie = "aucune";//"Sport";

let tableauButton;
let buttonRetour;

let tabCases;

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
	joueur = new Personnage(150, 300, 50, 75);
	tabCases = [0,0,0].map((e, i) => {
		return new CaseReponse(70 + i*150, 110, 60, i);
	});

	/*************************************************************/


	canvas.onclick = mouseClickHandler;
	canvas.onmousemove = mouseOverHandler;
	document.onkeydown = keyDownHandler;
	document.onkeyup = keyUpHandler;

	requestAnimationFrame(mainloop);

}

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
/************************************************/
let keys = {
	"ArrowLeft": false,
	"ArrowRight": false,
	"ArrowUp": false
};
function keyDownHandler(event){
	switch(event.code){
		case "ArrowLeft":
		case "ArrowRight":
		case "ArrowUp":
			keys[event.code] = true;
		break;
	}
}
function keyUpHandler(event){
	switch(event.code){
		case "ArrowLeft":
		case "ArrowRight":
		case "ArrowUp":
			keys[event.code] = false;
		break;
	}
}

function checkCollisionX(vX){
	return joueur.x+vX < 0
	|| joueur.x+joueur.w+vX > w;	
}

function checkCollisionY(vY){
	
	/*let tc = tabCases.reduce((n, e, i) => {
		if(joueur.y)
		e.c = e.c === "red" ? "orange" : "red";
		n+=i;
		return n;
	}, 0);

	if(tc !== 0)
		return 1;*/

	if(joueur.y+joueur.h+vY > 375){
		joueur.y = 375-joueur.h;
		return 2;
	}

	return 0;
}

/****************************************************************************/

function mainloop()
{
	ctx.clearRect(0, 0, w, h);
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

			//Temporary label
			ctx.save();
			ctx.fillStyle = 'blue';
			ctx.fillRect(180, 30, 200, 60);
			ctx.fillStyle = 'red';
			ctx.fillText("Catégorie: "+categorie, 200, 60);
			ctx.fillRect(0, 375, 500, 50);
			ctx.restore();
			//end temporary

			tabCases.forEach(function(e) {
				e.draw(ctx);
			});

			joueur.draw(ctx);

			joueur.move(keys);

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