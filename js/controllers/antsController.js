
/* Lorsqu'une fourmis se déplace sur une case, ajoute 100 phéromones 
* addPheromones (et proba) suceptibles d'évoluer 
* une fourmis ne peut pas faire demi tour, sinon elle voit
* ses propres phéromones 
*/

/* Selectionne la meilleure fourmis en fonction
 * de la nourriture rapportée au nid
 */
function aptitude(){
	var a = ants[0];
	for(let i=0;i<nbAnts;i++){
		if(ants[i].nbFoodCollected>a.nbFoodCollected){
			a = ants[i];
		}
	}
	console.log("Meilleure fourmis generation "+(generation-1)
		+" :\nfoodCollected = "+a.nbFoodCollected+"; alpha = "
		+a.alpha+"; proba = "+a.proba+"; lifeTime = "+a.lifeTime);
	return a;
}

/* Fonction qui renvoie un des deux parametres au 
 * hasard afin de pratiquer le croisement des fourmis
 */
function cross(a,b){
	let r = getRandomInt(2);
	if(r==0){
		return a;
	}else{
		return b;
	}
}

/* Selection 2 fourmis  
 * Croisement : prendre au pif les param d'une des 2 fourmis 
 * Mutation : proba de changer un paramètre 
 * 
 */
function evolution(antA, antB){

	//Croisement
	var antC = new Ant(nestPosX,nestPosY,cross(antA.proba,antB.proba),cross(antA.alpha,antB.alpha),cross(antA.lifeTime,antB.lifeTime));

	//Mutation
	tirage = getRandomInt(4);
	let tirage2 = getRandomInt(2); //si 1 augmente sinon diminue
	if(tirage2 == 0){
		tirage2 = -1;
	}
	let mutation;
	if(tirage == 0){
		//mutation proba
		mutation = antC.proba + ((antC.proba/inverseDegreMutation) * tirage2);
		if(mutation>0 && mutation<1){
			antC.proba = mutation;
		}
	}else if(tirage == 1){
		//mutation alpha
		mutation = antC.alpha + ((antC.alpha/inverseDegreMutation) * tirage2);
		if(mutation>0 && mutation<1){
			antC.alpha = mutation;
		}
	}else if(tirage == 2){
		//mutation lifeTime
		mutation = antC.lifeTime + ((antC.lifeTime/(inverseDegreMutation*2)) * tirage2);
		if(mutation>0){
			antC.lifeTime = mutation;
			//console.log("mutation lifeTime = "+mutation);
			//Update la variable globale du jeu
			if(mutation>lifeTime){
				lifeTime = mutation;
				console.log("New lifeTime = "+lifeTime);
			}
		}
	}else if(tirage == 3){
		//pas de mutation
	}else{
		console.log("Erreur tirage mutation "+tirage);
	}

	return antC;
}

//Créer une nouvelle génération de fourmis 
function generateAnts(){
	//var ants = [];
	if(generation>1){
		var antA = aptitude();
	}
	for(let i=0; i<nbAnts; i++){
		//ICI faire évoluer les proba et alpha
		if(generation == 1){
			ants[i] = new Ant(nestPosX,nestPosY,proba,alpha,lifeTime);
		}else{
			ants[i] = evolution(antA,ants[i]);
		}
	}
	return ants;
}

//Place les phéromones d'une fourmis avant de la déplacer 
function putPheromones(ant){
	if(ant.isHoldingFood){
		T.tab[ant.y][ant.x].greenPheromones += ant.addPheromones;
		if(maxPheromones<T.tab[ant.y][ant.x].greenPheromones){
			maxPheromones = T.tab[ant.y][ant.x].greenPheromones;
		}
	}else{
		T.tab[ant.y][ant.x].redPheromones += ant.addPheromones;
		if(maxPheromones<T.tab[ant.y][ant.x].redPheromones){
			maxPheromones = T.tab[ant.y][ant.x].redPheromones;
		}
	}
	//retire 1% des phéromones par tour
	if(ant.addPheromones>1){
		ant.addPheromones =  parseInt(ant.addPheromones-(ant.addPheromones/100));
		//console.log(ant.addPheromones);
	}
}

