//Canvas
let canvas, ctx, w, h;
let background;
let lblFps;

let __slow = false;
let __n = 3e7; //3e7 === 30000000

//Variables globales
let ecrans = {
	selection: 0,
	QCM: 1,
	resultatQCM: 2,
	resultatTotal: 3
};
let ecranJeu = ecrans.selection;
let idCategorie = -1;
let tabCategorie = [];

//Questions.js
let tabRepondu = [];
let tabReponseDonne = [];
let nCategorieFini = 0;
let nbQuestionARepondre = 3;

//JSONs
let jsonFile, jsonTest; //Fichier json temporaire pour OpenQuizz

//Retour ecranJeu Selection
let buttonRetour;

//Button + fonction musique
let playingMusic = false;
let btnMuteMusic;

//ecranJeu Selection
let tableauButton = [];
let tabLblRepondu = [];

//ecranJeu QCM
let tabBrick = [];
let platforme, joueur;
let lblQuestion, lblReponses, lblCategorie, lblTimer;

//indice question en cours dans le JSON
let nQuestion;

//Mécanisme Timer
let tempsQuestion = 999;
let interV;
let seconds = 5;

//Timer animation
// Voir https://courses.edx.org/courses/course-v1:W3Cx+HTML5.2x+3T2018/courseware/403b445abed54b2ba00322290f1684c7/8003fee922d14e8cac252a00ca01e2dc/1?activate_block_id=block-v1%3AW3Cx%2BHTML5.2x%2B3T2018%2Btype%40vertical%2Bblock%4061e116312bad49eba1a67b5c10d032af
// for time based animation
let now, delta = 0;
// High resolution timer
let oldTime = 0;

/************************************************************************/
//Assets (images + musiques)
const assetsToLoadURLs = {
    backgroundImage: { url: 'images/fond.jpg' }, 
	player: { url: "images/player.png" },
	brick: { url: "images/brick.png" },
	marioBrosTheme: { url: "resources/mario-bros-theme.mp3",
					tampon: false, loop: true, volume: 1.0
	},
	play: { url: "images/play.png" },
	mute: { url: "images/mute.png" }
};

let loadedAssets = "aucune";
let assetsAttributed = {};
for(a in assetsToLoadURLs) assetsAttributed[a] = false
/************************************************************************/
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

		let i = 0;
		for(let catName in jsonRes){
			tableauButton.push(new Button(x, y += 100, 250, 50, catName, () => {
				ecranJeu = ecrans.QCM;
				//TODO: optimisation (indexOf remplacée par i)
				idCategorie = tabCategorie.indexOf(catName);
				lblCategorie.t = "Catégorie: "+tabCategorie[idCategorie];
				getQuestion();
				startCountDown();
			}));
			tabLblRepondu.push(new Case(355, y, 50, 50, "0/"+nbQuestionARepondre));
			tabCategorie.push(catName);
			tabRepondu[i] = [];
			tabReponseDonne[i] = [];
			i++;
		}
	});

	//fichier test JSON
	fetch("resources/qOpenQuizz.json").then(res => {
		return res.json();
	})
	.then(jsonRes => {
		jsonTest = jsonRes;
	});

	/**********************************************************/
	
	//Chargement des assets dans assetsToLoadURLs
	loadAssets(assetsToLoadURLs);
	btnMuteMusic = new Button(30, 730, 50, 50, "P", e => {
		if(assetsAttributed.marioBrosTheme)
			if(playingMusic){
				loadedAssets.marioBrosTheme.stop();
				playingMusic = false;
				if(!e.play)
					e.t = "P";
			} else {
				loadedAssets.marioBrosTheme.play();
				playingMusic = true;
				if(!e.mute)
					e.t = "M";
			}
	});

	btnMuteMusic.draw = function(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillStyle = this.bc;
		ctx.fillRect(0, 0, this.w, this.h);
		if(this.play && this.mute)
			ctx.drawImage(playingMusic ? this.mute : this.play, 0, 0, this.w, this.h);
		else {
			ctx.translate(this.texteX, this.texteY);
			ctx.fillStyle = this.tc;
			ctx.fillText(this.t, 0, 0);
		}
		ctx.restore();
	};
	/*************************************************************/

	background = new Case(0, 0, w, h, null, "grey", "grey");
	lblFps = new Case(420, 730, 50, 50, 0);

	buttonRetour = new Button(10, 30, 100, 40, "Retour", () => {
		ecranJeu = ecrans.selection;
		idCategorie = -1;
		stopCountDown();
	});
	lblCategorie = new Case(125, 30, 240, 60, "Catégorie: aucune", "red", "blue");
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

	//Fonctions sont dans event_handler.js
	canvas.onclick = mouseClickHandler;
	canvas.onmousemove = mouseOverHandler;
	document.onkeydown = keyDownHandler;
	document.onkeyup = keyUpHandler;

	requestAnimationFrame(mainloop);
};
/*******************************************************************************/

function collision(o1, o2){

	if (o1.x >= o2.x+o2.w || o1.x+o1.w <= o2.x)
	   return false;

	if (o1.y >= o2.y+o2.h || o1.y+o1.h <= o2.y)
	   return false; 

	return true;
}

