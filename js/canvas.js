"use strict";

//Canvas
let canvas, ctx, w, h;
let background;
let lblFps;

//debug slow frame
let __slow = false;
let __n = 6e7; //6e7 === 60000000

//Variables globales
const ecrans = {
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

//JSON
let jsonFile;

//Retour ecranJeu Selection
let btnRetour;

//Button + fonction musique
let playingMusic = false;
let btnMuteMusic;

//ecranJeu Selection
let tabBtnCategorie = [];
let tabLblRepondu = [];
let tabLblARepondre = [];
let lblTitre;

//ecranJeu QCM
let tabBrick = [];
let platforme, joueur;
let lblQuestion, lblReponses, lblReponsesNb = [], lblCategorie, lblTimer;

//ecranJeu resultatTotal
let btnReset;

//indice question en cours dans le JSON
let nQuestion;

//Mécanisme Timer
let tempsQuestion = 20;
let interV;
let seconds = tempsQuestion;

//Timer animation
// Voir https://courses.edx.org/courses/course-v1:W3Cx+HTML5.2x+3T2018/courseware/403b445abed54b2ba00322290f1684c7/8003fee922d14e8cac252a00ca01e2dc/1?activate_block_id=block-v1%3AW3Cx%2BHTML5.2x%2B3T2018%2Btype%40vertical%2Bblock%4061e116312bad49eba1a67b5c10d032af
// for time based animation
let oldTime = 0, tempFrame = 0;
// fps counter
let lastTime = 0;
let frameCounter = 0;

/************************************************************************/
//Assets (images + musiques)
const assetsToLoadURLs = {
    backgroundImage: { url: "images/fond.jpg" },
	santa_sprite: { url: "images/santa_sprite.png" },
	snow: { url: "images/snow.jpg" },
	brick: { url: "images/brick.png" },
	marioBrosTheme: { url: "resources/mario-bros-theme.mp3",
					autoplay: true, loop: true, volume: 1.0 },
	play: { url: "images/play.png" },
	mute: { url: "images/mute.png" }
};
/************************************************************************/
window.onload = () => {

	canvas = document.querySelector("canvas#myCanvas");
	ctx = canvas.getContext("2d");
	w = canvas.width;
	h = canvas.height;
	ctx.font = "15pt Roboto Slab";
	ctx.textAlign = "center";

	/**********************************************************/

	fetch("resources/questions.json").then(res => {
		return res.json();
	})
	.then(jsonRes => {
		jsonFile = jsonRes;
		let x = w/2 - 150; // Yan : C'est quoi le w ? Ce ne serait pas par hasard la largeur du canvas ? 

		let i = 0;
		for(let catName in jsonRes){
			var y = 150 + i*110;
			var b = new Button(x, y, 250, 50, catName, function(){
				ecranJeu = ecrans.QCM;
				idCategorie = this.idCategorie;
				lblCategorie.t = "Catégorie: "+tabCategorie[idCategorie];
				getQuestion();
				startCountDown();
			});
			b.idCategorie = i;
			tabBtnCategorie.push(b);

			var laR = new textCase(x+25, y-20, 200, 20, nbQuestionARepondre+" à répondre", "white", "rgba(48, 134, 159, 0.2)");
			laR.texteY = 18;
			tabLblARepondre.push(laR);
			tabLblRepondu.push(new roundCase(355, y, 50, 50, "0/"+nbQuestionARepondre));

			tabCategorie.push(catName);
			tabRepondu[i] = [];
			tabReponseDonne[i] = [];
			i++;
		}
	});

	/**********************************************************/
	
	btnMuteMusic = new Button(30, 730, 50, 50, "M", function(){
		if(assetsAttributed.marioBrosTheme)
			if(playingMusic){
				loadedAssets.marioBrosTheme.stop();
				playingMusic = false;
				this.t = "M";
			} else {
				loadedAssets.marioBrosTheme.play();
				playingMusic = true;
				this.t = "P";
			}
	});

	btnMuteMusic.draw = function(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillStyle = this.c;
		ctx.fillRect(0, 0, this.w, this.h);
		ctx.strokeStyle = "white";
		ctx.strokeRect(0, 0, this.w, this.h);
		if(this.play && this.mute)
			ctx.drawImage(playingMusic ? this.play : this.mute, 0, 0, this.w, this.h);
		else {
			ctx.translate(this.texteX, this.texteY);
			ctx.fillStyle = this.tc;
			ctx.fillText(this.t, 0, 0);
		}
		ctx.restore();
	};
	/*************************************************************/

	background = new Case(0, 0, w, h, "grey");
	lblTitre = new textCase(130, 40, 200, 50, "QCMJump");
	lblFps = new roundCase(420, 730, 50, 50, 0);

	btnRetour = new Button(10, 30, 100, 40, "Retour", function(){
		if(ecranJeu === ecrans.resultatQCM){
			this.x = 10;
			this.y = 30;
		}
		ecranJeu = ecrans.selection;
		idCategorie = -1;
		stopCountDown();
	});

	lblCategorie = new textCase(125, 30, 240, 50, "Catégorie: aucune", "white", "rgba(48, 134, 159, 0.3)");
	lblTimer = new textCase(400, 30, 50, 40, seconds+"s");

	joueur = new Personnage(150, 310, 50, 65);
	
	tabBrick = [1,2,3].map((e, i) => {
		return new Brick(70 + i*150, 110, 60, 60, e);
	});
	
	platforme = new Case(0, 376, 500, 20, "white");
	lblQuestion = new textCase(5, 410, 490, 60, "QUESTION");
	lblQuestion.draw = function(ctx){
		ctx.save();
		ctx.translate(this.x, this.y);
		
		ctx.fillStyle = this.c;
		ctx.fillRect(0, 0, this.w, this.h);

		ctx.strokeStyle = "white";
		ctx.strokeRect(0, 0, this.w, this.h);
	
		ctx.translate(this.texteX, this.texteY);
		ctx.fillStyle = this.tc;
		wrapText(ctx, this.t, 0, 0, this.w, this.h/2);
		
		ctx.restore();
	};
	lblQuestion.texteY = 20;

	lblReponses = [1,2,3].map((e, i) => {
		var y = 490 + i*80;
		lblReponsesNb.push(new textCase(20, y, 60, 60, e, "yellow", "SaddleBrown"));
		return new textCase(100, y, 380, 60, e);
	});

	btnReset = new Button(150, 600, 200, 50, "Recommencer ?", () => {
		resetGame();
		ecranJeu = ecrans.selection;
	});

	/**************************************************************/

	//Chargement des assets dans assetsToLoadURLs
	loadAssets(assetsToLoadURLs, false);

	//Fonctions sont dans event_handler.js
	canvas.onclick = mouseClickHandler;
	canvas.onmousemove = mouseOverHandler;
	document.onkeydown = keyDownHandler;
	document.onkeyup = keyUpHandler;

	requestAnimationFrame(mainloop);
};
/*******************************************************************************/
function collision(o1, o2){

	if (o1.x > o2.x+o2.w || o1.x+o1.w < o2.x)
	   return false;

	if (o1.y > o2.y+o2.h || o1.y+o1.h < o2.y)
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
	clearInterval(interV);
}

function resetCountDown(){
	stopCountDown();
	startCountDown();
}
/****************************************************************************/
function mainloop(currentTime){

	//Artificial latency
	if(__slow) for(let k=0; k<__n; k++) {}

	// Timer animation
	// How long between the current frame and the previous one?
	tempFrame = currentTime - oldTime;

	ctx.clearRect(0, 0, w, h);
	
	attributeAsset("backgroundImage", background, "img");
	attributeAsset("snow", platforme, "img");
	attributeAsset("play", btnMuteMusic, "play");
	attributeAsset("mute", btnMuteMusic, "mute");
	attributeAsset("santa_sprite", joueur, "img");
	//Attribue l'image aux cases réponses ET aux bricks
	attributeAsset("brick", lblReponsesNb.concat(tabBrick), "img");
	if(attributeAsset("marioBrosTheme", loadedAssets, "marioBrosTheme")){
		playingMusic = true;
		btnMuteMusic.t = "P";
	}
	
	background.draw(ctx);
	updateAndDrawParticules(ctx, tempFrame, w, h);
	lblFps.draw(ctx);
	btnMuteMusic.draw(ctx);
	btnMuteMusic.checkMouse(mOver, mClick);

	switch(ecranJeu){
		case ecrans.selection:
			lblTitre.draw(ctx);
			tabLblARepondre.forEach(e => e.draw(ctx) );
			tabBtnCategorie.forEach((e, i) => {
				e.draw(ctx);
				if(tabRepondu[i].length < nbQuestionARepondre)
					//Vérfier avec la souris les positions du bloc
					e.checkMouse(mOver, mClick);
				
				tabLblRepondu[i].draw(ctx);
			});
		break;

		case ecrans.QCM:
			//Drawing
			btnRetour.draw(ctx);
			lblCategorie.draw(ctx);
			lblTimer.t = seconds+"s";
			lblTimer.draw(ctx);
			platforme.draw(ctx);
			//Drawing questions
			lblQuestion.draw(ctx);
			lblReponsesNb.forEach(e => e.draw(ctx) );
			lblReponses.forEach(e => e.draw(ctx) );			
			tabBrick.forEach(e => {
				e.draw(ctx);
				e.move(tempFrame);
			});
			joueur.draw(ctx);

			//Verification si fin de jeu + timer
			if(seconds === 0)
				repondreQuestion(-1, resetQCMSprite, c =>
					tabBrick.forEach(e => e.tap(c) )
				);

			//Checking inputs
			joueur.move(keyInput, tempFrame);
			btnRetour.checkMouse(mOver, mClick);
		break;

		case ecrans.resultatQCM:
			ctx.fillStyle = "white";
			ctx.fillText("Fin QCM "+tabCategorie[idCategorie], 250, 250);
			
			ctx.textAlign = "start";
			var total = tabReponseDonne[idCategorie].reduce((n, e, i) => {
				var txt = "Question "+(i+1)+" ";
				switch(e){
					case -1:
						txt += "Non donnée";
					break;

					case 0:
						txt += "Incorrect";
					break;

					case 1:
						txt += "Correct";
						n++;
					break;
				}
				ctx.fillText(txt, 150, 330 + i*50);
				return n;
			}, 0);
			ctx.textAlign = "center";

			ctx.fillText("Resultat Total = "+total+"/"+nbQuestionARepondre, 250, 350 + 50*nbQuestionARepondre);

			btnRetour.draw(ctx);
			btnRetour.checkMouse(mOver, mClick);
		break;

		case ecrans.resultatTotal:
		/*
			copy and paste console to access __debug

			idCategorie = 0;
			tabRepondu = JSON.parse("[[3,2,0],[3,0,2],[3,0,2],[2,1,4]]");
			tabReponseDonne = JSON.parse("[[1,0,1],[1,1,0],[0,0,1],[0,0,0]]");
			ecranJeu = ecrans.resultatTotal;
		*/
			ctx.fillStyle = "white";
			ctx.fillText("Fin QCM TOTAL ", 250, 230);

			ctx.textAlign = "start";
			var total = tabCategorie.reduce((n, catName, i) => {

				var res = tabReponseDonne[i].reduce((n, e) => {
					return n+(e === 1 ? 1 : 0);
				}, 0);

				var catRes = res + "/" + nbQuestionARepondre;

				ctx.fillText("Catégorie "+catName + " " + catRes, 150, 300 + i*50);
				return n+res;
			}, 0) + "/" + nbQuestionARepondre*tabCategorie.length;
			ctx.textAlign = "center";

			ctx.fillText("Resultat Total = "+total, 250, 320 + 50*tabCategorie.length);

			btnReset.draw(ctx);
			btnReset.checkMouse(mOver, mClick);
		break;
	}

	mClick = null;

	// Store time for tempFrame
	oldTime = currentTime;

	if(currentTime - lastTime >= 1000){
		lastTime = currentTime;
		lblFps.t = frameCounter;
		frameCounter = 0;
	}

	//Fin frame
	frameCounter++;

	requestAnimationFrame(mainloop);
}
/************************************************************************/
