"use strict";

function resetQCMSprite(){
    //reset joueur position + cases
    tabBrick.forEach(e => {
        e.y = e.oldY;
        e.tapped = false;
        e.speedY = 0;
    });
    joueur.y = joueur.oldY;
    joueur.x = 150;
    joueur.jumping = false;
    joueur.direction = direction.DROITE;
    joueur.speedY = 0;
    for(let k in keyInput) keyInput[k] = false;
    //class_particles.js
    tabParticule = [];
    stopCountDown();
}

function resetGame(){
    tabRepondu = new Array(tabCategorie.length).fill([]);
    tabReponseDonne = new Array(tabCategorie.length).fill([]);
    nCategorieFini = 0;
    tabLblRepondu.forEach(e => { e.bc = "rgba(48, 134, 159, 0.3)"; e.t = "0/"+nbQuestionARepondre; });
    tabBtnCategorie.forEach(e => {e.bc = "rgba(48, 134, 159, 0.3)"; });
    ecranJeu = ecrans.selection;
}

function getQuestion(){
	let cat = tabCategorie[idCategorie];
	do {
		nQuestion = Math.floor(Math.random() * jsonFile[cat].length);
	} while(tabRepondu[idCategorie].indexOf(nQuestion) !== -1);
	lblQuestion.t = jsonFile[cat][nQuestion].question;
	lblReponses.forEach((r, i) => {
		r.t = (i+1)+": "+jsonFile[cat][nQuestion].propositions[i+1];
	});
}

function repondreQuestion(rep, resetCB, nextQuestionCB){
	let cat = tabCategorie[idCategorie];
    let p = rep === -1 ? -1 : rep == jsonFile[cat][nQuestion].Solution ? 1 : 0;
    tabReponseDonne[idCategorie].push(p);
    tabRepondu[idCategorie].push(nQuestion);
    tabLblRepondu[idCategorie].t = tabRepondu[idCategorie].length+"/"+nbQuestionARepondre;
    if(tabReponseDonne[idCategorie].length >= nbQuestionARepondre){
        if(resetCB)
            resetCB();
        //Check fin catégorie ou jeu complet
        stopCountDown();
        if(++nCategorieFini === tabCategorie.length)
            ecranJeu = ecrans.resultatTotal;
        else {
            tabBtnCategorie[idCategorie].bc = "rgba(255,255,255, 0.5)";
            tabLblRepondu[idCategorie].bc = "rgba(255,255,255, 0.5)";
            ecranJeu = ecrans.resultatQCM;
            btnRetour.x = 200; btnRetour.y = 600;
        }
    } else {
        getQuestion();
        if(nextQuestionCB)
            nextQuestionCB(p);
        
		resetCountDown();
    }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
    let words = text.split(" ");
    let line = "";//words[0];

    words.forEach((word, n) => {
        let testLine = line + word + " ";
        let metricsWidth = ctx.measureText(testLine).width;
        if(metricsWidth > maxWidth){//&& n > 0){
            ctx.fillText(line, x, y);
            line = word + " ";
            y += lineHeight;
        } else 
            line = testLine;
    });
    ctx.fillText(line, x, y);
}