/****************************************************************************/
function startCountDown(){
	seconds = tempsQuestion;
	interV = setInterval(() => {
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
	clearInterval(interV);
}
/****************************************************************************/
function mainloop(currentTime){

	if(__slow)
		for(let k=0; k<__n; k++) {
			//Artificial latency
		}

	// Timer animation
	// How long between the current frame and the previous one?
	delta = currentTime - oldTime;

	ctx.clearRect(0, 0, w, h);
	//creation button du bas 

	if(assetsAttributed.backgroundImage === false)
		if(loadedAssets.hasOwnProperty('backgroundImage')){
			background.img = loadedAssets.backgroundImage;
			assetsAttributed.backgroundImage = true;
		}
	
	background.draw(ctx);
	lblFps.draw(ctx);

	if(assetsAttributed.marioBrosTheme === false)
		if(loadedAssets.hasOwnProperty('marioBrosTheme')){
			loadedAssets.marioBrosTheme.play();
			assetsAttributed.marioBrosTheme = true;
			playingMusic = true;
			btnMuteMusic.t = "M";
		}

	if(assetsAttributed.play === false)
		if(loadedAssets.hasOwnProperty('play')){
			btnMuteMusic.play = loadedAssets.play;
			assetsAttributed.play = true;
		}
	
	if(assetsAttributed.mute === false)
		if(loadedAssets.hasOwnProperty('mute')){
			btnMuteMusic.mute = loadedAssets.mute;
			assetsAttributed.mute = true;
		}

	btnMuteMusic.draw(ctx);
	btnMuteMusic.checkOver(mOver);
	if(mClick != null)
		btnMuteMusic.checkClick(mClick);

	switch(ecranJeu){
		case ecrans.selection:
			tableauButton.forEach((e, i) => {
				e.draw(ctx);
				if(tabRepondu[i].length < nbQuestionARepondre){
					e.checkOver(mOver);//Vérfier avec la souris les positions du bloc
					if(mClick != null)
						e.checkClick(mClick);
				}
				tabLblRepondu[i].draw(ctx);
			});
		break;

		case ecrans.QCM:
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

			if(assetsAttributed.brick === false)
				if(loadedAssets.hasOwnProperty('brick')){
					tabBrick.forEach(e => { e.img = loadedAssets.brick; });
					assetsAttributed.brick = true;
				}

			tabBrick.forEach(e => {
				e.draw(ctx);
				e.move(delta);
			});

			if(assetsAttributed.player === false)
				if(loadedAssets.hasOwnProperty('player')){
					joueur.img = loadedAssets.player;
					assetsAttributed.player = true;
				}

			joueur.draw(ctx);

			//Verification si fin de jeu + timer
			if(seconds === 0)
				repondreQuestion(-1);

			//Checking inputs
			joueur.move(keyInput, delta);

			buttonRetour.checkOver(mOver);
			if(mClick != null)
				buttonRetour.checkClick(mClick);
		break;

		case ecrans.resultatQCM:
			ctx.fillStyle = "white";
			ctx.fillText("Fin QCM "+tabCategorie[idCategorie], 100, 300);
			tabReponseDonne[idCategorie].forEach((e, i) =>{
				let txt = "Question "+(i+1)+" ";
				switch(e){
					case -1:
						txt += "Non donnée";
					break;

					case 0:
						txt += "Incorrect";
					break;

					case 1:
						txt += "Correct";
					break;
				}
				ctx.fillText(txt, 100, 350 + i*50);
			});

			buttonRetour.draw(ctx);
			buttonRetour.checkOver(mOver);
			if(mClick != null)
				buttonRetour.checkClick(mClick);
		break;

		case ecrans.resultatTotal:
		/*
			copy and paste console to access __debug

			tabRepondu = JSON.parse("[[3,2,0],[3,0,2],[3,0,2],[2,1,4]]");
			tabReponseDonne = JSON.parse("[[1,0,1],[1,1,0],[0,0,1],[0,0,0]]");
			ecranJeu = ecrans.resultatTotal;

		*/
			ctx.fillStyle = "white";
			ctx.fillText("Fin QCM TOTAL ", 100, 150);
			var total = tabCategorie.reduce((n, catName, i) => {

				var res = tabReponseDonne[i].reduce((n, e) => {
					return n+(e === 1 ? 1 : 0);
				}, 0);

				var catRes = res + "/" + nbQuestionARepondre;

				ctx.fillText("Catégorie "+catName + " " + catRes, 100, 250 + i*50);
				return n+res;
			}, 0) + "/" + nbQuestionARepondre*tabCategorie.length;

			ctx.fillText("Resultat Total = "+total, 100, 300 + 50*tabCategorie.length);
		break;
	}

	mClick = null;

    // Store time
    oldTime = currentTime;

	var newFps = Math.floor(1/delta*1000);
	if(Math.abs(lblFps.t - newFps) > 1)
		lblFps.t = newFps;

	requestAnimationFrame(mainloop);
}
/************************************************************************/