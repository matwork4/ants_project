
const dimX = 60;
const dimY = 60;
const nestPosX = 16;
const nestPosY = 40;
const nbAnts = 500;
const proba = 0.05; //Proba d'en faire qu'a sa tête
const addPheromones = 100; //phéromones ajouté par déplacement, décrémenté
const lifeTime = 1000; //durée de vie avant la prochaine génération
var run = false;
var time = 0;
var maxPheromones = 100; //valeur a augmenter lorsqu'un bloc dépasse
var foodCollected = 0;
var generation = 1;


var T = new Terrain(dimX,dimY);
T.initNest(nestPosX,nestPosY);
//T.setFood(20,20);
T.setFood(40,30);

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

updateFoodCollectedDOM();
updateGenerationDOM();

/* Pour enlever 10% a une valeur : 
* a = parseInt(a - (a/10))
*/

//Idée : cliquer sur une case pour placer un bloc





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
		if(time>=lifeTime){
			nextGeneration()
		}
		await sleep(20);
	}
}

//Passe a la génération suivante
function nextGeneration(){
	generation++;
	time=0;
	ants = generateAnts();
	updateGenerationDOM();
	stop();
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
