let canvas, ctx, w, h;
let joueur;

let ecranJeu = "selection";//"QCM";
let categorie = "aucune";//"Sciences";

let tableauButton = [];
let buttonRetour;

let tabBrick;
let platforme;
let lblQuestion;
let lblReponses;
let lblCategorie;
let lblTimer;
let tempsQuestion = 10;
let cd;
let seconds = 5;
let nQuestion;
let tabRepondu = [[],[],[],[]];
let tabReponseDonne = [[],[],[],[]];
let nCategorieFini = 0;

let jsonFile;    

let background;
let playingMusic = false;
let btnMuteMusic;
const assetsToLoadURLs = {
    backgroundImage: { url: 'images/fond.jpg' }, 
	player: { url: "images/player.png" },
	brick: { url: "images/brick.png" },
	marioBrosTheme: { url: "resources/mario-bros-theme.mp3",
					tampon: false, loop: true, volume: 1.0
	}
};

let loadedAssets = "aucune";
let assetsAttributed = {};

window.onload = () => {

	canvas = document.querySelector("canvas#myCanvas");

	ctx = canvas.getContext("2d");

	w = canvas.width;
	h = canvas.height;

	ctx.font = "15pt Roboto Slab";
	/**********************************************************/

	fetch("resources/questions.json").then(res => {
		return res.json();
	})
	.then(jsonRes => {
		jsonFile = jsonRes;
		let x = w/2 - 150; // Yan : C'est quoi le w ? Ce ne serait pas par hasard la largeur du canvas ? 
		let y = -30;

		for(let catName in jsonRes)
			tableauButton.push(new Button(x, y += 100, 250, 50, catName, () => {
				ecranJeu = "QCM";
				categorie = catName;
				lblCategorie.t = "Catégorie: "+categorie;
				getQuestion();
				startCountDown();
			}));
	});

	/**********************************************************/
	
	//Chargement des assets dans assetsToLoadURLs
	loadAssets(assetsToLoadURLs);
	btnMuteMusic = new Button(30, 730, 50, 50, "P", () => {
		if(assetsAttributed.hasOwnProperty('marioBrosTheme'))
			if(playingMusic){
				loadedAssets.marioBrosTheme.stop();
				playingMusic = false;
				btnMuteMusic.t = "P";
			} else {
				loadedAssets.marioBrosTheme.play();
				playingMusic = true;
				btnMuteMusic.t = "M";
			}
	});
	/*************************************************************/

	background = new Case(0, 0, w, h, null, "grey", "grey");

	buttonRetour = new Button(10, 30, 100, 40, "Retour", () => {
		ecranJeu = "selection";
		categorie = "aucune";
		stopCountDown();
	});
	lblCategorie = new Case(125, 30, 240, 60, "Catégorie: "+categorie, "red", "blue");
	lblTimer = new Case(400, 30, 50, 40, seconds+"s");

	joueur = new Personnage(150, 310, 50, 65);
	
	tabBrick = [1,2,3].map((e, i) => {
		return new Brick(70 + i*150, 110, 60, 60, e);
	});
	
	platforme = new Case(0, 375, 500, 20, null);
	lblQuestion = new Case(0, 420, 500, 50, "QUESTION");
	lblReponses = [1,2,3].map((e, i) => {
		return new Case(50, 490 + i*80, 380, 60, e);
	});

	/*************************************************************/

	canvas.onclick = mouseClickHandler;
	canvas.onmousemove = mouseOverHandler;
	document.onkeydown = keyDownHandler;
	document.onkeyup = keyUpHandler;

	requestAnimationFrame(mainloop);
};
/*******************************************************************************/
function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
function isAudio(url) {
    return (url.match(/\.(mp3|ogg|wav)$/) != null);
}
function loadAssets(assetsToBeLoaded) {
    let assetsLoaded = {};
    let nbLoaded = 0;
    let numberOfAssetsToLoad = 0;

    // get num of assets to load
    for (let name in assetsToBeLoaded) 
        numberOfAssetsToLoad++;

    //console.log("Nb assets to load: " + numberOfAssetsToLoad);

    for (name in assetsToBeLoaded) {
        let url = assetsToBeLoaded[name].url;
        //console.log("Loading " + url);
        if (isImage(url)) {
            assetsLoaded[name] = new Image();
            assetsLoaded[name].onload = () => {
				if (++nbLoaded >= numberOfAssetsToLoad)
					loadedAssets = assetsLoaded;
				
				//console.log("Loaded asset " + nbLoaded);
			};
            // will start async loading. 
            assetsLoaded[name].src = url;
        } else {
            // We assume the asset is an audio file
            //console.log("loading " + name + " buffer : " + assetsToBeLoaded[name].loop);
            assetsLoaded[name] = new Howl({
                urls: [url],
                buffer: assetsToBeLoaded[name].buffer,
                loop: assetsToBeLoaded[name].loop,
                autoplay: false,
                volume: assetsToBeLoaded[name].volume,
                onload: () => {
					if (++nbLoaded >= numberOfAssetsToLoad)
						loadedAssets = assetsLoaded;
                    
                    //console.log("Loaded asset " + nbLoaded);
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
	
	let toucheCase = tabBrick.reduce((n, e) => {
		if(!n)
			if(collision(joueur, e)){
				n = true;
				e.tap();
				tabReponseDonne[nCategorieFini].push(e.t == jsonFile[categorie][nQuestion].Solution ? 1 : 0);
				tabRepondu[nCategorieFini].push(nQuestion);
				if(tabReponseDonne[nCategorieFini].length === 3){
					//reset joueur position + cases
					tabBrick.forEach(e => {
						e.y = e.oldY;
						e.tapped = false;
						e.speedY = 0;
					});
					joueur.y = joueur.oldY;
					joueur.jumping = false;
					joueur.speedY = 0;
					//Check fin catégorie ou jeu complet
					nCategorieFini++;
					stopCountDown();
					if(nCategorieFini === 4)
						ecranJeu = "resultatTotal";
					else
						ecranJeu = "resultatQCM";
				} else {
					getQuestion();
					seconds += tempsQuestion;
				}
			}
		return n;
	}, false);

	if(toucheCase)
		return 1;

	if(collision(joueur, platforme))
		return 2;

	if(joueur.x < 0
	|| joueur.x+joueur.w > w)
		return 3;

	return 0;
}
/****************************************************************************/
function startCountDown(){
	seconds = tempsQuestion;
	cd = setInterval(() => {
		if(seconds === 0)
			stopCountDown();
		else
			seconds--;
	}, 1000);
}

function stopCountDown(){
	//Verifier si autres question
	//Si oui remettre a tempsQuestion
	//si non clear
	clearInterval(cd);
}
/****************************************************************************/

function getQuestion(){
	do {
		nQuestion = Math.floor(Math.random() * jsonFile[categorie].length);
	} while(tabRepondu[nCategorieFini].indexOf(nQuestion) !== -1);
	lblQuestion.t =  jsonFile[categorie][nQuestion].question;
	lblReponses.forEach((r, i) => {
		r.t = (i+1)+": "+jsonFile[categorie][nQuestion].propositions[i+1];
	});
}

function mainloop(){

	ctx.clearRect(0, 0, w, h);
	//creation button du bas 

	if(assetsAttributed.hasOwnProperty('backgroundImage') === false)
		if(loadedAssets.hasOwnProperty('backgroundImage')){
			background.img = loadedAssets.backgroundImage;
			assetsAttributed.backgroundImage = true;
		}
	
	background.draw(ctx);

	if(assetsAttributed.hasOwnProperty('marioBrosTheme') === false)
		if(loadedAssets.hasOwnProperty('marioBrosTheme')){
			loadedAssets.marioBrosTheme.play();
			assetsAttributed.marioBrosTheme = true;
			playingMusic = true;
			btnMuteMusic.t = "M";
		}

	btnMuteMusic.draw(ctx);
	btnMuteMusic.checkOver(mOver);
	if(mClick != null)
		btnMuteMusic.checkClick(mClick);

	switch(ecranJeu){
		case "selection":
			tableauButton.forEach(function(e) {
				e.draw(ctx);
				e.checkOver(mOver);//vérfier avec la souris les positions du bloc
				if(mClick != null)
					e.checkClick(mClick);
			});
		break;

		case "QCM":
			//Drawing
			buttonRetour.draw(ctx);
			lblCategorie.draw(ctx);
			lblTimer.t = seconds+"s";
			lblTimer.draw(ctx);
			platforme.draw(ctx);
			//Drawing questions
			lblQuestion.draw(ctx);
			lblReponses.forEach(e => {
				e.draw(ctx);
			});			

			if(assetsAttributed.hasOwnProperty('brick') === false)
				if(loadedAssets.hasOwnProperty('brick')){
					tabBrick.forEach(e => { e.img = loadedAssets.brick; });
					assetsAttributed.brick = true;
				}

			tabBrick.forEach(function(e) {
				e.draw(ctx);
			});

			if(assetsAttributed.hasOwnProperty('player') === false)
				if(loadedAssets.hasOwnProperty('player')){
					joueur.img = loadedAssets.player;
					assetsAttributed.player = true;
				}

			joueur.draw(ctx);

			//Verification si fin de jeu + timer
			if(seconds === 0){
				tabReponseDonne[nCategorieFini].push(-1);
				tabRepondu[nCategorieFini].push(nQuestion);
				if(tabReponseDonne[nCategorieFini].length === 3){
					nCategorieFini++;
					if(nCategorieFini === 4)
						ecranJeu = "resultatTotal";
					else
						ecranJeu = "resultatQCM";
				}
				else {
					getQuestion();
					seconds = tempsQuestion;
				}
			}

			//Checking inputs
			joueur.move(keyInput);

			buttonRetour.checkOver(mOver);
			if(mClick != null)
				buttonRetour.checkClick(mClick);
		break;

		case "resultatQCM":
			ctx.fillStyle = "white";
			ctx.fillText("Fin QCM "+categorie, 100, 300);
			tabReponseDonne.forEach((e, i) => {
				let txt = "";
				switch(e){
					case -1:
						txt = "Non donnée";
					break;

					case 0:
						txt = "Incorrect";
					break;

					case 1:
						txt = "Correct";
					break;
				}
				ctx.fillText(txt, 100, 350 + i*50);
			});

			buttonRetour.draw(ctx);
			buttonRetour.checkOver(mOver);
			if(mClick != null)
				buttonRetour.checkClick(mClick);
		break;

		case "resultatTotal":
			ctx.fillStyle = "white";
			ctx.fillText("Fin QCM TOTAL ", 100, 300);
			let i=0;
			for(let catName in jsonFile) {
				/*jsonFile[catName].forEach(e => {

				});*/
				ctx.fillText(catName + " test", 100, 350 + i*50);
				i++;
			}
		break;

		default:
			console.log("ERREUR DANS LA VARIABLE ecranJeu !!!");
			return;
	}

	mClick = null;

	requestAnimationFrame(mainloop);
}
/************************************************************************/