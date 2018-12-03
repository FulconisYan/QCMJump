window.onload = init;

let canvas, ctx, w, h;
let joueur;

let ecranJeu = "selection";//"QCM";
let categorie = "aucune";//"Sciences";

let tableauButton;
let buttonRetour;

let tabCases;
let platforme;
let lblQuestion;
let lblReponses;

let jsonFile;

let imageFond;

let assetsToLoadURLs = {
    backgroundImage: { url: 'images/fond.jpg' }, 
    player: { url: "images/player.png" },
};

let loadedAssets = "aucune";

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
	
	//Chargement des assets dans assetsToLoadURLs
	loadAssetsUsingHowlerAndNoXhr(assetsToLoadURLs);

	/*************************************************************/
	let tabNames = ["Sport", "Histoire", "Culture", "Sciences"];
	let x = w/2 - 150; // Yan : C'est quoi le w ? Ce ne serait pas par hasard la largeur du canvas ? 
	let y = -30;
	tableauButton = tabNames.map(e => {
		return new Button(x, y += 100, 250, 50, e);
	});

	/*************************************************************/

	buttonRetour = new Button(30, 30, 100, 40, "Retour");

	joueur = new Personnage(150, 310, 50, 65);
	
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
function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
function isAudio(url) {
    return (url.match(/\.(mp3|ogg|wav)$/) != null);
}
function loadAssetsUsingHowlerAndNoXhr(assetsToBeLoaded) {
    let assetsLoaded = {};
    let nbLoaded = 0;
    let numberOfAssetsToLoad = 0;

    // get num of assets to load
    for (let name in assetsToBeLoaded) 
        numberOfAssetsToLoad++;

    console.log("Nb assets to load: " + numberOfAssetsToLoad);

    for (name in assetsToBeLoaded) {
        let url = assetsToBeLoaded[name].url;
        console.log("Loading " + url);
        if (isImage(url)) {
            assetsLoaded[name] = new Image();
            assetsLoaded[name].onload = () => {
				if (++nbLoaded >= numberOfAssetsToLoad)
					loadedAssets = assetsLoaded;
				
				console.log("Loaded asset " + nbLoaded);
			};
            // will start async loading. 
            assetsLoaded[name].src = url;
        } else {
            // We assume the asset is an audio file
            console.log("loading " + name + " buffer : " + assetsToBeLoaded[name].loop);
            assetsLoaded[name] = new Howl({
                urls: [url],
                buffer: assetsToBeLoaded[name].buffer,
                loop: assetsToBeLoaded[name].loop,
                autoplay: false,
                volume: assetsToBeLoaded[name].volume,
                onload: () => {
					if (++nbLoaded >= numberOfAssetsToLoad)
						loadedAssets = assetsLoaded;
                    
                    console.log("Loaded asset " + nbLoaded);
                }
            }); // End of howler.js callback
        } // if

    } // for
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

	if(loadedAssets.hasOwnProperty('backgroundImage'))
	ctx.drawImage(loadedAssets.backgroundImage, 0, 0, w, h);

	switch(ecranJeu){
		case "selection":

			tableauButton.forEach(function(e) {
				e.draw(ctx);

				e.checkOver(mOver);//vérfier avec la souris les positions du bloc

				if(mClick != null){
					if(e.checkClick(mClick) === true){
						//changer écran
						ecranJeu = "QCM";
						categorie = e.texte;
						let nQuestion = Math.floor(Math.random() * jsonFile[categorie].length);
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

			if(loadedAssets.hasOwnProperty('player') && joueur.img === undefined)
				joueur.addImg(loadedAssets.player);

			joueur.draw(ctx);

			//Checking inputs
			joueur.move(keyInput);

			buttonRetour.checkOver(mOver);
			if(mClick != null){
				if(buttonRetour.checkClick(mClick) === true){
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