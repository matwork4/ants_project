
const dimX = 120;
const dimY = 60;
const nestPosX = 5;
const nestPosY = 2;
const nbAnts = 10;
const proba = 0.2; //Proba d'en faire qu'a sa tête
const addPheromones = 100; //phéromones ajouté par déplacement
var run = false;
var maxPheromones = 100; //valeur a augmenter lorsqu'un bloc dépasse


var T = new Terrain(dimX,dimY);
T.initNest(nestPosX,nestPosY);

displayTerrain();
/*
deleteTerrain();
displayTerrain();
*/

var ants = generateAnts();


/* afficher le terrain en fonction des couleurs des phéromones (dégradé)
*/
T.tab[0][0].redPheromones = 80;
T.tab[0][0].greenPheromones = 0;
//updateBlockDOM(1);
T.updateAllBlocks();

/* Pour enlever 10% a une valeur : 
* a = parseInt(a - (a/10))
*/

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
		T.updateAllBlocks();
		await sleep(100);
	}
}


/* Sleep function
 * use : await sleep(<duration>);
*/
const sleep = ms => new Promise(r => setTimeout(r, ms));




