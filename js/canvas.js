window.onload = init;

let canvas, ctx, w, h;
let joueur;

let ecranJeu = "QCM";//"selection";
let categorie = "Sciences";//"aucune";

let tableauButton;
let buttonRetour;

let tabCases;
let platforme;
let lblQuestion;
let lblReponses;

let jsonFile;

let imageFond;

var assetsToLoadURLs = {
    backgroundImage: { url: 'images/fond.jpg' }, 
    player: { url: "player.png" },
    
};

var loadedAssets;

function init() {
  

	canvas = document.querySelector("canvas#myCanvas");

	ctx = canvas.getContext("2d");

	w = canvas.width;
	h = canvas.height;

	ctx.font = "15pt Calibri";
	/******************************************************/
	
	drawImage();
	/**********************************************************/

	fetch("resources/questions.json").then((res) => {
		return res.json();
	})
	.then((jsonRes) => {
		jsonFile = jsonRes;
	});

	/**********************************************************/
	//inserer le fond de notre canvas 

	/*var imageFond = new Image();


	imageFond.onload = function(){
		ctx.drawImage(imageFond,0,10,500,800);
	};

	imageFond.src = "images/fond.jpg";*/


	/*************************************************************/
	let tabNames = ["Sport", "Histoire", "Culture", "Sciences"];
	let x = w/2 - 150; // Yan : C'est quoi le w ? Ce ne serait pas par hasard la largeur du canvas ? 
	let y = -30;
	tableauButton = tabNames.map(e => {
		return new Button(x, y += 100, 250, 50, e);
	});

	/*************************************************************/

	buttonRetour = new Button(30, 30, 100, 40, "Retour");
	joueur = new Personnage(150, 300, 50, 75);
	tabCases = [0,0,0].map((e, i) => {
		return new Case(70 + i*150, 110, 60, 60, i+1);
	});
	platforme = new Case(0, 375, 500, 20, "");
	lblQuestion = new Case(0, 420, 500, 50, "QUESTION");
	lblReponses = [0,0,0].map((e, i) => {
		return new Case(50, 490 + i*80, 380, 60, i);
	});

	/*************************************************************/


	canvas.onclick = mouseClickHandler;
	canvas.onmousemove = mouseOverHandler;
	document.onkeydown = keyDownHandler;
	document.onkeyup = keyUpHandler;

	requestAnimationFrame(mainloop);
}

/*******************************************************************************/
function drawImage(){
	console.log("image loaded");
	ctx.drawImage(loadedAssets.backgroundImage, 0, 0, canvas.width, canvas.height);
 	ctx.drawImage(loadedAssets.bell, 20, 20);
 	ctx.drawImage(loadedAssets.spriteSheetBunny, 190, 0);
	
}
/*********************************************************************************/

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
let keyInput = {
	"ArrowLeft": false,
	"ArrowRight": false,
	"ArrowUp": false
};
function keyDownHandler(event){
	if(keyInput.hasOwnProperty(event.code))
		keyInput[event.code] = true;
}
function keyUpHandler(event){
	if(keyInput.hasOwnProperty(event.code))
		keyInput[event.code] = false;
}

function collision(o1, o2){

	if (o1.x > o2.x+o2.w || o1.x+o1.w < o2.x)
	   return false;

	if (o1.y > o2.y+o2.h || o1.y+o1.h < o2.y)
	   return false; 

	return true;
}

function checkCollision(){
	
	let toucheCase = tabCases.reduce((n, e) => {
		if(!n)
			if(collision(joueur, e)){
				e.c = e.c === "red" ? "orange" : "red";
				n = true;
				console.log("Reponse "+e.n);
			}
		return n;
	}, false);

	if(toucheCase)
		return 1;

	if(collision(joueur, platforme)){
		return 2;
	}

	if(joueur.x < 0
	|| joueur.x+joueur.w > w)
		return 3;

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
						let nQuestion = Math.round(Math.random() * jsonFile[categorie].length);
						lblQuestion.n =  jsonFile[categorie][nQuestion].question;
						lblReponses.forEach((r, i) => {
							r.n = (i+1)+": "+jsonFile[categorie][nQuestion].propositions[i+1];
						})
					}
				}
			});
		break;

		case "QCM":
			//Drawing
			buttonRetour.draw(ctx);

			//Temporary label
			ctx.save();
			ctx.fillStyle = 'blue';
			ctx.fillRect(180, 30, 240, 60);
			ctx.fillStyle = 'red';
			ctx.fillText("Catégorie: "+categorie, 200, 60);
			//end temporary

			platforme.draw(ctx);
			//Drawing questions
			lblQuestion.draw(ctx);
			lblReponses.forEach(e => {
				e.draw(ctx);
			});

			ctx.restore();

			tabCases.forEach(function(e) {
				e.draw(ctx);
			});

			joueur.draw(ctx);

			//Checking inputs
			joueur.move(keyInput);

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