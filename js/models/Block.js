
/* Permet d'auto incrémenter l'id 
*/
//idBlockGeneral = 1;

class Block{

	/*
	* redPheromones : les péhromones placés par une Ant 
	* les mains vides 
	* (à suivre pour rentrer au nid)
	* 
	* greenPheromones : les phéromones placés par une Ant 
	* qui possède de la nourriture 
	* (à suivre pour trouver de la nourriture)
	* 
	* isEmpty : true lorsque ce n'est pas un mur, false sinon
	*/

	constructor(idBlock){
		this.redPheromones = 0;
		this.greenPheromones = 0;
		this.isWall = false;
		this.isNest = false;
		this.isFood = false;
		this.isEmpty = true;
		
		this.id = idBlock;
		//idBlock++;
	}

	initNest(){
		if(this.isEmpty){
			this.isNest = true;
			this.isEmpty = false;
		}
	}

	setFood(){
		if(this.isEmpty){
			this.isFood = true;
			this.isEmpty = false;
		}
	}

	setWall(){
		if(this.isEmpty){
			this.isWall = true;
			this.isEmpty = false;
		}
	}



}