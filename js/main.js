
const dimX = 60;
const dimY = 60;
const nestPosX = 16;
const nestPosY = 40;
const nbAnts = 50;
const proba = 0.1; //Proba d'en faire qu'a sa tête
const addPheromones = 100; //phéromones ajouté par déplacement
const lifeTime = 200; //durée de vie avant la prochaine génération
var run = false;
var time = 0;
var maxPheromones = 200; //valeur a augmenter lorsqu'un bloc dépasse


var T = new Terrain(dimX,dimY);
T.initNest(nestPosX,nestPosY);
T.setFood(20,30);

displayTerrain();
/*
deleteTerrain();
displayTerrain();
*/

var ants = generateAnts();


/* afficher le terrain en fonction des couleurs des phéromones (dégradé)
*/
T.tab[8][2].redPheromones = 0;
T.tab[8][2].greenPheromones = 100;
//updateBlockDOM(1);
T.updateAllBlocks();

/* Pour enlever 10% a une valeur : 
* a = parseInt(a - (a/10))
*/

//Idée : cliquer sur une case pour placer un bloc

/* Lorsqu'une fourmis se déplace sur une case, ajoute 100 phéromones 
* addPheromones (et proba) suceptibles d'évoluer 
* une fourmis ne peut pas faire demi tour, sinon elle voit
* ses propres phéromones 
*/


function generateAnts(){
	var ants = [];
	for(let i=0; i<nbAnts; i++){
		ants[i] = new Ant(nestPosX,nestPosY,proba);
	}
	return ants;
}

//Place les phéromones d'une fourmis avant de la déplacer 
function putPheromones(ant){
	if(ant.isHoldingFood){
		T.tab[ant.y][ant.x].greenPheromones += addPheromones;
		if(maxPheromones<T.tab[ant.y][ant.x].greenPheromones){
			maxPheromones = T.tab[ant.y][ant.x].greenPheromones;
		}
	}else{
		T.tab[ant.y][ant.x].redPheromones += addPheromones;
		if(maxPheromones<T.tab[ant.y][ant.x].redPheromones){
			maxPheromones = T.tab[ant.y][ant.x].redPheromones;
		}
	}
}