//Déplace toutes les fourmis 
function moveAllAnts(){
	for(let i=0;i<ants.length;i++){

	  //seulement si elle est en vie
	  if(ants[i].isAlive){

	  	//elle pose ses phéromones
		putPheromones(ants[i]);

		//elle attrape ou non la nourriture
		if(ants[i].isHoldingFood){
			ants[i] = returnFood(ants[i]);
		}else{
			ants[i] = catchFood(ants[i]);
		}

		//elle choisit sa direction
		ants[i] = choiceAnt(ants[i]);

		//puis se déplace
		moveAnt(ants[i]);

		//elle vieillit, et meurt si dépasse son espérance de vie
		ants[i].age++;
		if(ants[i].age>ants[i].lifeTime){
			ants[i].isAlive = false;
			console.log("RIP "+i+"; score : "+ants[i].nbFoodCollected);
		}
	  }
		
	}
}

//Déplace une fourmis dans sa direction
function moveAnt(ant){

	switch(ant.direction){
		case 'N':
			ant.y--;
			break;
		case 'S':
			ant.y++;
			break;
		case 'E':
			ant.x++;
			break;
		case 'W':
			ant.x--;
			break;
		default:
			console.log("Error moveAnt");
	}
}

//récupère la nourriture
function catchFood(ant){
	let b = false;
	if(T.tab[ant.y][ant.x-1].isFood){
		b = true;
	}
	if(T.tab[ant.y-1][ant.x].isFood){
		b = true;
	}
	if(T.tab[ant.y+1][ant.x].isFood){
		b = true;
	}
	if(T.tab[ant.y][ant.x+1].isFood){
		b = true;
	}
	if(b){
		ant.isHoldingFood = true;
		ant.addPheromones = addPheromones;
	}

	return ant;
}

//depose la nourriture au nid
function returnFood(ant){
	let b = false;
	if(T.tab[ant.y][ant.x-1].isNest){
		b = true;
	}
	if(T.tab[ant.y-1][ant.x].isNest){
		b = true;
	}
	if(T.tab[ant.y+1][ant.x].isNest){
		b = true;
	}
	if(T.tab[ant.y][ant.x+1].isNest){
		b = true;
	}
	if(b){
		ant.isHoldingFood = false;
		ant.nbFoodCollected++;
		ant.addPheromones = addPheromones;
		foodCollected++;
		updateFoodCollectedDOM();
		console.log("Food collected !");
	}

	return ant;
}


/* Formule choix de direction :
 * pLeft = pheroLeft / phéro des 3 * (1-proba)
 * pStraight = proba + pheromones
 * pRight = proba + pheromones 
 * phéromones d'une case = phéromones / (phéromones des 3 cases) * (1-proba)
 * ici proba = 0.2 (proba de la fourmis)
 * 
 */

