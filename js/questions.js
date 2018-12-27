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

function repondreQuestion(rep, _callbc){
	var cat = tabCategorie[idCategorie];
    var p = rep === -1 ? -1 : rep == jsonFile[cat][nQuestion].Solution ? 1 : 0;
    tabReponseDonne[idCategorie].push(p);
    tabRepondu[idCategorie].push(nQuestion);
    tabLblRepondu[idCategorie].t = tabRepondu[idCategorie].length+"/"+nbQuestionARepondre;
    if(tabReponseDonne[idCategorie].length >= nbQuestionARepondre){
        if(_callbc)
            _callbc();
        //Check fin catégorie ou jeu complet
        stopCountDown();
        if(++nCategorieFini === tabCategorie.length)
            ecranJeu = ecrans.resultatTotal;
        else {
            tableauButton[idCategorie].bc = "silver";
            tabLblRepondu[idCategorie].bc = "silver";
            ecranJeu = ecrans.resultatQCM;
        }
    } else {
        getQuestion();
        seconds = tempsQuestion + p === -1 ? 0 : seconds;
    }
}