# QCMJump
Lien : https://fulconisyan.github.io/QCMJump/

## Créateurs

* Pierre Saunders
* Louiza Djaout
* Fulconis Yan

### Description

Jeu de type QCM avec une composante de jeu de plateforme.



### Features



* Ecran de résultat avec fusées
* La partie plateforme intègre un moteur physique simulant la gravité 
* Les fichiers ressources sont traiter via un assetloader 

* Un moteur de sprite pour la partie graphique
* Une interface graphique intelligible
* Intégre un moteur de particules
* Affichage d'un compteur en temps réel du nombre de trame par seconde.

### Concept du jeu :

Il s'agit d'un jeu de plateforme mélangé à un quizz de culture générale. L'objectif de l'équipe était de réaliser un jeu 
simple mais qui soit techniquement abouti et qui soit réalisé sans frameworks. L'interface du jeu est verticale, car la 
décision initiale était de faire en sorte que le jeu soit jouable autant sur un navigateur web lorsque l'on utilise un
téléphone mobile que sur un navigateur web sur ordinateur

### Points forts et Points faibles

#### Points forts :

* Provient d'une idée très simple.
* Une interface intuitive.
* Bonne optimisation du code.
* Facilte ainsi la compréhension et l'amélioration.
* Un jeu adapté aux différentes configuration d'ordinateurs (système permettant de compenser le ralentissement du jeu).


#### Points faibles :

* Penser à traiter les fonctionnalités spécifiques à la plateforme mobile.
* Un manque d'effets sonores général (sur les éléments d'intéractions).
* Les réponses d'une question pourraient s'afficher (sur l'écran de fin de section ou bien après la question) accompagnées d'anedcotes.
* Écran de résultats trop lisse.Faire en sorte que l'écran des résultats soit sous forme d'une célébration avec une distinction marquée quand on termine une section par rapport à l'écran de résultats.
* Mettre plus en évidence  les effets de couleurs lorsque l'on répond juste (vert) ou faux(red)
* Changer la musique pour éviter les problèmes de droits d'auteurs.

# Sauriez-vous capable de répondre à toutres les questions avant le temps imparti ?

### Exemples techniques

##### Récupération des touches claviers :
```javascript
//Dans event_handler
let keyInput = {
	//Gauche
	"ArrowLeft": false, "KeyA": false,
	//Droite
	"ArrowRight": false, "KeyD": false,
	//Saut
	"ArrowUp": false, "KeyW": false, "Space": false
};
```
##### Checking inputs :
```javascript
// Dans canvas
joueur.move(keyInput, tempFrame);
btnRetour.checkMouse(mOver, mClick);
```

##### Traitement de l'information des touches : 
```javascript
// Dans class_personnage
move(keyInput,ms)
{
let inC = 0;
if(this.jumping)			
this.speedY += calcGravityFromDelta(ms, this.gravity);		
else {	
	// Touche gauche ou A (respectivement Q pour les claviers AZERTY)		
	if(keyInput.ArrowLeft || keyInput.KeyA){
		inC = -this.speedX;
		this.direction = direction.GAUCHE;
		this.changerEtat(etat.COURIR);
		}	
	// Touche droit ou D
	if(keyInput.ArrowRight || keyInput.KeyD){
		inC = this.speedX;
		this.direction = direction.DROITE;
		this.changerEtat(etat.COURIR);
		}
	// Touche haut ou W (respectivement Z pour les claviers AZERTY)
	// ainsi que la touche espace
	if(keyInput.ArrowUp || keyInput.KeyW || keyInput.Space){
		this.jumping = true;
		this.speedY = -this.jumpHeight;
		this.changerEtat(etat.SAUT);
		}
	}
```
##### Compteur de trame par seconde :
```javascript
// Dans canvas
// Store time for tempFrame
	oldTime = currentTime;

	if(currentTime - lastTime >= 1000){
		lastTime = currentTime;
		lblFps.t = frameCounter;
		frameCounter = 0;
	}

	//Fin frame
	frameCounter++;

//Fin frame
frameCounter++;
}
````
##### Collision personnage :
````javascript
// Dans class_personnage
function checkCollisionPersonnage(){
	//La méthode some() teste si au moins un élément du tableau passe le test implémenté par la fonction fournie.
	// Ici, l'élément est une brique
	if(tabBrick.some(e => {
		// Si le joueur rencontre un bloc
		if(collision(joueur, e)){
			repondreQuestion(e.t, resetQCMSprite, c => e.tap(c) );
			return true;
		}
		return false;
	}))
		return 1;
	//Si le personnage retombe sur la plateforme
	if(collision(joueur, platforme))
		return 2;

	// Si le personnage est en contact avec les bords de l'écran
	if(joueur.x < 0
	|| joueur.x+joueur.w > w)
		return 3;

	return 0;
// Le fonctionnement du saut par rapport au contact ou non 
// D'un obstacle se trouve dans class_personnage
}
```










