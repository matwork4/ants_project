
class Terrain{

	constructor(dimX,dimY){
		var tab = [];
		//Permet d'auto incrémenter l'id
		var idBlock = 0;
		for(let i=0;i<dimY;i++){
				tab[i] = [];	
		}
		for(let i=0;i<dimY-1;i++){
			for(let j=0;j<dimX-1;j++){
				idBlock++;
				tab[i][j]= new Block(idBlock);
				//console.log("idBlock = "+idBlock);
				if(j==0 || j==dimX-2 || i==0 || i==dimY-2){
					tab[i][j].setWall();
				}

			}
			//idBlock--;
		}
		this.nbBlocks = idBlock;
		this.tab = tab;
		this.dimX = dimX;
		this.dimY = dimY;
	}

	initNest(x,y){
		this.tab[y][x].initNest();
	}

	setFood(x,y){
		this.tab[y][x].setFood();
	}

	/* fonction qui place une quantité de nourriture donnée 
	*  a un endroit aléatoire 
	*/

	/* fonction qui place des murs en ligne
	*/

	searchBlockById(id){
		for(let i=0;i<this.tab.length;i++){
			for(let j=0;j<this.tab[i].length;j++){
				if(this.tab[i][j].id == id){
					return this.tab[i][j];
				}
			}
		}
		console.log("Error searchBlockById("+id+") not found");
	}


	/* Fonction qui update les couleurs de chaque bloc
	*/
	updateAllBlocks(){

		//avant il faut update les phéromones
		/* Pour enlever 10% a une valeur : 
		* a = parseInt(a - (a/10))
		*/

		for(let i=1; i<=this.nbBlocks;i++){
			//console.log("fonctionne avec i = "+i);
			let b = this.searchBlockById(i);
			if(b.isEmpty){

				b.redPheromones = parseInt(b.redPheromones - (b.redPheromones/20));
				b.greenPheromones = parseInt(b.greenPheromones - (b.greenPheromones/20));

				updateBlockDOM(i);
			}
		}
	}


}