//Déplace toutes les fourmis 
function moveAllAnts(){
	for(let i=0;i<ants.length;i++){
		putPheromones(ants[i]);

		if(ants[i].isHoldingFood){
			ants[i] = returnFood(ants[i]);
		}else{
			ants[i] = catchFood(ants[i]);
		}

		ants[i] = choiceAnt(ants[i]);
		moveAnt(ants[i]);
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
	if(T.tab[ant.y][ant.x-1].isFood){
		ant.isHoldingFood = true;
	}
	if(T.tab[ant.y-1][ant.x].isFood){
		ant.isHoldingFood = true;
	}
	if(T.tab[ant.y+1][ant.x].isFood){
		ant.isHoldingFood = true;
	}
	if(T.tab[ant.y][ant.x+1].isFood){
		ant.isHoldingFood = true;
	}

	return ant;
}

//depose la nourriture au nid
function returnFood(ant){
	if(T.tab[ant.y][ant.x-1].isNest){
		ant.isHoldingFood = false;
		ant.nbFoodCollected++;
		console.log("Food collected !");
	}
	if(T.tab[ant.y-1][ant.x].isNest){
		ant.isHoldingFood = false;
		ant.nbFoodCollected++;
		console.log("Food collected !");
	}
	if(T.tab[ant.y+1][ant.x].isNest){
		ant.isHoldingFood = false;
		ant.nbFoodCollected++;
		console.log("Food collected !");
	}
	if(T.tab[ant.y][ant.x+1].isNest){
		ant.isHoldingFood = false;
		ant.nbFoodCollected++;
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
	let pLeft=proba/3;
	let pStraight=proba/3;
	let pRight=proba/3;
	let pheromonesDesTrois=0;
	let choix = "none";

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
				pLeft += (T.tab[ant.y][ant.x-1].redPheromones / pheromonesDesTrois)*(1-proba);
				pStraight += (T.tab[ant.y-1][ant.x].redPheromones / pheromonesDesTrois)*(1-proba);
				pRight += (T.tab[ant.y][ant.x+1].redPheromones / pheromonesDesTrois)*(1-proba);
			  }else{
				pLeft += (T.tab[ant.y][ant.x-1].greenPheromones / pheromonesDesTrois)*(1-proba);
				pStraight += (T.tab[ant.y-1][ant.x].greenPheromones / pheromonesDesTrois)*(1-proba);
				pRight += (T.tab[ant.y][ant.x+1].greenPheromones / pheromonesDesTrois)*(1-proba);
			  }
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
				pLeft += (T.tab[ant.y][ant.x+1].redPheromones / pheromonesDesTrois)*(1-proba);
				//console.log(T.tab[ant.y][ant.x+1].redPheromones +" / "+pheromonesDesTrois+" * "+(1-proba)+" = "+pLeft);
				pStraight += (T.tab[ant.y+1][ant.x].redPheromones / pheromonesDesTrois)*(1-proba);
				//console.log(T.tab[ant.y+1][ant.x].redPheromones +" / "+pheromonesDesTrois+" * "+(1-proba)+" = "+pStraight);
				pRight += (T.tab[ant.y][ant.x-1].redPheromones / pheromonesDesTrois)*(1-proba);
				//console.log(T.tab[ant.y][ant.x-1].redPheromones +" / "+pheromonesDesTrois+" * "+(1-proba)+" = "+pRight);
			  }else{
				pLeft += (T.tab[ant.y][ant.x+1].greenPheromones / pheromonesDesTrois)*(1-proba);
				pStraight += (T.tab[ant.y+1][ant.x].greenPheromones / pheromonesDesTrois)*(1-proba);
				pRight += (T.tab[ant.y][ant.x-1].greenPheromones / pheromonesDesTrois)*(1-proba);
			  }
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
				pLeft += (T.tab[ant.y-1][ant.x].redPheromones / pheromonesDesTrois)*(1-proba);
				pStraight += (T.tab[ant.y][ant.x+1].redPheromones / pheromonesDesTrois)*(1-proba);
				pRight += (T.tab[ant.y+1][ant.x].redPheromones / pheromonesDesTrois)*(1-proba);
			  }else{
				pLeft += (T.tab[ant.y-1][ant.x].greenPheromones / pheromonesDesTrois)*(1-proba);
				pStraight += (T.tab[ant.y][ant.x+1].greenPheromones / pheromonesDesTrois)*(1-proba);
				pRight += (T.tab[ant.y+1][ant.x].greenPheromones / pheromonesDesTrois)*(1-proba);
			  }
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
				pLeft += (T.tab[ant.y+1][ant.x].redPheromones / pheromonesDesTrois)*(1-proba);
				pStraight += (T.tab[ant.y][ant.x-1].redPheromones / pheromonesDesTrois)*(1-proba);
				pRight += (T.tab[ant.y-1][ant.x].redPheromones / pheromonesDesTrois)*(1-proba);
			  }else{
				pLeft += (T.tab[ant.y+1][ant.x].greenPheromones / pheromonesDesTrois)*(1-proba);
				pStraight += (T.tab[ant.y][ant.x-1].greenPheromones / pheromonesDesTrois)*(1-proba);
				pRight += (T.tab[ant.y-1][ant.x].greenPheromones / pheromonesDesTrois)*(1-proba);
			  }
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


function play(){
	playOrStop(true);
	run = true;
	runSimulation();
}
function stop(){
	playOrStop(false);
	run = false;
}
function restart(){
	restartDOM();
	run = false
}


async function runSimulation(){
	while(run){
		console.log("running ...");
		moveAllAnts();
		T.updateAllBlocks();
		updateMaxPheromones();
		time++;
		await sleep(20);
	}
}

//Retire 5% aux max par tour (pour l'affichage des couleurs)
function updateMaxPheromones(){
	maxPheromones = parseInt(maxPheromones - (maxPheromones/20));
}


/* Sleep function
 * use : await sleep(<duration>);
*/
const sleep = ms => new Promise(r => setTimeout(r, ms));


/* random int function
*/
function getRandomInt(max) {
  	return Math.floor(Math.random() * max);
}