//Choisit la direction de la fourmis 
function choiceAnt(ant){

	
	//correspond aux choix tourner à gauche, tout droit, droite
	let pLeft=ant.proba/3;
	let pStraight=ant.proba/3;
	let pRight=ant.proba/3;
	let pheromonesDesTrois=0;
	let choix = "none";
	let totalBlue = 0; //addition des phéromones bleu des 3 cases 

	//On test si les cases autour de la fourmis sont libres
	let emptyN = false,emptyS = false,emptyE = false,emptyW = false;
	if(T.tab[ant.y][ant.x-1].isEmpty){
		emptyW=true;
	}
	if(T.tab[ant.y-1][ant.x].isEmpty){
		emptyN=true;
	}
	if(T.tab[ant.y+1][ant.x].isEmpty){
		emptyS=true;
	}
	if(T.tab[ant.y][ant.x+1].isEmpty){
		emptyE=true;
	}

	
	//console.log("direction = "+ant.direction);
	//Tourne en fonction de l'orientation de la fourmis
	switch(ant.direction){
		case 'N':
			//trouver les probas L S R puis tirage
			if(ant.isHoldingFood){ //cherche les rouges pour rentrer
				pheromonesDesTrois = T.tab[ant.y][ant.x-1].redPheromones + T.tab[ant.y-1][ant.x].redPheromones + T.tab[ant.y][ant.x+1].redPheromones;
			}else{ //cherche les verts vers la nourriture
				pheromonesDesTrois = T.tab[ant.y][ant.x-1].greenPheromones + T.tab[ant.y-1][ant.x].greenPheromones + T.tab[ant.y][ant.x+1].greenPheromones;
			}
			if(pheromonesDesTrois == 0){
				pLeft = 0.1;
				pStraight = 0.8;
				pRight = 0.1;
			}else{ 
			  if(ant.isHoldingFood){
				pLeft += (T.tab[ant.y][ant.x-1].redPheromones / pheromonesDesTrois)*(1-ant.proba);
				pStraight += (T.tab[ant.y-1][ant.x].redPheromones / pheromonesDesTrois)*(1-ant.proba);
				pRight += (T.tab[ant.y][ant.x+1].redPheromones / pheromonesDesTrois)*(1-ant.proba);
			  }else{
				pLeft += (T.tab[ant.y][ant.x-1].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
				pStraight += (T.tab[ant.y-1][ant.x].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
				pRight += (T.tab[ant.y][ant.x+1].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
			  }
			}
			//Addition des phéromones bleu des 3 cases
			totalBlue = T.tab[ant.y][ant.x-1].bluePheromones + T.tab[ant.y-1][ant.x].bluePheromones + T.tab[ant.y][ant.x+1].bluePheromones;
			if(!ant.isHoldingFood && totalBlue>0 && ant.alpha>0){
				/* ajout de l'odeur des cases avec bluePheromones des cases et 
			  	 * alpha (importance de l'odeur) de la fourmis
			  	 */
			  	pLeft = (pLeft * (1-ant.alpha)) + ((T.tab[ant.y][ant.x-1].bluePheromones / totalBlue)*ant.alpha);
			  	pStraight = (pStraight * (1-ant.alpha)) + ((T.tab[ant.y-1][ant.x].bluePheromones / totalBlue)*ant.alpha);
			  	pRight = (pRight * (1-ant.alpha)) + ((T.tab[ant.y][ant.x+1].bluePheromones / totalBlue)*ant.alpha);
			  	//console.log("pLeft = "+pLeft+"; pStraight = "+pStraight+"; pRight = "+pRight);
			}

			if(!emptyW){
				pLeft=0;
			}
			if(!emptyN){
				pStraight=0;
			}
			if(!emptyE){
				pRight=0;
			}

			choix = tirageAnt(pLeft,pStraight,pRight);
			//console.log("choix = "+choix);
			if(choix == "left"){
				ant.direction = 'W';
			}else if(choix == "straight"){
				//change pas (reste N)
			}else if(choix == "right"){
				ant.direction = 'E';
			}else{
				ant.direction = 'S';
			}

			break;
		case 'S':

			if(ant.isHoldingFood){
				pheromonesDesTrois = T.tab[ant.y][ant.x-1].redPheromones + T.tab[ant.y+1][ant.x].redPheromones + T.tab[ant.y][ant.x+1].redPheromones;
			}else{
				pheromonesDesTrois = T.tab[ant.y][ant.x-1].greenPheromones + T.tab[ant.y+1][ant.x].greenPheromones + T.tab[ant.y][ant.x+1].greenPheromones;
			}
			if(pheromonesDesTrois == 0){
				pLeft = 0.1;
				pStraight = 0.8;
				pRight = 0.1;
			}else{ 
			  if(ant.isHoldingFood){
				//console.log("pheromonesDesTrois = "+pheromonesDesTrois);
				pLeft += (T.tab[ant.y][ant.x+1].redPheromones / pheromonesDesTrois)*(1-ant.proba);
				pStraight += (T.tab[ant.y+1][ant.x].redPheromones / pheromonesDesTrois)*(1-ant.proba);
				pRight += (T.tab[ant.y][ant.x-1].redPheromones / pheromonesDesTrois)*(1-ant.proba);
			  }else{
				pLeft += (T.tab[ant.y][ant.x+1].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
				pStraight += (T.tab[ant.y+1][ant.x].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
				pRight += (T.tab[ant.y][ant.x-1].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
			  }
			}

			//Addition des phéromones bleu des 3 cases
			totalBlue = T.tab[ant.y][ant.x+1].bluePheromones + T.tab[ant.y+1][ant.x].bluePheromones + T.tab[ant.y][ant.x-1].bluePheromones;
			if(!ant.isHoldingFood && totalBlue>0 && ant.alpha>0){
			  	pLeft = (pLeft * (1-ant.alpha)) + ((T.tab[ant.y][ant.x+1].bluePheromones / totalBlue)*ant.alpha);
			  	pStraight = (pStraight * (1-ant.alpha)) + ((T.tab[ant.y+1][ant.x].bluePheromones / totalBlue)*ant.alpha);
			  	pRight = (pRight * (1-ant.alpha)) + ((T.tab[ant.y][ant.x-1].bluePheromones / totalBlue)*ant.alpha);
			  	//console.log("pTotal = "+(pLeft+pStraight+pRight));
			}

			if(!emptyE){
				pLeft=0;
			}
			if(!emptyS){
				pStraight=0;
			}
			if(!emptyW){
				pRight=0;
			}

			choix = tirageAnt(pLeft,pStraight,pRight);
			//console.log("choix = "+choix);
			if(choix == "left"){
				ant.direction = 'E';
			}else if(choix == "straight"){
				//change pas (reste S)
			}else if(choix == "right"){
				ant.direction = 'W';
			}else{
				ant.direction = 'N';
			}
			
			break;
		case 'E':

			if(ant.isHoldingFood){
				pheromonesDesTrois = T.tab[ant.y+1][ant.x].redPheromones + T.tab[ant.y-1][ant.x].redPheromones + T.tab[ant.y][ant.x+1].redPheromones;
			}else{
				//trouver les probas L S R puis tirage
				pheromonesDesTrois = T.tab[ant.y+1][ant.x].greenPheromones + T.tab[ant.y-1][ant.x].greenPheromones + T.tab[ant.y][ant.x+1].greenPheromones;
			}
			if(pheromonesDesTrois == 0){
				pLeft = 0.1;
				pStraight = 0.8;
				pRight = 0.1;
			}else{ 
			  if(ant.isHoldingFood){
				pLeft += (T.tab[ant.y-1][ant.x].redPheromones / pheromonesDesTrois)*(1-ant.proba);
				pStraight += (T.tab[ant.y][ant.x+1].redPheromones / pheromonesDesTrois)*(1-ant.proba);
				pRight += (T.tab[ant.y+1][ant.x].redPheromones / pheromonesDesTrois)*(1-ant.proba);
			  }else{
				pLeft += (T.tab[ant.y-1][ant.x].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
				pStraight += (T.tab[ant.y][ant.x+1].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
				pRight += (T.tab[ant.y+1][ant.x].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
			  }
			}

			//Addition des phéromones bleu des 3 cases
			totalBlue = T.tab[ant.y-1][ant.x].bluePheromones + T.tab[ant.y][ant.x+1].bluePheromones + T.tab[ant.y+1][ant.x].bluePheromones;
			if(!ant.isHoldingFood && totalBlue>0 && ant.alpha>0){
			  	pLeft = (pLeft * (1-ant.alpha)) + ((T.tab[ant.y-1][ant.x].bluePheromones / totalBlue)*ant.alpha);
			  	pStraight = (pStraight * (1-ant.alpha)) + ((T.tab[ant.y][ant.x+1].bluePheromones / totalBlue)*ant.alpha);
			  	pRight = (pRight * (1-ant.alpha)) + ((T.tab[ant.y+1][ant.x].bluePheromones / totalBlue)*ant.alpha);
			  	//console.log("pTotal = "+(pLeft+pStraight+pRight));
			}

			if(!emptyN){
				pLeft=0;
			}
			if(!emptyE){
				pStraight=0;
			}
			if(!emptyS){
				pRight=0;
			}

			choix = tirageAnt(pLeft,pStraight,pRight);
			//console.log("choix = "+choix);
			if(choix == "left"){
				ant.direction = 'N';
			}else if(choix == "straight"){
				//change pas (reste E)
			}else if(choix == "right"){
				ant.direction = 'S';
			}else{
				ant.direction = 'W';
			}
			
			break;
		case 'W':

			if(ant.isHoldingFood){
				pheromonesDesTrois = T.tab[ant.y+1][ant.x].redPheromones + T.tab[ant.y-1][ant.x].redPheromones + T.tab[ant.y][ant.x-1].redPheromones;
			}else{
				//trouver les probas L S R puis tirage
				pheromonesDesTrois = T.tab[ant.y+1][ant.x].greenPheromones + T.tab[ant.y-1][ant.x].greenPheromones + T.tab[ant.y][ant.x-1].greenPheromones;
			}
			if(pheromonesDesTrois == 0){
				pLeft = 0.1;
				pStraight = 0.8;
				pRight = 0.1;
			}else{ 
			  if(ant.isHoldingFood){
				pLeft += (T.tab[ant.y+1][ant.x].redPheromones / pheromonesDesTrois)*(1-ant.proba);
				pStraight += (T.tab[ant.y][ant.x-1].redPheromones / pheromonesDesTrois)*(1-ant.proba);
				pRight += (T.tab[ant.y-1][ant.x].redPheromones / pheromonesDesTrois)*(1-ant.proba);
			  }else{
				pLeft += (T.tab[ant.y+1][ant.x].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
				pStraight += (T.tab[ant.y][ant.x-1].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
				pRight += (T.tab[ant.y-1][ant.x].greenPheromones / pheromonesDesTrois)*(1-ant.proba);
			  }
			}

			//Addition des phéromones bleu des 3 cases
			totalBlue = T.tab[ant.y+1][ant.x].bluePheromones + T.tab[ant.y][ant.x-1].bluePheromones + T.tab[ant.y-1][ant.x].bluePheromones;
			if(!ant.isHoldingFood && totalBlue>0 && ant.alpha>0){
			  	pLeft = (pLeft * (1-ant.alpha)) + ((T.tab[ant.y+1][ant.x].bluePheromones / totalBlue)*ant.alpha);
			  	pStraight = (pStraight * (1-ant.alpha)) + ((T.tab[ant.y][ant.x-1].bluePheromones / totalBlue)*ant.alpha);
			  	pRight = (pRight * (1-ant.alpha)) + ((T.tab[ant.y-1][ant.x].bluePheromones / totalBlue)*ant.alpha);
			  	//console.log("pTotal = "+(pLeft+pStraight+pRight));
			}

			if(!emptyS){
				pLeft=0;
			}
			if(!emptyW){
				pStraight=0;
			}
			if(!emptyN){
				pRight=0;
			}

			choix = tirageAnt(pLeft,pStraight,pRight);
			//console.log("choix = "+choix);
			if(choix == "left"){
				ant.direction = 'S';
			}else if(choix == "straight"){
				//change pas (reste W)
			}else if(choix == "right"){
				ant.direction = 'N';
			}else{
				ant.direction = 'E';
			}
			
			break;
		default:
			console.log("Error choiceAnt");
	}

	//console.log("turn "+choix+" ( direction : "+ant.direction+" )");
	/*
	//cherche les phéromones rouge pour rentrer
		if(ant.isHoldingFood){
				
		}else{
			//cherche les phéromones verts pour trouver la nourriture
			if(T.tab[ant.x-1][ant.y]){}
		}*/

	return ant;
}

function tirageAnt(pLeft, pStraight, pRight){
	let rand = Math.random();
	//console.log("rand = "+rand+", pLeft = "+pLeft+", pStraight = "+pStraight+", pRight = "+pRight);
	if(rand<pLeft){
		return 'left';
	}else if(rand<pLeft+pStraight){
		return 'straight';
	}else if(rand<pLeft+pStraight+pRight){
		return 'right';
	}else{
		//console.log("Warning tirageAnt: ant stuck");
		return 'back';
	}

}







