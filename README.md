# QCMJump
Lien : https://fulconisyan.github.io/QCMJump/

## Cr�ateurs

* Pierre Saunders
* Louiza Djaout
* Fulconis Yan

### Description

Jeu de type QCM avec une composante de jeu de plateforme.



### Features



* Ecran de r�sultat avec fus�es
* La partie plateforme int�gre un moteur physique simulant la gravit� 
* Les fichiers ressources sont traiter via un assetloader 

* Un moteur de sprite pour la partie graphique
* Une interface graphique intelligible
* Int�gre un moteur de particules
* Affichage d'un compteur en temps r�el du nombre de trame par seconde.

### Concept du jeu :

Il s'agit d'un jeu de plateforme m�lang� � un quizz de culture g�n�rale. L'objectif de l'�quipe �tait de r�aliser un jeu 
simple mais qui soit techniquement abouti et qui soit r�alis� sans frameworks. L'interface du jeu est verticale, car la 
d�cision initiale �tait de faire en sorte que le jeu soit jouable autant sur un navigateur web lorsque l'on utilise un
t�l�phone mobile que sur un navigateur web sur ordinateur

### Points forts et Points faibles

#### Points forts :

* Provient d'une id�e tr�s simple.
* Une interface intuitive.
* Bonne optimisation du code.
* Facilte ainsi la compr�hension et l'am�lioration.
* Un jeu adapt� aux diff�rentes configuration d'ordinateurs (syst�me permettant de compenser le ralentissement du jeu).


#### Points faibles :

* Penser � traiter les fonctionnalit�s sp�cifiques � la plateforme mobile.
* Un manque d'effets sonores g�n�ral (sur les �l�ments d'int�ractions).
* Les r�ponses d'une question pourraient s'afficher (sur l'�cran de fin de section ou bien apr�s la question) accompagn�es d'anedcotes.
* �cran de r�sultats trop lisse.Faire en sorte que l'�cran des r�sultats soit sous forme d'une c�l�bration avec une distinction marqu�e quand on termine une section par rapport � l'�cran de r�sultats.
* Mettre plus en �vidence  les effets de couleurs lorsque l'on r�pond juste (vert) ou faux(red)
* Changer la musique pour �viter les probl�mes de droits d'auteurs.

# Sauriez-vous capable de r�pondre � toutres les questions avant le temps imparti ?

### Exemples techniques

##### R�cup�ration des touches claviers :
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
	//La m�thode some() teste si au moins un �l�ment du tableau passe le test impl�ment� par la fonction fournie.
	// Ici, l'�l�ment est une brique
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

	// Si le personnage est en contact avec les bords de l'�cran
	if(joueur.x < 0
	|| joueur.x+joueur.w > w)
		return 3;

	return 0;
// Le fonctionnement du saut par rapport au contact ou non 
// D'un obstacle se trouve dans class_personnage
}
```










