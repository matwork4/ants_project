
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

	/* place le nid */
	initNest(x,y){
		this.tab[y][x].initNest();
	}

	/* pose de la nourriture à l'emplacement x y 
	 * avec une intensité de tant (odeur max 255)
	 */
	setFood(x,y,intensite){
		this.tab[y][x].setFood();
		this.updateBluePheromones(x,y,intensite);
	}

	/* Créer l'odeur de la nourriture par case
	 * en fonction de la distance de la nourriture la 
	 * plus proche 
	 */
	updateBluePheromones(x,y,intensite){
		//nb de case de la nourriture
		let distance = 0;
		//valeur de l'odeur 
		let val = 0;
		let a = 0;
		let b = 0;
		for(let i=0;i<this.tab.length;i++){
			for(let j=0;j<this.tab[i].length;j++){
				a = Math.abs(x-j);
				b = Math.abs(y-i);
				//on calcule la distance de chaque case a la nourriture
				distance = Math.sqrt(a*a+b*b);
				//l'odeur perd 1/8 de son intensité par case
				val = parseInt(intensite/(distance/8));

				//On lui assigne l'odeur de la nourriture la plus proche
				if(val > this.tab[i][j].bluePheromones){
					this.tab[i][j].bluePheromones = val;
					//console.log("val = "+val);
				}
			}
		}
	}



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
				//retire 5% des phéromones d'une case par tour
				b.redPheromones = parseInt(b.redPheromones - (b.redPheromones/20));
				b.greenPheromones = parseInt(b.greenPheromones - (b.greenPheromones/20));

				updateBlockDOM(i);
			}
		}
	}

	


}